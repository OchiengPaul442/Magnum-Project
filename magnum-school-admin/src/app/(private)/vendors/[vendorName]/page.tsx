'use client';
import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import VendorDetailsForm from '@/components/forms/VendorDetailsForm';
import { notFound, useRouter } from 'next/navigation';
import { useVendorsContext } from '@/contexts/VendorsContext';
import { slugifyStudentName } from '@/@core/utils';

export default function VendorDetailsPage({
  params,
}: {
  params: { vendorName: string };
}) {
  const router = useRouter();
  const { selectedVendor } = useVendorsContext();

  if (!selectedVendor?.raw) return notFound();
  const raw = selectedVendor.raw as any;
  const fullName = raw.vendor_name;
  if (slugifyStudentName(fullName) !== params.vendorName) return notFound();

  const handleClose = () => router.push('/vendors');

  // Fallback placeholders if raw properties are missing
  const entityName = raw.vendor_name || 'Campus Bites';
  const entityOwner = raw.owner_name || 'Kaddu Richard';
  const salesAmount = raw.sales_amount || 'UGX 5,000,679';
  const operators = raw.operators || [
    {
      id: '1',
      name: 'Jane Nabukenya',
      email: 'jnabukenya@gmail.com',
      amountTransacted: 'UGX 400,500',
    },
    {
      id: '2',
      name: 'John Kato',
      email: 'jkato@example.com',
      amountTransacted: 'UGX 1,890,000',
    },
    {
      id: '3',
      name: 'Mary Achieng',
      email: 'machieng@example.com',
      amountTransacted: 'UGX 800,700',
    },
    {
      id: '4',
      name: 'Paul Okello',
      email: 'pokello@example.com',
      amountTransacted: 'UGX 3,000,500',
    },
  ];

  return (
    <MainLayout>
      <VendorDetailsForm
        vendor={{ entityName, entityOwner, salesAmount, operators }}
        onClose={handleClose}
      />
    </MainLayout>
  );
}
