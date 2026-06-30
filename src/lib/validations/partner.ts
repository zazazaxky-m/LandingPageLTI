import { z } from "zod";

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

export const partnerFormSchema = z.object({
  name: z.string().trim().min(2, "Partner name is required."),
  slug: optionalText,
  logoUrl: optionalUrl,
  websiteUrl: optionalUrl,
  description: optionalText,
  type: z.enum(["CLIENT", "PARTNER", "ACADEMIC", "VENDOR", "COLLABORATION"]).default("PARTNER"),
  featured: z.coerce.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).default(0),
  status: z.enum(["VISIBLE", "HIDDEN"]).default("VISIBLE")
});

export type PartnerFormInput = z.input<typeof partnerFormSchema>;
type ParsedPartnerFormInput = z.output<typeof partnerFormSchema>;

export function normalizePartnerFormInput(input: ParsedPartnerFormInput) {
  return {
    ...input,
    slug: input.slug.trim(),
    logoUrl: input.logoUrl.trim() || null,
    websiteUrl: input.websiteUrl.trim() || null,
    description: input.description.trim() || null
  };
}

export function emptyPartnerFormValues(): PartnerFormInput {
  return {
    name: "",
    slug: "",
    logoUrl: "",
    websiteUrl: "",
    description: "",
    type: "PARTNER",
    featured: false,
    sortOrder: 0,
    status: "VISIBLE"
  };
}
