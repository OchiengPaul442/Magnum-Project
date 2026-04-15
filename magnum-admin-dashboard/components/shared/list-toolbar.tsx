import React from "react";

import SearchInput from "@/components/shared/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ListToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  children?: React.ReactNode;
}

export default function ListToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  children,
}: ListToolbarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex-1">
        <SearchInput
          placeholder="Search"
          value={search}
          onChange={onSearchChange}
          className="max-w-md bg-white"
        />
      </div>
      <div className="flex items-center gap-3">
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Activated</SelectItem>
            <SelectItem value="inactive">Deactivated</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        {children}
      </div>
    </div>
  );
}
