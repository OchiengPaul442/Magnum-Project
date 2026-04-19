import type { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import * as Sentry from '@sentry/nextjs';

const BASE_URL =
  typeof window === 'undefined'
    ? new URL(
        '/api',
        process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      ).toString()
    : '/api';

// Enhanced error response interface
export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, any>;
  timestamp?: string;
  path?: string;
}

// Centralized status messages
export const STATUS_MESSAGES = {
  200: 'Success',
  201: 'Created successfully',
  202: 'Accepted',
  204: 'No content',
  400: 'Invalid request. Please check your input and try again.',
  401: 'Authentication required. Please log in and try again.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  409: 'This action conflicts with existing data.',
  422: 'Invalid data provided. Please check your input.',
  429: 'Too many requests. Please wait a moment and try again.',
  500: 'Server error. Please try again later.',
  502: 'Service temporarily unavailable. Please try again later.',
  503: 'Service temporarily unavailable. Please try again later.',
  504: 'Gateway timeout. Please try again later.',
  NETWORK_ERROR: 'Network error - please check your connection and try again',
  CONFIG_ERROR: 'Request configuration error',
  UNKNOWN_ERROR: 'An unexpected error occurred',
} as const;

// Type-guard for Axios errors
export function isAxiosError<T = ApiErrorResponse>(
  err: unknown,
): err is AxiosError<T> {
  return axios.isAxiosError(err);
}

// Get status message helper
export function getStatusMessage(status?: number): string {
  if (!status) return STATUS_MESSAGES.UNKNOWN_ERROR;

  return (
    STATUS_MESSAGES[status as keyof typeof STATUS_MESSAGES] || `HTTP ${status}`
  );
}

// Configuration constants
const TIMEOUT_CONFIG = {
  timeout: 30000,
  timeoutErrorMessage: 'Request timeout - please try again',
} as const;

const AUTH_FAILURE_STORAGE_KEY = 'magnum-auth-401-count';
const AUTH_FAILURE_LOGOUT_THRESHOLD = 3;

let sessionRefreshPromise: Promise<boolean> | null = null;
let logoutPromise: Promise<void> | null = null;

type RetryAwareRequestConfig = AxiosRequestConfig & {
  _magnumAuthRetryAttempted?: boolean;
};

const readAuthFailureCount = () => {
  if (typeof window === 'undefined') {
    return 0;
  }

  const value = window.sessionStorage.getItem(AUTH_FAILURE_STORAGE_KEY);
  const count = Number(value);

  return Number.isFinite(count) && count > 0 ? count : 0;
};

const writeAuthFailureCount = (count: number) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(AUTH_FAILURE_STORAGE_KEY, String(count));
};

const resetAuthFailureCount = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(AUTH_FAILURE_STORAGE_KEY);
};

const incrementAuthFailureCount = () => {
  const nextCount = readAuthFailureCount() + 1;
  writeAuthFailureCount(nextCount);
  return nextCount;
};

const refreshClientSession = async () => {
  if (typeof window === 'undefined') {
    return false;
  }

  if (!sessionRefreshPromise) {
    sessionRefreshPromise = import('next-auth/react')
      .then(({ getSession }) => getSession())
      .then((session) => Boolean(session && !(session as any).error))
      .catch(() => false)
      .finally(() => {
        sessionRefreshPromise = null;
      });
  }

  return sessionRefreshPromise;
};

const logoutClientSession = async () => {
  if (typeof window === 'undefined') {
    return;
  }

  if (!logoutPromise) {
    logoutPromise = import('next-auth/react')
      .then(({ signOut }) =>
        signOut({ callbackUrl: '/sign-in' }).catch(() => {
          window.location.assign('/sign-in');
        }),
      )
      .catch(() => {
        window.location.assign('/sign-in');
      })
      .finally(() => {
        logoutPromise = null;
        resetAuthFailureCount();
      });
  }

  return logoutPromise;
};

