'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import CustomButton from '@/components/shared/CustomButton';

import AddVendorForm from '../forms/AddVendorForm';

export function AddVendorDialog() {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    // refetch removed: no longer needed
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CustomButton
          type="button"
          text="Add a vendor"
          className="bg-purple-700 text-sm gap-4 text-white px-6 py-3 rounded-lg hover:bg-purple-800 transition duration-200 flex items-center"
        />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add Vendor</DialogTitle>
          <DialogDescription className="max-w-xl text-sm text-muted-foreground">
            Create the vendor entity and owner account in one step. The form
            will use the currently loaded school profile automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto">
          <AddVendorForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
