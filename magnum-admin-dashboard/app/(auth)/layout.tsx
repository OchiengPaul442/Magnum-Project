import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="relative isolate flex min-h-[100dvh] items-center justify-center overflow-hidden bg-white px-4 py-8 sm:px-6 sm:py-12"
      style={{
        backgroundImage:
          "linear-gradient(135deg, #9777EA38 0%, #E1E0E50D 100%)",
      }}
    >
      <div className="relative z-10 flex w-full justify-center">{children}</div>
    </main>
  );
}
