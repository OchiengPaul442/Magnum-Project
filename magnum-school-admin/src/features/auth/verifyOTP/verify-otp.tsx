'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSession } from 'next-auth/react';
import { showErrorToast, showSuccessToast } from '@/lib/toast';

import Logo from '@public/assets/images/MAIN_LOGO.webp';
import { CustomButton } from '@components/shared';
import { handleResendOTP, handleVerifyOTP } from '@/services/auth/service';
import { getPostAuthRedirect, resolveCallbackUrl } from '@/lib/auth/flow';

const VerifyOTP: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = resolveCallbackUrl(searchParams);
  const email = searchParams.get('email')?.trim() || '';
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  // Refs for OTP inputs to manage focus
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (email) {
      return;
    }

    showErrorToast('Please sign in again to continue.');
    router.replace(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }, [callbackUrl, email, router]);

  useEffect(() => {
    if (resendCooldown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendCooldown((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits, single char
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to the next input if a digit is entered
      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // Handle backspace to move focus to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
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
      const newOtp = [...otp];

      // Fill in the digits starting from the current input position
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });

      setOtp(newOtp);

      // Focus on the next empty input or the last input if all are filled
      const nextEmptyIndex = newOtp.findIndex((val) => val === '');
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[5]?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      showErrorToast('Please enter the complete 6-digit code.');
      return;
    }

    setIsVerifying(true);

    try {
      const response = await handleVerifyOTP(email, otpCode);

      // On success server should set session cookie
      if (response?.status >= 200 && response?.status < 300) {
        const session = await getSession();
        const redirectTarget = getPostAuthRedirect(session, callbackUrl);
        const successMessage = session?.user?.first_time_login
          ? 'OTP verified. Finish setting up your password.'
          : 'Signed in successfully.';

        showSuccessToast(successMessage);
        router.replace(redirectTarget);
        return;
      }

      // For non-2xx statuses show backend message
      showErrorToast(response?.message || 'OTP verification failed.');
    } catch (err: any) {
      const message = (err as any)?.statusMessage || (err as any)?.message;
      showErrorToast(message || err, 'An unexpected error occurred.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (!email || isResending || resendCooldown > 0) return;

    setIsResending(true);
    try {
      const response = await handleResendOTP(email);

      if (response.status === 200 || response.status === 201) {
        showSuccessToast(
          response.message || 'OTP for login sent successfully.',
        );
        setResendCooldown(30);
      } else {
        showErrorToast(response.message || 'Failed to resend OTP.');
      }
    } catch (err: any) {
      showErrorToast(err, 'Failed to resend OTP.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="min-h-screen bg-light-purple-gradient px-4"
    >
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="absolute top-4 right-4 lg:top-9 lg:right-9">
          <Image src={Logo} alt="Magnum Logo" width={100} height={100} />
        </div>

        <h2 className="text-2xl lg:text-5xl font-bold text-black mb-10">
          Verify OTP
        </h2>

        <p className="text-lg text-gray-500 mb-8 text-center">
          Enter the 6-digit code sent to {email || 'your email'}.
        </p>

        {/* OTP Input Section */}
        <div className="flex space-x-4 mb-8">
          {otp.map((digit, index) => (
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
              className="w-12 h-12 md:w-16 md:h-16 text-2xl md:text-3xl text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              autoFocus={index === 0}
              required
              aria-label={`OTP digit ${index + 1}`}
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
            />
          ))}
        </div>

        <CustomButton
          type="submit"
          className="w-full max-w-[480px] mb-6"
          text={isVerifying ? 'Verifying...' : 'Continue'}
          loading={isVerifying}
        />

        <button
          type="button"
          onClick={handleResendCode}
          disabled={!email || isResending || resendCooldown > 0}
          className="text-black font-medium hover:underline disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isResending
            ? 'Resending...'
            : resendCooldown > 0
              ? `Resend Code (${resendCooldown}s)`
              : 'Resend Code'}
        </button>
      </div>
    </form>
  );
};

export default VerifyOTP;
