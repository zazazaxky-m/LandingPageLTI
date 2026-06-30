import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/admin");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-charcoal-950 p-5 text-white">
      <LoginForm />
    </main>
  );
}
