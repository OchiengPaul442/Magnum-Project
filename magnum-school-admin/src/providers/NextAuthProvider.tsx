'use client';

import { SessionProvider } from 'next-auth/react';
import type { SessionProviderProps } from 'next-auth/react';

export const NextAuthProvider = ({
  children,
  ...rest
}: SessionProviderProps) => {
  return (
    <SessionProvider
      {...rest}
      refetchInterval={0}
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  );
};
