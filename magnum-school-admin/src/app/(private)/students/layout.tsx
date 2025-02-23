import type { ChildrenType } from '@core/types';
import { StudentsProvider } from '@/contexts/StudentsContext';

const Layout = async (props: ChildrenType) => {
  const { children } = props;

  return <StudentsProvider>{children}</StudentsProvider>;
};

export default Layout;
