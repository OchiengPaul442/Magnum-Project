import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import MainLayout from "@/components/layout/main-layout";
import AuthGate from "@/components/providers/auth-gate";
import { authOptions } from "@/lib/auth/options";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <AuthGate>
      <MainLayout>{children}</MainLayout>
    </AuthGate>
  );
}
