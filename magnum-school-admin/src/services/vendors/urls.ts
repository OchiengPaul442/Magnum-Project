export const VENDOR_URLS = {
  GET_VENDORS: '/getvendorentitiesunderschool',
  ONBOARD_VENDOR_WITH_OWNER: '/onboardvendorwithowner/',
  GET_VENDOR_ENTITY_DETAILS: '/getvendorentitydetailsbyschool',
  UPDATE_VENDOR_ENTITY_STATUS_BY_SCHOOL: '/updatevendorentitystatusbyschool/',
} as const;

// Vendor service configuration
export const VENDOR_CONFIG = {
  SECURE: true,
  BASE_RESOURCE: 'vendors',
  TIMEOUT: 15000,
} as const;
