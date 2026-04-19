'use client';
import React from 'react';
import VendorDetailsForm from '@/components/forms/VendorDetailsForm';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getVendorEntityDetailsBySchool } from '@/services/vendors/service';
import ErrorState from '@/components/shared/ErrorState';
import NoData from '@/components/shared/NoData';
import VendorDetailsSkeleton from '@/components/shared/loaders/vendor-details-skeleton';
import { showErrorToast } from '@/lib/toast';

export default function VendorDetailsPage({
  params,
}: {
  params: { vendorId: string };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vendor, setVendor] = useState<{
    entityName: string;
    entityOwner: string;
    salesAmount: string;
    operators: Array<{
      id: string;
      name: string;
      email: string;
      amountTransacted: string;
    }>;
  } | null>(null);
  // Slugify util (copy from students if not global)

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    setVendor(null);
    const fetchVendor = async () => {
      try {
        const vendorId = params.vendorId;
        if (!vendorId) {
          if (!ignore)
            setError('No vendor selected. Please go back and select a vendor.');
          return;
        }
        const details: any = await getVendorEntityDetailsBySchool({
          vendor_entity_id: Number(vendorId),
        });
        const payload = details?.data ?? details;
        if (!payload || !payload.vendor_entity) {
          if (!ignore) setError('No details found for this vendor.');
          return;
        }
        const entity = payload.vendor_entity;
        const entityName = entity.vendor_entity_name || 'N/A';
        const entityOwner =
          entity.vendor_owner_details?.full_name ||
          entity.vendor_owner ||
          'N/A';
        const salesAmount =
          entity.vendor_entity_total_today_operator_transactions?.toString() ||
          '0';
        const operators = Array.isArray(entity.vendor_entity_operators)
          ? entity.vendor_entity_operators.map((op: any) => ({
              id: op.id?.toString() || '',
              name: op.full_name || '',
              email: op.email || '',
              amountTransacted: op.total_transactions?.toString() || '0',
            }))
          : [];
        if (!ignore) {
          setVendor({ entityName, entityOwner, salesAmount, operators });
          setError(null);
        }
      } catch (err: any) {
        if (!ignore) {
          const message =
            err?.response?.data?.message ||
            'Failed to fetch vendor details. Please try again later.';
          setError(message);
          showErrorToast(err, message);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchVendor();
    return () => {
      ignore = true;
    };
  }, [params.vendorId]);

  const handleClose = () => router.push('/vendors');

  if (loading) {
    return <VendorDetailsSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to Load Vendor Details"
        description={error}
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
