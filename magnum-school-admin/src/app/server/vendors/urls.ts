// Vendor service URLs
export const VENDOR_URLS = {
  GET_VENDORS: '/getvendorsunderschool/',
  REGISTER_VENDOR: '/registervendor/',
  ACTIVATE_VENDOR: '/activatevendor/',
  DEACTIVATE_VENDOR: '/deactivatevendor/',
  UPDATE_VENDOR: '/updatevendor/',
  DELETE_VENDOR: '/deletevendor/',
  GET_VENDOR_DETAILS: '/getvendordetails/',
  GET_VENDOR_TRANSACTIONS: '/getvendortransactions/',
} as const;

// Vendor service configuration
export const VENDOR_CONFIG = {
  SECURE: true,
  BASE_RESOURCE: 'vendors',
  TIMEOUT: 15000,
} as const;
