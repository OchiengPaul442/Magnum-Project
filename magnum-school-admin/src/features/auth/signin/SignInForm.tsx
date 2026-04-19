'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSession } from 'next-auth/react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Logo from '@public/assets/images/MAIN_LOGO.webp';
import { CustomButton, CustomInputField } from '@components/shared';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { SignInFormValues, signInSchema } from '@/lib/validationSchema';
import {
  buildVerifyOtpPath,
  getPostAuthRedirect,
  resolveCallbackUrl,
} from '@/lib/auth/flow';
import { handleSignIn } from '@/services/auth/service';

const SignInForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = resolveCallbackUrl(searchParams);
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

  const onSubmit = async (data: SignInFormValues) => {
    setLoading(true);

    try {
      const response = await handleSignIn(data.email, data.password);

      // If backend explicitly requires OTP, redirect to verify page
      if (response?.status === 202 || response?.requires_otp) {
        showSuccessToast(response?.message || 'OTP sent to your email.');
        router.replace(buildVerifyOtpPath(data.email, callbackUrl));
        return;
      }

      // Only treat as a full sign-in success when backend returned tokens
      const hasToken = Boolean(
        response &&
        (response.token ||
          response.access_token ||
          (response as any).accessToken),
      );

      if (
        !response ||
        response.status < 200 ||
        response.status >= 300 ||
        !hasToken
      ) {
        // Prefer backend message when available
        showErrorToast(
          response?.message || 'Unable to sign in. Please try again.',
        );
        return;
      }

      // Successful sign in - NextAuth session cookie should be set by server
      const session = await getSession();
      const redirectTarget = getPostAuthRedirect(session, callbackUrl);

      showSuccessToast(
        session?.user?.first_time_login
          ? 'Sign in complete. Finish setting up your password.'
          : 'Signed in successfully.',
      );

      router.replace(redirectTarget);
    } catch (error) {
      // If service threw an axios error with statusMessage, prefer that
      const message = (error as any)?.statusMessage || (error as any)?.message;
      showErrorToast(message || error, 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-purple-gradient px-4">
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="mb-4">
          <Image src={Logo} alt="Magnum Logo" width={80} height={80} />
        </div>

        <h2 className="mb-6 text-2xl font-medium text-purple-700">
          School Admin
        </h2>
        <p className="mb-6 max-w-md text-center text-sm text-gray-600">
          Sign in with your school admin credentials. We will send a one-time
          code when your account requires OTP verification.
        </p>

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

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="font-medium text-purple-700 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <CustomButton
            type="submit"
            className="mb-6 w-full max-w-[480px]"
            text={loading ? 'Signing In...' : 'Sign In'}
            loading={loading}
          />
        </form>
      </div>
    </div>
  );
};

export default SignInForm;
