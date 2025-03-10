'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Parser } from 'json2csv';
import { FaEllipsisV } from 'react-icons/fa';
import { BsDownload } from 'react-icons/bs';

import ReusableTable from '@/components/shared/tables/ReusableTable';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import ErrorState from '@/components/shared/ErrorState';
import NoData from '@/components/shared/NoData';
import LoadingSkeleton from '@/components/shared/loaders/loading-skeleton';

import { useStudentData } from '@/@core/hooks/useStudentData';
import { useStudentsContext } from '@/contexts/StudentsContext';
import { slugifyStudentName } from '@/@core/utils';

export default function StudentList() {
  const router = useRouter();
  const { students, isLoading, isError, refetch } = useStudentData();
  const [filter, setFilter] = useState<'All' | 'Activated' | 'Deactivated'>(
    'All',
  );

  const { setSelectedStudent } = useStudentsContext();

  if (isLoading) return <LoadingSkeleton />;
  if (isError) {
    return (
      <ErrorState
        title="Error Loading Student Data"
        description="There was an error while fetching student data. Please try again."
        actionLabel="Retry"
        onActionClick={() => refetch()}
      />
    );
  }

  if (!students || students.length === 0) {
    return (
      <NoData
        title="No Students Available"
        description="There are currently no students in the system."
        actionLabel="Refresh"
        onActionClick={() => refetch()}
      />
    );
  }

  // Filter logic
  const filteredData = students.filter((s) => {
    if (filter === 'All') return true;
    return s.status === filter;
  });

  // Columns for the table
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
            className={
              value === 'Activated' ? 'text-gray-700' : 'text-gray-500'
            }
          >
            {value}
          </span>
        </div>
      ),
    },
    {
      header: 'Balance',
      accessor: 'balance',
      Cell: ({ value }: { value: string }) => {
        const numericValue = parseFloat(value) || 0;
        return (
          <span className="font-medium">
            UGX {new Intl.NumberFormat().format(numericValue)}
          </span>
        );
      },
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
              onClick={() => {
                setSelectedStudent(row);
                // Compute full name from raw data
                const fullName = `${row.raw.student_first_name} ${row.raw.student_last_name}`;

                router.push(
                  `/students/${encodeURIComponent(slugifyStudentName(fullName))}`,
                );
              }}
            >
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Prepare data for the table
  const tableData = filteredData.map((student) => ({
    ...student,
  }));

  // CSV Download: Transform data to remove the raw field
  const downloadCSV = () => {
    try {
      const csvExportData = filteredData.map((student) => ({
        id: student.id,
        name: student.name,
        cardNumber: student.cardNumber,
        status: student.status,
        balance: student.balance,
      }));
      const parser = new Parser();
      const csvData = parser.parse(csvExportData);
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

  return (
    <div className="space-y-6">
      {/* Filters & Download CSV */}
      <div className="flex justify-between items-center bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-gray-700">Filters:</span>
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

      {/* Table */}
      <div>
        <ReusableTable
          columns={columns}
          data={tableData}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </div>
    </div>
  );
}
