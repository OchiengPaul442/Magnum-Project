'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Logo from '@public/assets/images/MAIN_LOGO.webp';
import { CustomInputField, CustomButton } from '@components/shared';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define a new Zod schema for resetting the password.
const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Infer the correct type for the form values.
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setLoading(true);
    try {
      // Replace with your API endpoint for resetting the password.
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
      toast.success('Your password has been reset successfully');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-purple-gradient px-4">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="mb-4">
          <Image src={Logo} alt="Magnum Logo" width={80} height={80} />
        </div>

        <h2 className="text-2xl font-medium text-purple-700 mb-2">
          Reset Password
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center max-w-md">
          Please enter your new password and confirm it below. Make sure your
          password is strong and secure.
        </p>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-8 bg-none p-8"
        >
          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <CustomInputField
                label="New Password"
                type="password"
                placeholder="Enter new password"
                value={field.value}
                onChange={field.onChange}
                clearable
                error={errors.newPassword?.message}
              />
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <CustomInputField
                label="Confirm New Password"
                type="password"
                placeholder="Confirm new password"
                value={field.value}
                onChange={field.onChange}
                clearable
                error={errors.confirmPassword?.message}
              />
            )}
          />

          <CustomButton
            type="submit"
            className="w-full max-w-[480px] mb-6"
            text={loading ? 'Resetting...' : 'Reset Password'}
            loading={loading}
          />
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
