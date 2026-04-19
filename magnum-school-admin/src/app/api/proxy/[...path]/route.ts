import { NextRequest, NextResponse } from 'next/server';
import { encode, getToken } from 'next-auth/jwt';

export const runtime = 'nodejs';

const API_BASE_URL = process.env.MAGNUM_API_BASE_URL || '';
const AUTH_SECRET = process.env.NEXTAUTH_SECRET || '';

const AUTH_SERVICE_ENDPOINTS = [
  'login',
  'verifyotp',
  'resendotp',
  'forgotpassword',
  'resetpassword',
  'changepassword',
  'logout',
  'getuserprofile',
  'activateaccount',
  'register/parent',
  'requestloginpinreset',
  'resetloginpin',
  'setloginpin',
] as const;

const PUBLIC_ENDPOINTS = [
  'login',
  'verifyotp',
  'resendotp',
  'forgotpassword',
  'resetpassword',
  'activateaccount',
  'register/parent',
  'requestloginpinreset',
  'resetloginpin',
  'setloginpin',
] as const;

const toApiBase = () => {
  if (!API_BASE_URL) {
    throw new Error('MAGNUM_API_BASE_URL is not configured');
  }
  return API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
};

const normalizePath = (path: string) => path.replace(/^\/+|\/+$/g, '');

const isPublicPath = (path: string) => {
  const normalizedPath = normalizePath(path);

  return PUBLIC_ENDPOINTS.some(
    (endpoint) =>
      normalizedPath === endpoint || normalizedPath.startsWith(`${endpoint}/`),
  );
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

const cloneHeaders = (request: NextRequest) => {
  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('cookie');
  headers.delete('content-length');
  headers.delete('connection');
  headers.delete('accept-encoding');
  headers.delete('authorization');
  return headers;
};

const buildTargetUrl = (request: NextRequest, path: string) => {
  const base = toApiBase();
  const basePath = new URL(base).pathname.replace(/\/+$/, '');
  const normalizedPath = normalizePath(path);
  const isAuthServiceEndpoint = AUTH_SERVICE_ENDPOINTS.some(
    (endpoint) =>
      normalizedPath === endpoint || normalizedPath.startsWith(`${endpoint}/`),
  );

  let targetPath = normalizedPath;
  if (isAuthServiceEndpoint) {
    if (basePath.endsWith('/api')) {
      targetPath = normalizedPath.replace(/^api\//, '');
    } else if (!normalizedPath.startsWith('api/')) {
      targetPath = `api/${normalizedPath}`;
    }
  }

  const target = new URL(
    targetPath.endsWith('/') ? targetPath : `${targetPath}/`,
    base,
  );
  target.search = request.nextUrl.search;
  return target;
};

const refreshAccessToken = async (refreshToken: string) => {
  const base = toApiBase();
  const refreshUrl = new URL('refreshtoken/', base);
  const response = await fetch(refreshUrl.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json().catch(() => null);
  if (!data) return null;

  const accessToken = data.token || data.access_token || data.accessToken;
  const nextRefreshToken =
    data.refresh_token || data.refreshToken || refreshToken;

  if (!accessToken) return null;

  return {
    accessToken,
    refreshToken: nextRefreshToken,
  };
};

const forwardResponse = async (
  response: Response,
  extraHeaders?: HeadersInit,
) => {
  const body = await response.arrayBuffer();
  const headers = new Headers(response.headers);

  // Do not forward backend Set-Cookie headers (these often include
  // cookies scoped to the backend domain, e.g. Cloudflare `__cf_bm`),
  // which the browser will reject and log as invalid domain. We only
  // set cookies explicitly on the proxy when required (see refresh flow).
  headers.delete('set-cookie');

  if (extraHeaders) {
    Object.entries(extraHeaders).forEach(([key, value]) => {
      headers.set(key, String(value));
    });
  }

  return new NextResponse(body, {
    status: response.status,
    headers,
  });
};

const handleRequest = async (
  request: NextRequest,
  context: { params: { path: string[] } },
) => {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: 'Server configuration error' },
      { status: 500 },
    );
  }

  const segments = context.params.path || [];
  const path = segments.join('/');
  const isPublic = isPublicPath(path);
  const headers = cloneHeaders(request);

  const token = await getToken({ req: request, secret: AUTH_SECRET });
  const accessToken = token?.accessToken as string | undefined;
  const refreshToken = token?.refreshToken as string | undefined;
  const tokenError = token?.error as string | undefined;

  if (!isPublic) {
    if (!accessToken || tokenError) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 },
      );
    }
    headers.set('Authorization', `Token ${accessToken}`);
  }

  const hasBody = !['GET', 'HEAD'].includes(request.method);
  const body = hasBody ? await request.arrayBuffer() : undefined;
  const targetUrl = buildTargetUrl(request, path);

  let response = await fetch(targetUrl.toString(), {
    method: request.method,
    headers,
    body,
  });

  if (!isPublic && response.status === 401 && refreshToken) {
    const refreshed = await refreshAccessToken(refreshToken);
    if (refreshed?.accessToken) {
      headers.set('Authorization', `Token ${refreshed.accessToken}`);
      response = await fetch(targetUrl.toString(), {
        method: request.method,
        headers,
        body,
      });

      if (AUTH_SECRET) {
        const cookieName = getCookieName();
        const updatedToken = {
          ...token,
          accessToken: refreshed.accessToken,
          refreshToken: refreshed.refreshToken,
        };
        const encoded = await encode({
          token: updatedToken,
          secret: AUTH_SECRET,
        });
        const nextResponse = await forwardResponse(response);
        nextResponse.cookies.set(cookieName, encoded, {
          httpOnly: true,
          sameSite: 'lax',
          secure: cookieName.startsWith('__Secure-'),
          path: '/',
        });
        return nextResponse;
      }
    }
  }

  return forwardResponse(response);
};

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as PUT,
  handleRequest as PATCH,
  handleRequest as DELETE,
  handleRequest as OPTIONS,
};
