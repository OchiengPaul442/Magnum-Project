import useSWR from "swr";

import type { ApiDetailResponse, ApiListResponse } from "@/lib/api/types";
import type { ListParams } from "@/lib/api/admin";

export function useListData<T>(url: string, params: ListParams) {
  return useSWR<ApiListResponse<T>>([url, params]);
}

export function useDetailData<T>(url: string | null) {
  return useSWR<ApiDetailResponse<T>>(url);
}
