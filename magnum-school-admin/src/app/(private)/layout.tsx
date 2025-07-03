import type { ChildrenType } from '@core/types';

// Component Imports
import Provider from '@/components/Provider';
import AuthGuard from '@/@core/hocs/AuthGuard';
import MainLayout from '@/components/layouts/MainLayout';

const Layout = async (props: ChildrenType) => {
  const { children } = props;

  return (
    <Provider>
      <AuthGuard>
        <MainLayout>{children}</MainLayout>
      </AuthGuard>
    </Provider>
  );
};

export default Layout;
