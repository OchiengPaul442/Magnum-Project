import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

const createApiClient = (config?: AxiosRequestConfig): AxiosInstance => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  });
};

const apiClient = createApiClient();

export const secureApiClient = createApiClient();

secureApiClient.interceptors.request.use(async (config) => {
  const session = await getSession();
  const token = session?.user?.accessToken;

  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  }

  return config;
});

export default apiClient;
