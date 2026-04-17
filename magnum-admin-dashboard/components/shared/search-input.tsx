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
        "flex items-center rounded-full border border-border/60 bg-card px-4 py-2 shadow-sm transition-colors focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10",
        className,
      )}
    >
      <Search className="mr-2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="flex-grow bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
      />
    </div>
  );
};

export default SearchInput;
