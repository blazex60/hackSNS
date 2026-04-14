'use server';

import { vulnerableLogin } from '../auth/login';
import { createSessionToken, verifySessionToken, SessionPayload } from '../auth/session';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function loginAction(formData: FormData): Promise<void> {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const user = vulnerableLogin(username, password) as Record<string, unknown> | null | undefined;

  if (user) {
    const token = await createSessionToken({
      sub: String(user.id),
      username: String(user.username),
      displayName: String(user.display_name),
    });
    const cookieStore = await cookies();
    cookieStore.set('session', token, {
      httpOnly: true,
      secure: false, // ローカル教育環境はHTTPのためfalse
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });
    revalidatePath('/feed');
    redirect('/feed');
  } else {
    redirect('/login?error=invalid-credentials');
  }
}

export async function logoutAction(): Promise<void> {
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

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

