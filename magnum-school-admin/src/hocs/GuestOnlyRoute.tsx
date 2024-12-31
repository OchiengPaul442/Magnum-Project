// Next Imports
import { redirect } from 'next/navigation';

// Third-party Imports
import { getServerSession } from 'next-auth';

// Type Imports
import type { ReactNode } from 'react';

interface GuestOnlyRouteProps {
  children: ReactNode;
}

const GuestOnlyRoute = async ({ children }: GuestOnlyRouteProps) => {
  const session = await getServerSession();

  if (session) {
    redirect('/dashboard');
  }

  return <>{children}</>;
};

export default GuestOnlyRoute;
