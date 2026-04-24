<!-- Generated: 2026-04-16 | Updated: 2026-04-16 -->

# hackSNS

## Purpose
パスワードクラッキング攻撃（辞書攻撃・ブルートフォース）を実演する教育目的のSNSアプリケーション。Next.js 16 + SQLite 構成。フロントエンドはApp Router、バックエンドはServer Actions + undiciベースの高速HTTPサーバーの二本立て。意図的に脆弱なログイン実装を含み、攻撃ツールとセットで授業・演習に使用する。

## Key Files

| File | Description |
|------|-------------|
| `package.json` | 依存関係とスクリプト定義（attack / brute / fast-api など攻撃ツール込み） |
| `next.config.ts` | Next.js 設定 |
| `tsconfig.json` | TypeScript 設定（`strict: false` は意図的） |
| `middleware.ts` | `/feed`, `/dashboard`, `/profile` をセッション認証で保護 |
| `eslint.config.mjs` | ESLint flat config |
| `dict.txt` | 辞書攻撃用パスワードリスト |
| `CLAUDE.md` | Claude Code 向けプロジェクト指示（共有） |
| `CLAUDE.local.md` | Claude Code 向け個人設定（非共有） |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `server/` | バックエンドロジック（DB・認証・fast-api）（see `server/AGENTS.md`） |
| `src/` | Next.js フロントエンドソース（see `src/AGENTS.md`） |
| `tools/` | 攻撃ツールスクリプト（see `tools/AGENTS.md`） |
| `public/` | 静的SVGアイコン群（see `public/AGENTS.md`） |
| `state/` | キャンセルシグナル用 JSON ステート |

## For AI Agents

### Working In This Directory
- `strict: false` は意図的設定。変更禁止
- 警告文・注意書き（「教育目的」「脆弱性が含まれています」等）をUIに追加しない
- ブランチ命名: `feature/xxx`, `fix/xxx`
- upstream: `KTC-Security-Circle/hackSNS`

### Testing Requirements
- 開発サーバー起動: `npm run dev`（port 3000）
- 攻撃ツールテスト: `npm run fast-api`（port 3001）を別ターミナルで起動してから `npm run attack:fast` / `npm run brute:fast`

### Common Patterns
- 認証フロー: POST `/api` → `vulnerableLogin` → JWTセッションクッキー
- 攻撃ツールは undici Pool + Semaphore による高並列HTTP送信

## Dependencies

### External
- `next ^16.2.3` - フレームワーク
- `better-sqlite3 ^12.5.0` - SQLite ORM
- `jose ^6.1.3` - JWT 生成・検証
- `undici ^7.22.0` - 高速 HTTP クライアント（攻撃ツール用）
- `tsx ^4.21.0` - TypeScript スクリプト実行

<!-- MANUAL: -->
