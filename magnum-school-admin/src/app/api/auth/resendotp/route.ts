import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const API_BASE_URL = process.env.MAGNUM_API_BASE_URL || '';

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

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { message: 'Missing request body' },
        { status: 400 },
      );
    }

    const target = buildTarget('resendotp');
    const resp = await fetch(target.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
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

export const GET = POST;
