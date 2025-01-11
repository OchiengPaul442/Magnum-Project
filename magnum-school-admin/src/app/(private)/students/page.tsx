import MainLayout from '@/components/layouts/MainLayout';
import StudentList from '@/views/pages/students/StudentList';

export default function StudentsPage() {
  return (
    <MainLayout>
      <StudentList />
    </MainLayout>
  );
}
