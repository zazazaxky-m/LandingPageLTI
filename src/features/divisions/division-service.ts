import { ProductStatus, VisibilityStatus, type Prisma } from "@prisma/client";

import type { PublicProductCard } from "@/features/products/product-service";
import type { Locale } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import { formatEnumLabel, getTranslationLookup, readTranslation, type TranslationEntity } from "@/lib/translations";
import { emptyDivisionFormValues, type DivisionFormInput } from "@/lib/validations/division";

export type PublicDivisionCard = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  icon: string;
  imageUrl: string | null;
  memberCount: number;
  productCount: number;
  employeeCount: number;
};

export type PublicDivisionIndex = {
  divisions: PublicDivisionCard[];
  totals: {
    divisions: number;
    members: number;
    products: number;
  };
};

export type PublicDivisionDetail = PublicDivisionCard & {
  relatedProducts: PublicProductCard[];
  employees: Array<{
    id: string;
    slug: string;
    name: string;
    role: string;
    shortBio: string;
    photoUrl: string | null;
    skills: string[];
  }>;
};

export type AdminDivisionFilters = {
  query?: string;
  status?: string;
};

type PublicDivisionRecord = Prisma.DivisionGetPayload<{
  include: {
    products: {
      include: {
        division: true;
        features: true;
        images: true;
        techStack: true;
      };
    };
    employees: {
      include: {
        skills: true;
      };
    };
  };
}>;

type ProductCardRecord = Prisma.ProductGetPayload<{
  include: {
    division: true;
    features: true;
    images: true;
    techStack: true;
  };
}>;

function cleanFilter(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
}

function divisionSearchWhere(query: string): Prisma.DivisionWhereInput {
  if (!query) {
    return {};
  }

  return {
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { shortDescription: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { slug: { contains: query, mode: "insensitive" } }
    ]
  };
}

function collectDivisionEntities(divisions: PublicDivisionRecord[]) {
  const entities: TranslationEntity[] = [];

  for (const division of divisions) {
    entities.push({ entityType: "Division", entityId: division.id });

    for (const product of division.products) {
      entities.push({ entityType: "Product", entityId: product.id });

      for (const feature of product.features) {
        entities.push({ entityType: "ProductFeature", entityId: feature.id });
      }

      for (const stack of product.techStack) {
        entities.push({ entityType: "ProductTechStack", entityId: stack.id });
      }
    }

    for (const employee of division.employees) {
      entities.push({ entityType: "Employee", entityId: employee.id });
    }
  }

  return entities;
}

function collectProductEntities(products: ProductCardRecord[]) {
  const entities: TranslationEntity[] = [];

  for (const product of products) {
    entities.push({ entityType: "Product", entityId: product.id });

    if (product.division) {
      entities.push({ entityType: "Division", entityId: product.division.id });
    }

    for (const feature of product.features) {
      entities.push({ entityType: "ProductFeature", entityId: feature.id });
    }

    for (const stack of product.techStack) {
      entities.push({ entityType: "ProductTechStack", entityId: stack.id });
    }
  }

  return entities;
}

function toDivisionCard(division: PublicDivisionRecord, locale: Locale, lookup: Map<string, string>): PublicDivisionCard {
  const products = division.products.filter((product) => product.status === ProductStatus.PUBLISHED);
  const employees = division.employees.filter((employee) => employee.status === "ACTIVE");

  return {
    id: division.id,
    slug: division.slug,
    name: readTranslation(lookup, "Division", division.id, "name", division.name),
    shortDescription: readTranslation(lookup, "Division", division.id, "shortDescription", division.shortDescription),
    description: readTranslation(lookup, "Division", division.id, "description", division.description),
    icon: division.icon ?? division.name.slice(0, 3).toUpperCase(),
    imageUrl: division.imageUrl,
    memberCount: division.memberCount ?? employees.length,
    productCount: products.length,
    employeeCount: employees.length
  };
}

function toProductCard(product: ProductCardRecord, locale: Locale, lookup: Map<string, string>): PublicProductCard {
  return {
    id: product.id,
    slug: product.slug,
    name: readTranslation(lookup, "Product", product.id, "name", product.name),
    shortDescription: readTranslation(lookup, "Product", product.id, "shortDescription", product.shortDescription),
    category: product.category ?? product.division?.name ?? "",
    divisionName: product.division
      ? readTranslation(lookup, "Division", product.division.id, "name", product.division.name)
      : "",
    status: formatEnumLabel(product.status, locale),
    imageUrl: product.images[0]?.url ?? null,
    techStack: product.techStack.map((stack) => readTranslation(lookup, "ProductTechStack", stack.id, "name", stack.name)),
    featureCount: product.features.length
  };
}

