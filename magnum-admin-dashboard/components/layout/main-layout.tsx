"use client";

import React, { useState } from "react";

import MobileSidebar from "@/components/layout/mobile-sidebar";
import AppFooter from "@/components/layout/app-footer";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[#F6F5FA] text-foreground">
      <Sidebar />
      <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex-1">{children}</div>
            <AppFooter />
          </div>
        </div>
      </main>
    </div>
  );
}
