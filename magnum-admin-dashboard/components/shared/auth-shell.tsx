import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AuthShellProps {
  title: string;
  description: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function AuthShell({
  title,
  description,
  children,
  className,
}: AuthShellProps) {
  return (
    <div
      className={cn("flex w-full max-w-md flex-col items-center", className)}
    >
      <Image
        src="/logos/logo.png"
        alt="Magnum"
        width={80}
        height={80}
        priority
        className="mb-6 h-20 w-20 drop-shadow-sm"
      />

      <h1 className="text-center text-2xl font-semibold tracking-tight text-[#533E89] sm:text-3xl">
        {title}
      </h1>

      <p className="mt-4 max-w-md text-center text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      <div className="w-full">{children}</div>
    </div>
  );
}
