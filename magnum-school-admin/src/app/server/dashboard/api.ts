import { getApiClient } from '@/utils/apiClient';

/**
 * Fetches school dashboard data using the API client with authorization.
 * @returns Dashboard data or undefined if an error occurs.
 */
export const getDashboardData = async () => {
  try {
    const client = await getApiClient(true);

    const response = await client.get('/getschooldashboarddata/');

    return response.data;
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
  }
};
