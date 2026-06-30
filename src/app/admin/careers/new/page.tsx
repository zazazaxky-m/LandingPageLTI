import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { CareerForm } from "@/components/admin/career-form";
import { buttonClasses } from "@/components/ui/button";
import { getCareerFormOptions } from "@/features/careers/career-service";
import { emptyCareerFormValues } from "@/lib/validations/career";

export const dynamic = "force-dynamic";

export default async function NewCareerPage() {
  const options = await getCareerFormOptions();

  return (
    <div className="grid gap-6">
      <div>
        <Link className={buttonClasses("ghost", "mb-5 inline-flex")} href="/admin/careers">
          <ArrowLeft className="h-4 w-4" />
          Back to careers
        </Link>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-lumen-400">New Career</p>
        <h1 className="mt-2 text-3xl font-black">Create career</h1>
      </div>

      <CareerForm initialValues={emptyCareerFormValues()} mode="create" options={options} />
    </div>
  );
}
