'use client';

import { useState } from 'react';
import ReusableTable from '@/components/shared/tables/ReusableTable';
import { FaEllipsisV } from 'react-icons/fa';
import { BsDownload } from 'react-icons/bs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { Parser } from 'json2csv';
import { Button } from '@/components/ui/button';
import { Student } from '@/types/student';

const columns = [
  {
    header: "Student's name",
    accessor: 'name',
    Cell: ({ value }: { value: string }) => (
      <span className="font-medium">{value}</span>
    ),
  },
  {
    header: 'Card number',
    accessor: 'cardNumber',
    Cell: ({ value }: { value: string }) => (
      <code className="text-sm font-mono">{value}</code>
    ),
  },
  {
    header: 'Status',
    accessor: 'status',
    Cell: ({ value }: { value: string }) => (
      <div className="flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            value === 'Activated' ? 'bg-teal-500' : 'bg-red-500'
          }`}
        />
        <span
          className={value === 'Activated' ? 'text-teal-700' : 'text-red-700'}
        >
          {value}
        </span>
      </div>
    ),
  },
  {
    header: 'Balance',
    accessor: 'balance',
    Cell: ({ value }: { value: string }) => (
      <span className="font-medium">
        UGX {new Intl.NumberFormat().format(parseInt(value))}
      </span>
    ),
  },
  {
    header: '',
    accessor: 'actions',
    Cell: ({ row }: { row: any }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <FaEllipsisV className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => row.navigateToDetails(row.original.id)}
          >
            View Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

interface StudentListProps {
  initialData: Student[];
}

export default function StudentList({ initialData }: StudentListProps) {
  const [students] = useState<Student[]>(initialData);
  const [filter, setFilter] = useState<'All' | 'Activated' | 'Deactivated'>(
    'All',
  );
  const router = useRouter();

  const filteredData =
    filter === 'All'
      ? students
      : students.filter((student) => student.status === filter);

  const tableData = filteredData?.map((student) => ({
    ...student,
    navigateToDetails: (id: string) => router.push(`/students/${id}`),
  }));

  const downloadCSV = () => {
    try {
      const parser = new Parser();
      const csvData = parser.parse(filteredData);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'students.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error(error);
    }
  };

  if (students?.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold mb-2">No Students Available</h2>
        <p className="text-gray-600">
          There are currently no students in the system.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Filters:</span>
          <div className="flex gap-2">
            {(['All', 'Activated', 'Deactivated'] as const).map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={downloadCSV}
          className="flex items-center gap-2"
        >
          <BsDownload className="h-4 w-4" />
          Download CSV
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <ReusableTable
          columns={columns}
          data={tableData}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </div>
    </div>
  );
}
