"use client";

import React, { useState } from "react";

import MobileSidebar from "@/components/layout/mobile-sidebar";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#F6F5FA] overflow-hidden">
      <Sidebar />
      <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <div className="px-6 py-6 w-full max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
