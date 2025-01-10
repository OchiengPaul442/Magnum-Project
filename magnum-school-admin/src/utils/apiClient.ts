import axios, { AxiosInstance } from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Asynchronously creates and configures an Axios instance,
 * including the Authorization header if `useAuth` is true.
 *
 * @param useAuth - If true, will attach the user token from the session.
 * @returns A promise that resolves to a configured Axios instance.
 */
export async function getApiClient(useAuth: boolean): Promise<AxiosInstance> {
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (useAuth) {
    try {
      // Retrieve the session on the server side
      const session = await getServerSession(authOptions);
      const token = session?.user?.accessToken;

      if (token) {
        instance.defaults.headers.common['Authorization'] = `Token ${token}`;
      }
    } catch (error) {
      console.error('Error retrieving session:', error);
    }
  }

  return instance;
}
