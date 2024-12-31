'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Logo from '@public/assets/images/MAIN_LOGO.webp';
import { CustomInputField, CustomButton } from '@components/shared';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, SignInFormValues } from '@lib/validationSchema';
import themeConfig from '@configs/themeConfig';

const SignInForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: 'admin@innolink.com',
      password: 'admin',
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    setLoading(true);
    setError(null);
    const res = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      router.push(themeConfig.homePageUrl);
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
                type="text"
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

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <CustomButton
            type="submit"
            className="w-full max-w-[480px] mb-6"
            text={loading ? 'Logging In...' : 'Log In'}
            loading={loading}
          />
        </form>
      </motion.div>
    </div>
  );
};

export default SignInForm;
