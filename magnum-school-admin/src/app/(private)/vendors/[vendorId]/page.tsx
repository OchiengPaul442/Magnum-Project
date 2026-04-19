'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import VendorDetailsForm from '@/components/forms/VendorDetailsForm';
import ErrorState from '@/components/shared/ErrorState';
import NoData from '@/components/shared/NoData';
import VendorDetailsSkeleton from '@/components/shared/loaders/vendor-details-skeleton';
import { getVendorEntityDetailsBySchool } from '@/services/vendors/service';
import { useResourceData } from '@/lib/api/useResourceData';

export default function VendorDetailsPage({
  params,
}: {
  params: { vendorId: string };
}) {
  const router = useRouter();

  const vendorDetailsKey = params.vendorId
    ? `vendor:details:${params.vendorId}`
    : null;

  const fetchVendorDetails = async () => {
    if (!params.vendorId) {
      throw new Error(
        'No vendor selected. Please go back and select a vendor.',
      );
    }

    const details: any = await getVendorEntityDetailsBySchool({
      vendor_entity_id: String(params.vendorId),
    });
    const payload = details?.data ?? details;

    if (!payload || !payload.vendor_entity) {
      return null;
    }

    const entity = payload.vendor_entity;
    const entityName = entity.vendor_entity_name || 'N/A';
    const entityOwner =
      entity.vendor_owner_details?.full_name || entity.vendor_owner || 'N/A';
    const salesAmount =
      entity.vendor_entity_total_today_operator_transactions?.toString() || '0';
    const operators = Array.isArray(entity.vendor_entity_operators)
      ? entity.vendor_entity_operators.map((op: any) => ({
          id: op.id?.toString() || '',
          name: op.full_name || '',
          email: op.email || '',
          amountTransacted: op.total_transactions?.toString() || '0',
        }))
      : [];

    return { entityName, entityOwner, salesAmount, operators };
  };

  const {
    data: vendor,
    error,
    isLoading,
  } = useResourceData(vendorDetailsKey, fetchVendorDetails);

  const handleClose = () => router.push('/vendors');

  if (isLoading) {
    return <VendorDetailsSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to Load Vendor Details"
        description="Failed to fetch vendor details. Please try again later."
        actionLabel="Back to Vendors List"
        onActionClick={handleClose}
      />
    );
  }

  if (!vendor) {
    return (
      <NoData
        title="No Vendor Details"
        description="No vendor details found for the selected vendor."
        actionLabel="Back to Vendors List"
        onActionClick={handleClose}
      />
    );
  }

  return <VendorDetailsForm vendor={vendor} onClose={handleClose} />;
}
