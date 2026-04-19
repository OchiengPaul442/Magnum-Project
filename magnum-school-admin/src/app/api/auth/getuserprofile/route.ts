import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getAuthSecret } from '@/lib/auth/secret';

export const runtime = 'nodejs';

const API_BASE_URL = process.env.MAGNUM_API_BASE_URL || '';
const AUTH_SECRET = getAuthSecret();

const toApiBase = () => {
  if (!API_BASE_URL) {
    throw new Error('MAGNUM_API_BASE_URL is not configured');
  }
  return API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
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

export const GET = async (request: NextRequest) => {
  try {
    const token = await getToken({ req: request, secret: AUTH_SECRET });
    const accessToken = (token as any)?.accessToken as string | undefined;

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 },
      );
    }

    const target = buildTarget('getuserprofile');
    const resp = await fetch(target.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Token ${accessToken}`,
      },
    });

    const data = await resp.json().catch(() => null);
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

export const POST = GET;
