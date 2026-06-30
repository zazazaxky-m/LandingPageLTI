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

export const academicFormSchema = z.object({
  title: z.string().trim().min(2, "Academic title is required."),
  slug: optionalText,
  category: z.string().trim().min(2, "Category is required."),
  shortDescription: z.string().trim().min(8, "Short description is required."),
  content: z.string().trim().min(20, "Content is required."),
  imageUrl: optionalUrl,
  publishedAt: optionalText,
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  seoTitle: optionalText,
  seoDescription: optionalText
});

export type AcademicFormInput = z.input<typeof academicFormSchema>;
type ParsedAcademicFormInput = z.output<typeof academicFormSchema>;

function normalizeDate(value: string) {
  if (!value.trim()) {
    return null;
  }

  const date = new Date(`${value.trim()}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export function normalizeAcademicFormInput(input: ParsedAcademicFormInput) {
  return {
    ...input,
    slug: input.slug.trim(),
    imageUrl: input.imageUrl.trim() || null,
    publishedAt: normalizeDate(input.publishedAt),
    seoTitle: input.seoTitle.trim() || null,
    seoDescription: input.seoDescription.trim() || null
  };
}

export function emptyAcademicFormValues(): AcademicFormInput {
  return {
    title: "",
    slug: "",
    category: "",
    shortDescription: "",
    content: "",
    imageUrl: "",
    publishedAt: "",
    status: "DRAFT",
    seoTitle: "",
    seoDescription: ""
  };
}
