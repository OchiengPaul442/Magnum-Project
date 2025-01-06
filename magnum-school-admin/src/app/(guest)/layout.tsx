// Type Imports
import type { ChildrenType } from '@core/types';

// HOC Imports
import GuestOnlyRoute from '@hocs/GuestOnlyRoute';
import Provider from '@/components/Provider';

const Layout = async (props: ChildrenType) => {
  const { children } = props;

  return (
    <Provider>
      <GuestOnlyRoute>{children}</GuestOnlyRoute>
    </Provider>
  );
};

export default Layout;
