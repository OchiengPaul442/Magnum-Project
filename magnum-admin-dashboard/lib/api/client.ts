import axios, { AxiosHeaders } from "axios";

import { getAuthToken } from "@/lib/auth/storage";
import { captureError } from "@/lib/logging";

const SKIP_AUTH_HEADER = "x-skip-auth";

export const apiClient = axios.create({
  baseURL: "",
});

apiClient.interceptors.request.use((config) => {
  const headers = AxiosHeaders.from(config.headers);
  const skipAuth = headers.get(SKIP_AUTH_HEADER) === "true";
  if (!skipAuth) {
    const token = getAuthToken();
    if (token) {
      headers.set("Authorization", `Token ${token}`);
    }
  }
  headers.delete(SKIP_AUTH_HEADER);
  config.headers = headers;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
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
