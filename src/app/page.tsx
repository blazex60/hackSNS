import Link from 'next/link';
import styles from './page.module.css';

export default function LandingPage() {
  return (
    <div className={styles.page}>
      {/* Top Bar */}
      <header className={styles.topBar}>
        <div className={styles.topBarInner}>
          <div className={styles.brand}>
            <span className={styles.brandIcon}>🔐</span>
            <span className={styles.brandText}>HackSNS</span>
          </div>
          <div className={styles.topActions}>
            <Link href="/login" className={styles.loginButton}>
              ログイン
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>
            パスワード攻撃の仕組みを学ぼう
          </h1>
          <p className={styles.heroSub}>
            hackSNS は、辞書攻撃・ブルートフォース・SQLインジェクションを実際に体験できる教育用プラットフォームです。
          </p>
          <Link href="/login" className={styles.heroCta}>
            ログインして体験する
          </Link>
        </div>
      </section>

      {/* Feature Cards */}
      <section className={styles.features}>
        <div className={styles.featuresInner}>
          <h2 className={styles.featuresTitle}>学べること</h2>
          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <span className={styles.cardIcon}>🔑</span>
              <h3 className={styles.cardTitle}>辞書攻撃</h3>
              <p className={styles.cardDesc}>
                事前に用意したパスワードリストで高速クラッキングを体験
              </p>
            </div>
            <div className={styles.card}>
              <span className={styles.cardIcon}>💪</span>
              <h3 className={styles.cardTitle}>ブルートフォース</h3>
              <p className={styles.cardDesc}>
                文字の組み合わせを総当たりで試す攻撃手法を学ぶ
              </p>
            </div>
            <div className={styles.card}>
              <span className={styles.cardIcon}>🗃️</span>
              <h3 className={styles.cardTitle}>SQLインジェクション</h3>
              <p className={styles.cardDesc}>
                意図的に脆弱なログインAPIに対してSQLiを実践
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.footerCredit}>KTC Security Circle</p>
      </footer>
    </div>
  );
}
