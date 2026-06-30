import { ProductStatus, type Prisma } from "@prisma/client";

import type { Locale } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import { formatEnumLabel, getTranslationLookup, readTranslation, type TranslationEntity } from "@/lib/translations";
import { emptyProductFormValues, type ProductFormInput } from "@/lib/validations/product";

export type PublicProductListFilters = {
  query?: string;
  division?: string;
  category?: string;
};

export type AdminProductListFilters = {
  query?: string;
  division?: string;
  status?: string;
};

export type ProductFormOptions = {
  divisions: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
};

export type PublicProductCard = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  category: string;
  divisionName: string;
  status: string;
  imageUrl: string | null;
  techStack: string[];
  featureCount: number;
};

export type PublicProductDetail = PublicProductCard & {
  fullDescription: string;
  youtubeUrl: string | null;
  seoTitle: string;
  seoDescription: string;
  useCases: string[];
  images: Array<{
    id: string;
    url: string;
    altText: string;
  }>;
  features: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  specifications: Array<{
    id: string;
    label: string;
    value: string;
    unit: string;
  }>;
  techStackItems: Array<{
    id: string;
    name: string;
    version: string;
  }>;
  relatedProducts: PublicProductCard[];
};

export type PublicProductIndex = {
  products: PublicProductCard[];
  divisions: Array<{
    id: string;
    slug: string;
    name: string;
  }>;
  categories: string[];
  filters: Required<PublicProductListFilters>;
};

type ProductWithPublicRelations = Prisma.ProductGetPayload<{
  include: {
    division: true;
    features: true;
    images: true;
    specifications: true;
    techStack: true;
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

function productSearchWhere(query: string): Prisma.ProductWhereInput {
  if (!query) {
    return {};
  }

  return {
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { shortDescription: { contains: query, mode: "insensitive" } },
      { fullDescription: { contains: query, mode: "insensitive" } },
      { category: { contains: query, mode: "insensitive" } }
    ]
  };
}

function collectProductTranslationEntities(products: ProductCardRecord[] | ProductWithPublicRelations[]) {
  const entities: TranslationEntity[] = [];

  for (const product of products) {
    entities.push({ entityType: "Product", entityId: product.id });

    if (product.division) {
      entities.push({ entityType: "Division", entityId: product.division.id });
    }

    for (const feature of product.features) {
      entities.push({ entityType: "ProductFeature", entityId: feature.id });
    }

    if ("specifications" in product) {
      for (const specification of product.specifications) {
        entities.push({ entityType: "ProductSpecification", entityId: specification.id });
      }
    }

    if ("techStack" in product) {
      for (const stack of product.techStack) {
        entities.push({ entityType: "ProductTechStack", entityId: stack.id });
      }
    }
  }

  return entities;
}

function toPublicProductCard(product: ProductCardRecord, locale: Locale, lookup: Map<string, string>): PublicProductCard {
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

function toPublicProductDetail(
  product: ProductWithPublicRelations,
  relatedProducts: ProductCardRecord[],
  locale: Locale,
  lookup: Map<string, string>
): PublicProductDetail {
  return {
    ...toPublicProductCard(product, locale, lookup),
    fullDescription: readTranslation(lookup, "Product", product.id, "fullDescription", product.fullDescription),
    youtubeUrl: product.youtubeUrl,
    seoTitle: readTranslation(lookup, "Product", product.id, "seoTitle", product.seoTitle),
    seoDescription: readTranslation(lookup, "Product", product.id, "seoDescription", product.seoDescription),
    useCases: product.useCases,
    images: product.images.map((image) => ({
      id: image.id,
      url: image.url,
      altText: readTranslation(lookup, "ProductImage", image.id, "altText", image.altText)
    })),
    features: product.features.map((feature) => ({
      id: feature.id,
      title: readTranslation(lookup, "ProductFeature", feature.id, "title", feature.title),
      description: readTranslation(lookup, "ProductFeature", feature.id, "description", feature.description)
    })),
    specifications: product.specifications.map((specification) => ({
      id: specification.id,
      label: readTranslation(lookup, "ProductSpecification", specification.id, "label", specification.label),
      value: readTranslation(lookup, "ProductSpecification", specification.id, "value", specification.value),
      unit: specification.unit ?? ""
    })),
    techStackItems: product.techStack.map((stack) => ({
      id: stack.id,
      name: readTranslation(lookup, "ProductTechStack", stack.id, "name", stack.name),
      version: stack.version ?? ""
    })),
    relatedProducts: relatedProducts.map((relatedProduct) => toPublicProductCard(relatedProduct, locale, lookup))
  };
}

export function parsePublicProductFilters(searchParams: Record<string, string | string[] | undefined>): Required<PublicProductListFilters> {
  return {
    query: cleanFilter(searchParams.q),
    division: cleanFilter(searchParams.division),
    category: cleanFilter(searchParams.category)
  };
}

export function parseAdminProductFilters(searchParams: Record<string, string | string[] | undefined>): Required<AdminProductListFilters> {
  const status = cleanFilter(searchParams.status);

  return {
    query: cleanFilter(searchParams.q),
    division: cleanFilter(searchParams.division),
    status: ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status) ? status : ""
  };
}

export async function getProductFormOptions(): Promise<ProductFormOptions> {
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

export async function getPublicProductIndex(locale: Locale, filters: Required<PublicProductListFilters>): Promise<PublicProductIndex> {
  const where: Prisma.ProductWhereInput = {
    status: ProductStatus.PUBLISHED,
    ...productSearchWhere(filters.query),
    ...(filters.division ? { division: { slug: filters.division } } : {}),
    ...(filters.category ? { category: filters.category } : {})
  };

  const [products, divisions, categoryRows] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        division: true,
        features: { orderBy: [{ sortOrder: "asc" }, { title: "asc" }] },
        images: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
        techStack: { orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }
      },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }]
    }),
    prisma.division.findMany({
      where: { status: "VISIBLE" },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
    }),
    prisma.product.findMany({
      where: {
        status: ProductStatus.PUBLISHED,
        category: { not: null }
      },
      select: { category: true },
      orderBy: { category: "asc" }
    })
  ]);

  const translationEntities: TranslationEntity[] = [
    ...collectProductTranslationEntities(products),
    ...divisions.map((division) => ({ entityType: "Division", entityId: division.id }))
  ];
  const lookup = await getTranslationLookup(locale, translationEntities);
  const categories = Array.from(new Set(categoryRows.map((row) => row.category).filter(Boolean))) as string[];

  return {
    products: products.map((product) => toPublicProductCard(product, locale, lookup)),
    divisions: divisions.map((division) => ({
      id: division.id,
      slug: division.slug,
      name: readTranslation(lookup, "Division", division.id, "name", division.name)
    })),
    categories,
    filters
  };
}

