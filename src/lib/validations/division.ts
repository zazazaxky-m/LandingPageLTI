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

export const divisionFormSchema = z.object({
  name: z.string().trim().min(2, "Division name is required."),
  slug: optionalText,
  shortDescription: z.string().trim().min(8, "Short description is required."),
  description: z.string().trim().min(20, "Description is required."),
  icon: optionalText,
  imageUrl: optionalUrl,
  memberCount: z.coerce.number().int().min(0).default(0),
  status: z.enum(["VISIBLE", "HIDDEN"]).default("VISIBLE"),
  sortOrder: z.coerce.number().int().min(0).default(0)
});

export type DivisionFormInput = z.input<typeof divisionFormSchema>;
type ParsedDivisionFormInput = z.output<typeof divisionFormSchema>;

export function normalizeDivisionFormInput(input: ParsedDivisionFormInput) {
  return {
    ...input,
    slug: input.slug.trim(),
    shortDescription: input.shortDescription.trim(),
    description: input.description.trim(),
    icon: input.icon.trim() || null,
    imageUrl: input.imageUrl.trim() || null
  };
}

export function emptyDivisionFormValues(): DivisionFormInput {
  return {
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    icon: "",
    imageUrl: "",
    memberCount: 0,
    status: "VISIBLE",
    sortOrder: 0
  };
}
