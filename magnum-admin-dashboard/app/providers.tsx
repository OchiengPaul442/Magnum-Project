"use client";

import { SWRConfig } from "swr";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/providers/auth-provider";
import ErrorBoundary from "@/components/shared/error-boundary";
import { apiFetcher } from "@/lib/api/client";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
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
  );
}
