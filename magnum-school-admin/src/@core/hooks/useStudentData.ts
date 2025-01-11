import useSWR from 'swr';
import { getStudentData } from '@/app/server/students/api';
import { StudentData } from '@/types/student';

export const useStudentData = () => {
  const { data, error, isLoading, mutate } = useSWR<StudentData>(
    'studentData',
    getStudentData,
  );

  return {
    students: data?.students || [],
    isLoading,
    isError: error,
    mutate,
  };
};
