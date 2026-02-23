import { SignJWT, jwtVerify } from 'jose';

export interface SessionPayload {
  sub: string;       // user id
  username: string;
  displayName: string;
  exp?: number;
}

const SESSION_COOKIE = 'session';
const SESSION_MAX_AGE = 60 * 60 * 24; // 24時間 (秒)

function getSecret(): Uint8Array {
  const key = process.env.SESSION_SECRET ?? 'hackSNS-dev-secret-change-in-production';
  return new TextEncoder().encode(key);
}

/** JWTセッショントークンを生成する */
export async function createSessionToken(payload: Omit<SessionPayload, 'exp'>): Promise<string> {
  return new SignJWT({ username: payload.username, displayName: payload.displayName })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getSecret());
}

/** JWTセッショントークンを検証してペイロードを返す。無効なら null */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      sub: payload.sub as string,
      username: payload.username as string,
      displayName: payload.displayName as string,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}

/** Set-Cookie 文字列を返す（`cookies().set()` の代替として `Response` ヘッダーに使用） */
export async function buildSessionCookie(payload: Omit<SessionPayload, 'exp'>): Promise<string> {
  const token = await createSessionToken(payload);
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${SESSION_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_MAX_AGE}${secure}`;
}

/** クリアするための空セッションCookieを返す */
export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}

export { SESSION_COOKIE };
