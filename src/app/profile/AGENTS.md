<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-16 | Updated: 2026-04-16 -->

# src/app/profile

## Purpose
ログイン済みユーザーのプロフィールページ（`/profile`）。`middleware.ts` によりセッション認証必須。

## Key Files

| File | Description |
|------|-------------|
| `page.tsx` | プロフィールページ本体（async Server Component） |
| `profile.module.css` | プロフィールページ用 CSS Modules |

## For AI Agents

### Working In This Directory
- 未認証アクセスは `middleware.ts` が `/login?from=/profile` へリダイレクト
- `getSession()` でログインユーザーの `username`, `displayName` を取得

## Dependencies

### Internal
- `server/actions/auth-actions.ts` - `getSession`, `logoutAction`

<!-- MANUAL: -->
