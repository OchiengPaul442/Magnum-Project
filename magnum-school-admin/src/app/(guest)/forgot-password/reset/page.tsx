import type { Metadata } from 'next';
import ResetPasswordForm from '@/features/auth/forgotPwd/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Set a new password for your Magnum School Admin account.',
};

const page = () => {
  return <ResetPasswordForm />;
};

export default page;
