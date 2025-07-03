// Types representing the API response
export interface APIVendor {
  id: number;
  vendor_name: string;
  created_at: string;
  updated_at: string;
  Vendor_Personnel: Array<{
    id: number;
    user: {
      id: number;
      username: string;
      first_name: string;
      last_name: string;
      email: string;
      is_active: boolean;
      // other fields...
    };
    contact: string;
    user_category: string;
  }>;
}

export interface GetVendorsResponse {
  message: string;
  Vendors: APIVendor[];
  status: number;
}

// Our internal vendor shape
export interface VendorDataItem {
  id: string;
  name: string;
  owner: string;
  canteenName: string;
  status: 'Activated' | 'Deactivated';
  operatorCount?: number;
  raw: any;
}
