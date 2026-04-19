import type { Metadata } from 'next';
import SignInForm from '@/features/auth/signin/SignInForm';

export const metadata: Metadata = {
  title: 'Sign In',
  description:
    'Sign in to Magnum School Admin to manage your school dashboard.',
};

const page = () => {
  return (
    <div>
      <SignInForm />
    </div>
  );
};

export default page;
