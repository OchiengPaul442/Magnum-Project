import { createService } from '@/lib/api/serviceFactory';
import { STUDENT_URLS, STUDENT_CONFIG } from './urls';
import type {
  RegisterStudentPayload,
  RegisterStudentResponse,
  StudentDataItem,
  RawStudent,
  StudentListResponse,
} from '@/types/student';

type StudentListApiResponse = StudentListResponse & {
  data?: {
    students?: RawStudent[];
  };
};

const studentService = createService({
  secure: STUDENT_CONFIG.SECURE,
});

export const getStudentData = async (): Promise<StudentDataItem[]> => {
  const response = await studentService.get<StudentListApiResponse>(
    STUDENT_URLS.GET_STUDENTS,
  );

  const students = response.data.students || response.data.data?.students || [];

  return students.map((student) => {
    const isActive = student.status === 'active';
    const studentId =
      student.id !== undefined && student.id !== null
        ? String(student.id)
        : student.ssid;
    return {
      id: studentId,
      name: `${student.student_first_name} ${student.student_last_name}`.trim(),
      cardNumber: student.card_number,
      status: isActive ? 'Activated' : 'Deactivated',
      balance: student.student_account_balance,
      raw: student,
    };
  });
};

export const registerNewStudent = async (
  body: RegisterStudentPayload,
): Promise<RegisterStudentResponse> => {
  const response = await studentService.post<RegisterStudentResponse>(
    STUDENT_URLS.REGISTER_STUDENT,
    body,
  );

  return response.data;
};

export const activateStudent = async (body: { student_id: string }) => {
  const response = await studentService.patch(
    STUDENT_URLS.ACTIVATE_STUDENT,
    body,
  );

  return response.data;
};

export const deactivateStudent = async (body: { student_id: string }) => {
  const response = await studentService.patch(
    STUDENT_URLS.DEACTIVATE_STUDENT,
    body,
  );

  return response.data;
};

export const getStudentDetails = async (body: { student_id: string }) => {
  const response = await studentService.post(
    STUDENT_URLS.GET_STUDENT_DETAILS,
    body,
  );

  return response.data;
};
