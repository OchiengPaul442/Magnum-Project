import type { ChildrenType } from '@/types/shared';

const Layout = async (props: ChildrenType) => {
  const { children } = props;

  return <>{children}</>;
};

export default Layout;
