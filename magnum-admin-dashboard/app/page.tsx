import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const hasAuth = cookieStore.get("magnum_admin_auth")?.value;
  if (hasAuth) {
    redirect("/dashboard");
  }
  redirect("/login");
}
