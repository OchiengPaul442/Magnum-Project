import { createService } from '@/@core/utils/serviceFactory';
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

/**
 * Get recent transactions
 */
export const getRecentTransactions = async () => {
  const response = await dashboardService.get(
    DASHBOARD_URLS.GET_RECENT_TRANSACTIONS,
  );

  return response.data;
};

/**
 * Get activity feed
 */
export const getActivityFeed = async () => {
  const response = await dashboardService.get(DASHBOARD_URLS.GET_ACTIVITY_FEED);

  return response.data;
};

/**
 * Get statistics
 */
export const getStatistics = async () => {
  const response = await dashboardService.get(DASHBOARD_URLS.GET_STATISTICS);

  return response.data;
};
