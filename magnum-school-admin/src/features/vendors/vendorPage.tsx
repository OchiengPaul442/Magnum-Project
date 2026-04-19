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
import LoadingSkeleton from '@/components/shared/loaders/loading-skeleton';
import ConfirmDialog from '@/components/dialogs/confirm-dialog';
import ErrorState from '@/components/shared/ErrorState';
import NoData from '@/components/shared/NoData';
import { useResourceData } from '@/lib/api/useResourceData';

import {
  getVendorData,
  updateVendorEntityStatusBySchool,
} from '@/services/vendors/service';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { VendorDataItem } from '@/types/vendors';

export default function VendorPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<'All' | 'Activated' | 'Deactivated'>(
    'All',
  );
  const {
    data: vendors = [],
    error,
    isLoading,
    mutate,
  } = useResourceData('vendors:list', getVendorData);

  const [updatingVendorId, setUpdatingVendorId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmVendorId, setConfirmVendorId] = useState<string | null>(null);
  const [confirmIsActive, setConfirmIsActive] = useState<boolean | null>(null);

  const handleRetry = () => {
    void mutate();
  };

  if (isLoading) return <LoadingSkeleton />;
  if (error) {
    return (
      <ErrorState
        title="Error Loading Vendor Data"
        description="There was an error while fetching vendor data. Please try again."
        actionLabel="Retry"
        onActionClick={handleRetry}
      />
    );
  }
  if (!vendors || vendors.length === 0) {
    return (
      <NoData
        title="No Vendors Available"
        description="There are currently no vendors in the system."
        actionLabel="Refresh"
        onActionClick={handleRetry}
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
      accessor: 'canteenName',
      Cell: ({ value }: { value: string }) => (
        <span className="font-medium">{value}</span>
      ),
    },
    {
      header: 'Owner',
      accessor: 'owner',
      Cell: ({ value }: { value: string }) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      header: 'Operators',
      accessor: 'operatorCount',
      Cell: ({ value }: { value: number }) => (
        <span className="text-sm font-semibold text-gray-700">{value}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      Cell: ({ value }: { value: string }) => (
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${value === 'Activated' ? 'bg-[#18806B]' : 'bg-red-500'}`}
          />
          <span
            className={
              value === 'Activated' ? 'text-[#18806B]' : 'text-gray-500'
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
      Cell: ({ row }: { row: VendorDataItem }) => (
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
                router.push(`/vendors/${row.id}`);
              }}
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setConfirmVendorId(String(row.id));
                setConfirmIsActive(row.status === 'Activated');
                setConfirmOpen(true);
              }}
              disabled={updatingVendorId === String(row.id)}
            >
              {row.status === 'Activated' ? 'Deactivate' : 'Activate'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Map API data to table data structure
  const tableData = filteredData.map((vendor: any) => ({
    ...vendor,
    canteenName: vendor.canteenName || vendor.vendor_entity_name || vendor.name,
    owner: vendor.owner || vendor.vendor_owner,
    status:
      vendor.status ||
      (vendor.vendor_entity_status
        ? vendor.vendor_entity_status === 'active'
          ? 'Activated'
          : 'Deactivated'
        : undefined),
    operatorCount:
      vendor.operatorCount !== undefined
        ? vendor.operatorCount
        : vendor.vendor_entity_operator_count,
    id: vendor.id || vendor.vendor_entity_id,
  }));

  const downloadCSV = () => {
    try {
      const csvExportData = filteredData.map((vendor: VendorDataItem) => ({
        ID: vendor.id,
        Name: vendor.name,
        Owner: vendor.owner,
        Canteen: vendor.canteenName,
        Status: vendor.status,
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

  const handleConfirmPerformToggle = async () => {
    if (!confirmVendorId) return;
    const isActive = !!confirmIsActive;

    setUpdatingVendorId(String(confirmVendorId));
    try {
      await updateVendorEntityStatusBySchool({
        vendor_entity_id: String(confirmVendorId),
        new_status: isActive ? 'inactive' : 'active',
      });
      const successMessage = `Vendor ${isActive ? 'deactivated' : 'activated'} successfully.`;
      showSuccessToast(successMessage);
      await mutate();
    } catch (err: any) {
      console.error(err);
      showErrorToast(err, 'Unable to update vendor status.');
    } finally {
      setUpdatingVendorId(null);
      setConfirmVendorId(null);
      setConfirmIsActive(null);
    }
  };

  return (
    <div className="space-y-6">
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Confirm ${confirmIsActive ? 'deactivation' : 'activation'}`}
        description={`Are you sure you want to ${confirmIsActive ? 'deactivate' : 'activate'} this vendor?`}
        confirmLabel={confirmIsActive ? 'Deactivate' : 'Activate'}
        confirmVariant={confirmIsActive ? 'destructive' : 'secondary'}
        onConfirm={handleConfirmPerformToggle}
      />
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
