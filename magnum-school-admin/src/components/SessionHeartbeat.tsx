'use client';

import { useEffect, useRef } from 'react';
import { getSession, signOut, useSession } from 'next-auth/react';
import themeConfig from '@/config/theme';

const ACCESS_TOKEN_REFRESH_BUFFER_MS = 2 * 60 * 1000;
const REFRESH_TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000;
const MIN_REFRESH_DELAY_MS = 1000;

const getNextRefreshDelay = (
  accessTokenExpires?: number,
  refreshTokenExpires?: number,
) => {
  const targets: number[] = [];

  if (typeof accessTokenExpires === 'number') {
    targets.push(accessTokenExpires - ACCESS_TOKEN_REFRESH_BUFFER_MS);
  }

  if (typeof refreshTokenExpires === 'number') {
    targets.push(refreshTokenExpires - REFRESH_TOKEN_REFRESH_BUFFER_MS);
  }

  if (targets.length === 0) {
    return null;
  }

  const nextTarget = Math.min(...targets);
  return Math.max(nextTarget - Date.now(), MIN_REFRESH_DELAY_MS);
};

const SessionHeartbeat = () => {
  const { data: session, status } = useSession();
  const logoutRequestedRef = useRef(false);

  useEffect(() => {
    if (status !== 'authenticated') {
      return undefined;
    }

    if (session?.error) {
      if (!logoutRequestedRef.current) {
        logoutRequestedRef.current = true;
        void signOut({ callbackUrl: themeConfig.signOutUrl });
      }
      return undefined;
    }

    let cancelled = false;
    let timeoutId: number | null = null;

    const scheduleRefresh = (
      accessTokenExpires?: number,
      refreshTokenExpires?: number,
    ) => {
      if (cancelled) {
        return;
      }

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      const delay = getNextRefreshDelay(
        accessTokenExpires,
        refreshTokenExpires,
      );

      if (delay === null) {
        if (!logoutRequestedRef.current) {
          logoutRequestedRef.current = true;
          void signOut({ callbackUrl: themeConfig.signOutUrl });
        }
        return;
      }

      timeoutId = window.setTimeout(async () => {
        if (cancelled) {
          return;
        }

        try {
          const refreshedSession = await getSession();

          if (cancelled) {
            return;
          }

          if (!refreshedSession) {
            logoutRequestedRef.current = true;
            void signOut({ callbackUrl: themeConfig.signOutUrl });
            return;
          }

          if (refreshedSession?.error) {
            logoutRequestedRef.current = true;
            void signOut({ callbackUrl: themeConfig.signOutUrl });
            return;
          }

          const refreshedAccessTokenExpires =
            refreshedSession?.user?.accessTokenExpires;
          const refreshedRefreshTokenExpires =
            refreshedSession?.user?.refreshTokenExpires;

          if (
            typeof refreshedAccessTokenExpires === 'number' ||
            typeof refreshedRefreshTokenExpires === 'number'
          ) {
            scheduleRefresh(
              refreshedAccessTokenExpires,
              refreshedRefreshTokenExpires,
            );
            return;
          }

          logoutRequestedRef.current = true;
          void signOut({ callbackUrl: themeConfig.signOutUrl });
        } catch {
          if (!cancelled) {
            logoutRequestedRef.current = true;
            void signOut({ callbackUrl: themeConfig.signOutUrl });
          }
        }
      }, delay);
    };

    scheduleRefresh(
      session?.user?.accessTokenExpires,
      session?.user?.refreshTokenExpires,
    );

    return () => {
      cancelled = true;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [
    session?.error,
    session?.user?.accessTokenExpires,
    session?.user?.refreshTokenExpires,
    status,
  ]);

  return null;
};

export default SessionHeartbeat;
