# hackSNS

パスワードクラッキング攻撃を実演する教育目的の SNS アプリケーション。

## 起動方法

### Docker（推奨）

```bash
docker compose up --build
```

- フロントエンド: http://localhost:3000
- バックエンド (fast-api): http://localhost:3001

停止:
```bash
docker compose down
```

DB ボリュームごとリセット:
```bash
docker compose down -v
```

### ローカル開発

```bash
npm install
npm run dev        # Next.js 開発サーバー (port 3000)
npm run fast-api   # 高速 HTTP サーバー (port 3001)
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
