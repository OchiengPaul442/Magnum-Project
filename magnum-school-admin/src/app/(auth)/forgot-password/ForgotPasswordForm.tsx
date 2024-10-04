'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Logo from '@public/assets/images/MAIN_LOGO.webp';
import { CustomButton } from '@components/ui';
import { motion } from 'framer-motion';

const ForgotPasswordForm = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Allow only a single character

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input if a digit is entered
    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    } else if (!value && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleSubmit = () => {
    const otpCode = otp.join('');
    console.log('Entered OTP:', otpCode);
    if (otpCode.length === 4) {
      router.push('/dashboard');
    } else {
      alert('Please enter the complete 4-digit code.');
    }
  };

  const handleResendCode = () => {
    alert('Code resent to your email address.');
  };

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center min-h-screen bg-light-purple-gradient px-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
    >
      <div className="absolute top-4 right-4 lg:top-9 lg:right-9">
        <Image src={Logo} alt="Magnum Logo" width={100} height={100} />
      </div>

      <h2 className="text-2xl lg:text-5xl font-bold text-black mb-10">
        Forgot password
      </h2>

      <p className="text-lg text-gray-500 mb-8 text-center">
        Enter the 4-digit code that has been sent to your email
      </p>

      {/* OTP Input Section */}
      <div className="flex space-x-6 mb-8">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-16 h-16 md:w-28 md:h-28 text-4xl text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        ))}
      </div>

      <CustomButton
        type="button"
        onClick={handleSubmit}
        className="w-full max-w-[480px] mb-6"
        text="continue"
        loading={false}
      />

      <button
        type="button"
        onClick={handleResendCode}
        className="text-black font-medium hover:underline"
      >
        Resend code
      </button>
    </motion.div>
  );
};

export default ForgotPasswordForm;
