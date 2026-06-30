import Link from "next/link";
import type { ReactNode } from "react";

import { LogoutButton } from "@/components/admin/logout-button";
import { auth } from "@/lib/auth";

const adminNav = [
  ["Dashboard", "/admin"],
  ["Company Profile", "/admin/company-profile"],
  ["Products", "/admin/products"],
  ["Divisions", "/admin/divisions"],
  ["Employees", "/admin/employees"],
  ["Partners", "/admin/partners"],
  ["Academic", "/admin/academic"],
  ["Careers", "/admin/careers"],
  ["Contact Submissions", "/admin/contact-submissions"],
  ["Media Library", "/admin/media-library"],
  ["Settings", "/admin/settings"]
] as const;

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-charcoal-950 text-white">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/10 bg-charcoal-900 p-5 lg:block">
        <Link className="mb-8 inline-flex items-center gap-3 font-black" href="/id">
          <span className="grid h-10 w-10 place-items-center rounded-ui bg-gradient-to-br from-lumen-500 to-lumen-400 text-charcoal-950">
            L
          </span>
          Lumiatech Admin
        </Link>
        <nav className="grid gap-1">
          {adminNav.map(([item, href]) => (
            <Link className="rounded-md px-3 py-2 text-sm font-bold text-zinc-400 transition hover:bg-white/[0.05] hover:text-white" href={href} key={item}>
              {item}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-charcoal-950/90 px-5 py-4 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-lumen-400">Admin Dashboard</p>
              <h1 className="text-xl font-black">Lumiatech CMS Foundation</h1>
            </div>
            <LogoutButton />
          </div>
        </header>
        <main className="p-5">{children}</main>
      </div>
    </div>
  );
}
