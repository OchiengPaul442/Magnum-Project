"use client";

import React, { useEffect, useRef, useState } from "react";

import MobileSidebar from "@/components/layout/mobile-sidebar";
import AppFooter from "@/components/layout/app-footer";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";

const SIDEBAR_COLLAPSED_KEY = "magnum_sidebar_collapsed";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sidebarHydrated = useRef(false);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (storedValue === null) {
      sidebarHydrated.current = true;
      return;
    }

    window.requestAnimationFrame(() => {
      sidebarHydrated.current = true;
      setSidebarCollapsed(storedValue === "true");
    });
  }, []);

  useEffect(() => {
    if (!sidebarHydrated.current) {
      return;
    }

    window.localStorage.setItem(
      SIDEBAR_COLLAPSED_KEY,
      String(sidebarCollapsed),
    );
  }, [sidebarCollapsed]);

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[#F6F5FA] text-foreground">
      <Sidebar collapsed={sidebarCollapsed} />
      <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar
          collapsed={sidebarCollapsed}
          onMenuClick={() => setMobileOpen(true)}
          onCollapseToggle={() => setSidebarCollapsed((value) => !value)}
        />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex-1">{children}</div>
            <AppFooter className="mt-auto" />
          </div>
        </div>
      </main>
    </div>
  );
}
