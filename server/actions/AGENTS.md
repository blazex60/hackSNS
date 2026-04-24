<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-16 | Updated: 2026-04-16 -->

# server/actions

## Purpose
Next.js Server Actions として動作する認証処理モジュール。フォームからのログイン・ログアウト、セッション取得の3つのアクションを提供する。

## Key Files

| File | Description |
|------|-------------|
| `auth-actions.ts` | `loginAction` / `logoutAction` / `getSession` の3アクションを定義。`'use server'` ディレクティブ付き |

## For AI Agents

### Working In This Directory
- `loginAction` は内部で `vulnerableLogin`（意図的な SQLi 脆弱性）を呼ぶ。修正しない
- ログイン成功: `session` クッキーをセットして `/feed` へ `redirect()`
- ログイン失敗: `/login?error=invalid-credentials` へ `redirect()`
- `getSession()` はサーバーコンポーネントから現在ユーザー情報を取得するために使用

### Common Patterns
```typescript
// Server Action 呼び出し例（フォームから）
<form action={loginAction}>
  <input name="username" />
  <input name="password" type="password" />
</form>
```

## Dependencies

### Internal
- `server/auth/login.ts` - `vulnerableLogin`
- `server/auth/session.ts` - `createSessionToken`, `verifySessionToken`

### External
- `next/navigation` - `redirect`, `revalidatePath`
- `next/headers` - `cookies`

<!-- MANUAL: -->
