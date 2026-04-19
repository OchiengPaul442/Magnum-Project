'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { CustomInputField, CustomButton } from '@components/shared';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { handleResetPassword, handleResendOTP } from '@/services/auth/service';
import Link from 'next/link';
import { useAuthFlowStore } from '@/store/useAuthFlowStore';

// Zod schema
const resetPasswordSchema = z
  .object({
    otp: z.string().length(6, { message: 'OTP must be 6 digits' }),
    new_password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirm_password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    path: ['confirm_password'],
    message: 'Passwords do not match',
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const resetEmail = useAuthFlowStore((state) => state.resetEmail);
  const setResetEmail = useAuthFlowStore((state) => state.setResetEmail);
  const clearResetEmail = useAuthFlowStore((state) => state.clearResetEmail);
  const [otpValues, setOtpValues] = useState<string[]>([
    '',
    '',
    '',
    '',
    '',
    '',
  ]);
  const navigatingToSignInRef = useRef(false);

  // Refs for OTP inputs to manage focus
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resetEmail) {
      return;
    }

    const storedResetEmail = sessionStorage.getItem('forgotPasswordEmail');
    if (storedResetEmail) {
      setResetEmail(storedResetEmail);
      return;
    }

    if (!navigatingToSignInRef.current) {
      showErrorToast('Email not found — please start again.');
      router.push('/forgot-password');
    }
  }, [resetEmail, router, setResetEmail]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { otp: '', new_password: '', confirm_password: '' },
  });

  // Watch for changes in OTP values and update form
  useEffect(() => {
    const combinedOtp = otpValues.join('');
    if (combinedOtp.length === 6) {
      setValue('otp', combinedOtp, { shouldValidate: true });
    }
  }, [otpValues, setValue]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits, single char
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otpValues];
      newOtp[index] = value;
      setOtpValues(newOtp);

      // Move focus to the next input if a digit is entered
      if (value && index < otpValues.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // Handle backspace to move focus to previous input
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste event for OTP
  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    // Check if pasted content contains only digits
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split('').slice(0, 6);

      // Create a new OTP array
      const newOtp = [...otpValues];

      // Fill in the digits starting from the current input position
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });

      setOtpValues(newOtp);

      // Focus on the next empty input or the last input if all are filled
      const nextEmptyIndex = newOtp.findIndex((val) => val === '');
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[5]?.focus();
      }
    }
  };

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!resetEmail) return;
    setLoading(true);
    try {
      await handleResetPassword({
        email: resetEmail,
        otp: data.otp,
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      });
      showSuccessToast('Password reset successfully');
      // mark navigation so the mount-effect does not redirect back
      navigatingToSignInRef.current = true;
      // navigate to sign-in first, then clear stored email
      router.push('/sign-in');
      sessionStorage.removeItem('forgotPasswordEmail');
      clearResetEmail();
    } catch (err: any) {
      console.info(err);
      showErrorToast(err, 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!resetEmail) return;
    setResendLoading(true);
    try {
      await handleResendOTP(resetEmail);
      showSuccessToast('OTP code resent to your email');
    } catch (err: any) {
      console.info(err);
      showErrorToast(err, 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-purple-gradient px-4">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-medium text-purple-700 mb-2">
          Reset Password
        </h2>
        {resetEmail && (
          <p className="text-sm text-gray-600 mb-6 text-center max-w-md">
            OTP sent to <strong>{resetEmail}</strong>
          </p>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-8 p-8"
        >
          {/* OTP Input Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Enter OTP
            </label>
            <div className="flex space-x-2 justify-center">
              {otpValues.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="\d{1}"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={(e) => handlePaste(e, index)}
                  ref={(el: any) => (inputRefs.current[index] = el)}
                  className="w-10 h-12 md:w-12 md:h-14 text-xl md:text-2xl text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  autoFocus={index === 0}
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>
            {errors.otp && (
              <p className="text-xs text-red-500 mt-1">{errors.otp.message}</p>
            )}
          </div>

          {/* Password Fields */}
          {['new_password', 'confirm_password'].map((field) => (
            <Controller
              key={field}
              name={field as any}
              control={control}
              render={({ field: f }) => (
                <CustomInputField
                  label={
                    field === 'new_password'
                      ? 'New Password'
                      : 'Confirm Password'
                  }
                  type="password"
                  value={f.value}
                  onChange={f.onChange}
                  clearable
                  error={(errors as any)[field]?.message}
                />
              )}
            />
          ))}

          <CustomButton
            type="submit"
            className="w-full max-w-[480px]"
            text={loading ? 'Resetting...' : 'Reset Password'}
            loading={loading}
          />

          <div className="w-full max-w-[480px] text-center">
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleResend();
              }}
              className={`text-sm font-medium ${
                resendLoading
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-purple-700 hover:underline'
              }`}
              aria-disabled={resendLoading}
            >
              {resendLoading ? 'Resending OTP…' : 'Resend OTP'}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
