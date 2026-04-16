"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Settings } from "lucide-react";

import Brand from "@/components/layout/brand";
import { NAV_SECTIONS } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/components/providers/auth-provider";

interface SidebarProps {
  mobile?: boolean;
}

export default function Sidebar({ mobile = false }: SidebarProps) {
  const pathname = usePathname();
  const { logout, profile } = useAuth();
  const displayName =
    (profile?.first_name as string) ||
    (profile?.firstname as string) ||
    (profile?.email as string) ||
    "Admin";
  const email = (profile?.email as string) || "admin@magnum.app";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside
      className={cn(
        "flex h-full flex-col bg-white text-foreground",
        mobile ? "w-full" : "hidden w-72 shrink-0 lg:flex",
      )}
    >
      <div className="flex-none px-5 py-5">
        <Brand />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-2">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="space-y-2 py-3 first:pt-0">
            <p className="px-3 text-xs uppercase tracking-[0.24em] text-muted-foreground">
              {section.label}
            </p>
            <nav className="flex flex-col gap-1">
              {section.items.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-[#f0eef8] text-[#0f766e]"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        isActive ? "text-[#0f766e]" : "text-muted-foreground",
                      )}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
      <div className="flex-none px-4 pb-4 pt-2">
        <div className="space-y-3">
          <Link
            href="/account"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>

          <div className="flex items-center justify-between rounded-2xl bg-muted/40 px-3 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-white text-sm font-semibold text-foreground">
                  {initials || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {displayName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {email}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => void logout()}
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
