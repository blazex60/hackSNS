import { loginAction } from '@/server/actions/auth-actions';
import styles from './login.module.css';

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>🔐</div>
          <h1 className={styles.title}>HackSNS</h1>
          <p className={styles.subtitle}>SQLインジェクション実習環境</p>
        </div>

        <form action={loginAction} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              ユーザー名
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className={styles.input}
              placeholder="ユーザー名を入力"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className={styles.input}
              placeholder="パスワードを入力"
              required
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            ログイン
          </button>
        </form>

        <div className={styles.demoInfo}>
          <h3>💡 デモアカウント</h3>
          <p>👤 ユーザー名: <code>admin</code> / パスワード: <code>password123</code></p>
          <p>👤 ユーザー名: <code>user</code> / パスワード: <code>test456</code></p>
        </div>

        <div className={styles.footer}>
          <p>© 2026 HackSNS - Educational Purpose Only</p>
        </div>
      </div>
    </div>
  );
}
