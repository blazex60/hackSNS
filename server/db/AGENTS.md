<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-16 | Updated: 2026-04-16 -->

# server/db

## Purpose
SQLite データベースの初期化・スキーマ定義・シードデータ投入を担うモジュール。`database.ts` は DB シングルトンを管理し、モジュールインポート時にスキーマ適用とシードデータ挿入を自動実行する。

## Key Files

| File | Description |
|------|-------------|
| `database.ts` | better-sqlite3 シングルトン。WAL モード有効化、スキーマ実行、シードデータ自動挿入 |
| `schema.sql` | テーブル定義: `users`, `posts`, `comments`, `likes`, `follows` |

## For AI Agents

### Working In This Directory
- スキーマ変更は `schema.sql` を編集し、`server/data/app.db` を削除して再起動すれば再作成される
- シードユーザーとパスワードは演習設計上重要。変更する場合は攻撃ツールの設定も確認すること
- `database.ts` はモジュールレベルで即時実行されるため、インポートするだけで DB が初期化される

### シードデータ一覧（ユーザー）

| username | password | 役割 |
|----------|----------|------|
| admin | rabbit | 辞書攻撃ターゲット |
| take | 1234 | 数字ブルートフォースターゲット |
| alice | ar94 | lownm charset ターゲット |
| bob | rEtT | alnum charset ターゲット |
| chris | T9@a | 強度高めパスワード |

### Common Patterns
- WAL モード + `synchronous = NORMAL` で並行読み取り性能を確保
- キャッシュサイズ 8MB でホットクエリを高速化

## Dependencies

### External
- `better-sqlite3` - SQLite ドライバ
- `fs`, `path` - ファイルシステム操作

<!-- MANUAL: -->
