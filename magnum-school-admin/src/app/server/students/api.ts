import { getApiClient } from '@/utils/apiClient';

/**
 * Fetches student data using the API client with authorization.
 * @returns Dashboard data or undefined if an error occurs.
 */
export const getStudentData = async () => {
  try {
    const apiClient = await getApiClient(true);

    const response = await apiClient.get('/getstudentsunderschool/');

    // Check for success response
    if (response.status !== 200) {
      throw new Error('Failed to fetch student data');
    }

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.error('Unauthorized request: Please check your credentials.');
    } else {
      console.error('Error fetching student data:', error);
    }
    throw error;
  }
};
