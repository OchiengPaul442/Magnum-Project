import { Suspense } from 'react';
import { DashboardPage } from '@/views/pages/dashboard';
import { DashboardSkeleton } from '@/views/pages/dashboard';

const page = () => {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardPage />
    </Suspense>
  );
};

export default page;
