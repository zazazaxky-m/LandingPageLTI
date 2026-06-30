import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { AcademicForm } from "@/components/admin/academic-form";
import { buttonClasses } from "@/components/ui/button";
import { getAcademicForEdit } from "@/features/academic/academic-service";

type EditAcademicPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function EditAcademicPage({ params }: EditAcademicPageProps) {
  const { id } = await params;
  const item = await getAcademicForEdit(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="grid gap-6">
      <div>
        <Link className={buttonClasses("ghost", "mb-5 inline-flex")} href="/admin/academic">
          <ArrowLeft className="h-4 w-4" />
          Back to academic
        </Link>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-lumen-400">Edit Academic Content</p>
        <h1 className="mt-2 text-3xl font-black">{item.title}</h1>
      </div>

      <AcademicForm academicId={id} initialValues={item} mode="edit" />
    </div>
  );
}
