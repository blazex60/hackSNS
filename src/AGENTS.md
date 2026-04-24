<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-16 | Updated: 2026-04-16 -->

# src

## Purpose
Next.js App Router を使用したフロントエンドのソースコード。ページ（`app/`）とコンポーネント（`components/`）の二層構造。SNS の UI（フィード・ダッシュボード・プロフィール・ログイン）を提供する。

## Key Files

なし（サブディレクトリへ委譲）

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `app/` | Next.js App Router のページ・レイアウト・API ルート（see `app/AGENTS.md`） |
| `components/` | 再利用可能な React コンポーネント（see `components/AGENTS.md`） |

## For AI Agents

### Working In This Directory
- パスエイリアス `@/*` は `src/` を指す（`tsconfig.json` で設定済み）
- スタイルは CSS Modules（`*.module.css`）を使用
- `strict: false` のため型エラーは警告扱い

### Testing Requirements
- `npm run dev` で開発サーバー起動後、ブラウザで動作確認

### Common Patterns
- レイアウトは `app/layout.tsx` でルートシェル（`AppShell`）を適用
- コンポーネントは `Sidebar`, `Header`, `PostCard` で構成

## Dependencies

### Internal
- `server/` - 認証・DB ロジック（Server Actions 経由）

### External
- `react 19.x` / `react-dom`
- `next ^16.2.3`

<!-- MANUAL: -->
