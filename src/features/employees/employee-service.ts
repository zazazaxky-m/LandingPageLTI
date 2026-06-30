import { EmployeeStatus, VisibilityStatus, type Prisma } from "@prisma/client";

import type { Locale } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import { formatEnumLabel, getTranslationLookup, readTranslation, type TranslationEntity } from "@/lib/translations";
import { emptyEmployeeFormValues, type EmployeeFormInput } from "@/lib/validations/employee";

export type PublicEmployeeFilters = {
  query?: string;
  division?: string;
};

export type AdminEmployeeFilters = {
  query?: string;
  division?: string;
  status?: string;
};

export type EmployeeFormOptions = {
  divisions: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
};

export type PublicEmployeeCard = {
  id: string;
  slug: string;
  name: string;
  role: string;
  divisionName: string;
  divisionSlug: string;
  photoUrl: string | null;
  shortBio: string;
  experienceHistory: string;
  linkedinUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  email: string | null;
  skills: string[];
};

export type PublicEmployeeIndex = {
  employees: PublicEmployeeCard[];
  divisions: Array<{
    id: string;
    slug: string;
    name: string;
  }>;
  filters: Required<PublicEmployeeFilters>;
  totals: {
    employees: number;
    divisions: number;
    skills: number;
  };
};

type EmployeeRecord = Prisma.EmployeeGetPayload<{
  include: {
    division: true;
    skills: true;
  };
}>;

function cleanFilter(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
}

function employeeSearchWhere(query: string): Prisma.EmployeeWhereInput {
  if (!query) {
    return {};
  }

  return {
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { role: { contains: query, mode: "insensitive" } },
      { shortBio: { contains: query, mode: "insensitive" } },
      { experienceHistory: { contains: query, mode: "insensitive" } },
      { skills: { some: { name: { contains: query, mode: "insensitive" } } } }
    ]
  };
}

function collectEmployeeTranslationEntities(employees: EmployeeRecord[]) {
  const entities: TranslationEntity[] = [];

  for (const employee of employees) {
    entities.push({ entityType: "Employee", entityId: employee.id });

    if (employee.division) {
      entities.push({ entityType: "Division", entityId: employee.division.id });
    }
  }

  return entities;
}

function toPublicEmployeeCard(employee: EmployeeRecord, lookup: Map<string, string>): PublicEmployeeCard {
  return {
    id: employee.id,
    slug: employee.slug,
    name: readTranslation(lookup, "Employee", employee.id, "name", employee.name),
    role: readTranslation(lookup, "Employee", employee.id, "role", employee.role),
    divisionName: employee.division
      ? readTranslation(lookup, "Division", employee.division.id, "name", employee.division.name)
      : "",
    divisionSlug: employee.division?.slug ?? "",
    photoUrl: employee.photoUrl,
    shortBio: readTranslation(lookup, "Employee", employee.id, "shortBio", employee.shortBio),
    experienceHistory: readTranslation(lookup, "Employee", employee.id, "experienceHistory", employee.experienceHistory),
    linkedinUrl: employee.linkedinUrl,
    githubUrl: employee.githubUrl,
    portfolioUrl: employee.portfolioUrl,
    email: employee.email,
    skills: employee.skills.map((skill) => skill.name)
  };
}

export function parsePublicEmployeeFilters(searchParams: Record<string, string | string[] | undefined>): Required<PublicEmployeeFilters> {
  return {
    query: cleanFilter(searchParams.q),
    division: cleanFilter(searchParams.division)
  };
}

export function parseAdminEmployeeFilters(searchParams: Record<string, string | string[] | undefined>): Required<AdminEmployeeFilters> {
  const status = cleanFilter(searchParams.status);

  return {
    query: cleanFilter(searchParams.q),
    division: cleanFilter(searchParams.division),
    status: ["ACTIVE", "INACTIVE"].includes(status) ? status : ""
  };
}

export async function getEmployeeFormOptions(): Promise<EmployeeFormOptions> {
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

export async function getPublicEmployeeIndex(locale: Locale, filters: Required<PublicEmployeeFilters>): Promise<PublicEmployeeIndex> {
  const where: Prisma.EmployeeWhereInput = {
    status: EmployeeStatus.ACTIVE,
    ...employeeSearchWhere(filters.query),
    ...(filters.division ? { division: { slug: filters.division } } : {})
  };

  const [employees, divisions] = await Promise.all([
    prisma.employee.findMany({
      where,
      include: {
        division: true,
        skills: { orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
    }),
    prisma.division.findMany({
      where: { status: VisibilityStatus.VISIBLE },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
    })
  ]);

  const lookup = await getTranslationLookup(locale, [
    ...collectEmployeeTranslationEntities(employees),
    ...divisions.map((division) => ({ entityType: "Division", entityId: division.id }))
  ]);
  const uniqueSkills = new Set(employees.flatMap((employee) => employee.skills.map((skill) => skill.name)));

  return {
    employees: employees.map((employee) => toPublicEmployeeCard(employee, lookup)),
    divisions: divisions.map((division) => ({
      id: division.id,
      slug: division.slug,
      name: readTranslation(lookup, "Division", division.id, "name", division.name)
    })),
    filters,
    totals: {
      employees: employees.length,
      divisions: divisions.length,
      skills: uniqueSkills.size
    }
  };
}

export async function getAdminEmployees(filters: Required<AdminEmployeeFilters>) {
  const where: Prisma.EmployeeWhereInput = {
    ...employeeSearchWhere(filters.query),
    ...(filters.status ? { status: filters.status as EmployeeStatus } : {}),
    ...(filters.division ? { divisionId: filters.division } : {})
  };

  const [employees, divisions] = await Promise.all([
    prisma.employee.findMany({
      where,
      include: {
        division: true,
        skills: { orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }
      },
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }]
    }),
    prisma.division.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
    })
  ]);

  return {
    employees: employees.map((employee) => ({
      id: employee.id,
      name: employee.name,
      slug: employee.slug,
      role: employee.role,
      divisionName: employee.division?.name ?? "",
      status: employee.status,
      sortOrder: employee.sortOrder,
      photoUrl: employee.photoUrl,
      skillCount: employee.skills.length,
      skills: employee.skills.map((skill) => skill.name),
      updatedAt: employee.updatedAt.toISOString()
    })),
    divisions: divisions.map((division) => ({
      id: division.id,
      name: division.name
    })),
    filters
  };
}

export async function getEmployeeForEdit(id: string): Promise<EmployeeFormInput | null> {
  const employee = await prisma.employee.findUnique({
    where: { id },
    include: {
      skills: { orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }
    }
  });

  if (!employee) {
    return null;
  }

  return {
    ...emptyEmployeeFormValues(),
    name: employee.name,
    slug: employee.slug,
    role: employee.role,
    divisionId: employee.divisionId ?? "",
    photoUrl: employee.photoUrl ?? "",
    shortBio: employee.shortBio ?? "",
    experienceHistory: employee.experienceHistory ?? "",
    linkedinUrl: employee.linkedinUrl ?? "",
    githubUrl: employee.githubUrl ?? "",
    portfolioUrl: employee.portfolioUrl ?? "",
    email: employee.email ?? "",
    status: employee.status,
    sortOrder: employee.sortOrder,
    skills: employee.skills.map((skill) => ({ name: skill.name }))
  };
}

export function formatEmployeeStatus(status: string, locale: Locale) {
  return formatEnumLabel(status, locale);
}
