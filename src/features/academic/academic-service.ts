import { ContentStatus, type Prisma } from "@prisma/client";

import type { Locale } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import { formatEnumLabel, getTranslationLookup, readTranslation, type TranslationEntity } from "@/lib/translations";
import { emptyAcademicFormValues, type AcademicFormInput } from "@/lib/validations/academic";

export type PublicAcademicFilters = {
  query?: string;
  category?: string;
};

export type AdminAcademicFilters = {
  query?: string;
  category?: string;
  status?: string;
};

export type PublicAcademicCard = {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  imageUrl: string | null;
  publishedAt: string;
};

export type PublicAcademicDetail = PublicAcademicCard & {
  content: string;
  seoTitle: string;
  seoDescription: string;
  related: PublicAcademicCard[];
};

export type PublicAcademicIndex = {
  items: PublicAcademicCard[];
  categories: string[];
  filters: Required<PublicAcademicFilters>;
};

type AcademicRecord = Prisma.AcademicContentGetPayload<object>;

function cleanFilter(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
}

function academicSearchWhere(query: string): Prisma.AcademicContentWhereInput {
  if (!query) {
    return {};
  }

  return {
    OR: [
      { title: { contains: query, mode: "insensitive" } },
      { category: { contains: query, mode: "insensitive" } },
      { shortDescription: { contains: query, mode: "insensitive" } },
      { content: { contains: query, mode: "insensitive" } }
    ]
  };
}

function academicTranslationEntities(items: AcademicRecord[]): TranslationEntity[] {
  return items.map((item) => ({ entityType: "AcademicContent", entityId: item.id }));
}

function toPublicAcademicCard(item: AcademicRecord, lookup: Map<string, string>): PublicAcademicCard {
  return {
    id: item.id,
    slug: item.slug,
    title: readTranslation(lookup, "AcademicContent", item.id, "title", item.title),
    category: readTranslation(lookup, "AcademicContent", item.id, "category", item.category),
    shortDescription: readTranslation(lookup, "AcademicContent", item.id, "shortDescription", item.shortDescription),
    imageUrl: item.imageUrl,
    publishedAt: item.publishedAt?.toISOString() ?? item.createdAt.toISOString()
  };
}

export function parsePublicAcademicFilters(searchParams: Record<string, string | string[] | undefined>): Required<PublicAcademicFilters> {
  return {
    query: cleanFilter(searchParams.q),
    category: cleanFilter(searchParams.category)
  };
}

export function parseAdminAcademicFilters(searchParams: Record<string, string | string[] | undefined>): Required<AdminAcademicFilters> {
  const status = cleanFilter(searchParams.status);

  return {
    query: cleanFilter(searchParams.q),
    category: cleanFilter(searchParams.category),
    status: ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status) ? status : ""
  };
}

export async function getPublicAcademicIndex(locale: Locale, filters: Required<PublicAcademicFilters>): Promise<PublicAcademicIndex> {
  const where: Prisma.AcademicContentWhereInput = {
    status: ContentStatus.PUBLISHED,
    ...academicSearchWhere(filters.query),
    ...(filters.category ? { category: filters.category } : {})
  };

  const [items, categoryRows] = await Promise.all([
    prisma.academicContent.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }]
    }),
    prisma.academicContent.findMany({
      where: {
        status: ContentStatus.PUBLISHED
      },
      select: { category: true },
      orderBy: { category: "asc" }
    })
  ]);
  const lookup = await getTranslationLookup(locale, academicTranslationEntities(items));

  return {
    items: items.map((item) => toPublicAcademicCard(item, lookup)),
    categories: Array.from(new Set(categoryRows.map((row) => row.category).filter(Boolean))),
    filters
  };
}

export async function getPublicAcademicDetail(locale: Locale, slug: string): Promise<PublicAcademicDetail | null> {
  const item = await prisma.academicContent.findFirst({
    where: {
      slug,
      status: ContentStatus.PUBLISHED
    }
  });

  if (!item) {
    return null;
  }

  const related = await prisma.academicContent.findMany({
    where: {
      id: { not: item.id },
      status: ContentStatus.PUBLISHED,
      category: item.category
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 3
  });
  const lookup = await getTranslationLookup(locale, academicTranslationEntities([item, ...related]));

  return {
    ...toPublicAcademicCard(item, lookup),
    content: readTranslation(lookup, "AcademicContent", item.id, "content", item.content),
    seoTitle: readTranslation(lookup, "AcademicContent", item.id, "seoTitle", item.seoTitle),
    seoDescription: readTranslation(lookup, "AcademicContent", item.id, "seoDescription", item.seoDescription),
    related: related.map((relatedItem) => toPublicAcademicCard(relatedItem, lookup))
  };
}

export async function getAdminAcademic(filters: Required<AdminAcademicFilters>) {
  const where: Prisma.AcademicContentWhereInput = {
    ...academicSearchWhere(filters.query),
    ...(filters.status ? { status: filters.status as ContentStatus } : {}),
    ...(filters.category ? { category: filters.category } : {})
  };

  const [items, categoryRows] = await Promise.all([
    prisma.academicContent.findMany({
      where,
      orderBy: [{ updatedAt: "desc" }, { title: "asc" }]
    }),
    prisma.academicContent.findMany({
      select: { category: true },
      orderBy: { category: "asc" }
    })
  ]);

  return {
    items: items.map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      category: item.category,
      status: item.status,
      imageUrl: item.imageUrl,
      publishedAt: item.publishedAt?.toISOString() ?? "",
      updatedAt: item.updatedAt.toISOString()
    })),
    categories: Array.from(new Set(categoryRows.map((row) => row.category).filter(Boolean))),
    filters
  };
}

export async function getAcademicForEdit(id: string): Promise<AcademicFormInput | null> {
  const item = await prisma.academicContent.findUnique({ where: { id } });

  if (!item) {
    return null;
  }

  return {
    ...emptyAcademicFormValues(),
    title: item.title,
    slug: item.slug,
    category: item.category,
    shortDescription: item.shortDescription ?? "",
    content: item.content ?? "",
    imageUrl: item.imageUrl ?? "",
    publishedAt: item.publishedAt ? item.publishedAt.toISOString().slice(0, 10) : "",
    status: item.status,
    seoTitle: item.seoTitle ?? "",
    seoDescription: item.seoDescription ?? ""
  };
}

export function formatAcademicStatus(status: string, locale: Locale) {
  return formatEnumLabel(status, locale);
}
