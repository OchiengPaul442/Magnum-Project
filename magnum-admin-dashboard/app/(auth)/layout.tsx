import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative isolate flex min-h-[100dvh] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4 py-8 sm:px-6 sm:py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.18),transparent_28%)]" />
      <div className="relative z-10 flex w-full justify-center">{children}</div>
    </main>
  );
}
