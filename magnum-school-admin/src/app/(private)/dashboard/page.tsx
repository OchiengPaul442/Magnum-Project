import type { Metadata } from 'next';
import { Suspense } from 'react';
import { DashboardPage } from '@/features/dashboard';
import { DashboardSkeleton } from '@/features/dashboard';

export const metadata: Metadata = {
  title: 'Dashboard',
  description:
    'Overview of your school dashboard and analytics in Magnum School Admin.',
};

const page = () => {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardPage />
    </Suspense>
  );
};

export default page;
