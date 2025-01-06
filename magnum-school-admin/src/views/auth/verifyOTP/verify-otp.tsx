// pages/verify-otp.tsx

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Logo from '@public/assets/images/MAIN_LOGO.webp';
import { CustomButton } from '@components/shared';
import { signIn } from 'next-auth/react';
import { handleResendOTP } from '@/app/server/actions';
import { useSession } from 'next-auth/react';

const VerifyOTP: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const otpCode = otp.join(''); // "123456"
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit code.');
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
        // e.g. 'Invalid OTP' or 'OTP_REQUIRED'
        if (res.error === 'OTP_REQUIRED') {
          setError('OTP is required for sign-in.');
        } else {
          setError(res.error);
        }
      }
      // Successful sign-in will be handled by useEffect
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'An unexpected error occurred.');
    }
  };

  const handleResendCode = async () => {
    if (!email) return;
    setLoading(true);
    setError(null);
    const purpose = 'login';

    try {
      const response = await handleResendOTP(email, purpose);

      if (response.status === 200 || response.status === 201) {
        alert(response.message || 'OTP for login sent successfully.');
      } else {
        setError(response.message || 'Failed to resend OTP.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
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
              ref={(el: any) => (inputRefs.current[index] = el)}
              className="w-12 h-12 md:w-16 md:h-16 text-2xl md:text-3xl text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              autoFocus={index === 0}
              required
            />
          ))}
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center mb-4">{error}</div>
        )}

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
