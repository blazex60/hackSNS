# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

hackSNS はパスワードクラッキング攻撃を実演する教育目的のSNSアプリケーション。Next.js + SQLite 構成。

## 開発サーバー

```bash
npm run dev        # Next.js 開発サーバー (port 3000)
npm run fast-api   # 高速 HTTP サーバー (port 3001, 攻撃ターゲット用)
```

## 攻撃ツール

```bash
npm run attack              # 辞書攻撃 (port 3000)
npm run brute               # ブルートフォース (port 3000)
npm run attack:fast         # 辞書攻撃 (port 3001)
npm run brute:fast          # ブルートフォース (port 3001)
npm run brute:lownm         # lownm charset で alice を攻撃
npm run brute:alnum         # alnum charset で bob を攻撃
```

## データベース

- SQLite: `server/data/app.db` (WAL モード)
- 初回リクエスト時に自動初期化・シードデータ挿入
- スキーマ: `server/db/schema.sql`
- シード: `server/db/database.ts`

## TypeScript 設定

- `strict: false` — 意図的な設定。変更しないこと
- パスエイリアス: `@/*` → `src/`

## Lint

```bash
npm run lint   # ESLint (flat config, eslint.config.mjs)
```

## UIの注意事項

- サイト内に警告文・注意書き（「教育目的のデモ環境です」「脆弱性が含まれています」等）を記載しない。授業内で口頭説明するため不要。

## Git 規約

- ブランチ命名: `feature/xxx`, `fix/xxx`
- upstream: `KTC-Security-Circle/hackSNS`
