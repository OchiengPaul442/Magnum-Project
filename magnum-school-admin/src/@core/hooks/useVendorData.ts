import useSWR from 'swr';
import { getVendors } from '@/app/server/vendors/api';
import { VendorsData } from '@/types/vendors';
import { swrOptions } from '../swrConfigs';

export const useVendorData = () => {
  const { data, error, isLoading, mutate } = useSWR<VendorsData>(
    'vendorData',
    getVendors,
    swrOptions,
  );

  return {
    vendors: data?.vendors || [],
    isLoading,
    isError: error,
    mutate,
  };
};
