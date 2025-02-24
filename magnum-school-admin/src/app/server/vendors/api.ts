import { APIVendor, GetVendorsResponse, VendorDataItem } from '@/types/vendors';
import { secureApiClient } from '@/utils/apiClient';

const transformVendor = (vendor: APIVendor): VendorDataItem => {
  const personnel = vendor.Vendor_Personnel[0];
  return {
    id: vendor.id.toString(),
    name: vendor.vendor_name,
    email: personnel ? personnel.user.email : '',
    canteenName: vendor.vendor_name, // or map to a different field if needed
    status: personnel && personnel.user.is_active ? 'Activated' : 'Deactivated',
    raw: vendor,
  };
};
export const getVendors = async (): Promise<VendorDataItem[]> => {
  const response = await secureApiClient.get<GetVendorsResponse>(
    '/getvendorsunderschool/',
  );
  // Transform the API data into our internal shape
  const vendors = response.data.Vendors.map(transformVendor);
  return vendors;
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
