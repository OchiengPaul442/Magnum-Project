const AUTH_API_BASE_URL =
  typeof window === 'undefined'
    ? new URL(
        '/api',
        process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      ).toString()
    : '/api';

type AuthMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface AuthRequestOptions {
  method?: AuthMethod;
  body?: unknown;
  headers?: HeadersInit;
}

const buildUrl = (path: string) => {
  const normalizedPath = path.replace(/^\/+/, '');
  if (AUTH_API_BASE_URL.startsWith('/')) {
    return `${AUTH_API_BASE_URL.replace(/\/+$/, '')}/${normalizedPath}`;
  }

  return new URL(
    normalizedPath,
    AUTH_API_BASE_URL.endsWith('/')
      ? AUTH_API_BASE_URL
      : `${AUTH_API_BASE_URL}/`,
  ).toString();
};

const parseResponseBody = async (response: Response) => {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json().catch(() => null);
  }

  return response.text().catch(() => '');
};

const extractErrorMessage = (body: unknown, status: number) => {
  if (body && typeof body === 'object' && 'message' in body) {
    const message = (body as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }

  if (typeof body === 'string' && body.trim()) {
    return body;
  }

  return `Request failed with status ${status}`;
};

const request = async <T>(
  path: string,
  options: AuthRequestOptions = {},
): Promise<T> => {
  const headers = new Headers(options.headers);
  const hasFormDataBody = options.body instanceof FormData;

  if (hasFormDataBody) {
    headers.delete('Content-Type');
  } else if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(buildUrl(path), {
    method: options.method || 'POST',
    headers,
    body:
      options.body === undefined
        ? undefined
        : hasFormDataBody
          ? (options.body as BodyInit)
          : JSON.stringify(options.body),
    credentials: 'same-origin',
  });

  const parsedBody = await parseResponseBody(response);

  if (!response.ok) {
    throw new Error(extractErrorMessage(parsedBody, response.status));
  }

  return parsedBody as T;
};

export const authApi = {
  get: <T>(
    path: string,
    options?: Omit<AuthRequestOptions, 'method' | 'body'>,
  ) => request<T>(path, { ...options, method: 'GET' }),
  post: <T>(
    path: string,
    body?: unknown,
    options?: Omit<AuthRequestOptions, 'method' | 'body'>,
  ) => request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(
    path: string,
    body?: unknown,
    options?: Omit<AuthRequestOptions, 'method' | 'body'>,
  ) => request<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(
    path: string,
    body?: unknown,
    options?: Omit<AuthRequestOptions, 'method' | 'body'>,
  ) => request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(
    path: string,
    options?: Omit<AuthRequestOptions, 'method' | 'body'>,
  ) => request<T>(path, { ...options, method: 'DELETE' }),
};
