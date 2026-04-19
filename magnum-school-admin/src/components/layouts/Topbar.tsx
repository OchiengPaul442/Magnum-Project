'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { RiMenu2Fill } from 'react-icons/ri';

import { SearchInput } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { AddStudentDialog } from '../dialogs/add-student-dialog';
import { AddVendorDialog } from '../dialogs/add-vendor-dialog';

interface TopbarProps {
  showAddButton?: boolean;
  collapsed: boolean;
  onMenuClick: () => void;
  onCollapseToggle: () => void;
}

const Topbar: React.FC<TopbarProps> = ({
  showAddButton = true,
  collapsed,
  onMenuClick,
  onCollapseToggle,
}) => {
  const pathname = usePathname();

  const isVendorsRoute = pathname.startsWith('/vendors');

  return (
    <div className="border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <RiMenu2Fill className="h-5 w-5" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="hidden lg:inline-flex"
          onClick={onCollapseToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <FiChevronRight className="h-5 w-5" />
          ) : (
            <FiChevronLeft className="h-5 w-5" />
          )}
        </Button>

        <SearchInput
          placeholder="Search for students"
          className="hidden w-full max-w-[800px] flex-1 lg:flex"
        />

        <div className="ml-auto flex items-center gap-3">
          {showAddButton && !isVendorsRoute && <AddStudentDialog />}
          {isVendorsRoute && <AddVendorDialog />}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
