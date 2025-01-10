import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Create a function that returns an Axios instance configured based on `useAuth`.
 * @param useAuth - Determines whether to include the Authorization header.
 * @returns Configured Axios instance.
 */
const apiClient = (useAuth: boolean): AxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add the Authorization header if `useAuth` is true
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      if (useAuth) {
        const session = await getSession();
        if (session?.user.accessToken) {
          config.headers.Authorization = `Token ${session.user.accessToken}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  return instance;
};

export default apiClient;
