<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-16 | Updated: 2026-04-16 -->

# src/app/login

## Purpose
ログインページ（`/login`）。フォーム送信で `loginAction` Server Action を呼び出す。認証不要でアクセス可能。

## Key Files

| File | Description |
|------|-------------|
| `page.tsx` | ログインフォームページ。クエリパラメータ `error` でエラー表示、`from` で遷移元を保持 |
| `login.module.css` | ログインページ用 CSS Modules |

## For AI Agents

### Working In This Directory
- `?error=invalid-credentials` → 認証失敗メッセージ表示
- `?error=missing-fields` → 入力不足メッセージ表示
- `?from=/feed` → ログイン成功後のリダイレクト先（現在 `loginAction` では `/feed` 固定）

## Dependencies

### Internal
- `server/actions/auth-actions.ts` - `loginAction`

<!-- MANUAL: -->
