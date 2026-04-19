import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import type { AxiosResponse } from 'axios';
import type { SWRConfiguration, SWRResponse } from 'swr';

import {
  publicApi,
  authenticatedApi,
  fileUploadApi,
  isAxiosError,
  getStatusMessage,
  STATUS_MESSAGES,
  type ApiErrorResponse,
} from './enhancedApiClient';

// Enhanced error interface for better error handling
export interface ApiError extends Error {
  status?: number;
  statusText?: string;
  statusMessage?: string;
  code?: string;
  details?: Record<string, any>;
  timestamp?: string;
}

// Enhanced response interface that includes status information
export interface FetchResponse<T> {
  data: T;
  status: number;
  statusText: string;
  statusMessage: string;
  headers: Record<string, string>;
}

// Enhanced SWR response interface
export interface UseFetchResponse<T> extends Omit<
  SWRResponse<FetchResponse<T>, ApiError>,
  'data'
> {
  data: T | undefined;
  response: FetchResponse<T> | undefined;
  isLoading: boolean;
  isValidating: boolean;
  status?: number;
  statusText?: string;
  statusMessage?: string;
}

// Enhanced mutation response interface
export interface MutationResponse<T> {
  data: T;
  status: number;
  statusText: string;
  statusMessage: string;
  headers: Record<string, string>;
}

// Create enhanced API error from axios error
function createApiError(error: unknown): ApiError {
  if (isAxiosError<ApiErrorResponse>(error)) {
    const { response, request } = error;
    const apiError = new Error() as ApiError;

    if (response) {
      // Server responded with error
      const statusMessage = getStatusMessage(response.status);

      apiError.message = response.data?.message || statusMessage;
      apiError.status = response.status;
      apiError.statusText = response.statusText;
      apiError.statusMessage = statusMessage;
      apiError.code = response.data?.code;
      apiError.details = response.data?.details;
      apiError.timestamp = response.data?.timestamp || new Date().toISOString();
    } else if (request) {
      // Network error
      apiError.message = STATUS_MESSAGES.NETWORK_ERROR;
      apiError.statusMessage = STATUS_MESSAGES.NETWORK_ERROR;
      apiError.code = 'NETWORK_ERROR';
    } else {
      // Request configuration error
      apiError.message = STATUS_MESSAGES.CONFIG_ERROR;
      apiError.statusMessage = STATUS_MESSAGES.CONFIG_ERROR;
      apiError.code = 'CONFIG_ERROR';
    }

    apiError.name = 'ApiError';
    apiError.timestamp = apiError.timestamp || new Date().toISOString();

    return apiError;
  }

  // Unknown error
  const apiError = new Error(STATUS_MESSAGES.UNKNOWN_ERROR) as ApiError;

  apiError.name = 'UnknownError';
  apiError.statusMessage = STATUS_MESSAGES.UNKNOWN_ERROR;
  apiError.code = 'UNKNOWN_ERROR';
  apiError.timestamp = new Date().toISOString();

  return apiError;
}

// Generic GET fetcher with comprehensive error handling and status extraction
export async function fetcher<T>(
  url: string,
  secure = false,
): Promise<FetchResponse<T>> {
  try {
    const client = secure ? authenticatedApi : publicApi;
    const response: AxiosResponse<T> = await client.get<T>(url);

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      statusMessage: getStatusMessage(response.status),
      headers: response.headers as Record<string, string>,
    };
  } catch (error) {
    throw createApiError(error);
  }
}

