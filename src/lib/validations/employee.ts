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

export const employeeFormSchema = z.object({
  name: z.string().trim().min(2, "Employee name is required."),
  slug: optionalText,
  role: z.string().trim().min(2, "Role is required."),
  divisionId: optionalText,
  photoUrl: optionalUrl,
  shortBio: z.string().trim().min(12, "Short bio is required."),
  experienceHistory: optionalText,
  linkedinUrl: optionalUrl,
  githubUrl: optionalUrl,
  portfolioUrl: optionalUrl,
  email: optionalEmail,
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  sortOrder: z.coerce.number().int().min(0).default(0),
  skills: z
    .array(
      z.object({
        name: optionalText
      })
    )
    .default([])
});

export type EmployeeFormInput = z.input<typeof employeeFormSchema>;
type ParsedEmployeeFormInput = z.output<typeof employeeFormSchema>;

export function normalizeEmployeeFormInput(input: ParsedEmployeeFormInput) {
  return {
    ...input,
    slug: input.slug.trim(),
    divisionId: input.divisionId.trim() || null,
    photoUrl: input.photoUrl.trim() || null,
    experienceHistory: input.experienceHistory.trim() || null,
    linkedinUrl: input.linkedinUrl.trim() || null,
    githubUrl: input.githubUrl.trim() || null,
    portfolioUrl: input.portfolioUrl.trim() || null,
    email: input.email.trim() || null,
    skills: input.skills
      .map((skill, index) => ({
        name: skill.name.trim(),
        sortOrder: index + 1
      }))
      .filter((skill) => skill.name)
  };
}

export function emptyEmployeeFormValues(): EmployeeFormInput {
  return {
    name: "",
    slug: "",
    role: "",
    divisionId: "",
    photoUrl: "",
    shortBio: "",
    experienceHistory: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    email: "",
    status: "ACTIVE",
    sortOrder: 0,
    skills: [{ name: "" }]
  };
}
