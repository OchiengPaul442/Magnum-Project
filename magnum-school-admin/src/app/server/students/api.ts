import {
  RegisterStudentRequest,
  RegisterStudentResponse,
  StudentDataItem,
  StudentListResponse,
} from '@/@core/types/student';
import { secureApiClient } from '@/@core/utils/apiClient';

// Get student data from server
export const getStudentData = async (): Promise<StudentDataItem[]> => {
  try {
    const response = await secureApiClient.get<StudentListResponse>(
      '/getstudentsunderschool/',
    );

    return response.data.students.map((student) => {
      const isActive = student.status === 'active';
      return {
        id: student.ssid,
        name: `${student.student_first_name} ${student.student_last_name}`.trim(),
        cardNumber: student.card_number,
        status: isActive ? 'Activated' : 'Deactivated',
        balance: student.student_account_balance,
        raw: student,
      };
    });
  } catch (error: any) {
    console.error('Error fetching student data:', error);
    throw error;
  }
};

export const registerNewStudent = async (
  body: RegisterStudentRequest,
): Promise<RegisterStudentResponse> => {
  try {
    const response = await secureApiClient.post('/registerstudent/', body);
    return response.data;
  } catch (error: any) {
    console.error('Error registering new student:', error);
    throw error;
  }
};

// Activate student use patch method takes a body with student_id
export const activateStudent = async (body: { student_id: string }) => {
  try {
    const response = await secureApiClient.patch('/activatestudent/', body);
    return response.data;
  } catch (error: any) {
    console.error('Error activating student:', error);
    throw error;
  }
};

// Deactivate student use patch method takes a body with student_id
export const deactivateStudent = async (body: { student_id: string }) => {
  try {
    const response = await secureApiClient.patch('/deactivatestudent/', body);
    return response.data;
  } catch (error: any) {
    console.error('Error deactivating student:', error);
    throw error;
  }
};
