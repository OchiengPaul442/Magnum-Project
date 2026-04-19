import type { Metadata } from 'next';
import VendorPage from '@/features/vendors/vendorPage';

export const metadata: Metadata = {
  title: 'Vendors',
  description:
    'Manage vendors and operators for your school with Magnum School Admin.',
};

const page = () => {
  return <VendorPage />;
};

export default page;
