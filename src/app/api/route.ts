import { NextRequest, NextResponse } from 'next/server';
import { vulnerableLogin } from '@/server/auth/login';
import { createSessionToken } from '@/server/auth/session';

// 失敗レスポンスをモジュールレベルでキャッシュして生成コストを削減
const INVALID_CREDS_BODY = JSON.stringify({ success: false, error: 'invalid credentials' });
const BAD_REQUEST_BODY = JSON.stringify({ success: false, error: 'username and password are required' });
const JSON_HEADERS = { 'Content-Type': 'application/json' };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body as { username: string; password: string };

    if (!username || !password) {
      return new Response(BAD_REQUEST_BODY, { status: 400, headers: JSON_HEADERS });
    }

    const user = vulnerableLogin(username, password) as Record<string, unknown> | null | undefined;

    if (user) {
      const token = await createSessionToken({
        sub: String(user.id),
        username: String(user.username),
        displayName: String(user.display_name),
      });
      const res = NextResponse.json(
        { success: true, user: { id: user.id, username: user.username, display_name: user.display_name } },
        { status: 200 }
      );
      res.cookies.set('session', token, {
        httpOnly: true,
        secure: false, // ローカル教育環境はHTTPのためfalse
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
      });
      return res;
    } else {
      return new Response(INVALID_CREDS_BODY, { status: 401, headers: JSON_HEADERS });
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'internal server error', detail: String(error) }),
      { status: 500, headers: JSON_HEADERS }
    );
  }
}
