'use client';

import React, { useEffect, useState } from 'react';
import StudentDetailsForm from '@components/forms/StudentDetailsForm';
import { notFound, useRouter } from 'next/navigation';
import { slugifyStudentName } from '@/@core/utils';
import {
  getStudentDetailsPost,
  activateStudent,
  deactivateStudent,
  getStudentData,
} from '@/app/server/students/service';
import ErrorState from '@/components/shared/ErrorState';
import LoadingSkeleton from '@/components/shared/loaders/loading-skeleton';
import NoData from '@/components/shared/NoData';
import { useStudentsContext } from '@/contexts/StudentsContext';

export default function StudentDetailsPage({
  params,
}: {
  params: { studentName: string };
}) {
  const router = useRouter();
  const { selectedStudent, setSelectedStudent } = useStudentsContext();
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);

  // Refetch student details
  const fetchDetails = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      // Try to get studentId from context, else from URL
      let studentId = selectedStudent?.raw?.id;
      if (!studentId) {
        // Fallback: fetch all students and match by slugified name
        const allStudents = await getStudentData();
        const match = allStudents.find((stu) => {
          const fullName = `${stu.raw.student_first_name} ${stu.raw.student_last_name}`;
          return slugifyStudentName(fullName) === params.studentName;
        });
        if (match) {
          studentId = match.raw.id;
          setSelectedStudent(match); // Set context for future use
        }
      }
      if (!studentId) {
        setIsError(true);
        setIsLoading(false);
        return;
      }
      const response: any = await getStudentDetailsPost({
        student_id: String(studentId),
      });
      if (!response || !response.data || !response.data.student) {
        setStudentData(null);
      } else {
        setStudentData(response.data);
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    // Only re-run if the selectedStudent changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStudent]);

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

  const fullName = `${studentData.student.first_name} ${studentData.student.last_name}`;
  if (slugifyStudentName(fullName) !== params.studentName) {
    return notFound();
  }

  // Handle activate/deactivate
  const handleToggleStatus = async () => {
    if (!studentData?.student?.id && !selectedStudent?.raw?.id) return;
    const studentId = studentData?.student?.id || selectedStudent?.raw?.id;
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
