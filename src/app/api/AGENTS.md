<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-16 | Updated: 2026-04-16 -->

# src/app/api

## Purpose
ログイン API エンドポイント（`POST /api`）を提供する App Router Route Handler。辞書攻撃・ブルートフォース攻撃ツールの HTTP ターゲットとして機能する。`middleware.ts` の matcher から除外されているため認証不要でアクセス可能。

## Key Files

| File | Description |
|------|-------------|
| `route.ts` | `POST /api` ハンドラ。`vulnerableLogin` を呼び出してセッションクッキーを発行 |

## For AI Agents

### Working In This Directory
- レスポンスボディは **モジュールレベルでキャッシュ済み**（`INVALID_CREDS_BODY`, `BAD_REQUEST_BODY`）。攻撃時の生成コストを削減するための意図的な最適化
- 成功: HTTP 200 + `{ success: true, user: {...} }` + `session` クッキー
- 失敗: HTTP 401 + `{ success: false, error: 'invalid credentials' }`
- `/api` は攻撃ツールのターゲットであるため、レート制限・ロックアウト等を追加しない

### Common Patterns
```typescript
// 攻撃ツールが送信するリクエスト形式
POST /api
Content-Type: application/json
{"username":"admin","password":"guess"}
```

## Dependencies

### Internal
- `server/auth/login.ts` - `vulnerableLogin`
- `server/auth/session.ts` - `createSessionToken`

<!-- MANUAL: -->
