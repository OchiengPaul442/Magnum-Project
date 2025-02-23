'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { SearchInput } from '@/components/shared';
import { RiMenu2Fill } from 'react-icons/ri';
import { AddStudentDialog } from '../dialogs/add-student-dialog';
import { AddVendorDialog } from '../dialogs/add-vendor-dialog';
import { toggleSidebar } from '@/redux-store/slices/sidebarSlice';
import { useDispatch } from '@/redux-store/hooks';

interface TopbarProps {
  showAddButton?: boolean;
}

const Topbar: React.FC<TopbarProps> = ({ showAddButton = true }) => {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const isVendorsRoute = pathname.startsWith('/vendors');

  return (
    <div className="bg-white">
      <div className="flex items-center px-6 py-5 justify-between w-full max-w-7xl mx-auto">
        {/* Mobile Menu Trigger */}
        <button
          type="button"
          onClick={() => dispatch(toggleSidebar())}
          className="lg:hidden"
        >
          <RiMenu2Fill size={30} color="#553C9A" className="mr-3" />
        </button>

        {/* Search Input Field (hidden on small screens) */}
        <SearchInput
          placeholder="Search for students"
          className="lg:flex flex-1 mr-4 w-full max-w-[800px] hidden"
        />

        {/* Add Student or Vendor Dialog Trigger */}
        {showAddButton && !isVendorsRoute && <AddStudentDialog />}
        {isVendorsRoute && <AddVendorDialog />}
      </div>
    </div>
  );
};

export default Topbar;
