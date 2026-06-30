import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { normalizeCursorVariant } from "@/lib/cursor-variants";
import { emptyCompanySettingFormValues, type CompanySettingFormInput } from "@/lib/validations/company-setting";

function socialLinksObject(value: Prisma.JsonValue | null | undefined) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
}

function socialLink(value: Prisma.JsonValue | null | undefined, key: string) {
  const links = socialLinksObject(value);
  const entry = links[key];

  return typeof entry === "string" ? entry : "";
}

export async function getCompanySettingForEdit(): Promise<{ id: string; values: CompanySettingFormInput } | null> {
  const company = await prisma.companySetting.findFirst({
    orderBy: { createdAt: "asc" }
  });

  if (!company) {
    return null;
  }

  return {
    id: company.id,
    values: {
      ...emptyCompanySettingFormValues(),
      companyName: company.companyName,
      tagline: company.tagline,
      shortDescription: company.shortDescription ?? "",
      longDescription: company.longDescription ?? "",
      vision: company.vision ?? "",
      mission: company.mission ?? "",
      address: company.address ?? "",
      email: company.email ?? "",
      phone: company.phone ?? "",
      linkedinUrl: socialLink(company.socialLinks, "linkedin"),
      githubUrl: socialLink(company.socialLinks, "github"),
      instagramUrl: socialLink(company.socialLinks, "instagram"),
      youtubeUrl: socialLink(company.socialLinks, "youtube"),
      logoUrl: company.logoUrl ?? "",
      faviconUrl: company.faviconUrl ?? "",
      cursorVariant: normalizeCursorVariant(company.cursorVariant),
      mainCtaText: company.mainCtaText ?? "",
      mainCtaUrl: company.mainCtaUrl ?? "",
      remoteHighlightTitle: company.remoteHighlightTitle ?? "",
      remoteHighlightBody: company.remoteHighlightBody ?? "",
      defaultLocale: company.defaultLocale,
      seoTitle: company.seoTitle ?? "",
      seoDescription: company.seoDescription ?? ""
    }
  };
}
