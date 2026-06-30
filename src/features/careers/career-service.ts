import { CareerStatus, VisibilityStatus, WorkType, type Prisma } from "@prisma/client";

import type { Locale } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import { formatEnumLabel, getTranslationLookup, readTranslation, type TranslationEntity } from "@/lib/translations";
import { emptyCareerFormValues, type CareerFormInput } from "@/lib/validations/career";

export type PublicCareerFilters = {
  query?: string;
  division?: string;
  workType?: string;
};

export type AdminCareerFilters = {
  query?: string;
  division?: string;
  workType?: string;
  status?: string;
};

export type CareerFormOptions = {
  divisions: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
};

export type PublicCareerCard = {
  id: string;
  slug: string;
  jobTitle: string;
  divisionName: string;
  divisionSlug: string;
  location: string;
  workType: string;
  workTypeValue: string;
  employmentType: string;
  shortDescription: string;
  isRemote: boolean;
};

export type PublicCareerDetail = PublicCareerCard & {
  requirements: string;
  responsibilities: string;
  benefits: string;
  applyUrl: string | null;
  applyEmail: string | null;
  related: PublicCareerCard[];
};

export type PublicCareerIndex = {
  jobs: PublicCareerCard[];
  divisions: Array<{
    id: string;
    slug: string;
    name: string;
  }>;
  workTypes: Array<{
    value: string;
    label: string;
  }>;
  filters: Required<PublicCareerFilters>;
};

type CareerRecord = Prisma.CareerGetPayload<{
  include: {
    division: true;
  };
}>;

function cleanFilter(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
}

function careerSearchWhere(query: string): Prisma.CareerWhereInput {
  if (!query) {
    return {};
  }

  return {
    OR: [
      { jobTitle: { contains: query, mode: "insensitive" } },
      { location: { contains: query, mode: "insensitive" } },
      { shortDescription: { contains: query, mode: "insensitive" } },
      { requirements: { contains: query, mode: "insensitive" } },
      { responsibilities: { contains: query, mode: "insensitive" } },
      { benefits: { contains: query, mode: "insensitive" } }
    ]
  };
}

function collectCareerTranslationEntities(careers: CareerRecord[]): TranslationEntity[] {
  const entities: TranslationEntity[] = [];

  for (const career of careers) {
    entities.push({ entityType: "Career", entityId: career.id });

    if (career.division) {
      entities.push({ entityType: "Division", entityId: career.division.id });
    }
  }

  return entities;
}

function toPublicCareerCard(career: CareerRecord, locale: Locale, lookup: Map<string, string>): PublicCareerCard {
  return {
    id: career.id,
    slug: career.slug,
    jobTitle: readTranslation(lookup, "Career", career.id, "jobTitle", career.jobTitle),
    divisionName: career.division ? readTranslation(lookup, "Division", career.division.id, "name", career.division.name) : "",
    divisionSlug: career.division?.slug ?? "",
    location: career.location ?? "",
    workType: formatEnumLabel(career.workType, locale),
    workTypeValue: career.workType,
    employmentType: formatEnumLabel(career.employmentType, locale),
    shortDescription: readTranslation(lookup, "Career", career.id, "shortDescription", career.shortDescription),
    isRemote: career.workType === WorkType.REMOTE
  };
}

export function parsePublicCareerFilters(searchParams: Record<string, string | string[] | undefined>): Required<PublicCareerFilters> {
  const workType = cleanFilter(searchParams.workType);

  return {
    query: cleanFilter(searchParams.q),
    division: cleanFilter(searchParams.division),
    workType: Object.values(WorkType).includes(workType as WorkType) ? workType : ""
  };
}

export function parseAdminCareerFilters(searchParams: Record<string, string | string[] | undefined>): Required<AdminCareerFilters> {
  const workType = cleanFilter(searchParams.workType);
  const status = cleanFilter(searchParams.status);

  return {
    query: cleanFilter(searchParams.q),
    division: cleanFilter(searchParams.division),
    workType: Object.values(WorkType).includes(workType as WorkType) ? workType : "",
    status: ["DRAFT", "OPEN", "CLOSED"].includes(status) ? status : ""
  };
}

export async function getCareerFormOptions(): Promise<CareerFormOptions> {
  const divisions = await prisma.division.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
  });

  return {
    divisions: divisions.map((division) => ({
      id: division.id,
      name: division.name,
      slug: division.slug
    }))
  };
}

