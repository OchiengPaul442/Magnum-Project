'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Logo from '@public/assets/images/MAIN_LOGO.webp';
import { CustomInputField, Button } from '@components/ui';

const SignInForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    console.log('Email:', email);
    console.log('Password:', password);
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-light-purple-gradient px-4">
      <div className="mb-4">
        <Image src={Logo} alt="Magnum Logo" width={80} height={80} />
      </div>

      <h2 className="text-2xl font-medium text-purple-700 mb-6">
        School Admin
      </h2>

      {/* Form Section */}
      <div className="w-full max-w-md space-y-8 bg-none p-8">
        <CustomInputField
          label="Enter school admin email address"
          type="text"
          placeholder="placeholder"
          value={email}
          onChange={setEmail}
          clearable
        />

        <CustomInputField
          label="Enter password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={setPassword}
          clearable
        />

        <Button
          type="button"
          onClick={() => handleSubmit()}
          className="w-full py-3 bg-purple-700 text-white rounded-full hover:bg-purple-800 transition duration-200 mt-4"
        >
          Log In
        </Button>
      </div>
    </div>
  );
};

export default SignInForm;
