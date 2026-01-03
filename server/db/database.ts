import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'app.db');
const db = new Database(dbPath);

// テーブル初期化
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL
  )
`);

// 初期データ
const insert = db.prepare('INSERT OR IGNORE INTO users (id, username, password) VALUES (?, ?, ?)');
insert.run(1, 'admin', 'password123');
insert.run(2, 'user', 'test456');

export default db;
