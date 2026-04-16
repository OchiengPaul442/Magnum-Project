import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandProps {
  collapsed?: boolean;
  className?: string;
}

export default function Brand({ collapsed = false, className }: BrandProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        collapsed && "justify-center",
        className,
      )}
    >
      <Image
        src="/logos/logo.png"
        alt="Magnum"
        width={collapsed ? 40 : 44}
        height={collapsed ? 40 : 44}
      />
      {!collapsed ? (
        <div className="leading-tight">
          <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">
            Magnum
          </p>
          <p className="text-base font-semibold text-foreground">
            Admin Dashboard
          </p>
        </div>
      ) : null}
    </div>
  );
}
