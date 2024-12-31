'use client';

// Next.js Imports
import { redirect, usePathname } from 'next/navigation';

const AuthRedirect = () => {
  const pathname = usePathname();

  // Define the login URL
  const loginUrl = '/sign-in';

  // Determine the redirect URL
  const redirectUrl = `${loginUrl}?redirectTo=${pathname}`;

  // Redirect logic
  return redirect(pathname === loginUrl ? loginUrl : redirectUrl);
};

export default AuthRedirect;
