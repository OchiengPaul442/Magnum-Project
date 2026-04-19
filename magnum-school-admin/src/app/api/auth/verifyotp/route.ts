import { NextRequest, NextResponse } from 'next/server';
import { encode } from 'next-auth/jwt';

export const runtime = 'nodejs';

const API_BASE_URL = process.env.MAGNUM_API_BASE_URL || '';
const AUTH_SECRET = process.env.NEXTAUTH_SECRET || '';
const DEFAULT_ACCESS_TOKEN_TTL_MS = 55 * 60 * 1000;
const DEFAULT_REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

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

const extractTokensFromResponse = (data: any) => {
  const root = data || {};
  const container = root.user_data || root.data || root;

  const accessToken =
    container?.token ||
    container?.access_token ||
    root?.token ||
    root?.access_token;
  const refreshToken = container?.refresh_token || root?.refresh_token || null;
  const expiresIn =
    container?.access_token_expires_in ||
    container?.access_token_expiresIn ||
    container?.expires_in ||
    root?.access_token_expires_in ||
    root?.expires_in ||
    null;

  const refreshExpiresIn =
    container?.refresh_token_expires_in ||
    container?.refresh_token_expiresIn ||
    root?.refresh_token_expires_in ||
    root?.refresh_token_expiresIn ||
    null;

  const asNumber = Number(expiresIn);
  const accessTokenExpires = Number.isFinite(asNumber)
    ? Date.now() + asNumber * 1000
    : Date.now() + DEFAULT_ACCESS_TOKEN_TTL_MS;

  const refreshAsNumber = Number(refreshExpiresIn);
  const refreshTokenExpires = Number.isFinite(refreshAsNumber)
    ? Date.now() + refreshAsNumber * 1000
    : Date.now() + DEFAULT_REFRESH_TOKEN_TTL_MS;

  const userData = container?.user_data || container?.user || container || {};
  const firstTimeLogin =
    container?.first_time_login ??
    container?.firstTimeLogin ??
    root?.first_time_login ??
    root?.firstTimeLogin ??
    false;

  return {
    accessToken: String(accessToken || ''),
    refreshToken: refreshToken || null,
    accessTokenExpires,
    refreshTokenExpires,
    userData,
    firstTimeLogin: Boolean(firstTimeLogin),
  };
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { message: 'Missing request body' },
        { status: 400 },
      );
    }

    const target = buildTarget('verifyotp');
    const resp = await fetch(target.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await resp.json().catch(() => null);

    if (resp.ok && data) {
      const {
        accessToken,
        refreshToken,
        accessTokenExpires,
        refreshTokenExpires,
        userData,
        firstTimeLogin,
      } = extractTokensFromResponse(data);

      if (!accessToken) {
        return NextResponse.json(data, { status: resp.status });
      }

      const nextToken = {
        accessToken,
        refreshToken,
        accessTokenExpires,
        refreshTokenExpires,
        id: String(userData?.id || body.username || body.email || '0'),
        name:
          userData?.first_name && userData?.last_name
            ? `${userData.first_name} ${userData.last_name}`
            : userData?.first_name || userData?.last_name || 'User',
        email: userData?.email || body.username || body.email || '',
        picture: userData?.user_profile_picture || null,
        userCategory: userData?.user_category || '',
        first_time_login: firstTimeLogin,
        school: userData?.school || null,
      } as any;

      const cookieName = getCookieName();
      const encoded = AUTH_SECRET
        ? await encode({ token: nextToken, secret: AUTH_SECRET })
        : '';

      const nextResponse = NextResponse.json(data, { status: resp.status });

      if (encoded) {
        nextResponse.cookies.set(cookieName, encoded, {
          httpOnly: true,
          sameSite: 'lax',
          secure: cookieName.startsWith('__Secure-'),
          path: '/',
          maxAge: 30 * 24 * 60 * 60,
        });
      }

      return nextResponse;
    }

    return NextResponse.json(data || { message: 'Request failed' }, {
      status: resp.status,
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || 'Server error' },
      { status: 500 },
    );
  }
};

export const GET = POST;
