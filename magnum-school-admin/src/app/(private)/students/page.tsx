import type { Metadata } from 'next';
import StudentList from '@/features/students/StudentList';

export const metadata: Metadata = {
  title: 'Students',
  description:
    'Manage students enrolled at your school with Magnum School Admin.',
};

export default function StudentsPage() {
  return <StudentList />;
}
