<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-16 | Updated: 2026-04-16 -->

# server

## Purpose
アプリケーションのバックエンドロジック全体を担うディレクトリ。SQLite データベース、認証（意図的に脆弱な実装を含む）、Server Actions、および攻撃ターゲット用の高速 HTTP サーバー (`fast-api.ts`) を管理する。

## Key Files

| File | Description |
|------|-------------|
| `fast-api.ts` | undici ベースの高速 HTTP サーバー（port 3001）。攻撃ツールの標的として Next.js より軽量な応答を提供 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `actions/` | Next.js Server Actions（認証処理）（see `actions/AGENTS.md`） |
| `auth/` | ログイン処理とセッション管理（see `auth/AGENTS.md`） |
| `db/` | SQLite スキーマ定義と初期化・シードデータ（see `db/AGENTS.md`） |
| `utils/` | サーバー共通ヘルパー関数（see `utils/AGENTS.md`） |
| `data/` | SQLite データベースファイル（`app.db`、WAL モード） |

## For AI Agents

### Working In This Directory
- `server/auth/login.ts` の `vulnerableLogin` は意図的な SQL インジェクション脆弱性。修正しない
- `server/data/app.db` はバイナリ。直接編集せず、スキーマ変更は `db/schema.sql` を介する
- データベースは初回リクエスト時に自動初期化される

### Testing Requirements
- `npm run fast-api` で port 3001 を起動して動作確認
- 攻撃ツールは `npm run attack:fast` / `npm run brute:fast` でテスト

### Common Patterns
- DB 接続はシングルトン（`db/database.ts` が管理）
- 認証成功時は jose で JWT を生成してクッキーにセット

## Dependencies

### Internal
- `src/app/api/route.ts` が `auth/login.ts` と `auth/session.ts` を呼び出す

### External
- `better-sqlite3` - SQLite ドライバ
- `jose` - JWT 生成・検証

<!-- MANUAL: -->
