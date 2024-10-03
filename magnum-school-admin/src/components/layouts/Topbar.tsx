'use client';
import React from 'react';
import { CustomButton, SearchInput } from '@components/ui';
import { FiPlus } from 'react-icons/fi';

interface TopbarProps {
  showAddButton?: boolean;
}

const Topbar: React.FC<TopbarProps> = ({ showAddButton = true }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white">
      {/* Search Input Field */}
      <SearchInput
        placeholder="Search for students"
        className="flex-1 mr-4 w-full max-w-[800px]"
      />

      {/* Optional Add Student Button */}
      {showAddButton && (
        <CustomButton
          type="button"
          text="Add a student"
          icon={<FiPlus />}
          onClick={() => console.log('Add Student')}
          className="bg-purple-700 text-sm gap-4 text-white px-6 py-3 rounded-lg hover:bg-purple-800 transition duration-200 flex items-center"
        />
      )}
    </div>
  );
};

export default Topbar;
