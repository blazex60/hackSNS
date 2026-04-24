import PostCard from '@/components/PostCard';
import styles from "./feed.module.css";
import { getSession } from '@/server/actions/auth-actions';

const posts = [
  {
    displayName: "Admin",
    username: "admin",
    imageUrl: "https://picsum.photos/seed/admin42/600/600",
    content: "ライトアップされた橋と教会の夜景がとても綺麗でした✨ 夜の散歩は最高ですね",
    timestamp: "2時間前",
    likes: 12,
    comments: 3,
  },
  {
    displayName: "Security Bot",
    username: "secbot",
    imageUrl: "https://picsum.photos/seed/secbot77/600/600",
    content: "丘の上の素敵な邸宅と一面の畑🌾 まるで絵画のような美しい風景です",
    timestamp: "4時間前",
    likes: 34,
    comments: 7,
  },
  {
    displayName: "Alice",
    username: "alice",
    imageUrl: "https://picsum.photos/seed/alice88/600/600",
    content: "透き通るような青い海と可愛いオレンジのボート⛵ 最高のバカンス！",
    timestamp: "6時間前",
    likes: 58,
    comments: 11,
  },
  {
    displayName: "Chris",
    username: "chris",
    imageUrl: "https://picsum.photos/seed/chris55/600/600",
    content: "霧に包まれた幻想的な山林🌲 深呼吸すると自然のパワーを感じます",
    timestamp: "10時間前",
    likes: 45,
    comments: 9,
  },
];

const users = ["take", "alice", "bob", "chris", "admin"];

const suggestions = [
  { name: "kenoere",       reason: "heych2002 他7人がフォロー中" },
  { name: "lofti232",      reason: "kenoere 他12人がフォロー中" },
  { name: "sapphireblues", reason: "lofti232 他3人がフォロー中" },
  { name: "gwangurl77",    reason: "lofti232 他19人がフォロー中" },
  { name: "amethyst_grl",  reason: "dark_emeralds がフォロー中" },
];

export default async function FeedPage() {
  const session = await getSession();
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* 左カラム - フィード */}
        <div className={styles.leftCol}>
          {/* ストーリー */}
          <div className={styles.storiesBox}>
            <div className={styles.storiesList}>
              {users.map((name) => (
                <div key={name} className={styles.storyItem}>
                  <div className={styles.storyRing}>
                    <div className={styles.storyAvatar}>
                      {name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <span className={styles.storyName}>{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 投稿 */}
          {posts.map((post, i) => (
            <PostCard
              key={i}
              displayName={post.displayName}
              username={post.username}
              content={post.content}
              timestamp={post.timestamp}
              likes={post.likes}
              comments={post.comments}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>

        {/* 右カラム - サイドバー */}
        <div className={styles.rightCol}>
          <div className={styles.sidebarSection}>
            {/* 現在のユーザー */}
            <div className={styles.currentUser}>
              <div className={styles.currentAvatarRing}>
                <div className={styles.currentAvatar}>
                  {(session?.username ?? 'G').charAt(0).toUpperCase()}
                </div>
              </div>
              <div className={styles.currentInfo}>
                <span className={styles.currentUsername}>{session?.username ?? 'guest'}</span>
                <span className={styles.currentName}>{session?.username ?? 'guest'}</span>
              </div>
              <button className={styles.switchLink}>切り替え</button>
            </div>

            {/* おすすめユーザー */}
            <div className={styles.suggestionsHeader}>
              <span className={styles.suggestionsTitle}>おすすめユーザー</span>
              <span className={styles.seeAll}>すべて見る</span>
            </div>

            <div className={styles.suggestionsList}>
              {suggestions.map((item, i) => (
                <div key={i} className={styles.suggestionItem}>
                  <div className={styles.suggAvatar}>
                    {item.name.charAt(0)}
                  </div>
                  <div className={styles.suggInfo}>
                    <span className={styles.suggUsername}>{item.name}</span>
                    <span className={styles.suggReason}>{item.reason}</span>
                  </div>
                  <button className={styles.followLink}>フォロー</button>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.footerLinks}>
                <a href="#" className={styles.footerLink}>About</a> ·{' '}
                <a href="#" className={styles.footerLink}>Help</a> ·{' '}
                <a href="#" className={styles.footerLink}>Privacy</a> ·{' '}
                <a href="#" className={styles.footerLink}>Terms</a>
              </div>
              <div className={styles.copyright}>© 2026 TOYGRAM</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
