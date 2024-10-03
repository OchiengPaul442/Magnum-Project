import React from 'react';
import MainLayout from '@components/layouts/MainLayout';
import TransactionList from './TransactionList';

const page = () => {
  return (
    <MainLayout>
      <TransactionList />
    </MainLayout>
  );
};

export default page;
