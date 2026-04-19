import type { Metadata } from 'next';

import SettingsPage from '@/features/settings/SettingsPage';

export const metadata: Metadata = {
  title: 'Settings',
  description:
    'Manage account and application settings in Magnum School Admin.',
};
const page = () => {
  return <SettingsPage />;
};

export default page;
