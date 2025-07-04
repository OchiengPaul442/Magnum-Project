'use client';
import { useSelector } from '@/redux-store/hooks';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import CustomInputField from '@/components/shared/CustomInputField';
import CustomButton from '@/components/shared/CustomButton';

import { onboardVendorWithOwner } from '@/app/server/vendors/service';

// 1. Define your vendor form schema (fields required by onboarding API, schoolId is hidden)
const formSchema = z.object({
  vendorName: z.string().min(2, {
    message: 'Vendor name must be at least 2 characters.',
  }),
  // schoolId is injected, not shown to user
  schoolId: z.number().min(1, {
    message: 'School ID is required.',
  }),
  ownerEmail: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  ownerFirstName: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  ownerLastName: z.string().min(2, {
    message: 'Last name must be at least 2 characters.',
  }),
  contact: z.string().min(7, {
    message: 'Contact is required.',
  }),
  nationalId: z.string().min(5, {
    message: 'National ID is required.',
  }),
});

type FormData = z.infer<typeof formSchema>;

interface AddVendorFormProps {
  onSuccess?: () => void;
}

const AddVendorForm: React.FC<AddVendorFormProps> = ({ onSuccess }) => {
  const [isRegistering, setIsRegistering] = React.useState(false);

  // Get schoolId from user profile redux slice
  const userProfile = useSelector((state) => state.userProfile.data);
  const schoolId = userProfile?.data?.school?.id || 1;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vendorName: '',
      schoolId: schoolId,
      ownerEmail: '',
      ownerFirstName: '',
      ownerLastName: '',
      contact: '',
      nationalId: '',
    },
  });

  // 2. Handle form submission
  const onSubmit = async (formData: FormData) => {
    try {
      setIsRegistering(true);
      // Map form fields to API body
      const apiBody = {
        vendor_name: formData.vendorName,
        school_id: schoolId,
        owner_email: formData.ownerEmail,
        owner_first_name: formData.ownerFirstName,
        owner_last_name: formData.ownerLastName,
        contact: formData.contact,
        national_id: formData.nationalId,
      };
      const response = await onboardVendorWithOwner(apiBody);
      // Check for error in response (status or error/message field)
      if (
        response?.status &&
        response.status !== 200 &&
        response.status !== 201
      ) {
        toast.error(response?.message || 'Failed to onboard vendor.');
        return;
      }
      if (
        response?.error ||
        response?.message?.toLowerCase().includes('error')
      ) {
        toast.error(
          response?.message || response?.error || 'Failed to onboard vendor.',
        );
        return;
      }
      toast.success('Vendor onboarded successfully!');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Onboarding error:', err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          'Error onboarding new vendor. Please try again.',
      );
    } finally {
      setIsRegistering(false);
    }
  };

  // Prevent form submission on enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 relative"
      onKeyDown={handleKeyDown}
    >
      {/* Vendor Name */}
      <Controller
        name="vendorName"
        control={control}
        render={({ field }) => (
          <CustomInputField
            label="Vendor Name"
            placeholder="Prime Canteen Services"
            value={field.value}
            onChange={field.onChange}
            error={errors.vendorName?.message}
          />
        )}
      />

      {/* School ID is hidden and injected automatically */}
      <input
        type="hidden"
        value={schoolId}
        {...control.register('schoolId')}
        readOnly
      />

      {/* Owner First & Last Name side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 -mb-4">
        <Controller
          name="ownerFirstName"
          control={control}
          render={({ field }) => (
            <CustomInputField
              label="Owner First Name"
              placeholder="John"
              value={field.value}
              onChange={field.onChange}
              error={errors.ownerFirstName?.message}
            />
          )}
        />
        <Controller
          name="ownerLastName"
          control={control}
          render={({ field }) => (
            <CustomInputField
              label="Owner Last Name"
              placeholder="Kasaija"
              value={field.value}
              onChange={field.onChange}
              error={errors.ownerLastName?.message}
            />
          )}
        />
      </div>

      {/* Owner Email */}
      <Controller
        name="ownerEmail"
        control={control}
        render={({ field }) => (
          <CustomInputField
            label="Owner Email"
            placeholder="kevihed202@boxmach.com"
            value={field.value}
            onChange={field.onChange}
            error={errors.ownerEmail?.message}
          />
        )}
      />

      {/* Contact */}
      <Controller
        name="contact"
        control={control}
        render={({ field }) => (
          <CustomInputField
            label="Contact"
            placeholder="0700111222"
            value={field.value}
            onChange={field.onChange}
            error={errors.contact?.message}
          />
        )}
      />

      {/* National ID */}
      <Controller
        name="nationalId"
        control={control}
        render={({ field }) => (
          <CustomInputField
            label="National ID"
            placeholder="CM123456789"
            value={field.value}
            onChange={field.onChange}
            error={errors.nationalId?.message}
          />
        )}
      />

      <CustomButton
        type="submit"
        text={isRegistering ? 'Registering...' : 'Continue'}
        disabled={isRegistering}
        className="w-full bg-purple-700 hover:bg-purple-800 text-white rounded-full py-3"
      />
    </form>
  );
};

export default AddVendorForm;
