import { Suspense } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { getDashboardData } from '@/app/server/dashboard/api';
import {
  CardAnalytics,
  ChartAnalytics,
  RecentActivity,
  RecentTransactions,
  DashboardSkeleton,
} from '@/views/pages/dashboard';

// Wrap the entire content in MainLayout
export default function DashboardPage() {
  return (
    <MainLayout>
      <DashboardWrapper />
    </MainLayout>
  );
}

// Separate component for Suspense boundary
function DashboardWrapper() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

// Async component for data fetching
async function DashboardContent() {
  const { data } = await getDashboardData();

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

      <RecentTransactions transactions={[]} />
    </div>
  );
}
