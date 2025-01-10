'use server';

import apiClient from '@/utils/apiClient';

/**
 * Get Dashboard Data
 */
export const getDashboardData = async () => {
  const client = apiClient(true);
  try {
    const response = await client.get('/getschooldashboarddata/');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
