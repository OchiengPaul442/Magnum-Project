import useSWR from 'swr';
import { getDashboardData } from '@/app/server/dashboard/api';
import { swrOptions } from '../swrConfigs';

export const useDashboardData = () => {
  const { data, error, isLoading, mutate } = useSWR(
    'dashboardData',
    getDashboardData,
    swrOptions,
  );

  return {
    data,
    isLoading,
    isError: error,
    refetch: mutate,
  };
};
