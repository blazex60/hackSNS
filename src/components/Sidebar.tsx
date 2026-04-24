'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/server/actions/auth-actions';
import styles from './Sidebar.module.css';

const navItems = [
  { href: '/feed',      icon: '/icon-home.svg',                  label: 'ホーム' },
  { href: '/reels',     icon: '/wordpress--video.svg',          label: 'リール動画' },
  { href: '/messages',  icon: '/akar-icons--paper-airplane.svg', label: 'メッセージ' },
  { href: '/search',    icon: '/icon-search.svg',                label: '検索' },
  { href: '/explore',   icon: '/icon-explore.svg',               label: '発見' },
  { href: '/notif',     icon: '/icon-heart.svg',                 label: 'お知らせ', badge: 1 },
  { href: '/create',    icon: '/icon-new-post.svg',              label: '作成' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* PC: 左固定サイドバー */}
      <aside className={styles.sidebar}>
        <div className={styles.logoArea}>
          <Link href="/feed" className={styles.logoLink}>Nyanstagram</Link>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ''}`}
            >
              <div className={styles.iconWrap}>
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={24}
                  height={24}
                  className={styles.navIcon}
                />
                {item.badge ? <span className={styles.badge}>{item.badge}</span> : null}
              </div>
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          ))}
        </nav>

        <Link href="/profile" className={`${styles.navItem} ${styles.profileItem}`}>
          <div className={styles.avatarCircle}>T</div>
          <span className={styles.navLabel}>マイページ</span>
        </Link>

        <form action={logoutAction} className={styles.logoutForm}>
          <button type="submit" className={styles.logoutButton}>
            ログアウト
          </button>
        </form>
      </aside>

      {/* モバイル: 下部固定ナビ */}
      <nav className={styles.bottomNav}>
        {navItems.slice(0, 5).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.bottomNavItem} ${pathname === item.href ? styles.bottomNavItemActive : ''}`}
          >
            <div className={styles.iconWrap}>
              <Image
                src={item.icon}
                alt={item.label}
                width={24}
                height={24}
                className={styles.navIcon}
              />
              {item.badge ? <span className={styles.badge}>{item.badge}</span> : null}
            </div>
          </Link>
        ))}
      </nav>
    </>
  );
}
