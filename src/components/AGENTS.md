<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-16 | Updated: 2026-04-16 -->

# src/components

## Purpose
アプリケーション全体で再利用される React コンポーネント群。SNS の共通 UI（ナビゲーションシェル・サイドバー・ヘッダー・投稿カード）を提供する。各コンポーネントは対応する CSS Modules ファイルを持つ。

## Key Files

| File | Description |
|------|-------------|
| `AppShell.tsx` | アプリ全体のレイアウトシェル。`Sidebar` と `Header` を含むラッパー |
| `Sidebar.tsx` | 左サイドバーナビゲーション（ホーム・探索・通知・DM・プロフィール等） |
| `Header.tsx` | ページ上部ヘッダー |
| `PostCard.tsx` | SNS 投稿1件を表示するカード（いいね・コメント・ブックマーク等のアクション付き） |
| `AppShell.module.css` | AppShell レイアウト用スタイル |
| `Sidebar.module.css` | Sidebar 用スタイル |
| `PostCard.module.css` | PostCard 用スタイル |

## For AI Agents

### Working In This Directory
- CSS は CSS Modules のみ使用（グローバルクラス名の衝突を回避）
- コンポーネントへの `'use client'` 指定は必要な場合のみ付与
- アイコンは `public/` の SVG を `<img src="/icon-name.svg">` で参照

### Common Patterns
```tsx
// CSS Modules インポートパターン
import styles from './ComponentName.module.css';
<div className={styles.container}>...</div>
```

## Dependencies

### Internal
- `public/` - SVG アイコンファイル群

<!-- MANUAL: -->
