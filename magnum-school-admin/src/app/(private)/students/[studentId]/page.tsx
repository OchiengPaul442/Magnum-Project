'use client';

import React, { useCallback, useEffect, useState } from 'react';
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

export default function StudentDetailsPage({
  params,
}: {
  params: { studentId: string };
}) {
  const router = useRouter();
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);

  // Refetch student details
  const fetchDetails = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const studentId = params.studentId;
      if (!studentId) {
        setIsError(true);
        setIsLoading(false);
        return;
      }
      const response: any = await getStudentDetails({
        student_id: String(studentId),
      });
      const payload = response?.data ?? response;
      const student = payload?.student || payload?.data?.student;
      if (!student) {
        setStudentData(null);
      } else {
        setStudentData({
          student,
          card: payload?.card || payload?.data?.card || {},
          transactions:
            payload?.transactions || payload?.data?.transactions || [],
          parents: payload?.parents || payload?.data?.parents || [],
        });
      }
    } catch (error) {
      showErrorToast(
        error,
        'Unable to load student details. Please try again.',
      );
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [params.studentId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  if (isLoading) return <LoadingSkeleton />;
  if (isError) {
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
      // Refetch details after status change
      await fetchDetails();
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
      onClose={handleClose}
      onToggleStatus={handleToggleStatus}
      toggleLoading={toggleLoading}
    />
  );
}
