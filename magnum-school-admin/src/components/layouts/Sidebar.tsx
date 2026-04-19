'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { FaCog } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa6';
import { FiLogOut } from 'react-icons/fi';
import { ImHome } from 'react-icons/im';
import { MdSwitchAccount } from 'react-icons/md';

import Logo from '@public/assets/images/MAIN_LOGO.webp';
import themeConfig from '@/config/theme';
import { handleLogout as handleLogoutRequest } from '@/services/auth/service';
import { normalizeUserProfile, getProfileInitials } from '@/lib/auth/profile';
import { useUserProfileStore } from '@/store/useUserProfileStore';
import { cn } from '@/lib/utils';
import { showErrorToast } from '@/lib/toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SidebarProps {
  mobile?: boolean;
  collapsed?: boolean;
  onNavigate?: () => void;
}

type NavIcon = React.ElementType<{ className?: string }>;

type NavItem = {
  name: string;
  path: string;
  icon: NavIcon;
};

const NAV_SECTIONS: Array<{
  label: string;
  items: NavItem[];
}> = [
  {
    label: 'Overview',
    items: [{ name: 'Dashboard', path: '/dashboard', icon: ImHome }],
  },
  {
    label: 'Records',
    items: [
      { name: 'Students', path: '/students', icon: FaUsers },
      { name: 'Vendors', path: '/vendors', icon: MdSwitchAccount },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({
  mobile = false,
  collapsed = false,
  onNavigate,
}) => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isCollapsed = !mobile && collapsed;
  const profileData = useUserProfileStore((state) => state.data);

  const profile = useMemo(
    () => normalizeUserProfile(profileData ?? session?.user),
    [profileData, session?.user],
  );
  const displayName = profile?.fullName || session?.user?.name || 'Admin';
  const email = profile?.email || session?.user?.email || 'admin@magnum.app';

  const initials = useMemo(
    () => getProfileInitials(profile ?? session?.user),
    [profile, session?.user],
  );

  const isActive = (path: string) => pathname.startsWith(path);

  const handleNavigate = () => {
    onNavigate?.();
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);

    try {
      await handleLogoutRequest();
    } catch (error: any) {
      showErrorToast(
        error?.statusMessage || error?.message || error,
        'Unable to log out of the server session.',
      );
    } finally {
      setLogoutDialogOpen(false);
      handleNavigate();
      void signOut({ callbackUrl: themeConfig.signOutUrl });
      setIsLoggingOut(false);
    }
  };

  const renderNavLink = (item: NavItem) => {
    const active = isActive(item.path);
    const Icon = item.icon;

    return (
      <div key={item.name} className="relative group">
        <Link
          href={item.path}
          onClick={handleNavigate}
          aria-label={item.name}
          aria-current={active ? 'page' : undefined}
          className={cn(
            'group flex items-center text-sm font-medium transition-colors',
            isCollapsed
              ? 'mx-auto h-11 w-11 justify-center rounded-2xl px-0'
              : 'gap-3 rounded-xl px-3 py-2.5',
            active
              ? 'bg-[#f0eef8] text-[#0f766e] shadow-sm'
              : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
          )}
        >
          <Icon
            className={cn(
              'h-4 w-4 shrink-0 transition-colors',
              active
                ? 'text-[#0f766e]'
                : 'text-muted-foreground group-hover:text-foreground',
            )}
          />
          {!isCollapsed ? <span>{item.name}</span> : null}
        </Link>

        {/* Collapsed tooltip */}
        {isCollapsed ? (
          <div
            role="tooltip"
            aria-hidden={!isCollapsed}
            className="sidebar-tooltip hidden group-hover:flex absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap items-center px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-sm text-gray-800 z-50"
          >
            {item.name}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-gray-200 bg-white text-foreground transition-[width] duration-200 ease-out',
        mobile
          ? 'w-full'
          : isCollapsed
            ? 'hidden w-20 shrink-0 lg:flex'
            : 'hidden w-72 shrink-0 lg:flex',
      )}
    >
      <div
        className={cn(
          'flex-none border-b border-gray-200 px-4 py-5',
          isCollapsed && 'px-3',
        )}
      >
        <Link
          href="/dashboard"
          onClick={handleNavigate}
          aria-label="Go to dashboard"
          className={cn(
            'flex items-center gap-3',
            isCollapsed && 'justify-center gap-0',
          )}
        >
          <Image
            src={Logo}
            alt="Magnum School Admin"
            width={isCollapsed ? 36 : 64}
            height={isCollapsed ? 28 : 48}
            className="h-auto w-auto object-contain"
            priority
          />
        </Link>
      </div>

      <div
        className={cn(
          'min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-2',
          isCollapsed && 'px-2',
        )}
      >
        {NAV_SECTIONS.map((section) => (
          <div
            key={section.label}
            className={cn('space-y-2 py-3 first:pt-0', isCollapsed && 'py-2')}
          >
            {!isCollapsed ? (
              <p className="px-3 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {section.label}
              </p>
            ) : null}
            <nav className="flex flex-col gap-1">
              {section.items.map((item) => renderNavLink(item))}
            </nav>
          </div>
        ))}
      </div>

      <div
        className={cn(
          'flex-none border-t border-gray-200 px-4 pb-4 pt-2',
          isCollapsed && 'px-2',
        )}
      >
        <div className="space-y-3">
          <Link
            href="/settings"
            onClick={handleNavigate}
            aria-label="Settings"
            title={isCollapsed ? 'Settings' : undefined}
            className={cn(
              'group flex items-center text-sm font-medium transition-colors',
              isCollapsed
                ? 'mx-auto h-11 w-11 justify-center rounded-2xl px-0'
                : 'gap-3 rounded-xl px-3 py-2.5',
              'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
            )}
          >
            <FaCog className={cn('h-4 w-4 shrink-0 transition-colors')} />
            {!isCollapsed ? <span>Settings</span> : null}
          </Link>

          <div
            className={cn(
              'flex items-center rounded-2xl bg-muted/35 px-3 py-3',
              isCollapsed ? 'justify-center px-2 py-2' : 'justify-between',
            )}
          >
            <div
              className={cn(
                'flex min-w-0 items-center gap-3',
                isCollapsed && 'gap-2',
              )}
            >
              <div
                title={displayName}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#533E89]/10 text-sm font-semibold text-[#533E89]"
              >
                {status === 'loading' ? (
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#533E89]" />
                ) : (
                  initials || 'A'
                )}
              </div>

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

            {!isCollapsed ? (
              <button
                type="button"
                aria-label="Log out"
                title="Log out"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setLogoutDialogOpen(true);
                }}
                className="shrink-0 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted/60"
              >
                <FiLogOut className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log out?</DialogTitle>
            <DialogDescription>
              You will be signed out of your admin session on this device.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setLogoutDialogOpen(false)}
              disabled={isLoggingOut}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void handleLogoutConfirm()}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'Logging out...' : 'Log out'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
};

export default Sidebar;
