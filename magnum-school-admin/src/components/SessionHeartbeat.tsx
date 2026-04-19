'use client';

import { useEffect } from 'react';
import { getSession, useSession } from 'next-auth/react';

const SESSION_REFRESH_BUFFER_MS = 60 * 1000;
const MIN_REFRESH_DELAY_MS = 1000;

const SessionHeartbeat = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== 'authenticated' || session?.error) {
      return undefined;
    }

    const initialExpiresAt = session?.user?.accessTokenExpires;
    if (typeof initialExpiresAt !== 'number') {
      return undefined;
    }

    let cancelled = false;
    let timeoutId: ReturnType<typeof window.setTimeout> | null = null;

    const scheduleRefresh = (expiresAt: number) => {
      if (cancelled) {
        return;
      }

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      const delay = Math.max(
        expiresAt - Date.now() - SESSION_REFRESH_BUFFER_MS,
        MIN_REFRESH_DELAY_MS,
      );

      timeoutId = window.setTimeout(async () => {
        if (cancelled) {
          return;
        }

        try {
          const refreshedSession = await getSession();
          const refreshedExpiresAt = refreshedSession?.user?.accessTokenExpires;

          if (cancelled) {
            return;
          }

          if (typeof refreshedExpiresAt === 'number') {
            scheduleRefresh(refreshedExpiresAt);
          }
        } catch {
          if (!cancelled) {
            scheduleRefresh(expiresAt);
          }
        }
      }, delay);
    };

    scheduleRefresh(initialExpiresAt);

    return () => {
      cancelled = true;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [session?.error, session?.user?.accessTokenExpires, status]);

  return null;
};

export default SessionHeartbeat;
