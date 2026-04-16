import React from "react";
import Image from "next/image";

export default function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-border flex items-center justify-center">
        <Image
          src="/logos/logo.png"
          alt="Magnum"
          width={36}
          height={36}
          className="h-auto w-auto"
        />
      </div>
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
          Magnum
        </p>
        <p className="text-base font-semibold text-foreground">
          Admin Dashboard
        </p>
      </div>
    </div>
  );
}
