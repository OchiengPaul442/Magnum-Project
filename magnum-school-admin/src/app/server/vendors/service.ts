import { createService } from '@/@core/utils/serviceFactory';
import { VENDOR_URLS, VENDOR_CONFIG } from './urls';
import type {
  VendorDataItem,
  GetVendorsResponse,
  APIVendor,
} from '@/@core/types/vendors';

// Create vendor service instance
const vendorService = createService({
  secure: VENDOR_CONFIG.SECURE,
});

/**
 * Get vendor data from server
 */
export const getVendorData = async (): Promise<VendorDataItem[]> => {
  const response = await vendorService.get<GetVendorsResponse>(
    VENDOR_URLS.GET_VENDORS,
  );

  return response.data.Vendors.map((vendor: APIVendor) => {
    const personnel = vendor.Vendor_Personnel[0]; // Get first personnel
    const isActive = personnel?.user?.is_active || false;

    return {
      id: vendor.id.toString(),
      name: `${personnel?.user?.first_name || ''} ${personnel?.user?.last_name || ''}`.trim(),
      canteenName: vendor.vendor_name,
      status: isActive ? 'Activated' : 'Deactivated',
      email: personnel?.user?.email || '',
      raw: vendor,
    };
  });
};

/**
 * Register a new vendor
 */
export const registerNewVendor = async (body: any): Promise<any> => {
  const response = await vendorService.post(VENDOR_URLS.REGISTER_VENDOR, body);

  return response.data;
};

/**
 * Activate vendor - takes a body with vendor_id
 */
export const activateVendor = async (body: { vendor_id: string }) => {
  const response = await vendorService.patch(VENDOR_URLS.ACTIVATE_VENDOR, body);

  return response.data;
};

/**
 * Deactivate vendor - takes a body with vendor_id
 */
export const deactivateVendor = async (body: { vendor_id: string }) => {
  const response = await vendorService.patch(
    VENDOR_URLS.DEACTIVATE_VENDOR,
    body,
  );

  return response.data;
};

/**
 * Update vendor information
 */
export const updateVendor = async (body: any) => {
  const response = await vendorService.put(VENDOR_URLS.UPDATE_VENDOR, body);

  return response.data;
};

/**
 * Delete vendor
 */
export const deleteVendor = async (body: { vendor_id: string }) => {
  const response = await vendorService.delete(VENDOR_URLS.DELETE_VENDOR, {
    data: body,
  });

  return response.data;
};

/**
 * Get vendor details by ID
 */
export const getVendorDetails = async (vendorId: string) => {
  const response = await vendorService.get(
    `${VENDOR_URLS.GET_VENDOR_DETAILS}?vendor_id=${vendorId}`,
  );

  return response.data;
};

/**
 * Get vendor transactions
 */
export const getVendorTransactions = async (vendorId: string) => {
  const response = await vendorService.get(
    `${VENDOR_URLS.GET_VENDOR_TRANSACTIONS}?vendor_id=${vendorId}`,
  );

  return response.data;
};
