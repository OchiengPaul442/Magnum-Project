// pages/VendorPage.tsx
'use client';

import React, { useState, useEffect } from 'react';
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

import { useVendorsContext } from '@/contexts/VendorsContext';
import { getVendorData } from '@/app/server/vendors/service';
import { VendorDataItem } from '@/@core/types/vendors';
import { slugifyStudentName } from '@/@core/utils';

export default function VendorPage() {
  const router = useRouter();
  const [vendors, setVendors] = useState<VendorDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [filter, setFilter] = useState<'All' | 'Activated' | 'Deactivated'>(
    'All',
  );
  const { setSelectedVendor } = useVendorsContext();

  const fetchData = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await getVendorData();
      setVendors(data);
    } catch (error) {
      console.error('Error fetching vendor data:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <LoadingSkeleton />;
  if (isError) {
    return (
      <ErrorState
        title="Error Loading Vendor Data"
        description="There was an error while fetching vendor data. Please try again."
        actionLabel="Retry"
        onActionClick={fetchData}
      />
    );
  }
  if (!vendors || vendors.length === 0) {
    return (
      <NoData
        title="No Vendors Available"
        description="There are currently no vendors in the system."
        actionLabel="Refresh"
        onActionClick={fetchData}
      />
    );
  }

  // Filter vendors by status
  const filteredData = vendors.filter((v: VendorDataItem) => {
    if (filter === 'All') return true;
    return v.status === filter;
  });

  const columns = [
    {
      header: "Vendor's Name",
      accessor: 'name',
      Cell: ({ value }: { value: string }) => (
        <span className="font-medium">{value}</span>
      ),
    },
    {
      header: 'Email',
      accessor: 'email',
      Cell: ({ value }: { value: string }) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      header: 'Canteen',
      accessor: 'canteenName',
      Cell: ({ value }: { value: string }) => (
        <span className="font-medium">{value}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      Cell: ({ value }: { value: string }) => (
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${value === 'Activated' ? 'bg-teal-500' : 'bg-red-500'}`}
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
                setSelectedVendor(row);
                router.push(
                  `/vendors/${encodeURIComponent(slugifyStudentName(row.raw.vendor_name))}`,
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

  const tableData = filteredData.map((vendor: VendorDataItem) => ({
    ...vendor,
  }));

  const downloadCSV = () => {
    try {
      const csvExportData = filteredData.map((vendor: VendorDataItem) => ({
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        canteenName: vendor.canteenName,
        status: vendor.status,
      }));
      const parser = new Parser();
      const csvData = parser.parse(csvExportData);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'vendors.csv');
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
