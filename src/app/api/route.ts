import { NextRequest, NextResponse } from 'next/server';
import { vulnerableLogin } from '@/server/auth/login';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body as { username: string; password: string };

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'username and password are required' },
        { status: 400 }
      );
    }

    const user = vulnerableLogin(username, password) as Record<string, unknown> | null | undefined;

    if (user) {
      return NextResponse.json(
        {
          success: true,
          user: {
            id: user.id,
            username: user.username,
            display_name: user.display_name,
          },
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, error: 'invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'internal server error', detail: String(error) },
      { status: 500 }
    );
  }
}
