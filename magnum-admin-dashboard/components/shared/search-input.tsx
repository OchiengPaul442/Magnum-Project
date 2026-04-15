import React from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search...",
  className = "",
  value,
  onChange,
}) => {
  return (
    <div
      className={cn(
        "flex items-center border border-gray-300 rounded-full px-4 py-2",
        className,
      )}
    >
      <Search className="text-gray-400 mr-2 h-4 w-4" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="flex-grow bg-transparent focus:outline-none text-gray-700"
      />
    </div>
  );
};

export default SearchInput;
