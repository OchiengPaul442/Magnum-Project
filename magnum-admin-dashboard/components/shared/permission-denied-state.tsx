"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PermissionDeniedStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onActionClick?: () => void;
  className?: string;
}

export default function PermissionDeniedState({
  title = "Permission required",
  description = "You do not have the required permissions to view this page or its data.",
  actionLabel = "Back to dashboard",
  actionHref = "/dashboard",
  onActionClick,
  className = "",
}: PermissionDeniedStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-amber-200/80 bg-amber-50/70 p-8 text-center shadow-sm",
        className,
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex flex-col items-center justify-center">
        <div className="mb-4 rounded-full bg-amber-100 p-3 text-amber-700">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <h2 className="mb-2 text-lg font-semibold text-foreground">{title}</h2>
        <p className="mb-5 max-w-md text-sm text-muted-foreground">
          {description}
        </p>
        {onActionClick ? (
          <Button
            variant="outline"
            className="rounded-full"
            onClick={onActionClick}
          >
            {actionLabel}
          </Button>
        ) : (
          <Button asChild variant="outline" className="rounded-full">
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
