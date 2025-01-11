import { secureApiClient } from '@/utils/apiClient';

export const getDashboardData = async () => {
  try {
    const response = await secureApiClient.get('/getschooldashboarddata/');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};
