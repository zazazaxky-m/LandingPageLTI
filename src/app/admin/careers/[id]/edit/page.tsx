import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { CareerForm } from "@/components/admin/career-form";
import { buttonClasses } from "@/components/ui/button";
import { getCareerForEdit, getCareerFormOptions } from "@/features/careers/career-service";

type EditCareerPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function EditCareerPage({ params }: EditCareerPageProps) {
  const { id } = await params;
  const [career, options] = await Promise.all([getCareerForEdit(id), getCareerFormOptions()]);

  if (!career) {
    notFound();
  }

  return (
    <div className="grid gap-6">
      <div>
        <Link className={buttonClasses("ghost", "mb-5 inline-flex")} href="/admin/careers">
          <ArrowLeft className="h-4 w-4" />
          Back to careers
        </Link>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-lumen-400">Edit Career</p>
        <h1 className="mt-2 text-3xl font-black">{career.jobTitle}</h1>
      </div>

      <CareerForm careerId={id} initialValues={career} mode="edit" options={options} />
    </div>
  );
}
