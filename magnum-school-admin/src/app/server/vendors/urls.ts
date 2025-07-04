export const VENDOR_URLS = {
  GET_VENDORS: '/getvendorentitiesunderschool/',
  REGISTER_VENDOR: '/registervendor/',
  ONBOARD_VENDOR_WITH_OWNER: '/onboardvendorwithowner/',
  ACTIVATE_VENDOR: '/activatevendor/',
  DEACTIVATE_VENDOR: '/deactivatevendor/',
  UPDATE_VENDOR: '/updatevendor/',
  DELETE_VENDOR: '/deletevendor/',
  GET_VENDOR_DETAILS: '/getvendordetails/',
  GET_VENDOR_TRANSACTIONS: '/getvendortransactions/',
  GET_VENDOR_ENTITY_DETAILS: '/getvendorentitydetailsbyschool/',
} as const;

// Vendor service configuration
export const VENDOR_CONFIG = {
  SECURE: true,
  BASE_RESOURCE: 'vendors',
  TIMEOUT: 15000,
} as const;
