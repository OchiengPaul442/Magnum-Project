import axios, { AxiosHeaders, type AxiosRequestConfig } from "axios";
import { getSession, signOut } from "next-auth/react";

import { captureError } from "@/lib/logging";

const SKIP_AUTH_HEADER = "x-skip-auth";
const UNAUTHORIZED_REDIRECT_KEY = "magnum_unauthorized_redirect";
const FORBIDDEN_ROUTE_KEY = "magnum_forbidden_route";
const FORBIDDEN_ROUTE_AT_KEY = "magnum_forbidden_route_at";

type RetriableRequestConfig = AxiosRequestConfig & {
  __magnumRetryAfterRefresh?: boolean;
};

const isBrowser = () => typeof window !== "undefined";

const markForbiddenRoute = () => {
  if (!isBrowser()) return;

  window.sessionStorage.setItem(FORBIDDEN_ROUTE_KEY, window.location.pathname);
  window.sessionStorage.setItem(FORBIDDEN_ROUTE_AT_KEY, String(Date.now()));
};

const handleUnauthorized = () => {
  if (!isBrowser()) return;

  void signOut({ redirect: false });

  if (window.sessionStorage.getItem(UNAUTHORIZED_REDIRECT_KEY) === "1") {
    return;
  }

  window.sessionStorage.setItem(UNAUTHORIZED_REDIRECT_KEY, "1");
  window.setTimeout(() => {
    window.sessionStorage.removeItem(UNAUTHORIZED_REDIRECT_KEY);
  }, 1500);

  const currentPath = `${window.location.pathname}${window.location.search}`;
  if (!window.location.pathname.startsWith("/login")) {
    window.location.replace(`/login?next=${encodeURIComponent(currentPath)}`);
  }
};

export const apiClient = axios.create({
  baseURL: "/api/proxy",
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const headers = AxiosHeaders.from(error?.config?.headers);
    const skipAuth = headers.get(SKIP_AUTH_HEADER) === "true";
    const originalRequest = error?.config as RetriableRequestConfig | undefined;

    if (
      status === 403 &&
      !skipAuth &&
      originalRequest &&
      !originalRequest.__magnumRetryAfterRefresh
    ) {
      const session = await getSession();

      if (!session || session.error === "RefreshAccessTokenError") {
        markForbiddenRoute();
        handleUnauthorized();
        return Promise.reject(error);
      }

      originalRequest.__magnumRetryAfterRefresh = true;
      try {
        return await apiClient.request(originalRequest);
      } catch (retryError) {
        const retryStatus = (
          retryError as { response?: { status?: number } } | undefined
        )?.response?.status;
        if (retryStatus === 403) {
          markForbiddenRoute();
        }
        throw retryError;
      }
    }

    if (status === 401) {
      if (!skipAuth) {
        handleUnauthorized();
      }
      return Promise.reject(error);
    }

    captureError(error, { source: "api" });
    return Promise.reject(error);
  },
);

export const apiFetcher = (key: string | [string, Record<string, unknown>]) => {
  if (Array.isArray(key)) {
    const [url, params] = key;
    return apiClient.get(url, { params }).then((response) => response.data);
  }
  return apiClient.get(key).then((response) => response.data);
};

export const noAuthConfig = {
  headers: {
    [SKIP_AUTH_HEADER]: "true",
  },
};
