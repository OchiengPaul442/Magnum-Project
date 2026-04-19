import { NextRequest, NextResponse } from 'next/server';
import { encode, getToken } from 'next-auth/jwt';
import { getAuthSecret } from '@/lib/auth/secret';

export const runtime = 'nodejs';

const API_BASE_URL = process.env.MAGNUM_API_BASE_URL || '';
const AUTH_SECRET = getAuthSecret();
const EXPIRY_BUFFER_MS = 60 * 1000;

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

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
};

const toStringValue = (value: unknown) => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const sanitizeResponseHeaders = (headers: Headers) => {
  headers.delete('set-cookie');
  headers.delete('content-encoding');
  headers.delete('content-length');
  headers.delete('transfer-encoding');
  headers.delete('connection');
  headers.delete('keep-alive');
  headers.delete('proxy-authenticate');
  headers.delete('proxy-authorization');
  headers.delete('te');
  headers.delete('trailer');
  headers.delete('upgrade');

  return headers;
};

const buildBackendHeaders = ({
  isPublic,
  accessToken,
  hasBody,
  contentType,
}: {
  isPublic: boolean;
  accessToken?: string;
  hasBody: boolean;
  contentType?: string | null;
}) => {
  const headers = new Headers();

  if (hasBody && contentType) {
    headers.set('Content-Type', contentType);
  } else if (hasBody) {
    headers.set('Content-Type', 'application/json');
  }

  if (!isPublic && accessToken) {
    headers.set('Authorization', `Token ${accessToken}`);
  }

  return headers;
};

const buildTargetUrl = (request: NextRequest, path: string) => {
  const base = toApiBase();
  const basePath = new URL(base).pathname.replace(/\/+$/, '');
  const normalizedPath = normalizePath(path);

  let targetPath = normalizedPath;
  if (basePath.endsWith('/api')) {
    targetPath = normalizedPath.replace(/^api\//, '');
  } else if (!normalizedPath.startsWith('api/')) {
    targetPath = `api/${normalizedPath}`;
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
  const refreshTokenExpiresIn =
    data.refresh_token_expires_in || data.refreshTokenExpiresIn || null;
  const accessTokenExpiresIn =
    data.access_token_expires_in ||
    data.accessTokenExpiresIn ||
    data.token_expires_in ||
    data.expires_in ||
    null;

  if (!accessToken) return null;

  const accessAsNumber = Number(accessTokenExpiresIn);
  const refreshAsNumber = Number(refreshTokenExpiresIn);

  return {
    accessToken,
    refreshToken: nextRefreshToken,
    accessTokenExpires: Number.isFinite(accessAsNumber)
      ? Date.now() + accessAsNumber * 1000
      : undefined,
    refreshTokenExpires: Number.isFinite(refreshAsNumber)
      ? Date.now() + refreshAsNumber * 1000
      : undefined,
  };
};

const extractSessionUpdatesFromResponse = (payload: unknown) => {
  const root = isRecord(payload) ? payload : {};
  const container =
    (isRecord(root.user_data) ? root.user_data : null) ||
    (isRecord(root.userData) ? root.userData : null) ||
    (isRecord(root.data) ? root.data : null) ||
    root;

  const userData =
    (isRecord(container.user_data) ? container.user_data : null) ||
    (isRecord(container.userData) ? container.userData : null) ||
    (isRecord(container.user) ? container.user : null) ||
    container;

  const accessToken =
    toStringValue(container.token) ||
    toStringValue(container.access_token) ||
    toStringValue(root.token) ||
    toStringValue(root.access_token);

  const refreshToken =
    toStringValue(container.refresh_token) ||
    toStringValue(container.refreshToken) ||
    toStringValue(root.refresh_token) ||
    toStringValue(root.refreshToken);

  const firstName =
    toStringValue(userData.first_name) || toStringValue(container.first_name);
  const lastName =
    toStringValue(userData.last_name) || toStringValue(container.last_name);
  const fullName =
    toStringValue(userData.full_name) ||
    toStringValue(userData.fullName) ||
    toStringValue(container.full_name) ||
    toStringValue(container.fullName) ||
    [firstName, lastName].filter(Boolean).join(' ').trim() ||
    toStringValue(userData.name) ||
    toStringValue(container.name);

  const email =
    toStringValue(userData.email) ||
    toStringValue(userData.user_email) ||
    toStringValue(container.email) ||
    toStringValue(container.user_email);

  const picture =
    toStringValue(userData.user_profile_picture) ||
    toStringValue(userData.picture) ||
    toStringValue(userData.image) ||
    toStringValue(container.user_profile_picture) ||
    toStringValue(container.picture) ||
    toStringValue(container.image);

  const userCategory =
    toStringValue(userData.user_category) ||
    toStringValue(userData.userCategory) ||
    toStringValue(container.user_category) ||
    toStringValue(container.userCategory);

  const school =
    (isRecord(userData.school) ? userData.school : null) ||
    (isRecord(container.school) ? container.school : null) ||
    (isRecord(root.school) ? root.school : null);

  const firstTimeLogin =
    container.first_time_login ??
    container.firstTimeLogin ??
    root.first_time_login ??
    root.firstTimeLogin;

  return {
    accessToken,
    refreshToken,
    name: fullName,
    email,
    picture,
    userCategory,
    school,
    first_time_login:
      typeof firstTimeLogin === 'boolean' ? firstTimeLogin : undefined,
  };
};

const isExpiringSoon = (expiresAt?: number, bufferMs = EXPIRY_BUFFER_MS) => {
  if (typeof expiresAt !== 'number') {
    return false;
  }

  return Date.now() >= expiresAt - bufferMs;
};

const attachSessionCookie = async (
  response: Response,
  token: Awaited<ReturnType<typeof getToken>> | null,
  sessionUpdates: Record<string, unknown>,
) => {
  if (!AUTH_SECRET || !token) {
    return forwardResponse(response);
  }

  const cookieName = getCookieName();
  const updatedToken = {
    ...(token as Record<string, unknown>),
    error: undefined,
  };

  Object.entries(sessionUpdates).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      (updatedToken as Record<string, unknown>)[key] = value;
    }
  });

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
};

