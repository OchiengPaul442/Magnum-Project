'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import CustomButton from '@/components/shared/CustomButton';
import { useVendorData } from '@/@core/hooks/useVendorData';
import AddVendorForm from '../forms/AddVendorForm';

export function AddVendorDialog() {
  const { refetch } = useVendorData();
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    refetch();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CustomButton
          type="button"
          onClick={() => setOpen(true)}
          text="Add a vendor"
          className="bg-purple-700 text-sm gap-4 text-white px-6 py-3 rounded-lg hover:bg-purple-800 transition duration-200 flex items-center"
        />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Vendor Details</DialogTitle>
        </DialogHeader>
        <AddVendorForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
