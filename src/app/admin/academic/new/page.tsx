import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AcademicForm } from "@/components/admin/academic-form";
import { buttonClasses } from "@/components/ui/button";
import { emptyAcademicFormValues } from "@/lib/validations/academic";

export const dynamic = "force-dynamic";

export default function NewAcademicPage() {
  return (
    <div className="grid gap-6">
      <div>
        <Link className={buttonClasses("ghost", "mb-5 inline-flex")} href="/admin/academic">
          <ArrowLeft className="h-4 w-4" />
          Back to academic
        </Link>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-lumen-400">New Academic Content</p>
        <h1 className="mt-2 text-3xl font-black">Create academic content</h1>
      </div>

      <AcademicForm initialValues={emptyAcademicFormValues()} mode="create" />
    </div>
  );
}