export async function getPublicProductDetail(locale: Locale, slug: string) {
  const product = await prisma.product.findFirst({
    where: {
      slug,
      status: ProductStatus.PUBLISHED
    },
    include: {
      division: true,
      features: { orderBy: [{ sortOrder: "asc" }, { title: "asc" }] },
      images: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
      specifications: { orderBy: [{ sortOrder: "asc" }, { label: "asc" }] },
      techStack: { orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }
    }
  });

  if (!product) {
    return null;
  }

  const relatedConditions: Prisma.ProductWhereInput[] = [
    product.divisionId ? { divisionId: product.divisionId } : {},
    product.category ? { category: product.category } : {}
  ].filter((item) => Object.keys(item).length > 0);

  const relatedProducts = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      status: ProductStatus.PUBLISHED,
      ...(relatedConditions.length > 0 ? { OR: relatedConditions } : {})
    },
    include: {
      division: true,
      features: { orderBy: [{ sortOrder: "asc" }, { title: "asc" }] },
      images: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
      techStack: { orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }
    },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    take: 3
  });

  const lookup = await getTranslationLookup(locale, [
    ...collectProductTranslationEntities([product, ...relatedProducts]),
    ...product.images.map((image) => ({ entityType: "ProductImage", entityId: image.id }))
  ]);

  return toPublicProductDetail(product, relatedProducts, locale, lookup);
}

export async function getAdminProducts(filters: Required<AdminProductListFilters>) {
  const where: Prisma.ProductWhereInput = {
    ...productSearchWhere(filters.query),
    ...(filters.status ? { status: filters.status as ProductStatus } : {}),
    ...(filters.division ? { divisionId: filters.division } : {})
  };

  const [products, divisions] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        division: true,
        _count: {
          select: {
            features: true,
            images: true,
            specifications: true,
            techStack: true
          }
        }
      },
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }]
    }),
    prisma.division.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
    })
  ]);

  return {
    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: product.category ?? "",
      divisionName: product.division?.name ?? "",
      status: product.status,
      featured: product.featured,
      sortOrder: product.sortOrder,
      updatedAt: product.updatedAt.toISOString(),
      counts: product._count
    })),
    divisions: divisions.map((division) => ({
      id: division.id,
      name: division.name
    })),
    filters
  };
}

export async function getProductForEdit(id: string): Promise<ProductFormInput | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      features: { orderBy: [{ sortOrder: "asc" }, { title: "asc" }] },
      images: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
      specifications: { orderBy: [{ sortOrder: "asc" }, { label: "asc" }] },
      techStack: { orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }
    }
  });

  if (!product) {
    return null;
  }

  return {
    ...emptyProductFormValues(),
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription ?? "",
    fullDescription: product.fullDescription ?? "",
    category: product.category ?? "",
    divisionId: product.divisionId ?? "",
    youtubeUrl: product.youtubeUrl ?? "",
    status: product.status,
    featured: product.featured,
    sortOrder: product.sortOrder,
    seoTitle: product.seoTitle ?? "",
    seoDescription: product.seoDescription ?? "",
    images: product.images.map((image) => ({
      url: image.url,
      altText: image.altText ?? "",
      sortOrder: image.sortOrder
    })),
    features: product.features.map((feature) => ({
      title: feature.title,
      description: feature.description ?? ""
    })),
    specifications: product.specifications.map((specification) => ({
      label: specification.label,
      value: specification.value,
      unit: specification.unit ?? ""
    })),
    techStack: product.techStack.map((stack) => ({
      name: stack.name,
      version: stack.version ?? ""
    })),
    useCases: product.useCases.map((value) => ({ value }))
  };
}

export async function getAdminDashboardStats() {
  const [totalProducts, publishedProducts, totalEmployees, openCareers, newContactSubmissions, totalPartners] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { status: ProductStatus.PUBLISHED } }),
      prisma.employee.count(),
      prisma.career.count({ where: { status: "OPEN" } }),
      prisma.contactSubmission.count({ where: { status: "NEW" } }),
      prisma.partner.count()
    ]);

  return {
    totalProducts,
    publishedProducts,
    totalEmployees,
    openCareers,
    newContactSubmissions,
    totalPartners
  };
}
