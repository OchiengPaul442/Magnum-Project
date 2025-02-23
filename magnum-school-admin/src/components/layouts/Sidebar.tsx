'use client';

import React from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@public/assets/images/MAIN_LOGO.webp';
import { FaCog } from 'react-icons/fa';
import { ImHome } from 'react-icons/im';
import { FaUsers } from 'react-icons/fa6';
import { MdSwitchAccount } from 'react-icons/md';
import { FiLogOut } from 'react-icons/fi';
import { MdCurrencyExchange } from 'react-icons/md';
import { signOut } from 'next-auth/react';
import themeConfig from '@/configs/themeConfig';

interface SidebarProps {
  mobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ mobile = false }) => {
  const pathname = usePathname();
  const router = useRouter();

  // Helper function to determine if the link is active
  const isActive = (path: string) => pathname.startsWith(path);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <ImHome /> },
    { name: 'Students', path: '/students', icon: <FaUsers /> },
    { name: 'Vendors', path: '/vendors', icon: <MdSwitchAccount /> },
    {
      name: 'Transactions',
      path: '/transactions',
      icon: <MdCurrencyExchange />,
    },
    { name: 'Settings', path: '/settings', icon: <FaCog /> },
    { name: 'Log out', action: 'logout', icon: <FiLogOut /> },
  ];

  const handleItemClick = (item: (typeof navItems)[number]) => {
    if (item.action === 'logout') {
      signOut({ callbackUrl: themeConfig.signOutUrl });
    } else if (item.path) {
      router.push(item.path);
    }
  };

  return (
    <div
      className={`bg-white h-full p-4 ${
        mobile ? 'w-full' : 'w-64 hidden lg:block'
      }`}
    >
      {/* Logo Section */}
      <div
        onClick={() => handleItemClick(navItems[0])}
        className="flex items-center justify-start mb-8 cursor-pointer"
      >
        <Image
          src={Logo}
          alt="Magnum Logo"
          width={90}
          height={72}
          className="object-contain"
          loading="eager"
        />
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col space-y-2 flex-grow">
        {navItems.map((item) => {
          const active = isActive(item.path || '');
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => handleItemClick(item)}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-100 cursor-pointer ${
                active ? 'bg-gray-100' : ''
              }`}
              aria-label={item.name}
            >
              <div className="mr-3">
                {React.cloneElement(item.icon, {
                  className: `w-5 h-5 ${active ? 'text-teal-700' : 'text-gray-500'}`,
                })}
              </div>
              <span
                className={`font-medium text-base ${
                  active ? 'text-teal-700' : 'text-gray-700'
                }`}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
