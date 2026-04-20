import React from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

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
        "flex w-full items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1.5 shadow-sm transition-colors focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10",
        className,
      )}
    >
      <Search className="ml-1 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        clearable
        wrapperClassName="min-w-0 flex-1"
        className="h-8 w-full border-0 bg-transparent px-0 text-sm placeholder:text-muted-foreground focus:outline-none focus-visible:!ring-0 focus-visible:!border-transparent"
      />
    </div>
  );
};

export default SearchInput;
