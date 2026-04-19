'use client';

import { useState, useEffect } from 'react';
import {
  CardAnalytics,
  ChartAnalytics,
  RecentActivity,
  RecentTransactions,
  DashboardSkeleton,
} from '@/features/dashboard';
import { getAnalytics } from '@/services/dashboard/service';

// Import custom components for error and no data states
import ErrorState from '@/components/shared/ErrorState';
import NoData from '@/components/shared/NoData';
import { showErrorToast } from '@/lib/toast';

export default function DashboardPage() {
  return <DashboardContent />;
}

function DashboardContent() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const result = await getAnalytics();
      setData(result);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showErrorToast(error, 'Unable to load dashboard data. Please try again.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Loading state
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Error state
  if (isError) {
    return (
      <ErrorState
        title="Error Loading Dashboard"
        description="We encountered an issue while fetching the dashboard data. Please try again."
        actionLabel="Retry"
        onActionClick={fetchData}
      />
    );
  }

  // No data state (adjust the condition as needed)
  const isEmpty =
    !data ||
    ((!data.graph_data || data.graph_data.length === 0) &&
      (!data.recent_activity || data.recent_activity.length === 0) &&
      (!data.recent_transactions || data.recent_transactions.length === 0));

  if (isEmpty) {
    return (
      <NoData
        title="No Dashboard Data"
        description="There is currently no data available to display."
        actionLabel="Refresh"
        onActionClick={fetchData}
      />
    );
  }

  // Render the main dashboard content
  return (
    <div className="flex flex-col w-full h-full gap-6">
      <CardAnalytics data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartAnalytics data={data.graph_data || []} />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity activities={data.recent_activity || []} />
        </div>
      </div>

      <RecentTransactions transactions={data.recent_transactions || []} />
    </div>
  );
}
