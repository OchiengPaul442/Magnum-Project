'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Logo from '@public/assets/images/MAIN_LOGO.webp';
import { CustomInputField, CustomButton } from '@components/ui';

const CreatePasswordForm = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    if (newPassword === confirmPassword) {
      console.log('Password successfully created');
      router.push('/dashboard');
    } else {
      alert('Passwords do not match. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-light-purple-gradient px-4">
      <div className="mb-4">
        <Image src={Logo} alt="Magnum Logo" width={80} height={80} />
      </div>

      <h2 className="text-2xl font-medium text-purple-700 mb-6">
        Create new password
      </h2>

      {/* Form Section */}
      <div className="w-full max-w-md space-y-8 p-8">
        {/* New Password Input */}
        <CustomInputField
          label="Create new password"
          type="password"
          placeholder="••••••••"
          value={newPassword}
          onChange={setNewPassword}
          clearable
        />

        {/* Confirm Password Input */}
        <CustomInputField
          label="Confirm new password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={setConfirmPassword}
          clearable
        />

        <CustomButton
          type="button"
          onClick={handleSubmit}
          className="w-full mt-4"
          text="continue"
        />
      </div>
    </div>
  );
};

export default CreatePasswordForm;
