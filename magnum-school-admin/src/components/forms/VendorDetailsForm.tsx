'use client';

import React from 'react';
import { MdClose } from 'react-icons/md';
import { CustomInputField, CustomButton } from '@/components/shared';
import {
  useActivateVendor,
  useDeactivateVendor,
} from '@/@core/hooks/useVendorData';
import { mutate as globalMutate } from 'swr';

interface VendorDetails {
  id: string;
  name: string;
  email: string;
  canteenName: string;
  status: 'active' | 'inactive';
  // add any other fields as needed
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
      const updatedStatus = vendor.status === 'active' ? 'inactive' : 'active';
      if (vendor.status === 'active') {
        await deactivateVendor({ vendor_id: vendor.id });
      } else {
        await activateVendor({ vendor_id: vendor.id });
      }
      // Optionally update vendor.status locally
      vendor.status = updatedStatus;
      globalMutate('vendorData');
    } catch (err) {
      console.error('Error toggling vendor status:', err);
    }
  };

  const buttonText =
    isActivating || isDeactivating
      ? 'Processing...'
      : vendor.status === 'active'
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

      {/* Vendor Details Section */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <CustomInputField
          label="Vendor Name"
          type="text"
          placeholder="Enter vendor name"
          value={vendor.name}
          readOnly
        />
        <CustomInputField
          label="Email"
          type="text"
          placeholder="Enter email"
          value={vendor.email}
          readOnly
        />
        <CustomInputField
          label="Canteen Name"
          type="text"
          placeholder="Enter canteen name"
          value={vendor.canteenName}
          readOnly
        />
      </div>
    </div>
  );
};

export default VendorDetailsForm;
