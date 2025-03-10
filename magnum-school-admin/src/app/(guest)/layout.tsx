// Type Imports
import type { ChildrenType } from '@core/types';

// HOC Imports
import Provider from '@/components/Provider';
import GuestOnlyRoute from '@/@core/hocs/GuestOnlyRoute';

const Layout = async (props: ChildrenType) => {
  const { children } = props;

  return (
    <Provider>
      <GuestOnlyRoute>{children}</GuestOnlyRoute>
    </Provider>
  );
};

export default Layout;
