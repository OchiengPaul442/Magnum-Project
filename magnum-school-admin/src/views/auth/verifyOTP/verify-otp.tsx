'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';

import Logo from '@public/assets/images/MAIN_LOGO.webp';
import { CustomButton } from '@components/shared';
import { handleResendOTP } from '@/app/server/actions';
import { useSession } from 'next-auth/react';

const VerifyOTP: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);

  // Refs for OTP inputs to manage focus
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Retrieve the pending email from sessionStorage
    const pendingEmail = sessionStorage.getItem('pendingEmail');
    if (pendingEmail) {
      setEmail(pendingEmail);
    } else {
      router.push('/sign-in');
    }
  }, [router]);

  useEffect(() => {
    // After successful sign-in, check first_time_login
    if (status === 'authenticated' && session) {
      if (session.user.first_time_login) {
        router.push('/create-password');
      } else {
        router.push('/dashboard');
      }
    }
  }, [status, session, router]);

  // Auto-submit when all fields are filled
  useEffect(() => {
    if (otp.every((digit) => digit !== '') && !loading) {
      // Short delay to ensure UI updates before submission
      const timer = setTimeout(() => {
        formRef.current?.dispatchEvent(
          new Event('submit', { cancelable: true, bubbles: true }),
        );
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [otp, loading]);

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
    console.log('Entered OTP:', otpCode);
    if (otpCode.length !== 6) {
      toast.error('Please enter the complete 6-digit code.');
      return;
    }

    setLoading(true);

    try {
      // Attempt to sign in with OTP
      const res = await signIn('credentials', {
        redirect: false,
        email,
        otp: otpCode,
      });

      setLoading(false);

      if (res?.error) {
        if (res.error === 'OTP_REQUIRED') {
          toast.error('OTP is required for sign-in.');
        } else {
          toast.error(res.error);
        }
      }
      // On success, redirection will be handled by useEffect based on session
    } catch (err: any) {
      setLoading(false);
      toast.error(err.message || 'An unexpected error occurred.');
    }
  };

  const handleResendCode = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const response = await handleResendOTP(email, 'login');

      if (response.status === 200 || response.status === 201) {
        toast.success(response.message || 'OTP for login sent successfully.');
      } else {
        toast.error(response.message || 'Failed to resend OTP.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
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
          Enter the 6-digit code that has been sent to your email
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
            />
          ))}
        </div>

        <CustomButton
          type="submit"
          className="w-full max-w-[480px] mb-6"
          text={loading ? 'Verifying...' : 'Continue'}
          loading={loading}
        />

        <button
          type="button"
          onClick={handleResendCode}
          className="text-black font-medium hover:underline"
        >
          Resend Code
        </button>
      </div>
    </form>
  );
};

export default VerifyOTP;
