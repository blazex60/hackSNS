'use server';

import { vulnerableLogin } from '../auth/login';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function loginAction(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  
  const user = vulnerableLogin(username, password);
  
  if (user) {
    // セッション処理などをここに追加
    revalidatePath('/feed');
    redirect('/feed');
  } else {
    // 認証失敗時はログインページにエラーメッセージ付きでリダイレクト
    redirect('/login?error=invalid-credentials');
  }
}