export function parseAdminDivisionFilters(searchParams: Record<string, string | string[] | undefined>): Required<AdminDivisionFilters> {
  const status = cleanFilter(searchParams.status);

  return {
    query: cleanFilter(searchParams.q),
    status: ["VISIBLE", "HIDDEN"].includes(status) ? status : ""
  };
}

export async function getPublicDivisionIndex(locale: Locale): Promise<PublicDivisionIndex> {
  const divisions = await prisma.division.findMany({
    where: { status: VisibilityStatus.VISIBLE },
    include: {
      products: {
        where: { status: ProductStatus.PUBLISHED },
        include: {
          division: true,
          features: true,
          images: true,
          techStack: true
        }
      },
      employees: {
        where: { status: "ACTIVE" },
        include: { skills: true }
      }
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
  });

  const lookup = await getTranslationLookup(locale, collectDivisionEntities(divisions));
  const cards = divisions.map((division) => toDivisionCard(division, locale, lookup));

  return {
    divisions: cards,
    totals: {
      divisions: cards.length,
      members: cards.reduce((total, division) => total + division.memberCount, 0),
      products: cards.reduce((total, division) => total + division.productCount, 0)
    }
  };
}

export async function getPublicDivisionDetail(locale: Locale, slug: string): Promise<PublicDivisionDetail | null> {
  const division = await prisma.division.findFirst({
    where: {
      slug,
      status: VisibilityStatus.VISIBLE
    },
    include: {
      products: {
        where: { status: ProductStatus.PUBLISHED },
        include: {
          division: true,
          features: { orderBy: [{ sortOrder: "asc" }, { title: "asc" }] },
          images: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
          techStack: { orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }
        },
        orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }]
      },
      employees: {
        where: { status: "ACTIVE" },
        include: {
          skills: { orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }
        },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
      }
    }
  });

  if (!division) {
    return null;
  }

  const lookup = await getTranslationLookup(locale, [
    ...collectDivisionEntities([division]),
    ...collectProductEntities(division.products)
  ]);
  const card = toDivisionCard(division, locale, lookup);

  return {
    ...card,
    relatedProducts: division.products.map((product) => toProductCard(product, locale, lookup)),
    employees: division.employees.map((employee) => ({
      id: employee.id,
      slug: employee.slug,
      name: readTranslation(lookup, "Employee", employee.id, "name", employee.name),
      role: readTranslation(lookup, "Employee", employee.id, "role", employee.role),
      shortBio: readTranslation(lookup, "Employee", employee.id, "shortBio", employee.shortBio),
      photoUrl: employee.photoUrl,
      skills: employee.skills.map((skill) => skill.name)
    }))
  };
}

export async function getAdminDivisions(filters: Required<AdminDivisionFilters>) {
  const where: Prisma.DivisionWhereInput = {
    ...divisionSearchWhere(filters.query),
    ...(filters.status ? { status: filters.status as VisibilityStatus } : {})
  };

  const divisions = await prisma.division.findMany({
    where,
    include: {
      _count: {
        select: {
          products: true,
          employees: true,
          careers: true
        }
      }
    },
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }]
  });

  return {
    divisions: divisions.map((division) => ({
      id: division.id,
      name: division.name,
      slug: division.slug,
      shortDescription: division.shortDescription ?? "",
      icon: division.icon ?? "",
      memberCount: division.memberCount ?? 0,
      status: division.status,
      sortOrder: division.sortOrder,
      updatedAt: division.updatedAt.toISOString(),
      counts: division._count
    })),
    filters
  };
}

export async function getDivisionForEdit(id: string): Promise<DivisionFormInput | null> {
  const division = await prisma.division.findUnique({
    where: { id }
  });

  if (!division) {
    return null;
  }

  return {
    ...emptyDivisionFormValues(),
    name: division.name,
    slug: division.slug,
    shortDescription: division.shortDescription ?? "",
    description: division.description ?? "",
    icon: division.icon ?? "",
    imageUrl: division.imageUrl ?? "",
    memberCount: division.memberCount ?? 0,
    status: division.status,
    sortOrder: division.sortOrder
  };
}
