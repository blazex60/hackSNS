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
    revalidatePath('/dashboard');
    redirect('/dashboard');
  } else {
    return { error: 'ログイン失敗' };
  }
}
