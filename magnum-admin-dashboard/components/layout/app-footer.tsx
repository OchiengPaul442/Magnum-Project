import React from "react";
import { cn } from "@/lib/utils";

interface AppFooterProps {
  className?: string;
}

export default function AppFooter({ className }: AppFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "flex-none py-3 text-center text-xs text-muted-foreground",
        className,
      )}
    >
      © {year} Magnum Admin Dashboard. All rights reserved.
    </footer>
  );
}
