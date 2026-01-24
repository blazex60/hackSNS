import Link from 'next/link';
import styles from './Header.module.css';

interface HeaderProps {
  username?: string;
}

export default function Header({ username = 'User' }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="/dashboard" className={styles.logo}>
          <span className={styles.logoIcon}>🔐</span>
          <span>HackSNS</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/dashboard" className={styles.navLink}>
            🏠 ホーム
          </Link>
          <Link href="/explore" className={styles.navLink}>
            🔍 探索
          </Link>
          <Link href="/notifications" className={styles.navLink}>
            🔔 通知
          </Link>
        </nav>

        <div className={styles.userSection}>
          <div className={styles.avatar}>
            {username.charAt(0).toUpperCase()}
          </div>
          <button className={styles.logoutButton}>ログアウト</button>
        </div>
      </div>
    </header>
  );
}
