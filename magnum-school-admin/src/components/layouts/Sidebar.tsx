'use client';

import React from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation'; // Import useRouter to programmatically navigate
import Logo from '@public/assets/images/MAIN_LOGO.webp';
import {
  FaUserGraduate,
  FaStore,
  FaMoneyCheckAlt,
  FaCog,
  FaSignOutAlt,
  FaHome,
} from 'react-icons/fa';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  // Helper function to determine if the link is active
  const isActive = (path: string) => pathname === path;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaHome /> },
    { name: 'Students', path: '/students', icon: <FaUserGraduate /> },
    { name: 'Vendors', path: '/vendors', icon: <FaStore /> },
    { name: 'Transactions', path: '/transactions', icon: <FaMoneyCheckAlt /> },
    { name: 'Settings', path: '/settings', icon: <FaCog /> },
    { name: 'Log out', path: '/logout', icon: <FaSignOutAlt /> },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="w-64 h-screen bg-white p-4 flex flex-col">
      {/* Logo Section */}
      <div className="flex items-center justify-start mb-8">
        <div
          onClick={() => handleNavigation('/dashboard')}
          className="cursor-pointer"
        >
          <Image
            src={Logo}
            alt="Magnum Logo"
            width={90}
            height={72}
            className="object-contain"
          />
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col space-y-2 flex-grow">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              type="button"
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-100 cursor-pointer ${
                active ? 'bg-gray-100' : ''
              }`}
            >
              <div className="mr-3">
                {React.cloneElement(item.icon, {
                  className: `w-5 h-5 ${
                    active ? 'text-green-700' : 'text-gray-500'
                  }`,
                })}
              </div>
              <span
                className={`font-medium text-base ${
                  active ? 'text-green-700' : 'text-gray-700'
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
