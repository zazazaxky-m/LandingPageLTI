import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { PartnerForm } from "@/components/admin/partner-form";
import { buttonClasses } from "@/components/ui/button";
import { getPartnerForEdit } from "@/features/partners/partner-service";

type EditPartnerPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function EditPartnerPage({ params }: EditPartnerPageProps) {
  const { id } = await params;
  const partner = await getPartnerForEdit(id);

  if (!partner) {
    notFound();
  }

  return (
    <div className="grid gap-6">
      <div>
        <Link className={buttonClasses("ghost", "mb-5 inline-flex")} href="/admin/partners">
          <ArrowLeft className="h-4 w-4" />
          Back to partners
        </Link>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-lumen-400">Edit Partner</p>
        <h1 className="mt-2 text-3xl font-black">{partner.name}</h1>
      </div>

      <PartnerForm initialValues={partner} mode="edit" partnerId={id} />
    </div>
  );
}
