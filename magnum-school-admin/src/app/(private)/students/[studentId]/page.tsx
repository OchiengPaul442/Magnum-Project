'use client';

import React, { useState } from 'react';
import StudentDetailsForm from '@components/forms/StudentDetailsForm';
import { useRouter } from 'next/navigation';
import {
  getStudentDetails,
  activateStudent,
  deactivateStudent,
} from '@/services/students/service';
import ErrorState from '@/components/shared/ErrorState';
import LoadingSkeleton from '@/components/shared/loaders/loading-skeleton';
import NoData from '@/components/shared/NoData';
import { showErrorToast } from '@/lib/toast';
import { useResourceData } from '@/lib/api/useResourceData';

export default function StudentDetailsPage({
  params,
}: {
  params: { studentId: string };
}) {
  const router = useRouter();
  const [toggleLoading, setToggleLoading] = useState(false);
  const studentDetailsKey = params.studentId
    ? `student:details:${params.studentId}`
    : null;

  const fetchStudentDetails = async () => {
    if (!params.studentId) {
      throw new Error('Student ID is required to fetch details.');
    }

    const response: any = await getStudentDetails({
      student_id: String(params.studentId),
    });
    const payload = response?.data ?? response;
    const student = payload?.student || payload?.data?.student;

    if (!student) {
      return null;
    }

    return {
      student,
      card: payload?.card || payload?.data?.card || {},
      transactions: payload?.transactions || payload?.data?.transactions || [],
      parents: payload?.parents || payload?.data?.parents || [],
    };
  };

  const {
    data: studentData,
    error,
    isLoading,
    mutate,
  } = useResourceData(studentDetailsKey, fetchStudentDetails);

  if (isLoading) return <LoadingSkeleton />;
  if (error) {
    return (
      <ErrorState
        title="Error Loading Student Details"
        description="Student ID is required to fetch details. Please navigate from the students list."
        actionLabel="Back to Students List"
        onActionClick={() => router.push('/students')}
      />
    );
  }
  if (!studentData) {
    return (
      <NoData
        title="No Student Data"
        description="No details found for this student."
        actionLabel="Back to Students List"
        onActionClick={() => router.push('/students')}
      />
    );
  }

  // No need to check slugified name, since we use ID in the URL now

  // Handle activate/deactivate
  const handleToggleStatus = async () => {
    const studentId = studentData?.student?.id || params.studentId;
    if (!studentId) return;
    setToggleLoading(true);
    try {
      if (studentData.student.status === 'active') {
        await deactivateStudent({ student_id: String(studentId) });
      } else {
        await activateStudent({ student_id: String(studentId) });
      }
      await mutate();
    } catch (err) {
      // Optionally: show error toast
      // eslint-disable-next-line no-console
      console.error('Failed to toggle student status', err);
      showErrorToast(err, 'Failed to update student status. Please retry.');
    } finally {
      setToggleLoading(false);
    }
  };

  const handleClose = () => {
    router.push('/students');
  };

  return (
    <StudentDetailsForm
      student={studentData.student}
      card={studentData.card}
      transactions={studentData.transactions}
      parents={studentData.parents}
      studentId={studentData.student.id || params.studentId}
      onResetSuccess={() => mutate()}
      onClose={handleClose}
      onToggleStatus={handleToggleStatus}
      toggleLoading={toggleLoading}
    />
  );
}
