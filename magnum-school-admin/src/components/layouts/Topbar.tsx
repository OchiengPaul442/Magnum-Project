'use client';

import React from 'react';
import { SearchInput } from '@/components/shared';
import { RiMenu2Fill } from 'react-icons/ri';
import { AddStudentDialog } from '../dialogs/add-student-dialog';

interface TopbarProps {
  showAddButton?: boolean;
}

const Topbar: React.FC<TopbarProps> = ({ showAddButton = true }) => {
  return (
    <div className="bg-white">
      <div className="flex items-center px-6 py-5 justify-between w-full max-w-7xl mx-auto">
        <button
          type="button"
          onClick={() => console.log('Open Menu')}
          className="lg:hidden"
        >
          <RiMenu2Fill size={30} color="#553C9A" className="mr-3" />
        </button>

        {/* Search Input Field */}
        <SearchInput
          placeholder="Search for students"
          className="lg:flex flex-1 mr-4 w-full max-w-[800px] hidden"
        />

        {/* Add Student Dialog Trigger */}
        {showAddButton && <AddStudentDialog />}
      </div>
    </div>
  );
};

export default Topbar;
