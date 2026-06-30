"use server";

import { revalidatePath } from "next/cache";

import { locales } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import {
  companySettingFormSchema,
  normalizeCompanySettingFormInput,
  type CompanySettingFormInput
} from "@/lib/validations/company-setting";

export type CompanySettingActionResult = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch (error) {
    if (error instanceof Error && error.message.includes("static generation store missing")) {
      return;
    }

    throw error;
  }
}

function revalidateCompanyPaths() {
  safeRevalidatePath("/admin");
  safeRevalidatePath("/admin/company-profile");
  safeRevalidatePath("/admin/settings");

  for (const locale of locales) {
    safeRevalidatePath(`/${locale}`);
    safeRevalidatePath(`/${locale}/contact`);
  }
}

export async function updateCompanySettingAction(
  companyId: string,
  input: CompanySettingFormInput
): Promise<CompanySettingActionResult> {
  const parsed = companySettingFormSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  try {
    const data = normalizeCompanySettingFormInput(parsed.data);

    await prisma.companySetting.update({
      where: { id: companyId },
      data: {
        companyName: data.companyName,
        tagline: data.tagline,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription,
        vision: data.vision,
        mission: data.mission,
        address: data.address,
        email: data.email,
        phone: data.phone,
        socialLinks: data.socialLinks,
        logoUrl: data.logoUrl,
        faviconUrl: data.faviconUrl,
        cursorVariant: data.cursorVariant,
        mainCtaText: data.mainCtaText,
        mainCtaUrl: data.mainCtaUrl,
        remoteHighlightTitle: data.remoteHighlightTitle,
        remoteHighlightBody: data.remoteHighlightBody,
        defaultLocale: data.defaultLocale,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription
      }
    });

    revalidateCompanyPaths();

    return {
      ok: true,
      message: "Company profile updated."
    };
  } catch {
    return {
      ok: false,
      message: "Company profile could not be updated."
    };
  }
}
