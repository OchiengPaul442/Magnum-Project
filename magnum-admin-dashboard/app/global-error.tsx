"use client";

import { useEffect } from "react";

import ErrorState from "@/components/shared/error-state";
import { captureError } from "@/lib/logging";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    captureError(error, { source: "global-error" });
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-background px-6">
        <ErrorState
          title="System error"
          description="The dashboard ran into an unexpected issue."
          actionLabel="Try again"
          onActionClick={reset}
        />
      </body>
    </html>
  );
}
