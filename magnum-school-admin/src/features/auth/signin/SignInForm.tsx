'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { handleSignIn } from '@/services/auth/service';
import { showErrorToast, showSuccessToast } from '@/lib/toast';

import Logo from '@public/assets/images/MAIN_LOGO.webp';
import { CustomInputField, CustomButton } from '@components/shared';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignInFormValues, signInSchema } from '@/lib/validationSchema';
import { useAuthFlowStore } from '@/store/useAuthFlowStore';

const SignInForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const setPendingEmail = useAuthFlowStore((state) => state.setPendingEmail);
  const onSubmit = async (data: SignInFormValues) => {
    setLoading(true);
    try {
      const response = await handleSignIn(data.email, data.password);

      if (!response) {
        showErrorToast('Unable to start sign in. Please try again.');
        return;
      }

      if (response.requires_otp || response.status === 202) {
        setPendingEmail(data.email);
        showSuccessToast(
          response.message ||
            'OTP sent to your email. Provide OTP to complete login.',
        );
        router.push('/verify-otp');
        return;
      }

      showErrorToast(
        response.message ||
          'Login response did not request OTP. Please try again.',
      );
    } catch (err: any) {
      showErrorToast(err, 'An unexpected error occurred.');
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
          School Admin
        </h2>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-8 bg-none p-8"
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <CustomInputField
                label="Enter school admin email address"
                type="email"
                placeholder="admin@innolink.com"
                value={field.value}
                onChange={field.onChange}
                clearable
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <CustomInputField
                label="Enter password"
                type="password"
                placeholder="••••••••"
                value={field.value}
                onChange={field.onChange}
                clearable
                error={errors.password?.message}
              />
            )}
          />

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-purple-700 font-medium hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <CustomButton
            type="submit"
            className="w-full max-w-[480px] mb-6"
            text={loading ? 'Logging In...' : 'Log In'}
            loading={loading}
          />
        </form>
      </div>
    </div>
  );
};

export default SignInForm;
