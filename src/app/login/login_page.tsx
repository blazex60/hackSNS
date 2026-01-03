import { loginAction } from '@/server/actions/auth-actions';

export default function LoginPage() {
  return (
    <div>
      <h1>ログイン</h1>
      <form action={loginAction}>
        <input name="username" placeholder="ユーザー名" required />
        <input name="password" type="password" placeholder="パスワード" required />
        <button type="submit">ログイン</button>
      </form>
    </div>
  );
}
