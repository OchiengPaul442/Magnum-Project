"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { usePathname } from "next/navigation";

import PermissionDeniedState from "@/components/shared/permission-denied-state";
import { cn } from "@/lib/utils";

const FORBIDDEN_ROUTE_KEY = "magnum_forbidden_route";
const FORBIDDEN_ROUTE_AT_KEY = "magnum_forbidden_route_at";
const FORBIDDEN_ROUTE_TTL_MS = 2 * 60_000;

interface ErrorStateProps {
  error?: unknown;
  title?: string;
  description?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  className?: string;
}

const getStatusCode = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return null;
  }

  const candidate = error as {
    status?: number;
    response?: { status?: number };
  };

  return candidate.response?.status ?? candidate.status ?? null;
};

const getForbiddenRouteMatch = (pathname: string) => {
  if (typeof window === "undefined") {
    return false;
  }

  const storedPath = window.sessionStorage.getItem(FORBIDDEN_ROUTE_KEY);
  const storedAt = Number(
    window.sessionStorage.getItem(FORBIDDEN_ROUTE_AT_KEY),
  );

  return (
    storedPath === pathname &&
    Number.isFinite(storedAt) &&
    Date.now() - storedAt <= FORBIDDEN_ROUTE_TTL_MS
  );
};

const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  title = "Something went wrong",
  description = "There was an issue fetching the data. Please try again later.",
  actionLabel,
  onActionClick,
  className = "",
}) => {
  const pathname = usePathname();
  const [forbiddenRouteMatches, setForbiddenRouteMatches] = useState(false);

  useEffect(() => {
    setForbiddenRouteMatches(getForbiddenRouteMatch(pathname));
  }, [pathname]);

  if (getStatusCode(error) === 403 || forbiddenRouteMatches) {
    return (
      <PermissionDeniedState
        title="Permission required"
        description="You do not have the required permissions to view this page or its data."
        actionLabel={actionLabel}
        onActionClick={onActionClick}
        className={className}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-6 rounded-md border border-red-200 bg-red-50 text-center",
        className,
      )}
    >
      <div className="text-red-500 mb-4">
        <AlertTriangle className="h-12 w-12" />
      </div>
      <h2 className="text-lg font-semibold text-red-700 mb-2">{title}</h2>
      <p className="text-sm text-red-600 mb-4">{description}</p>
      {actionLabel && onActionClick ? (
        <button
          onClick={onActionClick}
          className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
};

export default ErrorState;
