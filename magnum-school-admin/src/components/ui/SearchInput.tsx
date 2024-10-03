import React from 'react';
import { cn } from '@/lib/utils';
import { FiSearch } from 'react-icons/fi';

interface SearchInputProps {
  placeholder?: string;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Search...',
  className = '',
}) => {
  return (
    <div
      className={cn(
        'flex items-center border border-gray-300 rounded-full px-4 py-2',
        className,
      )}
    >
      <FiSearch className="text-gray-400 mr-2" />
      <input
        type="text"
        placeholder={placeholder}
        className="flex-grow bg-transparent focus:outline-none text-gray-700"
      />
    </div>
  );
};

export default SearchInput;