// Factory to create configured Axios instances
function createInstance(options: {
  secure?: boolean;
  multipart?: boolean;
}): AxiosInstance {
  const { multipart = false, secure = false } = options;

  const instance = axios.create({
    baseURL: BASE_URL,
    ...TIMEOUT_CONFIG,
    validateStatus: (status) => status < 400,
    withCredentials: false,
  });

  // If this instance is for multipart/form-data uploads, hint the header.
  if (multipart) {
    // Let Axios set the proper multipart boundary; provide a hint to consumers.
    // We add the header here to avoid the `multipart` variable being unused.
    // Note: when sending FormData, browsers will set the Content-Type correctly.
    instance.defaults.headers['Content-Type'] = 'multipart/form-data';
  }

  // Requests are routed through same-origin API paths and rewritten server-side.

  instance.interceptors.response.use(
    (response) => {
      if (secure) {
        resetAuthFailureCount();
      }

      if (process.env.NODE_ENV === 'development') {
        console.log(
          `✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`,
        );
      }

      return response;
    },
    async (error: AxiosError<ApiErrorResponse>) => {
      if (isAxiosError(error)) {
        const { response, request, config } = error;

        if (secure && response?.status === 401) {
          const retryConfig = (config || {}) as RetryAwareRequestConfig;

          if (!retryConfig._magnumAuthRetryAttempted) {
            retryConfig._magnumAuthRetryAttempted = true;

            const refreshed = await refreshClientSession();
            if (refreshed) {
              try {
                return await instance.request(retryConfig);
              } catch (retryError) {
                const retryResponse = (
                  retryError as AxiosError<ApiErrorResponse>
                ).response;

                if (retryResponse?.status === 401) {
                  const nextCount = incrementAuthFailureCount();
                  if (nextCount >= AUTH_FAILURE_LOGOUT_THRESHOLD) {
                    await logoutClientSession();
                  }
                } else {
                  const retryConfigData = (
                    retryError as AxiosError<ApiErrorResponse>
                  ).config;
                  const retryErrorLog = {
                    method: retryConfigData?.method?.toUpperCase(),
                    url: retryConfigData?.url,
                    status: retryResponse?.status,
                    statusText: retryResponse?.statusText,
                    message:
                      retryResponse?.data?.message ||
                      (retryError as AxiosError<ApiErrorResponse>).message,
                    timestamp: new Date().toISOString(),
                  };

                  console.error('API Error:', retryErrorLog);
                  Sentry.captureException(retryError, {
                    tags: {
                      request_url: retryConfigData?.url || 'unknown',
                      request_method: retryConfigData?.method || 'unknown',
                      status: retryResponse?.status?.toString() || 'unknown',
                    },
                    extra: retryErrorLog,
                  });
                }

                return Promise.reject(retryError);
              }
            }
          }

          const nextCount = incrementAuthFailureCount();
          if (nextCount >= AUTH_FAILURE_LOGOUT_THRESHOLD) {
            await logoutClientSession();
          }

          console.warn('Authentication failed - token may be expired');
          return Promise.reject(error);
        }

        const errorLog = {
          method: config?.method?.toUpperCase(),
          url: config?.url,
          status: response?.status,
          statusText: response?.statusText,
          message: response?.data?.message || error.message,
          timestamp: new Date().toISOString(),
        };

        console.error('API Error:', errorLog);
        Sentry.captureException(error, {
          tags: {
            request_url: config?.url || 'unknown',
            request_method: config?.method || 'unknown',
            status: response?.status?.toString() || 'unknown',
          },
          extra: errorLog,
        });

        if (response) {
          switch (response.status) {
            case 403:
              console.warn('Access forbidden - insufficient permissions');
              break;
            case 404:
              console.warn('Resource not found');
              break;
            case 429:
              console.warn('Rate limit exceeded');
              break;
            case 500:
            case 502:
            case 503:
            case 504:
              console.error('Server error - please try again later');
              break;
          }
        } else if (request) {
          console.error('Network error - no response received');
        } else {
          console.error('Request configuration error');
        }
      } else {
        console.error('Unexpected error:', error);
        Sentry.captureException(error);
      }

      return Promise.reject(error);
    },
  );

  return instance;
}

// Create singleton instances
export const publicApi = createInstance({ secure: false, multipart: false });
export const authenticatedApi = createInstance({
  secure: true,
  multipart: false,
});
export const fileUploadApi = createInstance({ secure: true, multipart: true });

// Legacy exports for backward compatibility
export const openApi = publicApi;
export const secureApi = authenticatedApi;
export const multipartApi = fileUploadApi;

export enum MicroService {
  USER_REGISTRATION = 'user-registration',
  COMMUNITY_ENGAGEMENT = 'community-engagement',
  RESOURCE_SHARING = 'resource-sharing',
}

// helper to trim stray slashes
const trim = (s: string) => s.replace(/^\/+|\/+$/g, '');

/**
 * lock in a service, version (defaults to v1)
 */
export function createServiceClient(
  service: MicroService,
  version: string = 'v1',
  defaultResource: string = '',
) {
  const base = `/${service}/api/${version}`;
  const resource = trim(defaultResource);

  return {
    /**
     * build an endpoint under the defaultResource "/e.g user-registration/api/v1/users/login"
     */
    endpoint: (...paths: string[]) => {
      const clean = paths.map(trim).filter(Boolean).join('/');

      return clean ? `${base}/${resource}/${clean}` : `${base}/${resource}`;
    },

    /**
     * if you ever need a raw base+resource (no extra path) "e.g /user-registration/api/v1/users"
     */
    all: () => `${base}/${resource}`,

    /**
     * or a true raw base with no resource segment at all: "e.g /user-registration/api/v1"
     */
    raw: () => base,
  };
}
