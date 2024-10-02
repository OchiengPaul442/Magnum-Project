'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Logo from '@public/assets/images/MAIN_LOGO.png';
import { Button } from '@components/ui';

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
      // Move focus to the previous input if the current one is cleared
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
      // Move focus to the previous input on backspace if the current field is empty
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
      router.push('/reset-password');
    } else {
      alert('Please enter the complete 4-digit code.');
    }
  };

  const handleResendCode = () => {
    alert('Code resent to your email address.');
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-light-purple-gradient px-4">
      {/* Logo Section at Top Right */}
      <div className="absolute top-4 right-4">
        <Image src={Logo} alt="Magnum Logo" width={100} height={100} />
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold text-purple-800 mb-6">
        Forgot password
      </h2>

      {/* Description */}
      <p className="text-lg text-gray-600 mb-8 text-center">
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
            className="w-20 h-20 text-4xl text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        ))}
      </div>

      {/* Continue Button */}
      <Button
        type="button"
        onClick={handleSubmit}
        className="w-full max-w-md py-4 bg-purple-700 text-white rounded-full hover:bg-purple-800 transition duration-200 mb-4"
      >
        Continue
      </Button>

      {/* Resend Code Link */}
      <button
        type="button"
        onClick={handleResendCode}
        className="text-black font-medium hover:underline"
      >
        Resend code
      </button>
    </div>
  );
};

export default ForgotPasswordForm;
