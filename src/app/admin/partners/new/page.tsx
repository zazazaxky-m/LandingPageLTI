import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { PartnerForm } from "@/components/admin/partner-form";
import { buttonClasses } from "@/components/ui/button";
import { emptyPartnerFormValues } from "@/lib/validations/partner";

export const dynamic = "force-dynamic";

export default function NewPartnerPage() {
  return (
    <div className="grid gap-6">
      <div>
        <Link className={buttonClasses("ghost", "mb-5 inline-flex")} href="/admin/partners">
          <ArrowLeft className="h-4 w-4" />
          Back to partners
        </Link>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-lumen-400">New Partner</p>
        <h1 className="mt-2 text-3xl font-black">Create partner</h1>
      </div>

      <PartnerForm initialValues={emptyPartnerFormValues()} mode="create" />
    </div>
  );
}
