'use client';
import { NextAuthProvider } from '@/contexts/nextAuthProvider';
import { store } from '@/redux-store/store';
import { Provider as ReduxProvider } from 'react-redux';

const Provider = (props: any) => {
  // Props
  const { children } = props;

  return (
    <NextAuthProvider basePath={process.env.NEXTAUTH_BASEPATH}>
      <ReduxProvider store={store}>{children}</ReduxProvider>
    </NextAuthProvider>
  );
};

export default Provider;
