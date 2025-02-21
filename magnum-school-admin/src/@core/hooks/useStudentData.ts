import useSWR from 'swr';
import { getStudentData } from '@/app/server/students/api';
import { StudentData } from '@/types/student';
import { swrOptions } from '../swrConfigs';

export const useStudentData = () => {
  const { data, error, isLoading, mutate } = useSWR<StudentData>(
    'studentData',
    getStudentData,
    swrOptions,
  );

  return {
    students: data?.students || [],
    isLoading,
    isError: error,
    mutate,
  };
};
