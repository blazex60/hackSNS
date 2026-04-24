import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'server', 'data', 'app.db');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// パフォーマンス最適化: WALモードで並行読み取りを有効化
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('cache_size = -8000'); // 8MB キャッシュ
db.pragma('temp_store = MEMORY');

// スキーマファイルを読み込んで実行
const schemaPath = path.join(process.cwd(), 'server', 'db', 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');
db.exec(schema);

// 初期データ: すでに存在する場合はスキップ（毎リクエスト時の不要なI/Oを防ぐ）
const userCount = (db.prepare('SELECT COUNT(*) as cnt FROM users').get() as { cnt: number }).cnt;
if (userCount === 0) {
  const insertUser = db.prepare('INSERT OR REPLACE INTO users (id, username, password, display_name, bio, avatar_url) VALUES (?, ?, ?, ?, ?, ?)');
  insertUser.run(1, 'admin', '@Dm1N_u3er', 'Admin User', 'システム管理者です', '/avatars/admin.png');
  insertUser.run(2, 'take', '1234', 'take', 'デザイナーです🎨', '/avatars/user.png');
  insertUser.run(3, 'alice', 'ar94', 'Alice', '写真が好きです📷', '/avatars/alice.png');
  insertUser.run(4, 'bob', 'rE4T', 'Bob', '旅行と料理が趣味です🌍🍳', '/avatars/bob.png');
  insertUser.run(5, 'chris', 'T9@a', 'chris', 'プログラマーです💻', '/avatars/charlie.png');

  // 初期データ: 投稿
  const insertPost = db.prepare('INSERT OR IGNORE INTO posts (id, user_id, content, image_url, created_at) VALUES (?, ?, ?, ?, ?)');
  insertPost.run(1, 1, 'HackSNSへようこそ！このサイトはSQLインジェクションの実習用です。', null, '2026-01-01 10:00:00');
  insertPost.run(2, 2, '初投稿です！よろしくお願いします🎉', null, '2026-01-01 11:30:00');
  insertPost.run(3, 3, '今日はいい天気ですね☀️', '/images/sunny.jpg', '2026-01-02 09:15:00');
  insertPost.run(4, 4, '新しいカフェを見つけました☕美味しかったです！', '/images/cafe.jpg', '2026-01-02 14:20:00');
  insertPost.run(5, 5, 'TypeScriptの新機能を試してみました。便利ですね！', null, '2026-01-02 16:45:00');
  insertPost.run(6, 3, 'SQLインジェクションの勉強中です📚', null, '2026-01-03 08:00:00');
  insertPost.run(7, 2, 'ランチに何を食べるか迷っています🤔', null, '2026-01-03 12:00:00');
  insertPost.run(8, 4, '週末は山登りに行ってきました⛰️', '/images/mountain.jpg', '2026-01-03 15:30:00');

  // 初期データ: コメント
  const insertComment = db.prepare('INSERT OR IGNORE INTO comments (id, post_id, user_id, content, created_at) VALUES (?, ?, ?, ?, ?)');
  insertComment.run(1, 1, 2, 'よろしくお願いします！', '2026-01-01 10:30:00');
  insertComment.run(2, 2, 3, 'こちらこそよろしく！', '2026-01-01 12:00:00');
  insertComment.run(3, 3, 4, '本当にいい天気ですね！', '2026-01-02 10:00:00');
  insertComment.run(4, 4, 5, 'そのカフェ行ってみたいです！', '2026-01-02 15:00:00');
  insertComment.run(5, 5, 3, '面白そうですね！', '2026-01-02 17:00:00');

  // 初期データ: いいね
  const insertLike = db.prepare('INSERT OR IGNORE INTO likes (post_id, user_id, created_at) VALUES (?, ?, ?)');
  insertLike.run(1, 2, '2026-01-01 10:15:00');
  insertLike.run(1, 3, '2026-01-01 10:20:00');
  insertLike.run(2, 1, '2026-01-01 11:45:00');
  insertLike.run(2, 4, '2026-01-01 12:30:00');
  insertLike.run(3, 2, '2026-01-02 09:30:00');
  insertLike.run(3, 5, '2026-01-02 10:15:00');
  insertLike.run(4, 3, '2026-01-02 14:45:00');
  insertLike.run(5, 2, '2026-01-02 17:00:00');
  insertLike.run(6, 4, '2026-01-03 09:00:00');

  // 初期データ: フォロー関係
  const insertFollow = db.prepare('INSERT OR IGNORE INTO follows (follower_id, following_id, created_at) VALUES (?, ?, ?)');
  insertFollow.run(2, 1, '2026-01-01 10:00:00');
  insertFollow.run(3, 1, '2026-01-01 11:00:00');
  insertFollow.run(4, 1, '2026-01-01 12:00:00');
  insertFollow.run(2, 3, '2026-01-02 08:00:00');
  insertFollow.run(3, 4, '2026-01-02 09:00:00');
  insertFollow.run(4, 5, '2026-01-02 10:00:00');
  insertFollow.run(5, 3, '2026-01-02 11:00:00');
}

export default db;
