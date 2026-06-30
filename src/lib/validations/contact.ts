import { z } from "zod";

export const contactInterestSchema = z.enum([
  "ENGINEERING_PROTOTYPE",
  "IT_SOLUTION",
  "MOBILE_APP",
  "CYBER_SECURITY",
  "PARTNERSHIP",
  "CAREER",
  "ACADEMIC",
  "OTHER"
]);

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Name is required."),
  email: z.string().trim().email("Valid email is required."),
  company: z.string().trim().optional().default(""),
  phone: z.string().trim().optional().default(""),
  subject: z.string().trim().min(3, "Subject is required."),
  message: z.string().trim().min(10, "Message is required."),
  interest: contactInterestSchema
});

export type ContactFormInput = z.input<typeof contactFormSchema>;
type ParsedContactFormInput = z.output<typeof contactFormSchema>;

export function normalizeContactFormInput(input: ParsedContactFormInput) {
  return {
    ...input,
    company: input.company.trim() || null,
    phone: input.phone.trim() || null
  };
}

export function emptyContactFormValues(): ContactFormInput {
  return {
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: "",
    interest: "IT_SOLUTION"
  };
}
