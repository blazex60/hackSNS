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
      content: 'HackSNSへようこそ！このサイトはWebセキュリティ（SQLインジェクション・認証bypass）の実習環境です。安全に学びましょう。',
      timestamp: '2時間前',
      likes: 24,
      comments: 5,
    },
    {
      id: 2,
      displayName: 'Alice',
      username: 'alice',
      content: 'SQLインジェクション基礎を学習中。\' OR \'1\'=\'1 のような入力がなぜ危険なのか理解できてきた！',
      timestamp: '3時間前',
      likes: 18,
      comments: 4,
    },
    {
      id: 3,
      displayName: 'Bob',
      username: 'bob',
      content: 'パスワードのハッシュ化とソルトについて調べてみた。平文パスワードを保存しているシステムがまだ多いのは驚き。',
      timestamp: '5時間前',
      likes: 31,
      comments: 7,
    },
    {
      id: 4,
      displayName: 'Chris',
      username: 'chris',
      content: 'セッション管理の脆弱性を実際に試してみた。Cookieのhttponly属性がいかに重要かわかった。次はCSRF対策を学ぶ予定。',
      timestamp: '6時間前',
      likes: 12,
      comments: 3,
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
          <div className={styles.attackCard}>
            <h2 className={styles.sidebarTitle}>攻撃ツール</h2>
            <div className={styles.codeBlock}>
              <div className={styles.codeLine}>npm run attack --target &lt;user&gt;</div>
              <div className={styles.codeLine}>npm run brute --target &lt;user&gt;</div>
              <div className={styles.codeLine}>npm run fast-api (高速ターゲット)</div>
            </div>
          </div>

          <div className={styles.attackCard} style={{ marginTop: '16px' }}>
            <h2 className={styles.sidebarTitle}>テストアカウント</h2>
            <div className={styles.accountList}>
              <div className={styles.accountItem}>
                <span className={styles.accountUser}>take</span>
                <span className={styles.accountPass}>1234</span>
              </div>
              <div className={styles.accountItem}>
                <span className={styles.accountUser}>alice</span>
                <span className={styles.accountPass}>ar94</span>
              </div>
              <div className={styles.accountItem}>
                <span className={styles.accountUser}>bob</span>
                <span className={styles.accountPass}>8Fk7</span>
              </div>
              <div className={styles.accountItem}>
                <span className={styles.accountUser}>chris</span>
                <span className={styles.accountPass}>T9@a</span>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
