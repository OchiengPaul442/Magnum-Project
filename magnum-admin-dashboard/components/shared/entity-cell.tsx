import React from "react";

import { cn } from "@/lib/utils";

interface EntityCellProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export default function EntityCell({
  title,
  subtitle,
  className,
  titleClassName,
  subtitleClassName,
}: EntityCellProps) {
  return (
    <div className={cn("space-y-0.5", className)}>
      <div className={cn("font-medium text-foreground", titleClassName)}>
        {title}
      </div>
      {subtitle ? (
        <div className={cn("text-xs text-muted-foreground", subtitleClassName)}>
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}
