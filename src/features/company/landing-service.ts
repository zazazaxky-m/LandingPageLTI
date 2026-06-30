import { CareerStatus, ContactInterest, ContentStatus, EmployeeStatus, ProductStatus, VisibilityStatus } from "@prisma/client";

import type { Locale } from "@/i18n/config";
import { locales } from "@/i18n/config";
import { normalizeCursorVariant, type CursorVariant } from "@/lib/cursor-variants";
import { prisma } from "@/lib/prisma";
import { formatEnumLabel, getTranslationLookup, readTranslation } from "@/lib/translations";

export type LandingContent = {
  company: {
    id: string;
    name: string;
    tagline: string;
    shortDescription: string;
    longDescription: string;
    vision: string;
    mission: string;
    address: string;
    email: string;
    phone: string;
    logoUrl: string | null;
    mainCtaText: string;
    mainCtaUrl: string;
    remoteHighlightTitle: string;
    remoteHighlightBody: string;
    seoTitle: string;
    seoDescription: string;
  };
  heroTags: string[];
  heroStats: Array<{
    value: string;
    label: string;
  }>;
  divisions: Array<{
    id: string;
    slug: string;
    name: string;
    shortDescription: string;
    description: string;
    icon: string;
    memberCount: number;
    productCount: number;
  }>;
  partners: Array<{
    id: string;
    slug: string;
    name: string;
    logoUrl: string | null;
    websiteUrl: string | null;
    type: string;
    description: string;
  }>;
  featuredProducts: Array<{
    id: string;
    slug: string;
    name: string;
    shortDescription: string;
    category: string;
    status: string;
    imageUrl: string | null;
    divisionName: string;
    techStack: string[];
    features: string[];
    useCases: string[];
  }>;
  employees: Array<{
    id: string;
    slug: string;
    name: string;
    role: string;
    shortBio: string;
    photoUrl: string | null;
    divisionName: string;
    skills: string[];
  }>;
  academic: Array<{
    id: string;
    slug: string;
    title: string;
    category: string;
    shortDescription: string;
  }>;
  careers: Array<{
    id: string;
    slug: string;
    jobTitle: string;
    divisionName: string;
    location: string;
    workType: string;
    employmentType: string;
    shortDescription: string;
  }>;
  contactInterests: Array<{
    value: ContactInterest;
    label: string;
  }>;
  whyItems: Array<{
    title: string;
    body: string;
  }>;
};

const statLabels: Record<Locale, { divisions: string; members: string; languages: string }> = {
  en: {
    divisions: "Divisions",
    members: "Core members",
    languages: "Languages"
  },
  id: {
    divisions: "Divisi",
    members: "Core member",
    languages: "Bahasa"
  },
  zh: {
    divisions: "部门",
    members: "核心成员",
    languages: "语言"
  }
};

const whyLabels: Record<Locale, { vision: string; mission: string; remote: string }> = {
  en: {
    vision: "Clear engineering direction",
    mission: "Prototype to production delivery",
    remote: "Remote-ready collaboration"
  },
  id: {
    vision: "Arah engineering yang jelas",
    mission: "Delivery dari prototype ke production",
    remote: "Kolaborasi siap remote"
  },
  zh: {
    vision: "清晰的工程方向",
    mission: "从原型到生产交付",
    remote: "支持远程协作"
  }
};

const fallbackBrand = {
  name: "Lumiatech",
  tagline: "Discover Engineering Technology",
  cursorVariant: "GLOW" satisfies CursorVariant
};

const fallbackCopy: Record<
  Locale,
  {
    shortDescription: string;
    longDescription: string;
    vision: string;
    mission: string;
    remoteHighlightTitle: string;
    remoteHighlightBody: string;
    mainCtaText: string;
  }
