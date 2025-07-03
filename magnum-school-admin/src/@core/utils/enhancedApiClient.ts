import type {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import axios from 'axios';
import { getSession } from 'next-auth/react';

// Environment validation
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is required');
}

try {
  new URL(BASE_URL);
} catch {
  throw new Error('NEXT_PUBLIC_API_URL must be a valid URL');
}

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

// Factory to create configured Axios instances
function createInstance(options: {
  secure?: boolean;
  multipart?: boolean;
}): AxiosInstance {
  const { secure = false, multipart = false } = options;

  const instance = axios.create({
    baseURL: BASE_URL,
    ...TIMEOUT_CONFIG,
    headers: {
      ...(multipart ? {} : { 'Content-Type': 'application/json' }),
    },
    validateStatus: (status) => status < 500,
    withCredentials: false,
  });

  // Request interceptor for authentication
  if (secure) {
    instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        try {
          const session = await getSession();

          if (!session?.user?.accessToken) {
            throw new Error(
              'Authentication required but no valid session found',
            );
          }

          if (
            typeof session.user.accessToken !== 'string' ||
            session.user.accessToken.length < 10
          ) {
            throw new Error('Invalid authentication token format');
          }

          config.headers.Authorization = `Token ${session.user.accessToken}`;

          return config;
        } catch (error) {
          console.error('Authentication error:', error);

          return Promise.reject(error);
        }
      },
      (error) => {
        console.error('Request interceptor error:', error);

        return Promise.reject(error);
      },
    );
  }

  // Response interceptor with enhanced error handling
  instance.interceptors.response.use(
    (response) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`,
        );
      }

      return response;
    },
    (error: AxiosError<ApiErrorResponse>) => {
      if (isAxiosError(error)) {
        const { response, request, config } = error;

        // Log error details
        const errorLog = {
          method: config?.method?.toUpperCase(),
          url: config?.url,
          status: response?.status,
          statusText: response?.statusText,
          message: response?.data?.message || error.message,
          timestamp: new Date().toISOString(),
        };

        console.error('API Error:', errorLog);

        // Handle specific error cases
        if (response) {
          switch (response.status) {
            case 401:
              console.warn('Authentication failed - token may be expired');
              break;
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
