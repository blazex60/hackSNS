import db from '../db/database';

// 脆弱なログイン（SQLi用）
export function vulnerableLogin(username: string, password: string) {
  const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`; // 意図的に脆弱！
  
  try {
    const stmt = db.prepare(query);
    return stmt.get();
  } catch (error) {
    console.error('SQL Error:', error);
    return null;
  }
}

// 安全版（比較用に残す）
export function safeLogin(username: string, password: string) {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?');
  return stmt.get(username, password);
}
