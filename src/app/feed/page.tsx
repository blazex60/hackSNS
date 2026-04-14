import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import styles from "./feed.module.css";
import { getSession } from '@/server/actions/auth-actions';

const posts = [
  {
    displayName: "Admin",
    username: "admin",
    content: "今日の課題: admin アカウントに辞書攻撃を試してみよう！",
    timestamp: "2時間前",
    likes: 12,
    comments: 3,
  },
  {
    displayName: "Security Bot",
    username: "secbot",
    content: "パスワード '1234' は最も危険なパスワードのひとつです",
    timestamp: "4時間前",
    likes: 34,
    comments: 7,
  },
  {
    displayName: "Alice",
    username: "alice",
    content: "安全なパスワードは大文字・小文字・数字・記号を組み合わせた8文字以上",
    timestamp: "6時間前",
    likes: 58,
    comments: 11,
  },
  {
    displayName: "Chris",
    username: "chris",
    content: "SQLインジェクション: ユーザー名に `' OR '1'='1` を入れるとどうなる?",
    timestamp: "10時間前",
    likes: 45,
    comments: 9,
  },
];

const users = ["take", "alice", "bob", "chris", "admin"];

const suggestions = [
  { name: "kenoere", reason: "heych2002 他7人がフォロー中" },
  { name: "lofti232", reason: "kenoere 他12人がフォロー中" },
  { name: "sapphireblues", reason: "lofti232 他3人がフォロー中" },
  { name: "gwangurl77", reason: "lofti232 他19人がフォロー中" },
  { name: "amethyst_grl", reason: "dark_emeralds がフォロー中" },
];

export default async function FeedPage() {
  const session = await getSession();
  return (
    <div className={styles.container}>
      <Header username={session?.username ?? 'guest'} />

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

            {/* おすすめ */}
            <div className={styles.suggestionsHeader}>
              <span className={styles.suggestionsTitle}>おすすめユーザー</span>
              <span className={styles.seeAll}>すべて見る</span>
            </div>

            <div className={styles.suggestionsList}>
              {suggestions.map((user, i) => (
                <div key={i} className={styles.suggestionItem}>
                  <div className={styles.suggAvatar}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.suggInfo}>
                    <span className={styles.suggUsername}>{user.name}</span>
                    <span className={styles.suggReason}>{user.reason}</span>
                  </div>
                  <button className={styles.followLink}>フォロー</button>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.footerLinks}>
                <a href="#" className={styles.footerLink}>About</a> ·{' '}
                <a href="#" className={styles.footerLink}>Help</a> ·{' '}
                <a href="#" className={styles.footerLink}>Press</a> ·{' '}
                <a href="#" className={styles.footerLink}>Privacy</a> ·{' '}
                <a href="#" className={styles.footerLink}>Terms</a>
              </div>
              <div className={styles.copyright}>© 2026 HACKSNS</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
