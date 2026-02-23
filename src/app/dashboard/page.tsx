import Link from 'next/link';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import styles from './dashboard.module.css';
import { getSession, logoutAction } from '@/server/actions/auth-actions';

export default async function DashboardPage() {
  const session = await getSession();
  // モックデータ - 実際にはデータベースから取得
  const posts = [
    {
      id: 1,
      displayName: 'Admin User',
      username: 'admin',
      content: 'HackSNSへようこそ！このサイトはSQLインジェクションの実習用です。',
      timestamp: '2時間前',
      likes: 12,
      comments: 3,
    },
    {
      id: 2,
      displayName: 'Alice',
      username: 'alice',
      content: '今日はいい天気ですね☀️',
      timestamp: '3時間前',
      likes: 8,
      comments: 2,
      imageUrl: '/images/sunny.jpg',
    },
    {
      id: 3,
      displayName: 'Bob',
      username: 'bob',
      content: '新しいカフェを見つけました☕美味しかったです！',
      timestamp: '5時間前',
      likes: 15,
      comments: 5,
      imageUrl: '/images/cafe.jpg',
    },
    {
      id: 4,
      displayName: 'Charlie',
      username: 'charlie',
      content: 'TypeScriptの新機能を試してみました。便利ですね！',
      timestamp: '6時間前',
      likes: 6,
      comments: 1,
    },
  ];

  return (
    <div className={styles.container}>
      <Header username={session?.username ?? 'guest'} />

      <main className={styles.main}>
        {/* 左サイドバー */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <h2 className={styles.sidebarTitle}>メニュー</h2>
            <Link href="/dashboard" className={styles.menuItem}>
              <span>🏠</span>
              <span>ホーム</span>
            </Link>
            <Link href="/profile" className={styles.menuItem}>
              <span>👤</span>
              <span>プロフィール</span>
            </Link>
            <Link href="/messages" className={styles.menuItem}>
              <span>💬</span>
              <span>メッセージ</span>
            </Link>
            <Link href="/bookmarks" className={styles.menuItem}>
              <span>🔖</span>
              <span>ブックマーク</span>
            </Link>
            <Link href="/settings" className={styles.menuItem}>
              <span>⚙️</span>
              <span>設定</span>
            </Link>
            <form action={logoutAction}>
              <button type="submit" className={styles.menuItem} style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
                <span>🚪</span>
                <span>ログアウト</span>
              </button>
            </form>
          </div>

          <div className={styles.warningBanner}>
            <h3>⚠️ 実習環境</h3>
            <p>このサイトは教育目的のSQLインジェクション実習環境です。</p>
          </div>
        </aside>

        {/* メインフィード */}
        <section className={styles.feed}>
          <div className={styles.postForm}>
            <h2 className={styles.postFormTitle}>今何してる?</h2>
            <textarea
              className={styles.textarea}
              placeholder="いまどうしてる？"
            />
            <button className={styles.postButton}>投稿する</button>
          </div>

          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </section>

        {/* 右サイドバー */}
        <aside className={styles.rightSidebar}>
          <div className={styles.trendingCard}>
            <h2 className={styles.sidebarTitle}>トレンド</h2>
            <div className={styles.trendingItem}>
              <div className={styles.trendingTag}>#SQLインジェクション</div>
              <div className={styles.trendingCount}>125 posts</div>
            </div>
            <div className={styles.trendingItem}>
              <div className={styles.trendingTag}>#セキュリティ</div>
              <div className={styles.trendingCount}>89 posts</div>
            </div>
            <div className={styles.trendingItem}>
              <div className={styles.trendingTag}>#ハッキング実習</div>
              <div className={styles.trendingCount}>67 posts</div>
            </div>
            <div className={styles.trendingItem}>
              <div className={styles.trendingTag}>#WebSecurity</div>
              <div className={styles.trendingCount}>54 posts</div>
            </div>
          </div>

          <div className={styles.sidebarCard} style={{ marginTop: '16px' }}>
            <h2 className={styles.sidebarTitle}>おすすめユーザー</h2>
            <div className={styles.trendingItem}>
              <div className={styles.trendingTag}>@alice</div>
              <div className={styles.trendingCount}>写真が好きです📷</div>
            </div>
            <div className={styles.trendingItem}>
              <div className={styles.trendingTag}>@bob</div>
              <div className={styles.trendingCount}>旅行と料理が趣味です🌍</div>
            </div>
            <div className={styles.trendingItem}>
              <div className={styles.trendingTag}>@charlie</div>
              <div className={styles.trendingCount}>プログラマーです💻</div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
