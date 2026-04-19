import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const API_BASE_URL = process.env.MAGNUM_API_BASE_URL || '';

const toApiBase = () => {
  if (!API_BASE_URL) {
    throw new Error('MAGNUM_API_BASE_URL is not configured');
  }
  return API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
};

const getCookieName = () => {
  const isSecure =
    process.env.NODE_ENV === 'production' &&
    !!process.env.NEXTAUTH_URL &&
    process.env.NEXTAUTH_URL.startsWith('https://');
  return isSecure
    ? '__Secure-next-auth.session-token'
    : 'next-auth.session-token';
};

const buildTarget = (endpoint: string) => {
  const base = toApiBase();
  const basePath = new URL(base).pathname
    .replace(/\/+$|^/g, '')
    .replace(/\/+$/g, '');
  const normalized = endpoint.replace(/^\/+|\/+$/g, '');
  const targetPath = basePath.endsWith('/api')
    ? `${normalized}/`
    : `api/${normalized}/`;
  return new URL(targetPath, base);
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json().catch(() => null);

    // Forward to backend logout if refresh_token provided
    if (body && body.refresh_token) {
      const target = buildTarget('logout');
      await fetch(target.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: body.refresh_token }),
      }).catch(() => null);
    }

    // Clear NextAuth cookie
    const cookieName = getCookieName();
    const res = NextResponse.json({ message: 'Signed out' }, { status: 200 });
    res.cookies.set(cookieName, '', { httpOnly: true, path: '/', maxAge: 0 });
    return res;
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || 'Server error' },
      { status: 500 },
    );
  }
};

export const GET = POST;
