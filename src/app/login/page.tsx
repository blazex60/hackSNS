import styles from "./login.module.css";
import { loginAction } from "@/server/actions/auth-actions";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.langSelector}>
        日本語 <span>&#8964;</span>
      </div>

      <div className={styles.contentWrapper}>
        <h1 className={styles.logo}>Nyanstagram</h1>

        <button className={styles.facebookButton}>
          <span className={styles.facebookIcon}>C</span> Catbookでログイン
        </button>

        <div className={styles.separator}>
          <div className={styles.line}></div>
          <span className={styles.orText}>または</span>
          <div className={styles.line}></div>
        </div>

        <form className={styles.form} action={loginAction}>
          <input 
            type="text" 
            name="username"
            className={styles.input} 
            placeholder="電話番号、ユーザーネーム、メールアドレス" 
          />
          <input 
            type="password" 
            name="password"
            className={styles.input} 
            placeholder="パスワード" 
          />
          
          <a href="#" className={styles.forgotPassword}>
            パスワードを忘れた場合
          </a>

          <button type="submit" className={styles.loginButton}>
            ログイン
          </button>
        </form>

        <div className={styles.signupWrapper}>
          アカウントをお持ちでないですか？
          <a href="#" className={styles.signupLink}>登録する</a>
        </div>
      </div>

      <footer className={styles.metaFooter}>
        <span className={styles.fromText}>from</span>
        <div className={styles.metaLogo}>
          <span>&#8734;</span> Tama
        </div>
      </footer>
    </div>
  );
}
