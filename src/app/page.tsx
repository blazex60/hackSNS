import Link from "next/link";
import styles from "./page.module.css";

const posts = [
  {
    id: 1,
    user: "admin",
    displayName: "Admin",
    handle: "@admin",
    content:
      "HackSNSへようこそ。ここはSQLインジェクション実習用の安全な学習環境です。",
    time: "1h",
    stats: { replies: 12, reposts: 3, likes: 58, views: "2.3k" },
  },
  {
    id: 2,
    user: "alice",
    displayName: "Alice",
    handle: "@alice",
    content: "今日は脆弱性診断のハンズオン。入力検証の重要さが身にしみる…",
    time: "3h",
    stats: { replies: 4, reposts: 1, likes: 22, views: "1.1k" },
  },
  {
    id: 3,
    user: "bob",
    displayName: "Bob",
    handle: "@bob",
    content: "SQLi対策、プリペアドステートメントは本当に救世主。",
    time: "6h",
    stats: { replies: 7, reposts: 2, likes: 35, views: "3.8k" },
  },
  {
    id: 4,
    user: "charlie",
    displayName: "Charlie",
    handle: "@charlie",
    content: "講義のあとに実習すると理解が深い。ログイン画面もそれっぽくした！",
    time: "9h",
    stats: { replies: 2, reposts: 0, likes: 14, views: "900" },
  },
];

const trends = [
  { tag: "#SQLインジェクション", count: "125 posts" },
  { tag: "#セキュリティ実習", count: "89 posts" },
  { tag: "#WebSecurity", count: "54 posts" },
  { tag: "#OWASP", count: "38 posts" },
  { tag: "#入力検証", count: "27 posts" },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <div className={styles.topBarInner}>
          <div className={styles.brand}>
            <span className={styles.brandIcon}>✕</span>
            <span className={styles.brandText}>HackSNS</span>
          </div>
          <div className={styles.topActions}>
            <Link href="/login" className={styles.loginButton}>
              ログイン
            </Link>
            <Link href="/login" className={styles.signupButton}>
              サインアップ
            </Link>
          </div>
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.leftNav}>
          <nav className={styles.navList}>
            <a className={styles.navItem}>
              <span className={styles.navIcon}>🏠</span>
              ホーム
            </a>
            <a className={styles.navItem}>
              <span className={styles.navIcon}>🔎</span>
              検索
            </a>
            <a className={styles.navItem}>
              <span className={styles.navIcon}>🔔</span>
              通知
            </a>
            <a className={styles.navItem}>
              <span className={styles.navIcon}>✉️</span>
              メッセージ
            </a>
            <a className={styles.navItem}>
              <span className={styles.navIcon}>👤</span>
              プロフィール
            </a>
          </nav>

          <div className={styles.leftCard}>
            <p className={styles.leftCardTitle}>実習の準備はできましたか？</p>
            <p className={styles.leftCardText}>
              SQLインジェクションの動作を安全に体験できます。
            </p>
            <Link href="/login" className={styles.leftCardButton}>
              実習を始める
            </Link>
          </div>
        </aside>

        <main className={styles.feed}>
          <section className={styles.compose}>
            <div className={styles.composeHeader}>
              <div className={styles.avatar}></div>
              <div className={styles.composeInput}>
                今日は何を学んでいますか？
              </div>
            </div>
            <div className={styles.composeFooter}>
              <div className={styles.composeIcons}>
                <span>🖼️</span>
                <span>📊</span>
                <span>😊</span>
              </div>
              <button className={styles.composeButton}>投稿する</button>
            </div>
          </section>

          <section className={styles.postList}>
            {posts.map((post) => (
              <article key={post.id} className={styles.post}>
                <div className={styles.postAvatar}></div>
                <div className={styles.postBody}>
                  <div className={styles.postHeader}>
                    <span className={styles.postName}>{post.displayName}</span>
                    <span className={styles.postHandle}>
                      {post.handle} ・ {post.time}
                    </span>
                  </div>
                  <p className={styles.postContent}>{post.content}</p>
                  <div className={styles.postStats}>
                    <span>💬 {post.stats.replies}</span>
                    <span>🔁 {post.stats.reposts}</span>
                    <span>❤️ {post.stats.likes}</span>
                    <span>👀 {post.stats.views}</span>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </main>

        <aside className={styles.rightRail}>
          <div className={styles.searchBox}>
            <span>🔍</span>
            <input
              className={styles.searchInput}
              placeholder="HackSNSを検索"
            />
          </div>

          <section className={styles.trendCard}>
            <h2 className={styles.trendTitle}>トレンド</h2>
            {trends.map((trend) => (
              <div key={trend.tag} className={styles.trendItem}>
                <span className={styles.trendTag}>{trend.tag}</span>
                <span className={styles.trendCount}>{trend.count}</span>
              </div>
            ))}
          </section>

          <section className={styles.noticeCard}>
            <h3 className={styles.noticeTitle}>⚠️ 教育目的の実習環境</h3>
            <p className={styles.noticeText}>
              本サイトはSQLインジェクションの学習専用です。外部サービスでの
              実践は行わないでください。
            </p>
          </section>
        </aside>
      </div>

      <footer className={styles.footer}>
        教育目的のSQLインジェクション実習環境
      </footer>
    </div>
  );
}
