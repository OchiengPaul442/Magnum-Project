import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import {
  getStudentData,
  activateStudent,
  deactivateStudent,
  registerNewStudent,
} from '@/app/server/students/api';
import { StudentDataItem } from '@/types/student';
import { swrOptions } from '../swrConfigs';

export const useStudentData = () => {
  const { data, error, isLoading, mutate } = useSWR<StudentDataItem[]>(
    'studentData',
    getStudentData,
    swrOptions,
  );

  return {
    students: data || [],
    isLoading,
    isError: !!error,
    refetch: mutate,
  };
};

// register a new student
export const useRegisterNewStudent = () => {
  const { trigger, data, error, isMutating } = useSWRMutation(
    '/registerstudent',
    (_: string, { arg }: { arg: any }) => registerNewStudent(arg),
  );

  return {
    registerNewStudent: trigger,
    data,
    error,
    isRegistering: isMutating,
  };
};

// activate a student
export const useActivateStudent = () => {
  const { trigger, data, error, isMutating } = useSWRMutation(
    '/activatestudent',
    (_: string, { arg }: { arg: { student_id: string } }) =>
      activateStudent(arg),
  );

  return {
    // Call trigger with an object { student_id: string } to activate a student.
    activateStudent: trigger,
    data,
    error,
    isActivating: isMutating,
  };
};

// Hook to deactivate a student
export const useDeactivateStudent = () => {
  const { trigger, data, error, isMutating } = useSWRMutation(
    '/deactivatestudent',
    (_: string, { arg }: { arg: { student_id: string } }) =>
      deactivateStudent(arg),
  );

  return {
    // Call trigger with an object { student_id: string } to deactivate a student.
    deactivateStudent: trigger,
    data,
    error,
    isDeactivating: isMutating,
  };
};