> = {
  en: {
    shortDescription:
      "A remote-ready engineering technology company building prototypes, IT platforms, mobile products, and secure digital systems.",
    longDescription:
      "Lumiatech connects practical engineering, software delivery, mobile product development, and security thinking into one focused technology partner.",
    vision: "Make engineering technology easier to discover, validate, and deliver.",
    mission: "Deliver documented prototypes, platforms, mobile apps, and secure systems through focused cross-functional collaboration.",
    remoteHighlightTitle: "Remote-ready collaboration",
    remoteHighlightBody:
      "Remote work is supported through documented workflows, async project notes, scheduled reviews, and clear technical ownership.",
    mainCtaText: "Contact Us"
  },
  id: {
    shortDescription:
      "Perusahaan teknologi engineering yang siap remote untuk membangun prototype, platform IT, produk mobile, dan sistem digital yang aman.",
    longDescription:
      "Lumiatech menghubungkan engineering praktis, delivery software, pengembangan produk mobile, dan security thinking dalam satu partner teknologi yang fokus.",
    vision: "Membuat teknologi engineering lebih mudah ditemukan, divalidasi, dan dikirimkan.",
    mission:
      "Mengirim prototype, platform, aplikasi mobile, dan sistem aman melalui kolaborasi lintas fungsi yang fokus dan terdokumentasi.",
    remoteHighlightTitle: "Kolaborasi siap remote",
    remoteHighlightBody:
      "Kerja remote didukung dengan workflow terdokumentasi, catatan project async, review terjadwal, dan ownership teknis yang jelas.",
    mainCtaText: "Hubungi Kami"
  },
  zh: {
    shortDescription:
      "A remote-ready engineering technology company building prototypes, IT platforms, mobile products, and secure digital systems.",
    longDescription:
      "Lumiatech connects practical engineering, software delivery, mobile product development, and security thinking into one focused technology partner.",
    vision: "Make engineering technology easier to discover, validate, and deliver.",
    mission: "Deliver documented prototypes, platforms, mobile apps, and secure systems through focused cross-functional collaboration.",
    remoteHighlightTitle: "Remote-ready collaboration",
    remoteHighlightBody:
      "Remote work is supported through documented workflows, async project notes, scheduled reviews, and clear technical ownership.",
    mainCtaText: "Contact Us"
  }
};

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isDatabaseConnectionError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("Can't reach database server") ||
    message.includes("PrismaClientInitializationError") ||
    message.includes("P1001")
  );
}

async function withDatabaseRetry<T>(operation: () => Promise<T>, label: string, attempts = 3): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (!isDatabaseConnectionError(error) || attempt === attempts) {
        break;
      }

      await delay(350 * attempt);
    }
  }

  console.error(`Database operation failed: ${label}`, lastError);
  throw lastError;
}

function getFallbackLandingContent(locale: Locale): LandingContent {
  const copy = fallbackCopy[locale];

  return {
    company: {
      id: "fallback-company",
      name: fallbackBrand.name,
      tagline: fallbackBrand.tagline,
      shortDescription: copy.shortDescription,
      longDescription: copy.longDescription,
      vision: copy.vision,
      mission: copy.mission,
      address: "",
      email: "",
      phone: "",
      logoUrl: null,
      mainCtaText: copy.mainCtaText,
      mainCtaUrl: `/${locale}#contact`,
      remoteHighlightTitle: copy.remoteHighlightTitle,
      remoteHighlightBody: copy.remoteHighlightBody,
      seoTitle: `${fallbackBrand.name} - ${fallbackBrand.tagline}`,
      seoDescription: copy.shortDescription
    },
    heroTags: [],
    heroStats: [
      { value: "0", label: statLabels[locale].divisions },
      { value: "0+", label: statLabels[locale].members },
      { value: String(locales.length), label: statLabels[locale].languages }
    ],
    divisions: [],
    partners: [],
    featuredProducts: [],
    employees: [],
    academic: [],
    careers: [],
    contactInterests: Object.values(ContactInterest).map((interest) => ({
      value: interest,
      label: formatEnumLabel(interest, locale)
    })),
    whyItems: [
      {
        title: whyLabels[locale].vision,
        body: copy.vision
      },
      {
        title: whyLabels[locale].mission,
        body: copy.mission
      },
      {
        title: whyLabels[locale].remote,
        body: copy.remoteHighlightBody
      }
    ]
  };
}

function productCountByDivision(products: Array<{ divisionId: string | null }>) {
  return products.reduce<Map<string, number>>((accumulator, product) => {
    if (!product.divisionId) {
      return accumulator;
    }

    accumulator.set(product.divisionId, (accumulator.get(product.divisionId) ?? 0) + 1);
    return accumulator;
  }, new Map<string, number>());
}

