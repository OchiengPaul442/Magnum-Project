"use client";

import { useEffect } from "react";

import ErrorState from "@/components/shared/error-state";
import { captureError } from "@/lib/logging";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    captureError(error, { source: "route-error" });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <ErrorState
        title="Something went wrong"
        description="We hit an unexpected error while loading this page."
        actionLabel="Try again"
        onActionClick={reset}
      />
    </div>
  );
}
