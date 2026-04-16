"use client";

import { SWRConfig } from "swr";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import { AuthProvider } from "@/components/providers/auth-provider";
import ErrorBoundary from "@/components/shared/error-boundary";
import { apiFetcher } from "@/lib/api/client";
import { TooltipProvider } from "@/components/ui/tooltip";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <AuthProvider>
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
            <Toaster richColors position="bottom-right" />
          </SWRConfig>
        </ErrorBoundary>
      </AuthProvider>
    </TooltipProvider>
  );
}
