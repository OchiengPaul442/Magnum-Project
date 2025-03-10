'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import CustomInputField from '@/components/shared/CustomInputField';
import CustomButton from '@/components/shared/CustomButton';

import { useRegisterNewVendor } from '@/@core/hooks/useVendorData';

// 1. Define your vendor form schema
const formSchema = z.object({
  firstName: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  lastName: z.string().min(2, {
    message: 'Last name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  canteenName: z.string().min(2, {
    message: 'Canteen name must be at least 2 characters.',
  }),
});

type FormData = z.infer<typeof formSchema>;

interface AddVendorFormProps {
  onSuccess?: () => void;
}

const AddVendorForm: React.FC<AddVendorFormProps> = ({ onSuccess }) => {
  const { registerNewVendor, isRegistering } = useRegisterNewVendor();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      canteenName: '',
    },
  });

  // 2. Handle form submission
  const onSubmit = async (formData: FormData) => {
    try {
      const response = await registerNewVendor(formData);
      console.log('Registration response:', response);

      toast.success('Vendor registered successfully!');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Registration error:', err);
      toast.error('Error registering new vendor. Please try again.');
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
      {/* First & Last Name side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 -mb-4">
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <CustomInputField
              label="First Name"
              placeholder="Jane"
              value={field.value}
              onChange={field.onChange}
              error={errors.firstName?.message}
            />
          )}
        />
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <CustomInputField
              label="Last Name"
              placeholder="Doe"
              value={field.value}
              onChange={field.onChange}
              error={errors.lastName?.message}
            />
          )}
        />
      </div>

      {/* Email address */}
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <CustomInputField
            label="Email address"
            placeholder="janedoe@gmail.com"
            value={field.value}
            onChange={field.onChange}
            error={errors.email?.message}
          />
        )}
      />

      {/* Canteen Name */}
      <Controller
        name="canteenName"
        control={control}
        render={({ field }) => (
          <CustomInputField
            label="Canteen Name"
            placeholder="Campus Bites"
            value={field.value}
            onChange={field.onChange}
            error={errors.canteenName?.message}
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
