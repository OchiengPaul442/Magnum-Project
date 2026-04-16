"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Settings } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import Brand from "@/components/layout/brand";
import { NAV_SECTIONS } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SidebarProps {
  mobile?: boolean;
  collapsed?: boolean;
}

export default function Sidebar({
  mobile = false,
  collapsed = false,
}: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const profile = session?.user;
  const isCollapsed = !mobile && collapsed;
  const resolvedName =
    profile?.name ||
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ");
  const displayName = resolvedName?.trim() || profile?.email || "Admin";
  const email = profile?.email ?? "admin@magnum.app";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const navItemClassName = (active: boolean) =>
    cn(
      "group flex items-center text-sm font-medium transition-colors",
      isCollapsed
        ? "mx-auto h-11 w-11 justify-center rounded-2xl px-0"
        : "gap-3 rounded-xl px-3 py-2.5",
      active
        ? "bg-[#f0eef8] text-[#0f766e] shadow-sm"
        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
    );

  const navIconClassName = (active: boolean) =>
    cn(
      "h-4 w-4 shrink-0 transition-colors",
      active
        ? "text-[#0f766e]"
        : "text-muted-foreground group-hover:text-foreground",
    );

  const navLink = (
    href: string,
    label: string,
    Icon: React.ElementType,
    active: boolean,
    key: string,
  ) => {
    const content = (
      <Link
        key={key}
        href={href}
        aria-label={label}
        title={isCollapsed ? label : undefined}
        className={navItemClassName(active)}
      >
        <Icon className={navIconClassName(active)} />
        {!isCollapsed ? <span>{label}</span> : null}
      </Link>
    );

    if (!isCollapsed) {
      return content;
    }

    return (
      <Tooltip key={key}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  };

  return (
    <aside
      className={cn(
        "flex h-full flex-col bg-white text-foreground transition-[width] duration-200 ease-out",
        mobile
          ? "w-full"
          : isCollapsed
            ? "hidden w-20 shrink-0 lg:flex"
            : "hidden w-72 shrink-0 lg:flex",
      )}
    >
      <div className={cn("flex-none px-4 py-5", isCollapsed && "px-2")}>
        {/* Brand */}
        <Brand
          collapsed={isCollapsed}
          className={cn(isCollapsed && "justify-center")}
        />
      </div>

      <div
        className={cn(
          "min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-2",
          isCollapsed && "px-2",
        )}
      >
        {NAV_SECTIONS.map((section) => (
          <div
            key={section.label}
            className={cn("space-y-2 py-3 first:pt-0", isCollapsed && "py-2")}
          >
            {!isCollapsed ? (
              <p className="px-3 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {section.label}
              </p>
            ) : null}
            <nav className="flex flex-col gap-1">
              {section.items.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return navLink(
                  item.href,
                  item.label,
                  item.icon,
                  isActive,
                  item.href,
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className={cn("flex-none px-4 pb-4 pt-2", isCollapsed && "px-2")}>
        <div className="space-y-3">
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/account"
                  aria-label="Account & Security"
                  className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-muted/40 text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
                >
                  <Settings className="h-4 w-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Account & Security</TooltipContent>
            </Tooltip>
          ) : (
            <Link
              href="/account"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          )}

          <div
            className={cn(
              "flex items-center justify-between rounded-2xl bg-muted/35 px-3 py-3",
              isCollapsed && "justify-center px-2 py-2",
            )}
          >
            <div
              className={cn(
                "flex min-w-0 items-center gap-3",
                isCollapsed && "gap-0",
              )}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="h-10 w-10">
                    {profile?.image ? (
                      <AvatarImage src={profile.image} alt={displayName} />
                    ) : null}
                    <AvatarFallback className="bg-white text-sm font-semibold text-foreground">
                      {initials || "A"}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <div className="space-y-0.5">
                    <p className="font-medium">{displayName}</p>
                    <p className="opacity-80">{email}</p>
                  </div>
                </TooltipContent>
              </Tooltip>

              {!isCollapsed ? (
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {displayName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {email}
                  </p>
                </div>
              ) : null}
            </div>

            <AlertDialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      aria-label="Log out"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent side="right">Log out</TooltipContent>
              </Tooltip>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Log out?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be signed out of your admin session on this device.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className={buttonVariants({ variant: "destructive" })}
                    onClick={() => void signOut({ callbackUrl: "/login" })}
                  >
                    Log out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </aside>
  );
}
