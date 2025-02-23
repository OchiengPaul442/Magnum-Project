import { VendorsProvider } from '@/contexts/VendorsContext';
import type { ChildrenType } from '@core/types';

const Layout = async (props: ChildrenType) => {
  const { children } = props;

  return <VendorsProvider>{children}</VendorsProvider>;
};

export default Layout;
