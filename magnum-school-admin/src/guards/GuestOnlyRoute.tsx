// Next Imports
import { redirect } from 'next/navigation';

// Third-party Imports
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Type Imports
import type { ReactNode } from 'react';

interface GuestOnlyRouteProps {
  children: ReactNode;
}

const GuestOnlyRoute = async ({ children }: GuestOnlyRouteProps) => {
  const session = await getServerSession(authOptions);

  if (session && !(session as any).error) {
    redirect('/dashboard');
  }

  return <>{children}</>;
};

export default GuestOnlyRoute;
