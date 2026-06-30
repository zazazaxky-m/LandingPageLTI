import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { DivisionForm } from "@/components/admin/division-form";
import { buttonClasses } from "@/components/ui/button";
import { getDivisionForEdit } from "@/features/divisions/division-service";

type EditDivisionPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function EditDivisionPage({ params }: EditDivisionPageProps) {
  const { id } = await params;
  const division = await getDivisionForEdit(id);

  if (!division) {
    notFound();
  }

  return (
    <div className="grid gap-6">
      <div>
        <Link className={buttonClasses("ghost", "mb-5 inline-flex")} href="/admin/divisions">
          <ArrowLeft className="h-4 w-4" />
          Back to divisions
        </Link>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-lumen-400">Edit Division</p>
        <h1 className="mt-2 text-3xl font-black">{division.name}</h1>
      </div>

      <DivisionForm divisionId={id} initialValues={division} mode="edit" />
    </div>
  );
}