async function fetchLandingRecords() {
  const [company, divisions, products, publishedProductDivisionRefs, partners, employees, academic, careers] =
    await withDatabaseRetry(
      () =>
        Promise.all([
          prisma.companySetting.findFirst({
            orderBy: { createdAt: "asc" }
          }),
          prisma.division.findMany({
            where: { status: VisibilityStatus.VISIBLE },
            orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
          }),
          prisma.product.findMany({
            where: {
              featured: true,
              status: ProductStatus.PUBLISHED
            },
            include: {
              division: true,
              features: { orderBy: [{ sortOrder: "asc" }, { title: "asc" }] },
              images: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
              techStack: { orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }
            },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
            take: 6
          }),
          prisma.product.findMany({
            where: { status: ProductStatus.PUBLISHED },
            select: { divisionId: true }
          }),
          prisma.partner.findMany({
            where: {
              featured: true,
              status: VisibilityStatus.VISIBLE
            },
            orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
            take: 12
          }),
          prisma.employee.findMany({
            where: { status: EmployeeStatus.ACTIVE },
            include: {
              division: true,
              skills: { orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }
            },
            orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
            take: 8
          }),
          prisma.academicContent.findMany({
            where: { status: ContentStatus.PUBLISHED },
            orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
            take: 3
          }),
          prisma.career.findMany({
            where: { status: CareerStatus.OPEN },
            include: { division: true },
            orderBy: [{ createdAt: "desc" }],
            take: 3
          })
        ]),
      "landing records"
    );

  return { company, divisions, products, publishedProductDivisionRefs, partners, employees, academic, careers };
}

export async function getCompanyBrand(locale: Locale) {
  let company;

  try {
    company = await withDatabaseRetry(
      () =>
        prisma.companySetting.findFirst({
          orderBy: { createdAt: "asc" }
        }),
      "company brand"
    );
  } catch {
    return fallbackBrand;
  }

  if (!company) {
    return fallbackBrand;
  }

  try {
    const lookup = await withDatabaseRetry(
      () => getTranslationLookup(locale, [{ entityType: "CompanySetting", entityId: company.id }]),
      "company brand translations"
    );

    return {
      name: readTranslation(lookup, "CompanySetting", company.id, "companyName", company.companyName),
      tagline: readTranslation(lookup, "CompanySetting", company.id, "tagline", company.tagline),
      cursorVariant: normalizeCursorVariant(company.cursorVariant)
    };
  } catch {
    return {
      name: company.companyName,
      tagline: company.tagline,
      cursorVariant: normalizeCursorVariant(company.cursorVariant)
    };
  }
}

