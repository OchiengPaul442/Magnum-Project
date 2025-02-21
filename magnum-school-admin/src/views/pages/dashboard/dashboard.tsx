'use client';

import { Suspense } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import {
  CardAnalytics,
  ChartAnalytics,
  RecentActivity,
  RecentTransactions,
  DashboardSkeleton,
} from '@/views/pages/dashboard';
import { useDashboardData } from '@core/hooks/useDashboardData';

// Import custom components for error and no data states
import ErrorState from '@/components/shared/ErrorState';
import NoData from '@/components/shared/NoData';

export default function DashboardPage() {
  return (
    <MainLayout>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </MainLayout>
  );
}

function DashboardContent() {
  const { data, isLoading, isError, refetch } = useDashboardData();

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
        onActionClick={() => refetch()}
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
        onActionClick={() => refetch()}
      />
    );
  }

  // Render the main dashboard content
  return (
    <div className="flex flex-col w-full h-full gap-6">
      <CardAnalytics data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartAnalytics data={data.graph_data} />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity activities={data.recent_activity} />
        </div>
      </div>

      <RecentTransactions transactions={data.recent_transactions} />
    </div>
  );
}
