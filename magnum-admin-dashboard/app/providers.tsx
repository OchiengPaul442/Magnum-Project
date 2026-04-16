"use client";

import { SWRConfig } from "swr";
import NextTopLoader from "nextjs-toploader";
import { SessionProvider } from "next-auth/react";

import ErrorBoundary from "@/components/shared/error-boundary";
import AppToaster from "@/components/shared/app-toaster";
import { apiFetcher } from "@/lib/api/client";
import { TooltipProvider } from "@/components/ui/tooltip";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <SessionProvider>
        <NextTopLoader
          color="hsl(var(--primary))"
          crawlSpeed={200}
          height={3}
          showSpinner={false}
          shadow={false}
        />
        <ErrorBoundary>
          <SWRConfig
            value={{
              fetcher: apiFetcher,
              revalidateOnFocus: false,
              shouldRetryOnError: false,
            }}
          >
            {children}
            <AppToaster />
          </SWRConfig>
        </ErrorBoundary>
      </SessionProvider>
    </TooltipProvider>
  );
}
