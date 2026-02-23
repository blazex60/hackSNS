#!/usr/bin/env tsx
/**
 * fast-api.ts
 * 高速API サーバー（攻撃デモ用）
 *
 * Next.js のルーティング/ミドルウェアを完全にバイパスして
 * 生の http.createServer + better-sqlite3 で認証エンドポイントを提供します。
 * Node.js cluster による複数ワーカーでマルチコアを活用します。
 *
 * 使い方:
 *   npm run fast-api                     # CPU コア数の半分のワーカーで起動
 *   npm run fast-api -- --workers 4      # ワーカー数を指定
 *   npm run fast-api -- --port 3001      # ポートを指定
 *
 * 攻撃ツールから使用:
 *   npm run brute  -- --target admin --url http://localhost:3001
 *   npm run attack -- --target admin --url http://localhost:3001
 */

import cluster from 'node:cluster';
import http from 'node:http';
import os from 'node:os';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { SignJWT } from 'jose';

// ─── CLI 引数 ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
function getArg(flag: string): string | undefined {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : undefined;
}

const WORKERS = getArg('--workers')
  ? parseInt(getArg('--workers')!, 10)
  : Math.max(1, Math.floor(os.cpus().length / 2));
const PORT = getArg('--port') ? parseInt(getArg('--port')!, 10) : 3001;

// ─── Primary プロセス ─────────────────────────────────────────────────────────

/** ポートが使用可能かどうかを確認する（使用中なら reject） */
function checkPortAvailable(port: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const probe = http.createServer();
    probe.once('error', reject);
    probe.once('listening', () => probe.close(resolve));
    probe.listen(port);
  });
}

if (cluster.isPrimary) {
  (async () => {
    // ワーカーをフォークする前にポートの空きを確認
    try {
      await checkPortAvailable(PORT);
    } catch (err) {
      const e = err as NodeJS.ErrnoException;
      if (e.code === 'EADDRINUSE') {
        console.error(`\n❌ Port ${PORT} is already in use.`);
        console.error(`   既存の fast-api プロセスを停止してから再起動してください。`);
        console.error(`   例: lsof -ti:${PORT} | xargs kill -9\n`);
      } else {
        console.error(`\n❌ Port availability check failed:`, e.message);
      }
      process.exit(1);
    }

    console.log(`\n🚀 Fast API Server — port ${PORT}, ${WORKERS} worker(s)\n`);
    console.log(`   攻撃ツールから使用:`);
    console.log(`   npm run brute  -- --target admin --url http://localhost:${PORT}`);
    console.log(`   npm run attack -- --target admin --url http://localhost:${PORT}\n`);

    for (let i = 0; i < WORKERS; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code) => {
      if (code !== 0 && code !== 2) {
        // code 2 = 再起動不要エラー (EADDRINUSE など)
        console.error(`Worker ${worker.process.pid} exited (code ${code}). Respawning...`);
        cluster.fork();
      } else if (code === 2) {
        console.error(`Worker ${worker.process.pid} exited with fatal error (code 2). Not respawning.`);
      }
    });
  })();
} else {
  // ─── Worker プロセス ──────────────────────────────────────────────────────

  // --- SQLite セットアップ（各ワーカーが独自の接続を持つ）---
  const dbPath = path.join(process.cwd(), 'server', 'data', 'app.db');
  const dbDir  = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  db.pragma('cache_size = -8000');
  db.pragma('temp_store = MEMORY');

  // スキーマ適用（ワーカー起動時に1回）
  const schemaPath = path.join(process.cwd(), 'server', 'db', 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    db.exec(fs.readFileSync(schemaPath, 'utf-8'));
  }

  // --- JWT 秘密鍵 ---
  const SECRET = new TextEncoder().encode(
    process.env.SESSION_SECRET ?? 'hackSNS-dev-secret-change-in-production',
  );

  // --- 脆弱なログイン（SQLi デモ用：文字列補間） ---
  function vulnerableLogin(username: string, password: string) {
    const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
    try {
      return db.prepare(query).get() ?? null;
    } catch {
      return null;
    }
  }

  // --- レスポンスボディの事前キャッシュ ---
  const INVALID_BODY = '{"success":false,"error":"invalid credentials"}';
  const BAD_REQ_BODY = '{"success":false,"error":"username and password are required"}';
  const JSON_CT      = 'application/json';

  // --- HTTP サーバー ---
  const server = http.createServer(async (req, res) => {
    // POST /api のみ受け付ける
    if (req.method !== 'POST' || req.url !== '/api') {
      res.writeHead(404, { 'content-type': JSON_CT });
      res.end('{"error":"not found"}');
      return;
    }

    // リクエストボディ読み取り（チャンクを直接結合）
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(chunk as Buffer);
    }
    const raw = Buffer.concat(chunks).toString();

    let username: string;
    let password: string;
    try {
      const parsed = JSON.parse(raw);
      username = parsed.username;
      password = parsed.password;
    } catch {
      res.writeHead(400, { 'content-type': JSON_CT });
      res.end(BAD_REQ_BODY);
      return;
    }

    if (!username || !password) {
      res.writeHead(400, { 'content-type': JSON_CT });
      res.end(BAD_REQ_BODY);
      return;
    }

    const user = vulnerableLogin(username, password) as Record<string, unknown> | null;

    if (!user) {
      res.writeHead(401, { 'content-type': JSON_CT });
      res.end(INVALID_BODY);
      return;
    }

    // 認証成功 → JWT生成
    const token = await new SignJWT({ username: String(user.username), displayName: String(user.display_name) })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(String(user.id))
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(SECRET);

    const body = JSON.stringify({
      success: true,
      user: { id: user.id, username: user.username, display_name: user.display_name },
    });

    res.writeHead(200, {
      'content-type': JSON_CT,
      'set-cookie': `session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=86400`,
    });
    res.end(body);
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`  Worker ${process.pid}: port ${PORT} is already in use. Is another fast-api instance running?`);
      process.exit(2); // 再起動不要フラグ
    } else {
      console.error(`  Worker ${process.pid}: server error:`, err.message);
      process.exit(1);
    }
  });

  server.listen(PORT, () => {
    console.log(`  Worker ${process.pid} listening on :${PORT}`);
  });
}
