'use client';

import React from 'react';
import MainLayout from '@components/layouts/MainLayout';
import StudentDetailsForm from '@components/forms/StudentDetailsForm';
import { notFound, useRouter } from 'next/navigation';
import { useStudentsContext } from '@/contexts/StudentsContext';
import { slugifyStudentName } from '@/utils';

export default function StudentDetailsPage({
  params,
}: {
  params: { studentName: string };
}) {
  const router = useRouter();
  const { selectedStudent } = useStudentsContext();

  // Ensure both selectedStudent and its raw data exist.
  if (!selectedStudent || !selectedStudent.raw) {
    return notFound();
  }

  // Compute the full name from the raw student data.
  const fullName = `${selectedStudent.raw.student_first_name} ${selectedStudent.raw.student_last_name}`;
  if (slugifyStudentName(fullName) !== params.studentName) {
    return notFound();
  }

  const handleClose = () => {
    router.push('/students');
  };

  return (
    <MainLayout>
      <StudentDetailsForm
        student={selectedStudent.raw as any}
        onClose={handleClose}
      />
    </MainLayout>
  );
}
