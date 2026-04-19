import { createService } from '@/lib/api/serviceFactory';
import { VENDOR_URLS, VENDOR_CONFIG } from './urls';
import type { VendorDataItem } from '@/types/vendors';

const vendorService = createService({
  secure: VENDOR_CONFIG.SECURE,
});

export const getVendorData = async (): Promise<VendorDataItem[]> => {
  const response = await vendorService.get<any>(VENDOR_URLS.GET_VENDORS);

  const data: any = response.data as any;
  const vendorList =
    data.vendor_entities ||
    data.vendorEntities ||
    data.vendors ||
    data.Vendors ||
    [];

  return vendorList.map((vendor: any) => ({
    id: vendor.vendor_entity_id?.toString() || '',
    name: vendor.vendor_entity_name || '',
    owner: vendor.vendor_owner_details?.full_name || vendor.vendor_owner || '',
    canteenName: vendor.vendor_entity_name || '',
    status:
      vendor.vendor_entity_status === 'active' ? 'Activated' : 'Deactivated',
    operatorCount: vendor.vendor_entity_operator_count || 0,
    raw: vendor,
  }));
};

export const getVendorEntityDetailsBySchool = async (param: {
  vendor_entity_id: number;
}) => {
  const response = await vendorService.get(
    `${VENDOR_URLS.GET_VENDOR_ENTITY_DETAILS}?vendor_entity_id=${param.vendor_entity_id}`,
  );

  return response.data;
};

export const updateVendorEntityStatusBySchool = async (body: {
  vendor_entity_id: number;
  new_status: string;
}): Promise<any> => {
  const response = await vendorService.patch(
    VENDOR_URLS.UPDATE_VENDOR_ENTITY_STATUS_BY_SCHOOL,
    body,
  );

  return response.data;
};

export const onboardVendorWithOwner = async (body: {
  vendor_name: string;
  school_id: number;
  owner_email: string;
  owner_first_name: string;
  owner_last_name: string;
  contact: string;
  national_id: string;
}): Promise<any> => {
  const response = await vendorService.post(
    VENDOR_URLS.ONBOARD_VENDOR_WITH_OWNER,
    body,
  );

  return response.data;
};
