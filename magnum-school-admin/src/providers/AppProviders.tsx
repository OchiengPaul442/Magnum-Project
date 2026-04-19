'use client';

import type { ReactNode } from 'react';
import { NextAuthProvider } from '@/providers/NextAuthProvider';

interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => {
  return <NextAuthProvider>{children}</NextAuthProvider>;
};

export default AppProviders;
