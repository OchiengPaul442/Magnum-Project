"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import SearchInput from "@/components/shared/search-input";

interface TopbarProps {
  onMenuClick: () => void;
  collapsed: boolean;
  onCollapseToggle: () => void;
}

export default function Topbar({
  onMenuClick,
  collapsed,
  onCollapseToggle,
}: TopbarProps) {
  return (
    <div className="flex h-16 items-center gap-3 border-b border-border/60 bg-white px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:inline-flex hover:bg-[#18806B] hover:text-white transition-colors"
          onClick={onCollapseToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>

        <p className="min-w-0 truncate text-sm font-semibold text-foreground sm:text-base lg:text-lg">
          Admin Dashboard
        </p>
      </div>

      <div className="ml-auto flex w-full max-w-xl items-center justify-end">
        <SearchInput
          placeholder="search for students"
          className="w-full bg-white"
        />
      </div>
    </div>
  );
}
