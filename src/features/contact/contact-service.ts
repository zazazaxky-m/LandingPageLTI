import { ContactInterest, ContactStatus, type Prisma } from "@prisma/client";

import type { Locale } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import { formatEnumLabel, getTranslationLookup, readTranslation } from "@/lib/translations";

export type AdminContactFilters = {
  query?: string;
  status?: string;
  interest?: string;
};

export type PublicContactContent = {
  company: {
    name: string;
    tagline: string;
    shortDescription: string;
    address: string;
    email: string;
    phone: string;
    socialLinks: Record<string, string>;
  };
  interests: Array<{
    value: ContactInterest;
    label: string;
  }>;
};

function cleanFilter(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
}

function parseSocialLinks(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([, entry]) => typeof entry === "string" && entry.trim())
      .map(([key, entry]) => [key, String(entry)])
  );
}

function contactSearchWhere(query: string): Prisma.ContactSubmissionWhereInput {
  if (!query) {
    return {};
  }

  return {
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
      { company: { contains: query, mode: "insensitive" } },
      { phone: { contains: query, mode: "insensitive" } },
      { subject: { contains: query, mode: "insensitive" } },
      { message: { contains: query, mode: "insensitive" } }
    ]
  };
}

export function parseAdminContactFilters(searchParams: Record<string, string | string[] | undefined>): Required<AdminContactFilters> {
  const status = cleanFilter(searchParams.status);
  const interest = cleanFilter(searchParams.interest);

  return {
    query: cleanFilter(searchParams.q),
    status: Object.values(ContactStatus).includes(status as ContactStatus) ? status : "",
    interest: Object.values(ContactInterest).includes(interest as ContactInterest) ? interest : ""
  };
}

export async function getPublicContactContent(locale: Locale): Promise<PublicContactContent> {
  const company = await prisma.companySetting.findFirst({
    orderBy: { createdAt: "asc" }
  });

  if (!company) {
    throw new Error("CompanySetting record is required before rendering contact page.");
  }

  const lookup = await getTranslationLookup(locale, [{ entityType: "CompanySetting", entityId: company.id }]);

  return {
    company: {
      name: readTranslation(lookup, "CompanySetting", company.id, "companyName", company.companyName),
      tagline: readTranslation(lookup, "CompanySetting", company.id, "tagline", company.tagline),
      shortDescription: readTranslation(lookup, "CompanySetting", company.id, "shortDescription", company.shortDescription),
      address: company.address ?? "",
      email: company.email ?? "",
      phone: company.phone ?? "",
      socialLinks: parseSocialLinks(company.socialLinks)
    },
    interests: Object.values(ContactInterest).map((interest) => ({
      value: interest,
      label: formatEnumLabel(interest, locale)
    }))
  };
}

export async function getAdminContactSubmissions(filters: Required<AdminContactFilters>) {
  const where: Prisma.ContactSubmissionWhereInput = {
    ...contactSearchWhere(filters.query),
    ...(filters.status ? { status: filters.status as ContactStatus } : {}),
    ...(filters.interest ? { interestCategory: filters.interest as ContactInterest } : {})
  };

  const submissions = await prisma.contactSubmission.findMany({
    where,
    orderBy: [{ status: "asc" }, { createdAt: "desc" }]
  });

  return {
    submissions: submissions.map((submission) => ({
      id: submission.id,
      name: submission.name,
      email: submission.email,
      company: submission.company ?? "",
      phone: submission.phone ?? "",
      subject: submission.subject,
      interestCategory: submission.interestCategory,
      status: submission.status,
      createdAt: submission.createdAt.toISOString(),
      updatedAt: submission.updatedAt.toISOString()
    })),
    statusOptions: Object.values(ContactStatus),
    interestOptions: Object.values(ContactInterest),
    filters
  };
}

export async function getContactSubmissionDetail(id: string) {
  return prisma.contactSubmission.findUnique({
    where: { id }
  });
}

export function formatContactStatus(status: string, locale: Locale) {
  return formatEnumLabel(status, locale);
}
