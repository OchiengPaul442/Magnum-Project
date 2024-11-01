import React from 'react';
import MainLayout from '@components/layouts/MainLayout';
import StudentList from './StudentList';

const page = () => {
  return (
    <MainLayout>
      <StudentList />
    </MainLayout>
  );
};

export default page;
