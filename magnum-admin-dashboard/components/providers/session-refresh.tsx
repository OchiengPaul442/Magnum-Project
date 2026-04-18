"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

import { TOKEN_REFRESH_BUFFER_MS } from "@/lib/auth/refresh-window";

const getSoonestRefreshTime = (
  accessTokenExpiresAt?: number,
  refreshTokenExpiresAt?: number,
) => {
  const expiries = [accessTokenExpiresAt, refreshTokenExpiresAt].filter(
    (expiry): expiry is number => typeof expiry === "number",
  );

  if (expiries.length === 0) {
    return null;
  }

  return Math.min(...expiries) - TOKEN_REFRESH_BUFFER_MS;
};

export default function SessionRefreshManager() {
  const { data: session, status, update } = useSession();
  const accessTokenExpiresAt = session?.accessTokenExpiresAt;
  const refreshTokenExpiresAt = session?.refreshTokenExpiresAt;
  const sessionError = session?.error;
  const refreshInFlight = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || sessionError) {
      return;
    }

    const refreshAt = getSoonestRefreshTime(
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    );
    if (refreshAt === null) {
      return;
    }

    const delay = Math.max(refreshAt - Date.now(), 0);
    const timer = window.setTimeout(() => {
      if (refreshInFlight.current) {
        return;
      }

      refreshInFlight.current = true;
      void update().finally(() => {
        refreshInFlight.current = false;
      });
    }, delay);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    accessTokenExpiresAt,
    refreshTokenExpiresAt,
    sessionError,
    status,
    update,
  ]);

  return null;
}
