import { secureApiClient } from '@/utils/apiClient';

import { StudentData } from '@/types/student';

export const getStudentData = async (): Promise<StudentData> => {
  try {
    const response = await secureApiClient.get<StudentData>(
      '/getstudentsunderschool/',
    );
    return response.data;
  } catch (error: any) {
    console.error('Error fetching student data:', error);
    throw error;
  }
};
