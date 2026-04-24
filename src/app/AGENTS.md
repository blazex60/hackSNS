<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-16 | Updated: 2026-04-16 -->

# src/app

## Purpose
Next.js App Router のルートディレクトリ。レイアウト・各ページ・API ルートを格納する。`/feed`, `/dashboard`, `/profile` は `middleware.ts` でセッション認証が必須。

## Key Files

| File | Description |
|------|-------------|
| `layout.tsx` | ルートレイアウト。`AppShell` コンポーネントを適用し全ページに共通シェルを提供 |
| `page.tsx` | ランディングページ（`/`） |
| `globals.css` | グローバル CSS リセット・変数定義 |
| `layout.module.css` | ルートレイアウト用 CSS Modules |
| `page.module.css` | ランディングページ用 CSS Modules |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `api/` | POST `/api` - ログイン API エンドポイント（攻撃ツールのターゲット）（see `api/AGENTS.md`） |
| `feed/` | フィードページ（認証必須）（see `feed/AGENTS.md`） |
| `dashboard/` | ダッシュボードページ（認証必須） |
| `login/` | ログインページ |
| `profile/` | プロフィールページ（認証必須） |

## For AI Agents

### Working In This Directory
- `/api` ルートは `middleware.ts` の matcher から除外されており、認証なしでアクセス可能（攻撃ツールのため）
- 保護ページ（`/feed`, `/dashboard`, `/profile`）はセッションクッキーが必要

### Common Patterns
- ページコンポーネントは `async` Server Component として実装
- `getSession()` でサーバー側セッション取得

## Dependencies

### Internal
- `src/components/` - `AppShell`, `Sidebar`, `Header`, `PostCard`
- `server/actions/auth-actions.ts` - `getSession`, `logoutAction`

<!-- MANUAL: -->
