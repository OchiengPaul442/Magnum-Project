import type { ChildrenType } from '@core/types';

// Component Imports
import AuthGuard from '@/hocs/AuthGuard';
import Provider from '@/components/Provider';

const Layout = async (props: ChildrenType) => {
  const { children } = props;

  return (
    <Provider>
      <AuthGuard>{children}</AuthGuard>
    </Provider>
  );
};

export default Layout;
