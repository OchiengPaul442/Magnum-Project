"use client";

import React from "react";
import * as Sentry from "@sentry/nextjs";

import ErrorState from "@/components/shared/error-state";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  return (
    <Sentry.ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background px-6">
          <ErrorState
            title="Something went wrong"
            description="We hit an unexpected error while rendering this section."
          />
        </div>
      }
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}
