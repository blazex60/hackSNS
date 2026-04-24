<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-16 | Updated: 2026-04-16 -->

# tools

## Purpose
パスワードクラッキング攻撃を実演する実習用スクリプト群。undici Pool + Semaphore による高並列 HTTP 通信で、ログイン API を高速に試行する。授業・演習のデモ用途に特化。

## Key Files

| File | Description |
|------|-------------|
| `dictionary-attack.ts` | 辞書攻撃ツール。`dict.txt` に列挙されたパスワードを並列送信 |
| `brute-force.ts` | ブルートフォース攻撃ツール。文字セット・長さ範囲を指定して全組み合わせを試行 |

## For AI Agents

### Working In This Directory
- 両スクリプトとも `npm run attack` / `npm run brute` などで `tsx` 経由で実行
- 並列度は `--concurrency` オプションで制御（デフォルト: 辞書攻撃 200、ブルートフォース 200）
- パスワード発見後は新規ディスパッチを即停止し、飛行中リクエストのみ完了を待つ設計

### Testing Requirements
- port 3000（`npm run dev`）または port 3001（`npm run fast-api`）が起動している状態でテスト

### Common Patterns

**Semaphore パターン（並行制御）**
```typescript
await sem.acquire();   // ループ側で取得（バックプレッシャー）
inFlight++;
void runOne(password); // fire-and-forget
// finally 内で inFlight--; sem.release();
```

**早期終了パターン**
```typescript
const toWait = inFlight;  // ループ脱出直後の in-flight 数を保存
for (let i = 0; i < toWait; i++) await sem.acquire(); // 飛行中のみ待機
```

## Dependencies

### Internal
- `dict.txt`（プロジェクトルート）- 辞書攻撃用パスワードリスト

### External
- `undici` - Pool + pipelining による高速 HTTP
- `tsx` - TypeScript 直接実行

<!-- MANUAL: -->
