import Link from "next/link";
import styles from "./profile.module.css";
import { getSession } from '@/server/actions/auth-actions';
import db from '@/server/db/database';
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(session.username) as any;
  if (!user) {
    redirect('/login');
  }

  // Calculate some dummy stats or fetch from DB if we wanted real ones.
  // We can fetch real post count
  const postCount = (db.prepare('SELECT COUNT(*) as cnt FROM posts WHERE user_id = ?').get(user.id) as any).cnt;
  const followersCount = (db.prepare('SELECT COUNT(*) as cnt FROM follows WHERE following_id = ?').get(user.id) as any).cnt;
  const followingCount = (db.prepare('SELECT COUNT(*) as cnt FROM follows WHERE follower_id = ?').get(user.id) as any).cnt;

  // Render Admin Dashboard
  if (user.username === 'admin') {
    return (
      <div className={styles.adminContainer}>
        <aside className={styles.adminSidebar}>
          <div className={styles.adminLogo}>Admin Console</div>
          <nav className={styles.adminNav}>
            <div className={`${styles.adminNavItem} ${styles.adminNavActive}`}>Dashboard</div>
            <div className={styles.adminNavItem}>Users</div>
            <div className={styles.adminNavItem}>Content Moderation</div>
            <div className={styles.adminNavItem}>System Logs</div>
            <div className={styles.adminNavItem}>Settings</div>
          </nav>
          <div className={styles.adminLogout}>
            <Link href="/login" prefetch={false}>Logout</Link>
          </div>
        </aside>
        
        <main className={styles.adminMain}>
          <header className={styles.adminHeader}>
            <h2>System Overview</h2>
            <div className={styles.adminProfilePic}>A</div>
          </header>
          
          <div className={styles.adminStatsGrid}>
            <div className={styles.adminStatCard}>
              <div className={styles.adminStatTitle}>Total Users</div>
              <div className={styles.adminStatValue}>1,024</div>
            </div>
            <div className={styles.adminStatCard}>
              <div className={styles.adminStatTitle}>Active Sessions</div>
              <div className={styles.adminStatValue}>42</div>
            </div>
            <div className={styles.adminStatCard}>
              <div className={styles.adminStatTitle}>Server Load</div>
              <div className={styles.adminStatValue}>12%</div>
            </div>
            <div className={styles.adminStatCard}>
              <div className={styles.adminStatTitle}>Security Alerts</div>
              <div className={`${styles.adminStatValue} ${styles.adminAlert}`}>3</div>
            </div>
          </div>

          <div className={styles.adminRecentActivity}>
            <h3>Recent Security Logs</h3>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>IP Address</th>
                  <th>Event</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2026-05-18 10:05:22</td>
                  <td>192.168.1.42</td>
                  <td>Failed Login (root)</td>
                  <td className={styles.adminAlertText}>Warning</td>
                </tr>
                <tr>
                  <td>2026-05-18 09:59:10</td>
                  <td>10.0.0.5</td>
                  <td>SQLi payload detected</td>
                  <td className={styles.adminAlertText}>Blocked</td>
                </tr>
                <tr>
                  <td>2026-05-18 09:50:01</td>
                  <td>172.16.0.100</td>
                  <td>Admin Login</td>
                  <td className={styles.adminSuccessText}>Success</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    );
  }

  // Render normal user profile
  // Define themes for known users
  let themeStyle = {};
  if (user.username === 'take') {
    themeStyle = { '--theme-color': '#f97316', '--gradient-start': '#f97316', '--gradient-end': '#ec4899', '--bg-color': '#fff7ed' }; // Orange/Pink
  } else if (user.username === 'alice') {
    themeStyle = { '--theme-color': '#0ea5e9', '--gradient-start': '#0ea5e9', '--gradient-end': '#14b8a6', '--bg-color': '#f0f9ff' }; // Blue/Teal
  } else if (user.username === 'bob') {
    themeStyle = { '--theme-color': '#84cc16', '--gradient-start': '#84cc16', '--gradient-end': '#eab308', '--bg-color': '#f7fee7' }; // Lime/Yellow
  } else if (user.username === 'chris') {
    themeStyle = { '--theme-color': '#8b5cf6', '--gradient-start': '#8b5cf6', '--gradient-end': '#3b82f6', '--bg-color': '#f5f3ff' }; // Violet/Blue
  } else {
    // Default theme
    themeStyle = { '--theme-color': '#262626', '--gradient-start': '#f09433', '--gradient-end': '#bc1888', '--bg-color': '#ffffff' };
  }

  return (
    <div className={styles.container} style={themeStyle as React.CSSProperties}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          {user.username} <span className={styles.verified}>☑️</span>
        </div>
        <div className={styles.menuIcon}>≡</div>
      </header>
      
      {/* Profile Info */}
      <div className={styles.profileInfo}>
        <div className={styles.avatarContainer}>
          <div className={styles.storyRing}>
            <div className={styles.avatar}>
               <span style={{fontSize: '36px'}}>{user.username.charAt(0).toUpperCase()}</span>
            </div>
          </div>
        </div>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{postCount}</span>
            <span className={styles.statLabel}>投稿</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{followersCount}</span>
            <span className={styles.statLabel}>フォロワー</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{followingCount}</span>
            <span className={styles.statLabel}>フォロー中</span>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className={styles.bio}>
        <span className={styles.bioName}>{user.display_name}</span>
        <br />
        {user.bio || "No bio yet."}
      </div>

      {/* Action Buttons */}
      <div className={styles.actions}>
        <button className={styles.actionBtn}>プロフィールを編集</button>
        <button className={styles.actionBtn}>アーカイブ</button>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <div className={`${styles.tab} ${styles.activeTab}`}>▦</div>
        <div className={styles.tab}>📺</div>
        <div className={styles.tab}>🏷️</div>
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {[...Array(12)].map((_, i) => (
          <div key={i} className={styles.gridItem}></div>
        ))}
      </div>

      {/* Bottom Nav */}
      <nav className={styles.bottomNav}>
        <Link href="/feed" className={styles.navIcon}>🏠</Link>
        <div className={styles.navIcon}>🔍</div>
        <div className={styles.navIcon}>➕</div>
        <div className={styles.navIcon}>❤️</div>
        <Link href="/profile">
           <div className={styles.navProfile}></div>
        </Link>
      </nav>
    </div>
  );
}
