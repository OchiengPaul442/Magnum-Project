'use client';
import React from 'react';
import VendorDetailsForm from '@/components/forms/VendorDetailsForm';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getVendorDetails, getVendorData } from '@/app/server/vendors/api';
import ErrorState from '@/components/shared/ErrorState';
import NoData from '@/components/shared/NoData';
import VendorDetailsSkeleton from '@/components/shared/loaders/vendor-details-skeleton';
import { useVendorsContext } from '@/contexts/VendorsContext';

export default function VendorDetailsPage() {
  const router = useRouter();
  const { selectedVendor, setSelectedVendor } = useVendorsContext();
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
    let ignore = false;
    setLoading(true);
    setError(null);
    setVendor(null);
    const fetchVendor = async () => {
      try {
        let vendorId =
          selectedVendor?.raw?.vendor_entity_id || selectedVendor?.id;
        // If no vendorId in context, try to get from vendor list by matching name in URL
        if (!vendorId) {
          const allVendors = await getVendorData();
          // Try to match by name (slugify if needed)
          // You may want to parse the vendorName param from the URL if available
          // For now, fallback to first vendor
          if (allVendors.length > 0) {
            vendorId = allVendors[0].raw?.vendor_entity_id || allVendors[0].id;
            setSelectedVendor(allVendors[0]);
          }
        }
        if (!vendorId) {
          if (!ignore)
            setError('No vendor selected. Please go back and select a vendor.');
          return;
        }
        const details: any = await getVendorDetails({
          vendor_entity_id: Number(vendorId),
        });
        if (!details || !details.vendor_entity) {
          if (!ignore) setError('No details found for this vendor.');
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
        if (!ignore) {
          setVendor({ entityName, entityOwner, salesAmount, operators });
          setError(null);
        }
      } catch (err: any) {
        if (!ignore) {
          setError(
            err?.response?.data?.message ||
              'Failed to fetch vendor details. Please try again later.',
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchVendor();
    return () => {
      ignore = true;
    };
  }, [selectedVendor, setSelectedVendor]);

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
