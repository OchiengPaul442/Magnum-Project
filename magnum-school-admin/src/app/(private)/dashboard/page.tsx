import React from 'react';
import MainLayout from '@components/layouts/MainLayout';
import Dashboard from '@views/pages/dashboard/Dashboard';

const page = () => {
  return (
    <MainLayout>
      <Dashboard />
    </MainLayout>
  );
};

export default page;
