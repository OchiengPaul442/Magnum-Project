import axios, { AxiosHeaders } from "axios";
import { signOut } from "next-auth/react";

import { captureError } from "@/lib/logging";

const SKIP_AUTH_HEADER = "x-skip-auth";
const UNAUTHORIZED_REDIRECT_KEY = "magnum_unauthorized_redirect";

const isBrowser = () => typeof window !== "undefined";

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
  baseURL: "",
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const headers = AxiosHeaders.from(error?.config?.headers);
    const skipAuth = headers.get(SKIP_AUTH_HEADER) === "true";

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
