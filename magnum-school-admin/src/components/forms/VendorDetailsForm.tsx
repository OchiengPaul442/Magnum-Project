'use client';

import React, { useState } from 'react';
import {
  MdClose,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from 'react-icons/md';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { updateVendorEntityStatusBySchool } from '@/services/vendors/service';
import ConfirmDialog from '@/components/dialogs/confirm-dialog';

interface Operator {
  id: string;
  name: string;
  email: string;
  amountTransacted: string;
}

interface Vendor {
  vendorEntityId: string;
  entityName: string;
  entityOwner: string;
  salesAmount: string;
  status: 'Activated' | 'Deactivated';
  operators: Operator[];
}

interface VendorDetailsFormProps {
  vendor?: Vendor;
  onClose: () => void;
  onStatusUpdated?: () => void | Promise<void>;
}

const ITEMS_PER_PAGE = 4;

const VendorDetailsForm: React.FC<VendorDetailsFormProps> = ({
  vendor,
  onClose,
  onStatusUpdated,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const operators = vendor?.operators || [];
  const totalPages = Math.ceil(operators.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentOperators = operators.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  const isActivated = vendor?.status === 'Activated';
  const showPagination = totalPages > 1;

  const goToPage = (page: number) => {
    if (totalPages < 1) return;
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const [confirmOpen, setConfirmOpen] = useState(false);

  const performToggleVendorStatus = async () => {
    if (!vendor?.vendorEntityId) {
      showErrorToast(
        'Vendor entity id is missing.',
        'Unable to update vendor status.',
      );
      return;
    }

    const currentlyActive = vendor.status === 'Activated';

    setIsUpdatingStatus(true);
    try {
      await updateVendorEntityStatusBySchool({
        vendor_entity_id: vendor.vendorEntityId,
        new_status: currentlyActive ? 'inactive' : 'active',
      });

      const successMessage = `Vendor ${currentlyActive ? 'deactivated' : 'activated'} successfully.`;
      showSuccessToast(successMessage);
      await onStatusUpdated?.();
    } catch (error) {
      showErrorToast(error, 'Unable to update vendor status right now.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (!vendor) {
    return (
      <div className="w-full rounded-[28px] bg-white p-6">
        <span className="block text-center text-gray-500">
          No vendor details found.
        </span>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl p-6 bg-white rounded-lg sm:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#18806B]">
            Vendor profile
          </p>
          <h2 className="text-2xl font-semibold text-gray-900">
            Vendor Details
          </h2>
          <p className="text-sm text-gray-500">
            Review the vendor entity, owner information, and operators attached
            to this account.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-2 text-gray-500 transition-colors hover:bg-white hover:text-gray-900"
          aria-label="Close vendor details"
        >
          <MdClose className="text-2xl" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Entity name</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {vendor.entityName}
              </p>
            </div>
            <Badge
              className={cn(
                'rounded-full px-3 py-1 text-xs font-semibold',
                vendor.status === 'Activated'
                  ? 'border-[#18806B]/15 bg-[#18806B]/10 text-[#18806B]'
                  : 'border-amber-200 bg-amber-50 text-amber-700',
              )}
            >
              {vendor.status}
            </Badge>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-gray-50 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Owner
              </p>
              <p className="mt-2 text-sm font-medium text-gray-900">
                {vendor.entityOwner}
              </p>
            </div>
            <div className="rounded-2xl bg-gray-50 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Operators
              </p>
              <p className="mt-2 text-sm font-medium text-gray-900">
                {operators.length} linked operators
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {(() => null)()}
            <Button
              type="button"
              onClick={() => {
                setConfirmOpen(true);
              }}
              disabled={isUpdatingStatus}
              className={
                isActivated
                  ? 'rounded-full !bg-red-600 px-5 !text-white hover:!bg-red-700'
                  : 'rounded-full !bg-[#18806B] px-5 !text-white hover:!bg-[#146b59]'
              }
            >
              {isUpdatingStatus
                ? 'Updating...'
                : isActivated
                  ? 'Deactivate vendor'
                  : 'Activate vendor'}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-sm font-medium text-gray-500">Sales today</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-[#18806B]">
              {vendor.salesAmount}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Total amount made in sales by operators under this vendor.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-sm font-medium text-gray-500">Quick summary</p>
            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <div className="flex items-center justify-between gap-3">
                <span>Vendor entity ID</span>
                <span className="font-medium text-gray-900">
                  {vendor.vendorEntityId}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Current status</span>
                <span className="font-medium text-gray-900">
                  {vendor.status}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Operators on page</span>
                <span className="font-medium text-gray-900">
                  {currentOperators.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Operators under this entity
            </h3>
            <p className="text-sm text-gray-500">
              Review the operators linked to this vendor account.
            </p>
          </div>
          <span className="rounded-full bg-[#18806B]/10 px-3 py-1 text-xs font-semibold text-[#18806B]">
            {operators.length} operators
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          {operators.length === 0 ? (
            <div className="p-8">
              <span className="block text-center text-gray-500">
                No operators found for this vendor.
              </span>
            </div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Operator&apos;s Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Email address
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Amount transacted
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentOperators.map((op) => (
                  <tr key={op.id} className="border-t border-gray-200">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {op.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {op.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {op.amountTransacted}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showPagination ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center space-x-1 rounded-full border border-gray-200 px-3 py-1.5 disabled:opacity-50"
            >
              <MdKeyboardArrowLeft />
              <span>Previous</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                type="button"
                key={page}
                onClick={() => goToPage(page)}
                className={cn(
                  'rounded-full px-3 py-1.5 transition-colors',
                  page === currentPage
                    ? 'bg-[#18806B] text-white'
                    : 'hover:bg-gray-100 hover:text-gray-900',
                )}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center space-x-1 rounded-full border border-gray-200 px-3 py-1.5 disabled:opacity-50"
            >
              <span>Next</span>
              <MdKeyboardArrowRight />
            </button>
          </div>
        ) : null}
      </div>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Confirm ${isActivated ? 'deactivation' : 'activation'}`}
        description={`Are you sure you want to ${isActivated ? 'deactivate' : 'activate'} this vendor?`}
        confirmLabel={isActivated ? 'Deactivate' : 'Activate'}
        confirmVariant={isActivated ? 'destructive' : 'secondary'}
        onConfirm={performToggleVendorStatus}
      />
    </div>
  );
};

export default VendorDetailsForm;
