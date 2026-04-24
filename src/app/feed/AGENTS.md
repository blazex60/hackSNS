<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-16 | Updated: 2026-04-16 -->

# src/app/feed

## Purpose
ログイン済みユーザーが閲覧するメインフィードページ（`/feed`）。`middleware.ts` によりセッション認証必須。投稿一覧を `PostCard` コンポーネントで表示する。

## Key Files

| File | Description |
|------|-------------|
| `page.tsx` | フィードページ本体（async Server Component） |
| `feed.module.css` | フィードページ用 CSS Modules |

## For AI Agents

### Working In This Directory
- 未認証アクセスは `middleware.ts` が `/login?from=/feed` へリダイレクト
- `getSession()` でログインユーザー情報をサーバー側で取得して表示に利用

## Dependencies

### Internal
- `src/components/PostCard.tsx` - 投稿表示
- `server/actions/auth-actions.ts` - `getSession`
- `server/db/database.ts` - 投稿データ取得

<!-- MANUAL: -->
