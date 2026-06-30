"use server";

import { ContactStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { locales } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import { contactFormSchema, normalizeContactFormInput, type ContactFormInput } from "@/lib/validations/contact";

export type ContactActionResult = {
  ok: boolean;
  message: string;
  submissionId?: string;
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

function revalidateContactPaths() {
  safeRevalidatePath("/admin");
  safeRevalidatePath("/admin/contact-submissions");

  for (const locale of locales) {
    safeRevalidatePath(`/${locale}`);
    safeRevalidatePath(`/${locale}/contact`);
  }
}

export async function createContactSubmissionAction(input: ContactFormInput): Promise<ContactActionResult> {
  const parsed = contactFormSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  try {
    const data = normalizeContactFormInput(parsed.data);
    const submission = await prisma.contactSubmission.create({
      data: {
        name: data.name,
        email: data.email,
        company: data.company,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        interestCategory: data.interest
      }
    });

    revalidateContactPaths();

    return {
      ok: true,
      message: "Message sent.",
      submissionId: submission.id
    };
  } catch {
    return {
      ok: false,
      message: "Message could not be sent."
    };
  }
}

export async function updateContactSubmissionStatusAction(
  submissionId: string,
  status: ContactStatus
): Promise<ContactActionResult> {
  if (!Object.values(ContactStatus).includes(status)) {
    return {
      ok: false,
      message: "Invalid contact status."
    };
  }

  try {
    const submission = await prisma.contactSubmission.update({
      where: { id: submissionId },
      data: { status }
    });

    revalidateContactPaths();
    safeRevalidatePath(`/admin/contact-submissions/${submission.id}`);

    return {
      ok: true,
      message: "Submission status updated.",
      submissionId: submission.id
    };
  } catch {
    return {
      ok: false,
      message: "Submission status could not be updated."
    };
  }
}
