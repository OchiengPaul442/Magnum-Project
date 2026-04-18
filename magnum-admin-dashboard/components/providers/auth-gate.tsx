"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import LoadingScreen from "@/components/shared/loading-screen";

interface AuthGateProps {
  children: React.ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const signOutStarted = useRef(false);

  const currentPath = searchParams.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;
  const loginUrl = `/login?next=${encodeURIComponent(currentPath)}`;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(loginUrl);
    }
  }, [loginUrl, pathname, router, status]);

  useEffect(() => {
    if (
      session?.error !== "RefreshAccessTokenError" ||
      signOutStarted.current
    ) {
      return;
    }

    signOutStarted.current = true;
    void signOut({ callbackUrl: loginUrl });
  }, [loginUrl, session?.error]);

  if (
    status !== "authenticated" ||
    session?.error === "RefreshAccessTokenError"
  ) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
