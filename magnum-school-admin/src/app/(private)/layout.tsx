import type { ChildrenType } from '@core/types';

// Component Imports
import Provider from '@/components/Provider';
import AuthGuard from '@/@core/hocs/AuthGuard';

const Layout = async (props: ChildrenType) => {
  const { children } = props;

  return (
    <Provider>
      <AuthGuard>{children}</AuthGuard>
    </Provider>
  );
};

export default Layout;
