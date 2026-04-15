import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import MainLayout from "@/components/layout/main-layout";
import AuthGate from "@/components/providers/auth-gate";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const hasAuth = cookieStore.get("magnum_admin_auth")?.value;
  if (!hasAuth) {
    redirect("/login");
  }

  return (
    <AuthGate>
      <MainLayout>{children}</MainLayout>
    </AuthGate>
  );
}
