<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-16 | Updated: 2026-04-16 -->

# src/app/dashboard

## Purpose
ログイン済みユーザー向けのダッシュボードページ（`/dashboard`）。`middleware.ts` によりセッション認証必須。

## Key Files

| File | Description |
|------|-------------|
| `page.tsx` | ダッシュボードページ本体（async Server Component） |
| `dashboard.module.css` | ダッシュボード用 CSS Modules |

## For AI Agents

### Working In This Directory
- 未認証アクセスは `middleware.ts` が `/login?from=/dashboard` へリダイレクト

## Dependencies

### Internal
- `server/actions/auth-actions.ts` - `getSession`

<!-- MANUAL: -->
