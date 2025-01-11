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
  const { data, isLoading, isError } = useDashboardData();

  if (isLoading) return <DashboardSkeleton />;
  if (isError)
    return (
      <div className="text-red-500 text-center">
        Error loading dashboard data
      </div>
    );

  return (
    <div className="flex flex-col w-full h-full gap-6">
      <CardAnalytics data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartAnalytics data={data?.graph_data} />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity activities={data?.recent_activity} />
        </div>
      </div>

      <RecentTransactions transactions={data?.recent_transactions} />
    </div>
  );
}
