// pages/vendors/[vendorName].tsx
'use client';

import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import VendorDetailsForm from '@/components/forms/VendorDetailsForm';
import { notFound, useRouter } from 'next/navigation';
import { useVendorsContext } from '@/contexts/VendorsContext';
import { slugifyStudentName } from '@/utils';

export default function VendorDetailsPage({
  params,
}: {
  params: { vendorName: string };
}) {
  const router = useRouter();
  const { selectedVendor } = useVendorsContext();

  if (!selectedVendor || !selectedVendor.raw) {
    return notFound();
  }

  const fullName = selectedVendor.raw.vendor_name;
  if (slugifyStudentName(fullName) !== params.vendorName) {
    return notFound();
  }

  const handleClose = () => {
    router.push('/vendors');
  };

  return (
    <MainLayout>
      <VendorDetailsForm
        vendor={selectedVendor.raw as any}
        onClose={handleClose}
      />
    </MainLayout>
  );
}
