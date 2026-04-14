'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/server/actions/auth-actions';
import styles from './Header.module.css';

interface HeaderProps {
  username?: string;
}

export default function Header({ username = 'User' }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="/feed" className={styles.logo}>
          Nyanstagram
        </Link>

        <div className={styles.searchBar}>
          <Image src="/icon-search.svg" alt="search" width={14} height={14} className={styles.searchIcon} />
          <span className={styles.searchText}>検索</span>
        </div>

        <nav className={styles.nav}>
          <Link
            href="/feed"
            className={`${styles.navIconLink} ${pathname === '/feed' ? styles.navIconLinkActive : ''}`}
            title="ホーム"
          >
            <Image src="/icon-home.svg" alt="ホーム" width={24} height={24} />
          </Link>
          <Link
            href="/feed"
            className={styles.navIconLink}
            title="メッセージ"
          >
            <Image src="/icon-share.svg" alt="メッセージ" width={24} height={24} />
          </Link>
          <Link
            href="/feed"
            className={styles.navIconLink}
            title="新規投稿"
          >
            <Image src="/icon-new-post.svg" alt="新規投稿" width={24} height={24} />
          </Link>
          <Link
            href="/explore"
            className={`${styles.navIconLink} ${pathname === '/explore' ? styles.navIconLinkActive : ''}`}
            title="探索"
          >
            <Image src="/icon-explore.svg" alt="探索" width={24} height={24} />
          </Link>
          <Link
            href="/notifications"
            className={`${styles.navIconLink} ${pathname === '/notifications' ? styles.navIconLinkActive : ''}`}
            title="通知"
          >
            <Image src="/icon-notification.svg" alt="通知" width={24} height={24} />
          </Link>
          <div className={styles.userSection}>
            <Link href="/profile" className={styles.navIconLink} title={username}>
              <div className={styles.avatar}>
                {username.charAt(0).toUpperCase()}
              </div>
            </Link>
            <form action={logoutAction}>
              <button type="submit" className={styles.logoutButton}>ログアウト</button>
            </form>
          </div>
        </nav>
      </div>
    </header>
  );
}
