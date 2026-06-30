import { PartnerType, VisibilityStatus, type Prisma } from "@prisma/client";

import type { Locale } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import { formatEnumLabel, getTranslationLookup, readTranslation, type TranslationEntity } from "@/lib/translations";
import { emptyPartnerFormValues, type PartnerFormInput } from "@/lib/validations/partner";

export type PublicPartnerFilters = {
  query?: string;
  type?: string;
};

export type AdminPartnerFilters = {
  query?: string;
  type?: string;
  status?: string;
};

export type PublicPartnerCard = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  description: string;
  type: string;
  featured: boolean;
};

export type PublicPartnerIndex = {
  partners: PublicPartnerCard[];
  types: Array<{
    value: string;
    label: string;
  }>;
  filters: Required<PublicPartnerFilters>;
};

type PartnerRecord = Prisma.PartnerGetPayload<object>;

function cleanFilter(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
}

function partnerSearchWhere(query: string): Prisma.PartnerWhereInput {
  if (!query) {
    return {};
  }

  return {
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { websiteUrl: { contains: query, mode: "insensitive" } }
    ]
  };
}

function partnerTranslationEntities(partners: PartnerRecord[]): TranslationEntity[] {
  return partners.map((partner) => ({ entityType: "Partner", entityId: partner.id }));
}

function toPublicPartnerCard(partner: PartnerRecord, locale: Locale, lookup: Map<string, string>): PublicPartnerCard {
  return {
    id: partner.id,
    slug: partner.slug,
    name: readTranslation(lookup, "Partner", partner.id, "name", partner.name),
    logoUrl: partner.logoUrl,
    websiteUrl: partner.websiteUrl,
    description: readTranslation(lookup, "Partner", partner.id, "description", partner.description),
    type: formatEnumLabel(partner.type, locale),
    featured: partner.featured
  };
}

export function parsePublicPartnerFilters(searchParams: Record<string, string | string[] | undefined>): Required<PublicPartnerFilters> {
  const type = cleanFilter(searchParams.type);

  return {
    query: cleanFilter(searchParams.q),
    type: Object.values(PartnerType).includes(type as PartnerType) ? type : ""
  };
}

export function parseAdminPartnerFilters(searchParams: Record<string, string | string[] | undefined>): Required<AdminPartnerFilters> {
  const type = cleanFilter(searchParams.type);
  const status = cleanFilter(searchParams.status);

  return {
    query: cleanFilter(searchParams.q),
    type: Object.values(PartnerType).includes(type as PartnerType) ? type : "",
    status: ["VISIBLE", "HIDDEN"].includes(status) ? status : ""
  };
}

export async function getPublicPartnerIndex(locale: Locale, filters: Required<PublicPartnerFilters>): Promise<PublicPartnerIndex> {
  const where: Prisma.PartnerWhereInput = {
    status: VisibilityStatus.VISIBLE,
    ...partnerSearchWhere(filters.query),
    ...(filters.type ? { type: filters.type as PartnerType } : {})
  };

  const partners = await prisma.partner.findMany({
    where,
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { name: "asc" }]
  });
  const lookup = await getTranslationLookup(locale, partnerTranslationEntities(partners));

  return {
    partners: partners.map((partner) => toPublicPartnerCard(partner, locale, lookup)),
    types: Object.values(PartnerType).map((type) => ({
      value: type,
      label: formatEnumLabel(type, locale)
    })),
    filters
  };
}

export async function getAdminPartners(filters: Required<AdminPartnerFilters>) {
  const where: Prisma.PartnerWhereInput = {
    ...partnerSearchWhere(filters.query),
    ...(filters.type ? { type: filters.type as PartnerType } : {}),
    ...(filters.status ? { status: filters.status as VisibilityStatus } : {})
  };

  const partners = await prisma.partner.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }]
  });

  return {
    partners: partners.map((partner) => ({
      id: partner.id,
      name: partner.name,
      slug: partner.slug,
      logoUrl: partner.logoUrl,
      websiteUrl: partner.websiteUrl,
      type: partner.type,
      featured: partner.featured,
      status: partner.status,
      sortOrder: partner.sortOrder,
      updatedAt: partner.updatedAt.toISOString()
    })),
    filters
  };
}

export async function getPartnerForEdit(id: string): Promise<PartnerFormInput | null> {
  const partner = await prisma.partner.findUnique({ where: { id } });

  if (!partner) {
    return null;
  }

  return {
    ...emptyPartnerFormValues(),
    name: partner.name,
    slug: partner.slug,
    logoUrl: partner.logoUrl ?? "",
    websiteUrl: partner.websiteUrl ?? "",
    description: partner.description ?? "",
    type: partner.type,
    featured: partner.featured,
    sortOrder: partner.sortOrder,
    status: partner.status
  };
}
