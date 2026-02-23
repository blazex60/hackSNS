import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/server/auth/session';

/** 認証が必要なパスのプレフィックス */
const PROTECTED_PATHS = ['/feed', '/dashboard', '/profile'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 保護対象パスかどうか確認
  const isProtected = PROTECTED_PATHS.some(p => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get('session')?.value;
  if (token) {
    const payload = await verifySessionToken(token);
    if (payload) {
      // 認証済み: そのまま通過
      return NextResponse.next();
    }
  }

  // 未認証: ログインページへリダイレクト
  const loginUrl = new URL('/login', req.url);
  loginUrl.searchParams.set('from', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    /*
     * 以下を除くすべてのパスにマッチ:
     * - _next/static, _next/image (静的アセット)
     * - favicon.ico
     * - /api (攻撃ツールのテストを妨げないよう除外)
     * - /login
     */
    '/((?!_next/static|_next/image|favicon.ico|api|login).*)',
  ],
};
