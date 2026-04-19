import type { Metadata } from 'next';
import CreatePasswordForm from '@/features/auth/createPassword/CreatePasswordForm';

export const metadata: Metadata = {
  title: 'Create Password',
  description:
    'Set your password to complete your Magnum School Admin account setup.',
};

const page = () => {
  return (
    <div>
      <CreatePasswordForm />
    </div>
  );
};

export default page;
