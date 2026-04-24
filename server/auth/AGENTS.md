<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-16 | Updated: 2026-04-16 -->

# server/auth

## Purpose
ログイン処理とセッション管理を担うモジュール群。`login.ts` は意図的に脆弱な実装と安全な実装の両方を提供し、`session.ts` は Jose ライブラリによる JWT の生成・検証を行う。

## Key Files

| File | Description |
|------|-------------|
| `login.ts` | `vulnerableLogin`（SQL インジェクション脆弱）と `safeLogin`（プレースホルダ使用）を提供。教育用比較コード |
| `session.ts` | JWT セッショントークンの生成（`createSessionToken`）・検証（`verifySessionToken`）・Cookie 文字列構築 |

## For AI Agents

### Working In This Directory
- `vulnerableLogin` の SQL インジェクション脆弱性は**意図的**。絶対に修正しない
- JWT 署名キーは `SESSION_SECRET` 環境変数、未設定時は固定文字列（開発用）
- セッション有効期限: 24時間

### Common Patterns

**脆弱なクエリ（意図的）:**
```typescript
const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
```

**安全なクエリ（比較用）:**
```typescript
db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);
```

**セッション生成:**
```typescript
const token = await createSessionToken({ sub, username, displayName });
```

## Dependencies

### Internal
- `server/db/database.ts` - DB シングルトン

### External
- `better-sqlite3` - クエリ実行
- `jose` - JWT HS256 署名・検証

<!-- MANUAL: -->
