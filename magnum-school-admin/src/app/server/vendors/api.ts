import { VendorsData } from '@/types/vendors';
import { secureApiClient } from '@/utils/apiClient';

export const getVendors = async () => {
  const response = await secureApiClient.get<VendorsData>(
    '/getvendorsunderschool/',
  );
  return response.data;
};
