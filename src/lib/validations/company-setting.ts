import { z } from "zod";

import { cursorVariantValues } from "@/lib/cursor-variants";

const optionalText = z.string().trim().optional().default("");

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .default("")
  .refine((value) => {
    if (!value) {
      return true;
    }

    if (value.startsWith("/")) {
      return true;
    }

    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }, "Use a valid URL or local path starting with /.");

const optionalEmail = z
  .string()
  .trim()
  .optional()
  .default("")
  .refine((value) => !value || z.string().email().safeParse(value).success, "Use a valid email address.");

export const companySettingFormSchema = z.object({
  companyName: z.string().trim().min(2, "Company name is required."),
  tagline: z.string().trim().min(2, "Tagline is required."),
  shortDescription: z.string().trim().min(8, "Short description is required."),
  longDescription: z.string().trim().min(20, "Long description is required."),
  vision: optionalText,
  mission: optionalText,
  address: optionalText,
  email: optionalEmail,
  phone: optionalText,
  linkedinUrl: optionalUrl,
  githubUrl: optionalUrl,
  instagramUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  logoUrl: optionalUrl,
  faviconUrl: optionalUrl,
  cursorVariant: z.enum(cursorVariantValues).default("GLOW"),
  mainCtaText: optionalText,
  mainCtaUrl: optionalUrl,
  remoteHighlightTitle: optionalText,
  remoteHighlightBody: optionalText,
  defaultLocale: z.enum(["EN", "ID", "ZH"]).default("ID"),
  seoTitle: optionalText,
  seoDescription: optionalText
});

export type CompanySettingFormInput = z.input<typeof companySettingFormSchema>;
type ParsedCompanySettingFormInput = z.output<typeof companySettingFormSchema>;

export function normalizeCompanySettingFormInput(input: ParsedCompanySettingFormInput) {
  return {
    ...input,
    vision: input.vision.trim() || null,
    mission: input.mission.trim() || null,
    address: input.address.trim() || null,
    email: input.email.trim() || null,
    phone: input.phone.trim() || null,
    logoUrl: input.logoUrl.trim() || null,
    faviconUrl: input.faviconUrl.trim() || null,
    cursorVariant: input.cursorVariant,
    mainCtaText: input.mainCtaText.trim() || null,
    mainCtaUrl: input.mainCtaUrl.trim() || null,
    remoteHighlightTitle: input.remoteHighlightTitle.trim() || null,
    remoteHighlightBody: input.remoteHighlightBody.trim() || null,
    seoTitle: input.seoTitle.trim() || null,
    seoDescription: input.seoDescription.trim() || null,
    socialLinks: {
      linkedin: input.linkedinUrl.trim(),
      github: input.githubUrl.trim(),
      instagram: input.instagramUrl.trim(),
      youtube: input.youtubeUrl.trim()
    }
  };
}

export function emptyCompanySettingFormValues(): CompanySettingFormInput {
  return {
    companyName: "",
    tagline: "",
    shortDescription: "",
    longDescription: "",
    vision: "",
    mission: "",
    address: "",
    email: "",
    phone: "",
    linkedinUrl: "",
    githubUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
    logoUrl: "",
    faviconUrl: "",
    cursorVariant: "GLOW",
    mainCtaText: "",
    mainCtaUrl: "",
    remoteHighlightTitle: "",
    remoteHighlightBody: "",
    defaultLocale: "ID",
    seoTitle: "",
    seoDescription: ""
  };
}
