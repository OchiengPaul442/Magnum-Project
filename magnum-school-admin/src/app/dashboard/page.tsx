import React from 'react';
import MainLayout from '@components/layouts/MainLayout';
import Dashboard from './Dashboard';

const page = () => {
  return (
    <MainLayout>
      <Dashboard />
    </MainLayout>
  );
};

export default page;