const forwardResponse = async (
  response: Response,
  extraHeaders?: HeadersInit,
) => {
  const body = await response.arrayBuffer();
  const headers = sanitizeResponseHeaders(new Headers(response.headers));

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
  const hasBody = !['GET', 'HEAD'].includes(request.method);
  const contentType = request.headers.get('content-type');
  const body = hasBody ? await request.arrayBuffer() : undefined;
  const targetUrl = buildTargetUrl(request, path);

  let token: Awaited<ReturnType<typeof getToken>> | null = null;
  let accessToken: string | undefined;
  let refreshToken: string | undefined;
  let accessTokenExpires: number | undefined;
  let refreshTokenExpires: number | undefined;
  let tokenError: string | undefined;
  let refreshedToken: {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    refreshTokenExpires?: number;
  } | null = null;

  if (!isPublic) {
    token = await getToken({ req: request, secret: AUTH_SECRET });
    accessToken = token?.accessToken as string | undefined;
    refreshToken = token?.refreshToken as string | undefined;
    accessTokenExpires = token?.accessTokenExpires as number | undefined;
    refreshTokenExpires = token?.refreshTokenExpires as number | undefined;
    tokenError = token?.error as string | undefined;

    if (!accessToken && !refreshToken) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 },
      );
    }

    if (
      refreshToken &&
      (tokenError === 'RefreshAccessTokenError' ||
        !accessToken ||
        isExpiringSoon(accessTokenExpires) ||
        isExpiringSoon(refreshTokenExpires))
    ) {
      refreshedToken = await refreshAccessToken(refreshToken);
      if (refreshedToken?.accessToken) {
        accessToken = refreshedToken.accessToken;
      }
    }

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 },
      );
    }
  }

  const headers = buildBackendHeaders({
    isPublic,
    accessToken,
    hasBody,
    contentType,
  });

  let response = await fetch(targetUrl.toString(), {
    method: request.method,
    headers,
    body,
    cache: 'no-store',
  });

  if (!isPublic && response.status === 401 && refreshToken) {
    const refreshed =
      refreshedToken || (await refreshAccessToken(refreshToken));
    if (refreshed?.accessToken) {
      const retryHeaders = buildBackendHeaders({
        isPublic,
        accessToken: refreshed.accessToken,
        hasBody,
      });
      response = await fetch(targetUrl.toString(), {
        method: request.method,
        headers: retryHeaders,
        body,
        cache: 'no-store',
      });

      return attachSessionCookie(response, token, refreshed);
    }
  }

  if (!isPublic) {
    const normalizedPath = normalizePath(path);
    let sessionUpdates: Record<string, unknown> | null = null;

    if (normalizedPath === 'updateuserprofile' && response.ok) {
      const responseBody = await response
        .clone()
        .json()
        .catch(() => null);
      sessionUpdates = extractSessionUpdatesFromResponse(responseBody);
    }

    const hasSessionUpdates =
      sessionUpdates &&
      Object.values(sessionUpdates).some(
        (value) => value !== undefined && value !== null,
      );

    if (
      AUTH_SECRET &&
      token &&
      (refreshedToken?.accessToken || hasSessionUpdates)
    ) {
      return attachSessionCookie(response, token, {
        ...(refreshedToken || {}),
        ...(sessionUpdates || {}),
      });
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
