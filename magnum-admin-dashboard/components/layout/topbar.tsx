"use client";

import React from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import SearchInput from "@/components/shared/search-input";

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <div className="flex h-16 items-center gap-3 border-0 bg-white px-4 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="ml-auto flex w-full max-w-xl items-center justify-end">
        <SearchInput
          placeholder="search for students"
          className="w-full bg-white"
        />
      </div>
    </div>
  );
}
