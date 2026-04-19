import type { Metadata } from 'next';
import EnterEmailForm from '@/features/auth/forgotPwd/EmailForm';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Request a password reset for your Magnum School Admin account.',
};

const page = () => {
  return (
    <div>
      <EnterEmailForm />
    </div>
  );
};

export default page;
