import type { ChildrenType } from '@core/types';

// Component Imports
import AuthGuard from '@/hocs/AuthGuard';
import Provider from '@/components/Provider';
import { StudentsProvider } from '@/contexts/StudentsContext';

const Layout = async (props: ChildrenType) => {
  const { children } = props;

  return (
    <Provider>
      <StudentsProvider>
        <AuthGuard>{children}</AuthGuard>
      </StudentsProvider>
    </Provider>
  );
};

export default Layout;
