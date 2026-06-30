import { notFound } from "next/navigation";

import { CompanySettingForm } from "@/components/admin/company-setting-form";
import { getCompanySettingForEdit } from "@/features/company-settings/company-settings-service";

export const dynamic = "force-dynamic";

export default async function CompanyProfilePage() {
  const company = await getCompanySettingForEdit();

  if (!company) {
    notFound();
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-lumen-400">Company Profile</p>
        <h1 className="mt-2 text-3xl font-black">Brand, profile, contact, and SEO settings</h1>
        <p className="mt-3 max-w-2xl leading-7 text-zinc-400">
          Edit global company content used by the landing page, footer, contact page, SEO metadata, and public brand surfaces.
        </p>
      </div>

      <CompanySettingForm companyId={company.id} initialValues={company.values} />
    </div>
  );
}
