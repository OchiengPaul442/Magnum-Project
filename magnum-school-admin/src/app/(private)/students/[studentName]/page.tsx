'use client';

import React, { useEffect, useState } from 'react';
import StudentDetailsForm from '@components/forms/StudentDetailsForm';
import { notFound, useRouter } from 'next/navigation';
import { slugifyStudentName } from '@/@core/utils';
import { getStudentDetailsPost } from '@/app/server/students/service';
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
  const { selectedStudent } = useStudentsContext();
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  console.log('StudentDetailsPage component rendered', selectedStudent);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        // Always use selectedStudent.raw.id (number) for the API call
        const studentId = selectedStudent?.raw?.id;
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
    fetchDetails();
    // Only re-run if the selectedStudent changes
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
    />
  );
}
