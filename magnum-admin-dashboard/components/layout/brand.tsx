import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandProps {
  collapsed?: boolean;
  className?: string;
}

export default function Brand({ collapsed = false, className }: BrandProps) {
  return (
    <div className={cn("flex items-center justify-start", className)}>
      <Image
        src="/logos/logo.png"
        alt="Magnum logo"
        width={collapsed ? 40 : 44}
        height={collapsed ? 40 : 44}
      />
    </div>
  );
}