export async function getLandingContent(locale: Locale): Promise<LandingContent> {
  let records;

  try {
    records = await fetchLandingRecords();
  } catch {
    return getFallbackLandingContent(locale);
  }

  const { company, divisions, products, publishedProductDivisionRefs, partners, employees, academic, careers } = records;

  if (!company) {
    return getFallbackLandingContent(locale);
  }

  const translationEntities = [
    { entityType: "CompanySetting", entityId: company.id },
    ...divisions.map((division) => ({ entityType: "Division", entityId: division.id })),
    ...products.map((product) => ({ entityType: "Product", entityId: product.id })),
    ...partners.map((partner) => ({ entityType: "Partner", entityId: partner.id })),
    ...employees.map((employee) => ({ entityType: "Employee", entityId: employee.id })),
    ...academic.map((content) => ({ entityType: "AcademicContent", entityId: content.id })),
    ...careers.map((career) => ({ entityType: "Career", entityId: career.id }))
  ];
  const lookup = await withDatabaseRetry(() => getTranslationLookup(locale, translationEntities), "landing translations").catch(
    () => new Map<string, string>()
  );
  const countsByDivision = productCountByDivision(publishedProductDivisionRefs);
  const translatedCompanyName = readTranslation(lookup, "CompanySetting", company.id, "companyName", company.companyName);
  const translatedTagline = readTranslation(lookup, "CompanySetting", company.id, "tagline", company.tagline);
  const translatedVision = readTranslation(lookup, "CompanySetting", company.id, "vision", company.vision);
  const translatedMission = readTranslation(lookup, "CompanySetting", company.id, "mission", company.mission);
  const translatedRemoteTitle = readTranslation(
    lookup,
    "CompanySetting",
    company.id,
    "remoteHighlightTitle",
    company.remoteHighlightTitle
  );
  const translatedRemoteBody = readTranslation(
    lookup,
    "CompanySetting",
    company.id,
    "remoteHighlightBody",
    company.remoteHighlightBody
  );
  const totalMembers = divisions.reduce((total, division) => total + (division.memberCount ?? 0), 0);

  return {
    company: {
      id: company.id,
      name: translatedCompanyName,
      tagline: translatedTagline,
      shortDescription: readTranslation(lookup, "CompanySetting", company.id, "shortDescription", company.shortDescription),
      longDescription: readTranslation(lookup, "CompanySetting", company.id, "longDescription", company.longDescription),
      vision: translatedVision,
      mission: translatedMission,
      address: company.address ?? "",
      email: company.email ?? "",
      phone: company.phone ?? "",
      logoUrl: company.logoUrl,
      mainCtaText: readTranslation(lookup, "CompanySetting", company.id, "mainCtaText", company.mainCtaText),
      mainCtaUrl: company.mainCtaUrl ?? `/${locale}#contact`,
      remoteHighlightTitle: translatedRemoteTitle,
      remoteHighlightBody: translatedRemoteBody,
      seoTitle: readTranslation(lookup, "CompanySetting", company.id, "seoTitle", company.seoTitle),
      seoDescription: readTranslation(lookup, "CompanySetting", company.id, "seoDescription", company.seoDescription)
    },
    heroTags: divisions.slice(0, 4).map((division) => readTranslation(lookup, "Division", division.id, "name", division.name)),
    heroStats: [
      { value: String(divisions.length), label: statLabels[locale].divisions },
      { value: `${totalMembers}+`, label: statLabels[locale].members },
      { value: String(locales.length), label: statLabels[locale].languages }
    ],
    divisions: divisions.map((division) => ({
      id: division.id,
      slug: division.slug,
      name: readTranslation(lookup, "Division", division.id, "name", division.name),
      shortDescription: readTranslation(lookup, "Division", division.id, "shortDescription", division.shortDescription),
      description: readTranslation(lookup, "Division", division.id, "description", division.description),
      icon: division.icon ?? division.name.slice(0, 3).toUpperCase(),
      memberCount: division.memberCount ?? 0,
      productCount: countsByDivision.get(division.id) ?? 0
    })),
    partners: partners.map((partner) => ({
      id: partner.id,
      slug: partner.slug,
      name: readTranslation(lookup, "Partner", partner.id, "name", partner.name),
      logoUrl: partner.logoUrl,
      websiteUrl: partner.websiteUrl,
      type: formatEnumLabel(partner.type, locale),
      description: readTranslation(lookup, "Partner", partner.id, "description", partner.description)
    })),
    featuredProducts: products.map((product) => ({
      id: product.id,
      slug: product.slug,
      name: readTranslation(lookup, "Product", product.id, "name", product.name),
      shortDescription: readTranslation(lookup, "Product", product.id, "shortDescription", product.shortDescription),
      category: product.category ?? product.division?.name ?? "",
      status: formatEnumLabel(product.status, locale),
      imageUrl: product.images[0]?.url ?? null,
      divisionName: product.division
        ? readTranslation(lookup, "Division", product.division.id, "name", product.division.name)
        : "",
      techStack: product.techStack.map((stack) => stack.name),
      features: product.features.map((feature) => feature.title),
      useCases: product.useCases
    })),
    employees: employees.map((employee) => ({
      id: employee.id,
      slug: employee.slug,
      name: readTranslation(lookup, "Employee", employee.id, "name", employee.name),
      role: readTranslation(lookup, "Employee", employee.id, "role", employee.role),
      shortBio: readTranslation(lookup, "Employee", employee.id, "shortBio", employee.shortBio),
      photoUrl: employee.photoUrl,
      divisionName: employee.division
        ? readTranslation(lookup, "Division", employee.division.id, "name", employee.division.name)
        : "",
      skills: employee.skills.map((skill) => skill.name)
    })),
    academic: academic.map((content) => ({
      id: content.id,
      slug: content.slug,
      title: readTranslation(lookup, "AcademicContent", content.id, "title", content.title),
      category: readTranslation(lookup, "AcademicContent", content.id, "category", content.category),
      shortDescription: readTranslation(lookup, "AcademicContent", content.id, "shortDescription", content.shortDescription)
    })),
    careers: careers.map((career) => ({
      id: career.id,
      slug: career.slug,
      jobTitle: readTranslation(lookup, "Career", career.id, "jobTitle", career.jobTitle),
      divisionName: career.division
        ? readTranslation(lookup, "Division", career.division.id, "name", career.division.name)
        : "",
      location: career.location ?? "",
      workType: formatEnumLabel(career.workType, locale),
      employmentType: formatEnumLabel(career.employmentType, locale),
      shortDescription: readTranslation(lookup, "Career", career.id, "shortDescription", career.shortDescription)
    })),
    contactInterests: Object.values(ContactInterest).map((interest) => ({
      value: interest,
      label: formatEnumLabel(interest, locale)
    })),
    whyItems: [
      {
        title: whyLabels[locale].vision,
        body: translatedVision
      },
      {
        title: whyLabels[locale].mission,
        body: translatedMission
      },
      {
        title: whyLabels[locale].remote,
        body: translatedRemoteBody
      }
    ]
  };
}
