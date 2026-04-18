import React from "react";
import { redirect } from "next/navigation";

import MainLayout from "@/components/layout/main-layout";
import AuthGate from "@/components/providers/auth-gate";
import { getServerAuthToken } from "@/lib/auth/server-token";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getServerAuthToken();
  if (!token) {
    redirect("/login");
  }

  return (
    <AuthGate>
      <MainLayout>{children}</MainLayout>
    </AuthGate>
  );
}
