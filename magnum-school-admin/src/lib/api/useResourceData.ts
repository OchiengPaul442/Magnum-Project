'use client';

import useSWR, { type SWRConfiguration } from 'swr';

import type { ApiError } from './swrConfig';

const DEFAULT_RESOURCE_CONFIG: SWRConfiguration<any, ApiError> = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 10000,
  errorRetryCount: 0,
  shouldRetryOnError: false,
};

export function useResourceData<T>(
  key: string | null,
  fetcher: () => Promise<T>,
  config?: SWRConfiguration<T, ApiError>,
) {
  return useSWR<T, ApiError>(key, fetcher, {
    ...DEFAULT_RESOURCE_CONFIG,
    ...config,
  });
}
