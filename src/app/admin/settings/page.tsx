import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  const items = [
    "Static UI labels are stored in locale dictionaries for EN, ID, and ZH.",
    "Dynamic content can be localized through the Translation table by entity type, entity id, field, and locale.",
    "Development uploads use the local provider and are stored in public/uploads plus Media records.",
    "The upload layer is isolated in src/lib/upload.ts for Cloudinary, S3, or Supabase Storage replacement.",
    "Admin routes are protected by session cookie middleware and NextAuth credentials login."
  ];

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-lumen-400">Settings</p>
        <h1 className="mt-2 text-3xl font-black">System settings and implementation notes</h1>
        <p className="mt-3 max-w-2xl leading-7 text-zinc-400">
          Operational notes for localization, upload providers, authentication, and content management.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-black text-white">Configuration status</h2>
          <div className="mt-5 grid gap-3">
            {items.map((item) => (
              <div className="flex gap-3 text-sm leading-6 text-zinc-300" key={item}>
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-lumen-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-black text-white">Quick actions</h2>
          <div className="mt-5 grid gap-3">
            <Link className={buttonClasses("solid")} href="/admin/company-profile">
              Edit company profile
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link className={buttonClasses("ghost")} href="/admin/media-library">
              Open media library
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link className={buttonClasses("ghost")} href="/admin/contact-submissions">
              Review contact submissions
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
