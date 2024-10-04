'use client';
import React, { useState } from 'react';
import ReusableTable from '@components/tables/ReusableTable';
import { FaEllipsisV } from 'react-icons/fa';
import { BsDownload } from 'react-icons/bs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { data } from '@lib/mockdata';
import { CustomButton } from '@components/ui';
import { Parser } from 'json2csv';

const columns = [
  { header: "Student's name", accessor: 'name' },
  { header: 'Card number', accessor: 'cardNumber' },
  {
    header: 'Status',
    accessor: 'status',
    Cell: ({ value }: { value: string }) => (
      <div className="flex items-center space-x-2 mr-4">
        <span
          className={`h-3 w-3 rounded-full ${
            value === 'Activated' ? 'bg-teal-500' : 'bg-red-500'
          }`}
        ></span>
        <span
          className={`h-3 w-3 rounded-full ${
            value === 'Activated' ? '' : 'text-gray-400'
          }`}
        >
          {value}
        </span>
      </div>
    ),
  },
  { header: 'Balance', accessor: 'balance' },
  {
    header: '',
    accessor: 'actions',
    Cell: ({ row }: { row: any }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center justify-center p-2 rounded-full text-gray-600 hover:bg-gray-100">
            <FaEllipsisV className="text-purple-700 text-lg" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onSelect={() => {
              row.navigateToDetails(row.id);
            }}
          >
            View Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const StudentList = () => {
  const [filter, setFilter] = useState<'All' | 'Activated' | 'Deactivated'>(
    'All',
  );

  const router = useRouter();

  // Filter data based on the selected filter
  const filteredData =
    filter === 'All'
      ? data
      : data.filter((student) => student.status === filter);

  // Add navigation function to each row
  const tableData = filteredData.map((item) => ({
    ...item,
    navigateToDetails: (id: any) => {
      router.push(`/students/${id}`);
    },
  }));

  // Function to download CSV
  const downloadCSV = () => {
    const parser = new Parser();
    const csvData = parser.parse(filteredData);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'student_list.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* Filter Section */}
      <div className="flex justify-between items-center mb-6 bg-white rounded-lg p-3">
        <div className="flex items-center space-x-4">
          <span className="text-lg font-semibold text-gray-800">Filters:</span>
          <button
            onClick={() => setFilter('Activated')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'Activated'
                ? 'bg-teal-100 text-teal-800'
                : 'bg-gray-50 text-gray-600'
            }`}
          >
            Activated
          </button>
          <button
            onClick={() => setFilter('Deactivated')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'Deactivated'
                ? 'bg-teal-100 text-teal-800'
                : 'bg-gray-50 text-gray-600'
            }`}
          >
            Deactivated
          </button>
        </div>
        <CustomButton
          text="Download CSV"
          icon={<BsDownload />}
          onClick={downloadCSV}
          className="flex items-center space-x-2 px-4 py-2 rounded-md bg-gray-50 text-gray-800 hover:bg-gray-200 transition duration-200"
        />
      </div>

      {/* Student Table */}
      <ReusableTable
        columns={columns}
        data={tableData}
        rowsPerPageOptions={[10, 25, 50]}
      />
    </div>
  );
};

export default StudentList;
