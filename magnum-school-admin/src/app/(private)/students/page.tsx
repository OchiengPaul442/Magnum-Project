import MainLayout from '@/components/layouts/MainLayout';
import StudentList from '@/views/pages/students/StudentList';
import { getStudentData } from '@/app/server/students/api';
import { Suspense } from 'react';
import LoadingSkeleton from '@/views/pages/students/loading-skeleton';

export default function StudentsPage() {
  return (
    <MainLayout>
      <Suspense fallback={<LoadingSkeleton />}>
        <StudentListWrapper />
      </Suspense>
    </MainLayout>
  );
}

async function StudentListWrapper() {
  const data = await getStudentData();

  return <StudentList initialData={data.students} />;
}
