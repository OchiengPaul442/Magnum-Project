import React from 'react';
import MainLayout from '@components/layouts/MainLayout';
import StudentList from '@views/pages/students/StudentList';

const page = () => {
  return (
    <MainLayout>
      <StudentList />
    </MainLayout>
  );
};

export default page;
