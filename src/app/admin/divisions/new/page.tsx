import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { DivisionForm } from "@/components/admin/division-form";
import { buttonClasses } from "@/components/ui/button";
import { emptyDivisionFormValues } from "@/lib/validations/division";

export const dynamic = "force-dynamic";

export default function NewDivisionPage() {
  return (
    <div className="grid gap-6">
      <div>
        <Link className={buttonClasses("ghost", "mb-5 inline-flex")} href="/admin/divisions">
          <ArrowLeft className="h-4 w-4" />
          Back to divisions
        </Link>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-lumen-400">New Division</p>
        <h1 className="mt-2 text-3xl font-black">Create division</h1>
      </div>

      <DivisionForm initialValues={emptyDivisionFormValues()} mode="create" />
    </div>
  );
}
