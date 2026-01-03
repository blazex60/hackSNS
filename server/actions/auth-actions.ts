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
  }
  
  // redirect()が呼ばれない場合はエラーを返す
  // 注意: この部分に到達するとエラーを表示する処理が必要
}
