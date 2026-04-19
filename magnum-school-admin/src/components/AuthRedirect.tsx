'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const AuthRedirect = () => {
  const pathname = usePathname();
  const router = useRouter();

  // Define the login URL
  const loginUrl = '/sign-in';

  // Determine the redirect URL
  const redirectUrl = `${loginUrl}?callbackUrl=${encodeURIComponent(pathname)}`;

  useEffect(() => {
    router.replace(pathname === loginUrl ? loginUrl : redirectUrl);
  }, [pathname, loginUrl, redirectUrl, router]);

  return null;
};

export default AuthRedirect;