export async function getPublicCareerIndex(locale: Locale, filters: Required<PublicCareerFilters>): Promise<PublicCareerIndex> {
  const where: Prisma.CareerWhereInput = {
    status: CareerStatus.OPEN,
    ...careerSearchWhere(filters.query),
    ...(filters.division ? { division: { slug: filters.division } } : {}),
    ...(filters.workType ? { workType: filters.workType as WorkType } : {})
  };

  const [careers, divisions] = await Promise.all([
    prisma.career.findMany({
      where,
      include: { division: true },
      orderBy: [{ workType: "desc" }, { createdAt: "desc" }]
    }),
    prisma.division.findMany({
      where: { status: VisibilityStatus.VISIBLE },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
    })
  ]);
  const lookup = await getTranslationLookup(locale, [
    ...collectCareerTranslationEntities(careers),
    ...divisions.map((division) => ({ entityType: "Division", entityId: division.id }))
  ]);

  return {
    jobs: careers.map((career) => toPublicCareerCard(career, locale, lookup)),
    divisions: divisions.map((division) => ({
      id: division.id,
      slug: division.slug,
      name: readTranslation(lookup, "Division", division.id, "name", division.name)
    })),
    workTypes: Object.values(WorkType).map((workType) => ({
      value: workType,
      label: formatEnumLabel(workType, locale)
    })),
    filters
  };
}

export async function getPublicCareerDetail(locale: Locale, slug: string): Promise<PublicCareerDetail | null> {
  const career = await prisma.career.findFirst({
    where: {
      slug,
      status: CareerStatus.OPEN
    },
    include: { division: true }
  });

  if (!career) {
    return null;
  }

  const related = await prisma.career.findMany({
    where: {
      id: { not: career.id },
      status: CareerStatus.OPEN,
      OR: [
        career.divisionId ? { divisionId: career.divisionId } : {},
        { workType: career.workType }
      ].filter((item) => Object.keys(item).length > 0)
    },
    include: { division: true },
    orderBy: [{ createdAt: "desc" }],
    take: 3
  });
  const lookup = await getTranslationLookup(locale, collectCareerTranslationEntities([career, ...related]));

  return {
    ...toPublicCareerCard(career, locale, lookup),
    requirements: readTranslation(lookup, "Career", career.id, "requirements", career.requirements),
    responsibilities: readTranslation(lookup, "Career", career.id, "responsibilities", career.responsibilities),
    benefits: readTranslation(lookup, "Career", career.id, "benefits", career.benefits),
    applyUrl: career.applyUrl,
    applyEmail: career.applyEmail,
    related: related.map((relatedCareer) => toPublicCareerCard(relatedCareer, locale, lookup))
  };
}

export async function getAdminCareers(filters: Required<AdminCareerFilters>) {
  const where: Prisma.CareerWhereInput = {
    ...careerSearchWhere(filters.query),
    ...(filters.status ? { status: filters.status as CareerStatus } : {}),
    ...(filters.workType ? { workType: filters.workType as WorkType } : {}),
    ...(filters.division ? { divisionId: filters.division } : {})
  };

  const [careers, divisions] = await Promise.all([
    prisma.career.findMany({
      where,
      include: { division: true },
      orderBy: [{ updatedAt: "desc" }, { jobTitle: "asc" }]
    }),
    prisma.division.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
    })
  ]);

  return {
    careers: careers.map((career) => ({
      id: career.id,
      jobTitle: career.jobTitle,
      slug: career.slug,
      divisionName: career.division?.name ?? "",
      location: career.location ?? "",
      workType: career.workType,
      employmentType: career.employmentType,
      status: career.status,
      updatedAt: career.updatedAt.toISOString()
    })),
    divisions: divisions.map((division) => ({
      id: division.id,
      name: division.name
    })),
    filters
  };
}

export async function getCareerForEdit(id: string): Promise<CareerFormInput | null> {
  const career = await prisma.career.findUnique({ where: { id } });

  if (!career) {
    return null;
  }

  return {
    ...emptyCareerFormValues(),
    jobTitle: career.jobTitle,
    slug: career.slug,
    divisionId: career.divisionId ?? "",
    location: career.location ?? "",
    workType: career.workType,
    employmentType: career.employmentType,
    shortDescription: career.shortDescription ?? "",
    requirements: career.requirements ?? "",
    responsibilities: career.responsibilities ?? "",
    benefits: career.benefits ?? "",
    status: career.status,
    applyUrl: career.applyUrl ?? "",
    applyEmail: career.applyEmail ?? ""
  };
}
