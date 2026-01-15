import Link from "next/link";
import styles from "./profile.module.css";

export default function ProfilePage() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          nyanstagram <span className={styles.verified}>☑️</span>
        </div>
        <div className={styles.menuIcon}>≡</div>
      </header>
      
      {/* Profile Info */}
      <div className={styles.profileInfo}>
        <div className={styles.avatarContainer}>
          <div className={styles.storyRing}>
            <div className={styles.avatar}></div>
          </div>
        </div>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>6,509</span>
            <span className={styles.statLabel}>投稿</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>3.7億</span>
            <span className={styles.statLabel}>フォロワー</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>52</span>
            <span className={styles.statLabel}>フォロー中</span>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className={styles.bio}>
        <span className={styles.bioName}>nyanstagram</span>
        <br />
        Bringing you closer to the people and things you love.
        <br />
        <a href="#" className={styles.link}>www.nyanstagram.com/votinginfocenter/</a>
        <br />
        翻訳を見る
      </div>

      {/* Action Buttons */}
      <div className={styles.actions}>
        <button className={styles.actionBtn}>フォロー中</button>
        <button className={styles.actionBtn}>メッセージ</button>
        <button className={styles.actionBtn}>∨</button>
      </div>

      {/* Highlights */}
      <div className={styles.highlights}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className={styles.highlightItem}>
            <div className={styles.highlightAvatar}></div>
            <span className={styles.highlightLabel}>Highlight {i+1}</span>
          </div>
        ))}
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
          <div key={i} className={styles.gridItem} style={{ background: `hsl(${i * 30}, 70%, 80%)`}}></div>
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
