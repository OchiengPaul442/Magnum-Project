import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-8 sm:px-6 sm:py-12">
      {children}
    </main>
  );
}
