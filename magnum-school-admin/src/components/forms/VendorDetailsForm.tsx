// components/forms/VendorDetailsForm.tsx
'use client';

import React from 'react';
import { MdClose } from 'react-icons/md';
import { CustomInputField, CustomButton } from '@/components/shared';
import { mutate as globalMutate } from 'swr';
import {
  useActivateVendor,
  useDeactivateVendor,
} from '@/@core/hooks/useVendorData';

interface VendorDetails {
  id: string;
  vendor_name: string;
  Vendor_Personnel: Array<{
    id: number;
    user: {
      email: string;
      is_active: boolean;
      // …other user fields
    };
    contact: string;
  }>;
}

interface VendorDetailsFormProps {
  vendor: VendorDetails;
  onClose?: () => void;
}

const VendorDetailsForm: React.FC<VendorDetailsFormProps> = ({
  vendor,
  onClose,
}) => {
  const { activateVendor, isActivating } = useActivateVendor();
  const { deactivateVendor, isDeactivating } = useDeactivateVendor();

  const handleToggleStatus = async () => {
    try {
      // Determine new status based on the first personnel’s is_active flag
      const isActive = vendor.Vendor_Personnel[0]?.user.is_active;
      if (isActive) {
        await deactivateVendor({ vendor_id: vendor.id });
      } else {
        await activateVendor({ vendor_id: vendor.id });
      }
      // Optionally update vendor locally and trigger a revalidation
      globalMutate('vendorData');
    } catch (err) {
      console.error('Error toggling vendor status:', err);
    }
  };

  const buttonText =
    isActivating || isDeactivating
      ? 'Processing...'
      : vendor.Vendor_Personnel[0]?.user.is_active
        ? 'Deactivate vendor'
        : 'Activate vendor';

  return (
    <div className="p-6 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-md font-semibold text-gray-900">Vendor Details</h2>
        <div className="flex items-center gap-4">
          <CustomButton
            type="button"
            onClick={handleToggleStatus}
            loading={isActivating || isDeactivating}
            text={buttonText}
            className="py-1 px-4 border-2 text-purple-700 border-purple-700 hover:bg-purple-400 hover:text-white rounded-full bg-transparent"
          />
          <button type="button" onClick={onClose}>
            <MdClose className="text-gray-500 text-2xl hover:text-gray-900 cursor-pointer" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 mb-8">
        <CustomInputField
          label="Vendor Name"
          type="text"
          placeholder="Enter vendor name"
          value={vendor.vendor_name}
          readOnly
        />
        <CustomInputField
          label="Email"
          type="text"
          placeholder="Enter email"
          value={vendor.Vendor_Personnel[0]?.user.email || ''}
          readOnly
        />
        <CustomInputField
          label="Contact"
          type="text"
          placeholder="Enter contact number"
          value={vendor.Vendor_Personnel[0]?.contact || ''}
          readOnly
        />
      </div>
    </div>
  );
};

export default VendorDetailsForm;
