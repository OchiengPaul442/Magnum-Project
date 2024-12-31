import { NextAuthProvider } from '@/contexts/nextAuthProvider';

const Provider = (props: any) => {
  // Props
  const { children } = props;

  return (
    <NextAuthProvider basePath={process.env.NEXTAUTH_BASEPATH}>
      {children}
    </NextAuthProvider>
  );
};

export default Provider;
