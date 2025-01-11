import useSWR from 'swr';
import { getDashboardData } from '@/app/server/dashboard/api';

export const useDashboardData = () => {
  const { data, error, isLoading } = useSWR('dashboardData', getDashboardData);

  return {
    data,
    isLoading,
    isError: error,
  };
};
