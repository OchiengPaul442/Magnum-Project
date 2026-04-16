import React from "react";
import Image from "next/image";

export default function Brand() {
  return (
    <div className="flex items-center gap-3">
      <Image src="/logos/logo.png" alt="Magnum" width={44} height={44} />
      <div className="leading-tight">
        <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">
          Magnum
        </p>
        <p className="text-base font-semibold text-foreground">
          Admin Dashboard
        </p>
      </div>
    </div>
  );
}
