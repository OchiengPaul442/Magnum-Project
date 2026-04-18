import { redirect } from "next/navigation";

import { getServerAuthToken } from "@/lib/auth/server-token";

export default async function Home() {
  const token = await getServerAuthToken();
  if (token) {
    redirect("/dashboard");
  }
  redirect("/login");
}
