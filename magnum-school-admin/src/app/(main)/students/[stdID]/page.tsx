import React from 'react';
import MainLayout from '@components/layouts/MainLayout';
import StudentDetailsForm from '@components/forms/StudentDetailsForm';

const page = ({ params }: { params: { stdID: string } }) => {
  return (
    <MainLayout>
      <StudentDetailsForm stdID={params.stdID} />
    </MainLayout>
  );
};

export default page;
