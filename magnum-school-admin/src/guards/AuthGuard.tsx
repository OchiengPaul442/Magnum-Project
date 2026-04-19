// Third-party Imports
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Type Imports
import type { ChildrenType } from '@/types/shared';

// Component Imports
import AuthRedirect from '@/components/AuthRedirect';

export default async function AuthGuard({ children }: ChildrenType) {
  const session = await getServerSession(authOptions);

  if (!session || (session as any).error) {
    return <AuthRedirect />;
  }

  return <>{children}</>;
}
