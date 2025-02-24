'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Logo from '@public/assets/images/MAIN_LOGO.webp';
import { CustomInputField, CustomButton } from '@components/shared';
import {
  createPasswordSchema,
  CreatePasswordFormValues,
} from '@lib/validationSchema';
import { handleChangePassword } from '@/app/server/actions';
import { ChangePasswordResponse } from '@/types/auth';
import { toast } from 'sonner';

const CreatePasswordForm = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePasswordFormValues>({
    resolver: zodResolver(createPasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: CreatePasswordFormValues) => {
    // If session or token is invalid, show an error toast
    if (!session?.user.accessToken) {
      toast.error('Invalid session. Please sign in again.');
      return;
    }

    setLoading(true);

    try {
      const response: ChangePasswordResponse = await handleChangePassword(
        data.oldPassword,
        data.newPassword,
        data.confirmPassword,
      );

      if (response.status === 200 || response.status === 201) {
        toast.success(response.message || 'Password changed successfully.');
        // Redirect to /dashboard instead of signing out
        router.push('/dashboard');
      } else {
        toast.error(response.message || 'Failed to change password.');
      }
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred.');
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

        <h2 className="text-2xl font-medium text-purple-700 mb-6">
          Change Password
        </h2>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-6 p-8 bg-none"
        >
          {/* Old Password Input */}
          <Controller
            name="oldPassword"
            control={control}
            render={({ field }) => (
              <CustomInputField
                label="Old Password"
                type="password"
                placeholder="••••••••"
                value={field.value}
                onChange={field.onChange}
                clearable
                error={errors.oldPassword?.message}
              />
            )}
          />

          {/* New Password Input */}
          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <CustomInputField
                label="New Password"
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

          {/* Submit Button */}
          <CustomButton
            type="submit"
            className="w-full mt-4"
            text={loading ? 'Submitting...' : 'Change Password'}
            loading={loading}
          />
        </form>
      </div>
    </div>
  );
};

export default CreatePasswordForm;
