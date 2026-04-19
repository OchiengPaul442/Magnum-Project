'use client';

import React from 'react';
import { useEffect, useRef, useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileSidebar from './MobileSidebar';
import UserProfileBootstrap from '@/components/UserProfileBootstrap';

interface MainLayoutProps {
  children: React.ReactNode;
  showAddButton?: boolean;
}

const SIDEBAR_COLLAPSED_KEY = 'magnum_school_sidebar_collapsed';

const MainLayout: React.FC<MainLayoutProps> = ({ children, showAddButton }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sidebarHydrated = useRef(false);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY);

    if (storedValue !== null) {
      setSidebarCollapsed(storedValue === 'true');
    }

    sidebarHydrated.current = true;
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
    <div className="flex h-[100dvh] overflow-hidden bg-[#FCFBFA] text-foreground">
      <UserProfileBootstrap />
      <Sidebar collapsed={sidebarCollapsed} />

      <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar
          showAddButton={showAddButton}
          collapsed={sidebarCollapsed}
          onMenuClick={() => setMobileOpen(true)}
          onCollapseToggle={() => setSidebarCollapsed((value) => !value)}
        />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col px-4 pt-4 pb-2 sm:px-6 lg:px-8">
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
