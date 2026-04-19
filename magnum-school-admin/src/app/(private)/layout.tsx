import type { ChildrenType } from '@/types/shared';

// Component Imports
import AppProviders from '@/providers/AppProviders';
import AuthGuard from '@/guards/AuthGuard';
import MainLayout from '@/components/layouts/MainLayout';

const Layout = async (props: ChildrenType) => {
  const { children } = props;

  return (
    <AppProviders>
      <AuthGuard>
        <MainLayout>{children}</MainLayout>
      </AuthGuard>
    </AppProviders>
  );
};

export default Layout;
