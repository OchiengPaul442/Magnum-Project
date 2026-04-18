import useSWR from "swr";

import type { ApiDetailResponse, ApiListResponse } from "@/lib/api/types";
import type { ListParams } from "@/lib/api/admin";

const ensureTrailingSlash = (url: string) =>
  url.endsWith("/") ? url : `${url}/`;

export function useListData<T>(url: string, params?: ListParams | null) {
  return useSWR<ApiListResponse<T>>(params ? [url, params] : null);
}

export function useDetailData<T>(url: string | null) {
  return useSWR<ApiDetailResponse<T>>(url ? ensureTrailingSlash(url) : null);
}
