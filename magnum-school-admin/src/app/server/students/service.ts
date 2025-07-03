/**
 * Get student details (POST version)
 * @param body { student_id: string }
 * @returns Student details and related info
 */
/**
 * Get student details (POST version)
 * @param body { student_id: string }
 * @returns Student details and related info
 */
export const getStudentDetailsPost = async (body: { student_id: string }) => {
  const response = await studentService.post(
    STUDENT_URLS.GET_STUDENT_DETAILS_POST,
    body,
  );
  return response.data;
};
import { createService } from '@/@core/utils/serviceFactory';
import { STUDENT_URLS, STUDENT_CONFIG } from './urls';
import type {
  RegisterStudentRequest,
  RegisterStudentResponse,
  StudentDataItem,
  StudentListResponse,
} from '@/@core/types/student';

// Create student service instance
const studentService = createService({
  secure: STUDENT_CONFIG.SECURE,
});

/**
 * Get student data from server
 */
export const getStudentData = async (): Promise<StudentDataItem[]> => {
  const response = await studentService.get<StudentListResponse>(
    STUDENT_URLS.GET_STUDENTS,
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
};

/**
 * Register a new student
 */
export const registerNewStudent = async (
  body: RegisterStudentRequest,
): Promise<RegisterStudentResponse> => {
  const response = await studentService.post<RegisterStudentResponse>(
    STUDENT_URLS.REGISTER_STUDENT,
    body,
  );

  return response.data;
};

/**
 * Activate student - takes a body with student_id
 */
export const activateStudent = async (body: { student_id: string }) => {
  const response = await studentService.patch(
    STUDENT_URLS.ACTIVATE_STUDENT,
    body,
  );

  return response.data;
};

/**
 * Deactivate student - takes a body with student_id
 */
export const deactivateStudent = async (body: { student_id: string }) => {
  const response = await studentService.patch(
    STUDENT_URLS.DEACTIVATE_STUDENT,
    body,
  );

  return response.data;
};

/**
 * Update student information
 */
export const updateStudent = async (body: any) => {
  const response = await studentService.put(STUDENT_URLS.UPDATE_STUDENT, body);

  return response.data;
};

/**
 * Delete student
 */
export const deleteStudent = async (body: { student_id: string }) => {
  const response = await studentService.delete(STUDENT_URLS.DELETE_STUDENT, {
    data: body,
  });

  return response.data;
};

/**
 * Get student details by ID
 */
export const getStudentDetails = async (studentId: string) => {
  const response = await studentService.get(
    `${STUDENT_URLS.GET_STUDENT_DETAILS}?student_id=${studentId}`,
  );

  return response.data;
};

/**
 * Get student transactions
 */
export const getStudentTransactions = async (studentId: string) => {
  const response = await studentService.get(
    `${STUDENT_URLS.GET_STUDENT_TRANSACTIONS}?student_id=${studentId}`,
  );

  return response.data;
};
