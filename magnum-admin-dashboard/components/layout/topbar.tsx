"use client";

import React from "react";
import { Menu, UserCircle2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import SearchInput from "@/components/shared/search-input";

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { profile, logout } = useAuth();
  const displayName =
    (profile?.first_name as string) ||
    (profile?.firstname as string) ||
    (profile?.email as string) ||
    "Admin";

  return (
    <div className="sticky top-0 z-30 w-full border-b border-border bg-white/95 backdrop-blur">
      <div className="flex flex-col gap-4 px-6 py-4 max-w-7xl mx-auto lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Magnum Admin
            </p>
            <p className="text-lg font-semibold text-foreground">
              Dashboard Control Center
            </p>
          </div>
        </div>
        <div className="w-full lg:max-w-xl">
          <SearchInput
            placeholder="search for students"
            className="bg-white shadow-sm"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <UserCircle2 className="h-5 w-5 text-purple-700" />
              <span className="text-sm font-medium text-foreground">
                {displayName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem disabled>Signed in</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => void logout()}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