// Enhanced hook for GET/READ operations with status information
export function useFetch<T>(
  key: string | null,
  secure = false,
  config?: SWRConfiguration<FetchResponse<T>, ApiError>,
): UseFetchResponse<T> {
  const swrResponse = useSWR<FetchResponse<T>, ApiError>(
    key,
    (url: string) => fetcher<T>(url, secure),
    {
      // Default configuration
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
      errorRetryCount: 3,
      errorRetryInterval: 1000,
      ...config,
    },
  );

  const { data: responseData, error, isValidating, mutate } = swrResponse;

  return {
    ...swrResponse,
    data: responseData?.data,
    response: responseData,
    isLoading: !responseData && !error,
    isValidating,
    status: responseData?.status,
    statusText: responseData?.statusText,
    statusMessage: responseData?.statusMessage,
    mutate,
  };
}

// Enhanced mutation hook with comprehensive options and status handling
export function useMutation<
  TData,
  TVars extends Record<string, any> = Record<string, any>,
>(
  endpoint: string,
  options?: {
    secure?: boolean;
    multipart?: boolean;
    method?: 'POST' | 'PATCH' | 'PUT' | 'DELETE' | 'OPTIONS';
  },
) {
  const { secure = false, multipart = false, method = 'POST' } = options || {};

  // Select appropriate client based on options
  const client = multipart
    ? fileUploadApi
    : secure
      ? authenticatedApi
      : publicApi;

  return useSWRMutation<MutationResponse<TData>, ApiError, string, TVars>(
    endpoint,
    async (url, { arg }) => {
      try {
        // Validate input for critical operations
        if (
          ['DELETE', 'PUT', 'PATCH'].includes(method) &&
          (!arg || Object.keys(arg).length === 0)
        ) {
          console.warn(
            `${method} operation with empty payload - this might be unintentional`,
          );
        }

        const response: AxiosResponse<TData> = await client.request({
          url,
          method,
          data: arg,

          // Additional security for file uploads
          ...(multipart && {
            maxContentLength: 50 * 1024 * 1024, // 50MB limit
            maxBodyLength: 50 * 1024 * 1024,
          }),
        });

        // Return enhanced response with metadata
        return {
          data: response.data,
          status: response.status,
          statusText: response.statusText,
          statusMessage: getStatusMessage(response.status),
          headers: response.headers as Record<string, string>,
        };
      } catch (error) {
        throw createApiError(error);
      }
    },
    {
      // Default mutation configuration
      revalidate: true,
      populateCache: false,
      rollbackOnError: true,
    },
  );
}

// Utility function to check if error is a specific HTTP status
export function isHttpError(error: unknown, status: number): boolean {
  return (
    error instanceof Error &&
    'status' in error &&
    (error as ApiError).status === status
  );
}

// Utility functions for common HTTP status checks
export const isUnauthorized = (error: unknown) => isHttpError(error, 401);
export const isForbidden = (error: unknown) => isHttpError(error, 403);
export const isNotFound = (error: unknown) => isHttpError(error, 404);

export const isServerError = (error: unknown) => {
  const apiError = error as ApiError;

  return apiError.status ? apiError.status >= 500 : false;
};

// Utility function to get user-friendly error message
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error && 'statusMessage' in error) {
    const apiError = error as ApiError;

    return apiError.statusMessage || apiError.message;
  }

  if (error instanceof Error && 'status' in error) {
    const apiError = error as ApiError;

    return getStatusMessage(apiError.status) || apiError.message;
  }

  return error instanceof Error ? error.message : STATUS_MESSAGES.UNKNOWN_ERROR;
}

// Helper function to get status info from response or error
export function getStatusInfo(
  responseOrError:
    | FetchResponse<any>
    | MutationResponse<any>
    | ApiError
    | unknown,
) {
  if (responseOrError && typeof responseOrError === 'object') {
    if ('status' in responseOrError) {
      const obj = responseOrError as any;

      return {
        status: obj.status,
        statusText: obj.statusText,
        statusMessage: obj.statusMessage || getStatusMessage(obj.status),
        isError: obj.status >= 400,
      };
    }
  }

  return {
    status: undefined,
    statusText: undefined,
    statusMessage: STATUS_MESSAGES.UNKNOWN_ERROR,
    isError: true,
  };
}
