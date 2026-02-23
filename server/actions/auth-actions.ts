'use server';

import { vulnerableLogin } from '../auth/login';
import { buildSessionCookie, clearSessionCookie, SessionPayload } from '../auth/session';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function loginAction(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const user = vulnerableLogin(username, password) as Record<string, unknown> | null | undefined;

  if (user) {
    // JWTセッションCookieを発行
    const token = await import('../auth/session').then(m =>
      m.createSessionToken({
        sub: String(user.id),
        username: String(user.username),
        displayName: String(user.display_name),
      })
    );
    const cookieStore = await cookies();
    cookieStore.set('session', token, {
      httpOnly: true,
      secure: false, // ローカル教育環境はHTTPのためfalse
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24時間
    });
    revalidatePath('/feed');
    redirect('/feed');
  } else {
    redirect('/login?error=invalid-credentials');
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.set('session', '', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  redirect('/login');
}

// セッションを取得するサーバー側ユーティリティ
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  if (!token) return null;
  const { verifySessionToken } = await import('../auth/session');
  return verifySessionToken(token);
}

// buildSessionCookie / clearSessionCookie を再エクスポート（他の場所で使う場合用）
export { buildSessionCookie, clearSessionCookie };
