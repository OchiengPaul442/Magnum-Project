import { createService } from '@/lib/api/serviceFactory';
import { DASHBOARD_URLS, DASHBOARD_CONFIG } from './urls';

// Create dashboard service instance
const dashboardService = createService({
  secure: DASHBOARD_CONFIG.SECURE,
});

/**
 * Get analytics data
 */
export const getAnalytics = async () => {
  const response = await dashboardService.get(DASHBOARD_URLS.GET_ANALYTICS);

  return (response.data as any)?.data || response.data; // Return the nested data object for backward compatibility
};
