'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Logo from '@public/assets/images/MAIN_LOGO.webp';
import { CustomInputField, CustomButton } from '@components/shared';
import { motion } from 'framer-motion';
import {
  createPasswordSchema,
  CreatePasswordFormValues,
} from '@lib/validationSchema';

const CreatePasswordForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePasswordFormValues>({
    resolver: zodResolver(createPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: CreatePasswordFormValues) => {
    setLoading(true);
    setServerError(null);

    try {
      // Replace the following with your actual API call to create/update the password

      // Simulating API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log('Password successfully created:', data.newPassword);
      router.push('/forgot-password');
    } catch (error: any) {
      console.error(error);
      setServerError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-purple-gradient px-4">
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
      >
        <div className="mb-4">
          <Image src={Logo} alt="Magnum Logo" width={80} height={80} />
        </div>

        <h2 className="text-2xl font-medium text-purple-700 mb-6">
          Create New Password
        </h2>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-6 p-8 bg-none"
        >
          {/* New Password Input */}
          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <CustomInputField
                label="Create New Password"
                type="password"
                placeholder="••••••••"
                value={field.value}
                onChange={field.onChange}
                clearable
                error={errors.newPassword?.message}
              />
            )}
          />

          {/* Confirm Password Input */}
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <CustomInputField
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                value={field.value}
                onChange={field.onChange}
                clearable
                error={errors.confirmPassword?.message}
              />
            )}
          />

          {/* Server Error Display */}
          {serverError && (
            <div className="text-red-500 text-sm text-center">
              {serverError}
            </div>
          )}

          {/* Submit Button */}
          <CustomButton
            type="submit"
            className="w-full mt-4"
            text={loading ? 'Submitting...' : 'Continue'}
            loading={loading}
          />
        </form>
      </motion.div>
    </div>
  );
};

export default CreatePasswordForm;
