'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import styles from '../app/layout.module.css';

// サイドバーを表示するパスのプレフィックス
const SIDEBAR_PREFIXES = ['/feed', '/profile', '/search', '/category', '/review', '/support', '/orders', '/wishlist', '/dashboard'];

function shouldShowSidebar(pathname: string): boolean {
  return SIDEBAR_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = shouldShowSidebar(pathname);

  return (
    <div className={showSidebar ? styles.appLayoutWithSidebar : styles.appLayoutFull}>
      {showSidebar && <Sidebar />}
      <main className={showSidebar ? styles.mainContent : styles.mainFull}>
        {children}
      </main>
    </div>
  );
}
