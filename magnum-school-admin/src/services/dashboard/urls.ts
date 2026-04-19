// Dashboard service URLs
export const DASHBOARD_URLS = {
  GET_ANALYTICS: '/getschooldashboarddata',
} as const;

// Dashboard service configuration
export const DASHBOARD_CONFIG = {
  SECURE: true,
  BASE_RESOURCE: 'dashboard',
  TIMEOUT: 10000,
} as const;
