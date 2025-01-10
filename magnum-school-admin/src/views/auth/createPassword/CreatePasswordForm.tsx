// components/CreatePasswordForm.tsx

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Logo from '@public/assets/images/MAIN_LOGO.webp';
import { CustomInputField, CustomButton } from '@components/shared';
import {
  createPasswordSchema,
  CreatePasswordFormValues,
} from '@lib/validationSchema';
import {
  handleChangePassword,
  ChangePasswordResponse,
} from '@/app/server/actions';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import themeConfig from '@/configs/themeConfig';

const CreatePasswordForm = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

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
    if (!session?.user.accessToken) {
      setServerError('Invalid session. Please sign in again.');
      return;
    }

    setLoading(true);
    setServerError(null);
    setServerSuccess(null);

    try {
      const response: ChangePasswordResponse = await handleChangePassword(
        data.oldPassword,
        data.newPassword,
        data.confirmPassword,
        session.user.accessToken,
      );

      if (response.status === 200 || response.status === 201) {
        setServerSuccess(response.message || 'Password successfully changed.');

        signOut({ callbackUrl: themeConfig.signOutUrl });
      } else {
        setServerError(response.message || 'Failed to change password.');
      }
    } catch (error: any) {
      setServerError(error.message || 'An unexpected error occurred.');
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

          {/* Server Error Display */}
          {serverError && (
            <div className="text-red-500 text-sm text-center">
              {serverError}
            </div>
          )}

          {/* Server Success Display */}
          {serverSuccess && (
            <div className="text-green-500 text-sm text-center">
              {serverSuccess}
            </div>
          )}

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
