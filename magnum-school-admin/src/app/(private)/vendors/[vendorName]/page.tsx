'use client';
import React from 'react';
import VendorDetailsForm from '@/components/forms/VendorDetailsForm';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getVendorEntityDetailsBySchool } from '@/app/server/vendors/api';
import ErrorState from '@/components/shared/ErrorState';
import NoData from '@/components/shared/NoData';
import { useVendorsContext } from '@/contexts/VendorsContext';

export default function VendorDetailsPage() {
  const router = useRouter();
  const { selectedVendor } = useVendorsContext();
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

  useEffect(() => {
    const fetchVendor = async () => {
      setLoading(true);
      setError(null);
      setVendor(null);
      try {
        const vendorId =
          selectedVendor?.raw?.vendor_entity_id || selectedVendor?.id;
        if (!vendorId) {
          setError('No vendor selected. Please go back and select a vendor.');
          return;
        }
        // Call the correct service to fetch vendor details
        const details: any = await getVendorEntityDetailsBySchool({
          vendor_entity_id: Number(vendorId),
        });
        if (!details || !details.vendor_entity) {
          setError('No details found for this vendor.');
          return;
        }
        const entity = details.vendor_entity;
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
        setVendor({ entityName, entityOwner, salesAmount, operators });
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            'Failed to fetch vendor details. Please try again later.',
        );
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
  }, [selectedVendor]);

  const handleClose = () => router.push('/vendors');

  if (loading) {
    return (
      <NoData
        title="Loading Vendor Details"
        description="Fetching vendor details, please wait..."
        actionLabel="Back to Vendors List"
        onActionClick={handleClose}
      />
    );
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
