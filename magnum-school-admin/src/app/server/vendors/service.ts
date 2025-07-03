/**
 * Get vendor entity details by school (POST version)
 * @param body { vendor_entity_id: number }
 * @returns Vendor entity details and related info
 */
/**
 * Get vendor entity details by school (POST version)
 * @param body { vendor_entity_id: number }
 * @returns Vendor entity details and related info
 */
export const getVendorEntityDetailsBySchool = async (body: {
  vendor_entity_id: number;
}) => {
  const response = await vendorService.post(
    VENDOR_URLS.GET_VENDOR_ENTITY_DETAILS,
    body,
  );
  return response.data;
};

import { createService } from '@/@core/utils/serviceFactory';
import { VENDOR_URLS, VENDOR_CONFIG } from './urls';
import type { VendorDataItem } from '@/@core/types/vendors';

// Create vendor service instance
const vendorService = createService({
  secure: VENDOR_CONFIG.SECURE,
});

/**
 * Get vendor data from server
 */
export const getVendorData = async (): Promise<VendorDataItem[]> => {
  const response = await vendorService.get<any>(VENDOR_URLS.GET_VENDORS);

  // Defensive: support both 'vendors' and 'Vendors' keys
  const data: any = response.data as any;
  const vendorList = data.vendors || data.Vendors || [];

  // Map the new backend structure to VendorDataItem
  return vendorList.map((vendor: any) => ({
    id: vendor.vendor_entity_id?.toString() || '',
    name: vendor.vendor_entity_name || '',
    owner: vendor.vendor_owner || '',
    canteenName: vendor.vendor_entity_name || '',
    status:
      vendor.vendor_entity_status === 'active' ? 'Activated' : 'Deactivated',
    operatorCount: vendor.vendor_entity_operator_count || 0,
    raw: vendor,
  }));
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
export const getVendorDetails = async (body: { vendor_entity_id: number }) => {
  // Use GET with body (non-standard, but supported by your backend)
  const response = await vendorService.getWithBody(
    VENDOR_URLS.GET_VENDOR_ENTITY_DETAILS,
    undefined,
    { data: body }, // Pass body as 'data' in AxiosRequestConfig
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
