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

// Define a new Zod schema for the forgot password email form.
const forgotPasswordEmailSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

// Infer the correct type for the form values.
type ForgotPasswordEmailFormValues = z.infer<typeof forgotPasswordEmailSchema>;

const EnterEmailForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordEmailFormValues>({
    resolver: zodResolver(forgotPasswordEmailSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordEmailFormValues) => {
    setLoading(true);
    try {
      console.info('Sending password reset link to:', data.email);
      toast.success('Password reset code sent to your email address');
      router.push('/forgot-password/verification');
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
          Forgot Password
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center max-w-md">
          Please enter your email address below. A verification code will be
          sent to your email so you can reset your password securely.
        </p>

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
                label="Enter your email address"
                type="email"
                placeholder="tom@magnum.com"
                value={field.value}
                onChange={field.onChange}
                clearable
                error={errors.email?.message}
              />
            )}
          />

          <CustomButton
            type="submit"
            className="w-full max-w-[480px] mb-6"
            text={loading ? 'Sending...' : 'Send'}
            loading={loading}
          />
        </form>
      </div>
    </div>
  );
};

export default EnterEmailForm;
