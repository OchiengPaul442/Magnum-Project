import type { Metadata } from 'next';
import VerifyOTP from '@/features/auth/verifyOTP/verify-otp';

export const metadata: Metadata = {
  title: 'Verify OTP',
  description: 'Verify your one-time password to access Magnum School Admin.',
};

const page = () => {
  return <VerifyOTP />;
};

export default page;
