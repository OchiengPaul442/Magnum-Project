import { VendorsData } from '@/types/vendors';
import { secureApiClient } from '@/utils/apiClient';

export const getVendors = async () => {
  const response = await secureApiClient.get<VendorsData>(
    '/getvendorsunderschool/',
  );
  return response.data;
};

// Activate vendor using patch method with vendor_id
export const activateVendor = async (body: { vendor_id: string }) => {
  try {
    const response = await secureApiClient.patch('/activatevendor/', body);
    return response.data;
  } catch (error: any) {
    console.error('Error activating vendor:', error);
    throw error;
  }
};

// Deactivate vendor using patch method with vendor_id
export const deactivateVendor = async (body: { vendor_id: string }) => {
  try {
    const response = await secureApiClient.patch('/deactivatevendor/', body);
    return response.data;
  } catch (error: any) {
    console.error('Error deactivating vendor:', error);
    throw error;
  }
};
