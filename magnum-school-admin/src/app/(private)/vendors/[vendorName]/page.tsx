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
  const { selectedVendor, setSelectedVendor } = useVendorsContext();

  if (!selectedVendor || !selectedVendor.raw) {
    return notFound();
  }

  // Compute vendor full name from raw data
  const fullName = selectedVendor.raw.name;
  if (slugifyStudentName(fullName) !== params.vendorName) {
    return notFound();
  }

  const handleClose = () => {
    setSelectedVendor(null);
    router.push('/vendors');
  };

  return (
    <MainLayout>
      <VendorDetailsForm vendor={selectedVendor.raw} onClose={handleClose} />
    </MainLayout>
  );
}
