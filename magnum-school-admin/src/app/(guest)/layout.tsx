// Type Imports
import type { ChildrenType } from '@/types/shared';

// HOC Imports
import AppProviders from '@/providers/AppProviders';
import GuestOnlyRoute from '@/guards/GuestOnlyRoute';

const Layout = async (props: ChildrenType) => {
  const { children } = props;

  return (
    <AppProviders>
      <GuestOnlyRoute>{children}</GuestOnlyRoute>
    </AppProviders>
  );
};

export default Layout;
