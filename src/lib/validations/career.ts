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

const optionalEmail = z
  .string()
  .trim()
  .optional()
  .default("")
  .refine((value) => !value || z.string().email().safeParse(value).success, "Use a valid email address.");

export const careerFormSchema = z.object({
  jobTitle: z.string().trim().min(2, "Job title is required."),
  slug: optionalText,
  divisionId: optionalText,
  location: optionalText,
  workType: z.enum(["ONSITE", "HYBRID", "REMOTE"]).default("REMOTE"),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "INTERNSHIP", "FREELANCE"]).default("FULL_TIME"),
  shortDescription: z.string().trim().min(8, "Short description is required."),
  requirements: optionalText,
  responsibilities: optionalText,
  benefits: optionalText,
  status: z.enum(["DRAFT", "OPEN", "CLOSED"]).default("DRAFT"),
  applyUrl: optionalUrl,
  applyEmail: optionalEmail
});

export type CareerFormInput = z.input<typeof careerFormSchema>;
type ParsedCareerFormInput = z.output<typeof careerFormSchema>;

export function normalizeCareerFormInput(input: ParsedCareerFormInput) {
  return {
    ...input,
    slug: input.slug.trim(),
    divisionId: input.divisionId.trim() || null,
    location: input.location.trim() || null,
    requirements: input.requirements.trim() || null,
    responsibilities: input.responsibilities.trim() || null,
    benefits: input.benefits.trim() || null,
    applyUrl: input.applyUrl.trim() || null,
    applyEmail: input.applyEmail.trim() || null
  };
}

export function emptyCareerFormValues(): CareerFormInput {
  return {
    jobTitle: "",
    slug: "",
    divisionId: "",
    location: "",
    workType: "REMOTE",
    employmentType: "FULL_TIME",
    shortDescription: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    status: "DRAFT",
    applyUrl: "",
    applyEmail: ""
  };
}
