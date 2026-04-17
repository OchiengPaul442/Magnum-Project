"use client";

import React from "react";
import { Info } from "lucide-react";

import { cn } from "@/lib/utils";

interface NoDataProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  className?: string;
}

const NoData: React.FC<NoDataProps> = ({
  title = "No Data Available",
  description = "There is nothing to display right now.",
  actionLabel,
  onActionClick,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border/60 bg-card p-8 text-center shadow-sm",
        className,
      )}
    >
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="mb-4 text-primary">
          <Info className="h-12 w-12" />
        </div>
        <h2 className="mb-2 text-lg font-semibold text-foreground">{title}</h2>
        <p className="mb-4 text-sm text-muted-foreground">{description}</p>
        {actionLabel && onActionClick ? (
          <button
            onClick={onActionClick}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default NoData;
