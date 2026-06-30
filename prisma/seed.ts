import {
  CareerStatus,
  ContactInterest,
  ContactStatus,
  ContentStatus,
  EmployeeStatus,
  EmploymentType,
  Locale,
  PartnerType,
  PrismaClient,
  ProductStatus,
  VisibilityStatus,
  WorkType
} from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";

const prisma = new PrismaClient();

type TranslationMap = Partial<Record<Locale, string>>;

type FieldTranslations = Record<string, TranslationMap>;

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");

  return `scrypt:${salt}:${hash}`;
}

async function upsertTranslations(entityType: string, entityId: string, fields: FieldTranslations) {
  for (const [field, translations] of Object.entries(fields)) {
    for (const [locale, value] of Object.entries(translations) as Array<[Locale, string]>) {
      await prisma.translation.upsert({
        where: {
          entityType_entityId_field_locale: {
            entityType,
            entityId,
            field,
            locale
          }
        },
        update: { value },
        create: {
          entityType,
          entityId,
          field,
          locale,
          value
        }
      });
    }
  }
}

async function seedCompany() {
  const company = await prisma.companySetting.upsert({
    where: { id: "default-company-setting" },
    update: {
      companyName: "Lumiatech",
      tagline: "Discover Engineering Technology",
      shortDescription:
        "A remote-ready engineering technology company building prototypes, IT platforms, mobile products, and secure digital systems.",
      longDescription:
        "Lumiatech connects hardware exploration, software delivery, mobile development, and cyber security into one practical technology partner.",
      vision: "Become a practical engineering technology partner for teams that need clarity from prototype to production.",
      mission:
        "Deliver prototype-first engineering, documented software systems, mobile products, and secure-by-design technology services.",
      address: "Remote-first company, Indonesia",
      email: "hello@lumiatech.example",
      phone: "+62 812 0000 0000",
      socialLinks: {
        linkedin: "https://www.linkedin.com/company/lumiatech-placeholder",
        github: "https://github.com/lumiatech-placeholder"
      },
      logoUrl: null,
      faviconUrl: null,
      cursorVariant: "GLOW",
      mainCtaText: "Contact Us",
      mainCtaUrl: "/id#contact",
      remoteHighlightTitle: "Built for remote collaboration without losing engineering clarity.",
      remoteHighlightBody:
        "Every project is organized around technical notes, sprint reviews, prototype evidence, and decision records so clients can follow progress even when teams are distributed.",
      defaultLocale: Locale.ID,
      seoTitle: "Lumiatech - Discover Engineering Technology",
      seoDescription:
        "Company profile and landing page for Lumiatech engineering technology solutions."
    },
    create: {
      id: "default-company-setting",
      companyName: "Lumiatech",
      tagline: "Discover Engineering Technology",
      shortDescription:
        "A remote-ready engineering technology company building prototypes, IT platforms, mobile products, and secure digital systems.",
      longDescription:
        "Lumiatech connects hardware exploration, software delivery, mobile development, and cyber security into one practical technology partner.",
      vision: "Become a practical engineering technology partner for teams that need clarity from prototype to production.",
      mission:
        "Deliver prototype-first engineering, documented software systems, mobile products, and secure-by-design technology services.",
      address: "Remote-first company, Indonesia",
      email: "hello@lumiatech.example",
      phone: "+62 812 0000 0000",
      socialLinks: {
        linkedin: "https://www.linkedin.com/company/lumiatech-placeholder",
        github: "https://github.com/lumiatech-placeholder"
      },
      mainCtaText: "Contact Us",
      cursorVariant: "GLOW",
      mainCtaUrl: "/id#contact",
      remoteHighlightTitle: "Built for remote collaboration without losing engineering clarity.",
      remoteHighlightBody:
        "Every project is organized around technical notes, sprint reviews, prototype evidence, and decision records so clients can follow progress even when teams are distributed.",
      defaultLocale: Locale.ID,
      seoTitle: "Lumiatech - Discover Engineering Technology",
      seoDescription:
        "Company profile and landing page for Lumiatech engineering technology solutions."
    }
  });

  await upsertTranslations("CompanySetting", company.id, {
    tagline: {
      EN: "Discover Engineering Technology",
      ID: "Discover Engineering Technology",
      ZH: "\u63a2\u7d22\u5de5\u7a0b\u6280\u672f"
    },
    shortDescription: {
      EN: "A remote-ready engineering technology company building prototypes, IT platforms, mobile products, and secure digital systems.",
      ID: "Perusahaan teknologi engineering yang siap remote untuk membangun prototype, platform IT, produk mobile, dan sistem digital yang aman.",
      ZH: "\u4e00\u5bb6\u652f\u6301\u8fdc\u7a0b\u534f\u4f5c\u7684\u5de5\u7a0b\u6280\u672f\u516c\u53f8\uff0c\u6784\u5efa\u539f\u578b\u3001IT \u5e73\u53f0\u3001\u79fb\u52a8\u4ea7\u54c1\u4e0e\u5b89\u5168\u6570\u5b57\u7cfb\u7edf\u3002"
    },
    longDescription: {
      EN: "Lumiatech connects hardware exploration, software delivery, mobile development, and cyber security into one practical technology partner.",
      ID: "Lumiatech menghubungkan eksplorasi hardware, delivery software, pengembangan mobile, dan cyber security dalam satu partner teknologi yang praktis.",
      ZH: "\u004c\u0075\u006d\u0069\u0061\u0074\u0065\u0063\u0068 \u5c06\u786c\u4ef6\u63a2\u7d22\u3001\u8f6f\u4ef6\u4ea4\u4ed8\u3001\u79fb\u52a8\u5f00\u53d1\u548c\u7f51\u7edc\u5b89\u5168\u8fde\u63a5\u6210\u4e00\u4e2a\u52a1\u5b9e\u7684\u6280\u672f\u4f19\u4f34\u3002"
    },
    vision: {
      EN: "Become a practical engineering technology partner for teams that need clarity from prototype to production.",
      ID: "Menjadi partner engineering technology yang praktis untuk tim yang butuh kejelasan dari prototype sampai production.",
      ZH: "\u6210\u4e3a\u52a1\u5b9e\u7684\u5de5\u7a0b\u6280\u672f\u4f19\u4f34\uff0c\u5e2e\u52a9\u56e2\u961f\u4ece\u539f\u578b\u5230\u751f\u4ea7\u4fdd\u6301\u6e05\u6670\u65b9\u5411\u3002"
    },
    mission: {
      EN: "Deliver prototype-first engineering, documented software systems, mobile products, and secure-by-design technology services.",
      ID: "Menghadirkan engineering prototype-first, sistem software terdokumentasi, produk mobile, dan layanan teknologi secure-by-design.",
      ZH: "\u4ea4\u4ed8\u4ee5\u539f\u578b\u4e3a\u5148\u7684\u5de5\u7a0b\u3001\u6587\u6863\u5316\u8f6f\u4ef6\u7cfb\u7edf\u3001\u79fb\u52a8\u4ea7\u54c1\u548c\u5b89\u5168\u4f18\u5148\u7684\u6280\u672f\u670d\u52a1\u3002"
    },
    mainCtaText: {
      EN: "Contact Us",
      ID: "Hubungi Kami",
      ZH: "\u8054\u7cfb\u6211\u4eec"
    },
    remoteHighlightTitle: {
      EN: "Built for remote collaboration without losing engineering clarity.",
      ID: "Dibangun untuk kolaborasi remote tanpa kehilangan kejelasan engineering.",
      ZH: "\u4e3a\u8fdc\u7a0b\u534f\u4f5c\u800c\u5efa\uff0c\u540c\u65f6\u4fdd\u6301\u5de5\u7a0b\u6e05\u6670\u5ea6\u3002"
    },
    remoteHighlightBody: {
      EN: "Every project is organized around technical notes, sprint reviews, prototype evidence, and decision records so clients can follow progress even when teams are distributed.",
      ID: "Setiap project disusun dengan catatan teknis, sprint review, bukti prototype, dan decision record agar client bisa mengikuti progres walau tim terdistribusi.",
      ZH: "\u6bcf\u4e2a\u9879\u76ee\u56f4\u7ed5\u6280\u672f\u8bb0\u5f55\u3001\u8fed\u4ee3\u8bc4\u5ba1\u3001\u539f\u578b\u8bc1\u636e\u548c\u51b3\u7b56\u8bb0\u5f55\u7ec4\u7ec7\uff0c\u5373\u4f7f\u56e2\u961f\u5206\u5e03\u5404\u5730\uff0c\u5ba2\u6237\u4e5f\u80fd\u6e05\u695a\u8ddf\u8e2a\u8fdb\u5c55\u3002"
    }
  });
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@lumiatech.local";
  const password = process.env.ADMIN_PASSWORD || "change-this-password";

  await prisma.user.upsert({
    where: { email },
    update: {
      name: "Lumiatech Admin",
      passwordHash: hashPassword(password)
    },
    create: {
      email,
      name: "Lumiatech Admin",
      passwordHash: hashPassword(password)
    }
  });
}

async function seedDivisions() {
  const seeds = [
    {
      slug: "engineering-prototype",
      name: "Engineering / Prototype",
      shortDescription: "Hardware, IoT, embedded systems, and rapid prototyping.",
      description:
        "Focus on engineering, prototype, hardware, IoT, embedded system, mechanical prototyping, and electronic prototyping.",
      icon: "ENG",
      memberCount: 4,
      sortOrder: 1,
      translations: {
        name: { EN: "Engineering / Prototype", ID: "Engineering / Prototype", ZH: "\u5de5\u7a0b / \u539f\u578b" },
        shortDescription: {
          EN: "Hardware, IoT, embedded systems, and rapid prototyping.",
          ID: "Hardware, IoT, embedded system, dan rapid prototyping.",
          ZH: "\u786c\u4ef6\u3001\u7269\u8054\u7f51\u3001\u5d4c\u5165\u5f0f\u7cfb\u7edf\u548c\u5feb\u901f\u539f\u578b\u3002"
        },
        description: {
          EN: "Focus on engineering, prototype, hardware, IoT, embedded system, mechanical prototyping, and electronic prototyping.",
          ID: "Fokus pada engineering, prototype, hardware, IoT, embedded system, prototype mekanik, dan prototype elektronik.",
          ZH: "\u805a\u7126\u5de5\u7a0b\u3001\u539f\u578b\u3001\u786c\u4ef6\u3001\u7269\u8054\u7f51\u3001\u5d4c\u5165\u5f0f\u7cfb\u7edf\u3001\u673a\u68b0\u539f\u578b\u548c\u7535\u5b50\u539f\u578b\u3002"
        }
      }
    },
    {
      slug: "it-solution",
      name: "IT Solution",
      shortDescription: "Web app, backend, dashboard, API, cloud, and automation.",
      description:
        "Focus on web applications, backend systems, dashboard, API, cloud automation, and enterprise systems.",
      icon: "IT",
      memberCount: 3,
      sortOrder: 2,
      translations: {
        name: { EN: "IT Solution", ID: "IT Solution", ZH: "IT \u89e3\u51b3\u65b9\u6848" },
        shortDescription: {
          EN: "Web app, backend, dashboard, API, cloud, and automation.",
          ID: "Web app, backend, dashboard, API, cloud, dan automation.",
          ZH: "Web \u5e94\u7528\u3001\u540e\u7aef\u3001\u4eea\u8868\u76d8\u3001API\u3001\u4e91\u548c\u81ea\u52a8\u5316\u3002"
        },
        description: {
          EN: "Focus on web applications, backend systems, dashboard, API, cloud automation, and enterprise systems.",
          ID: "Fokus pada web application, backend system, dashboard, API, cloud automation, dan enterprise system.",
          ZH: "\u805a\u7126 Web \u5e94\u7528\u3001\u540e\u7aef\u7cfb\u7edf\u3001\u4eea\u8868\u76d8\u3001API\u3001\u4e91\u81ea\u52a8\u5316\u548c\u4f01\u4e1a\u7cfb\u7edf\u3002"
        }
      }
    },
    {
      slug: "mobile-app",
      name: "Mobile App",
      shortDescription: "Android, iOS, cross-platform mobile apps, API integration, and UX.",
      description:
        "Focus on Android, iOS, cross-platform mobile app, API integration, and mobile user experience.",
      icon: "APP",
      memberCount: 2,
      sortOrder: 3,
      translations: {
        name: { EN: "Mobile App", ID: "Mobile App", ZH: "\u79fb\u52a8\u5e94\u7528" },
        shortDescription: {
          EN: "Android, iOS, cross-platform mobile apps, API integration, and UX.",
          ID: "Android, iOS, cross-platform mobile app, integrasi API, dan UX.",
          ZH: "Android\u3001iOS\u3001\u8de8\u5e73\u53f0\u79fb\u52a8\u5e94\u7528\u3001API \u96c6\u6210\u548c\u7528\u6237\u4f53\u9a8c\u3002"
        },
        description: {
          EN: "Focus on Android, iOS, cross-platform mobile app, API integration, and mobile user experience.",
          ID: "Fokus pada Android, iOS, cross-platform mobile app, integrasi API, dan mobile user experience.",
          ZH: "\u805a\u7126 Android\u3001iOS\u3001\u8de8\u5e73\u53f0\u79fb\u52a8\u5e94\u7528\u3001API \u96c6\u6210\u548c\u79fb\u52a8\u7528\u6237\u4f53\u9a8c\u3002"
        }
      }
    },
    {
      slug: "cyber-security",
      name: "Cyber Security",
      shortDescription: "Security assessment, penetration testing, monitoring, and secure architecture.",
      description:
        "Focus on security assessment, penetration testing, vulnerability assessment, monitoring, and secure architecture.",
      icon: "SEC",
      memberCount: 2,
      sortOrder: 4,
      translations: {
        name: { EN: "Cyber Security", ID: "Cyber Security", ZH: "\u7f51\u7edc\u5b89\u5168" },
        shortDescription: {
          EN: "Security assessment, penetration testing, monitoring, and secure architecture.",
          ID: "Security assessment, penetration testing, monitoring, dan secure architecture.",
          ZH: "\u5b89\u5168\u8bc4\u4f30\u3001\u6e17\u900f\u6d4b\u8bd5\u3001\u76d1\u63a7\u548c\u5b89\u5168\u67b6\u6784\u3002"
        },
        description: {
          EN: "Focus on security assessment, penetration testing, vulnerability assessment, monitoring, and secure architecture.",
          ID: "Fokus pada security assessment, penetration testing, vulnerability assessment, monitoring, dan secure architecture.",
          ZH: "\u805a\u7126\u5b89\u5168\u8bc4\u4f30\u3001\u6e17\u900f\u6d4b\u8bd5\u3001\u6f0f\u6d1e\u8bc4\u4f30\u3001\u76d1\u63a7\u548c\u5b89\u5168\u67b6\u6784\u3002"
        }
      }
    }
  ];

  const divisionsBySlug = new Map<string, string>();

  for (const seed of seeds) {
    const division = await prisma.division.upsert({
      where: { slug: seed.slug },
      update: {
        name: seed.name,
        shortDescription: seed.shortDescription,
        description: seed.description,
        icon: seed.icon,
        memberCount: seed.memberCount,
        status: VisibilityStatus.VISIBLE,
        sortOrder: seed.sortOrder
      },
      create: {
        slug: seed.slug,
        name: seed.name,
        shortDescription: seed.shortDescription,
        description: seed.description,
        icon: seed.icon,
        memberCount: seed.memberCount,
        status: VisibilityStatus.VISIBLE,
        sortOrder: seed.sortOrder
      }
    });

    divisionsBySlug.set(seed.slug, division.id);
    await upsertTranslations("Division", division.id, seed.translations);
  }

  return divisionsBySlug;
}

async function seedProducts(divisionsBySlug: Map<string, string>) {
  const products = [
    {
      slug: "todo-fieldops-control-hub",
      name: "TODO FieldOps Control Hub",
      category: "IT Solution",
      divisionSlug: "it-solution",
      shortDescription: "[TODO] Operational dashboard for assets, sensors, workflows, and field reporting.",
      fullDescription:
        "[TODO] Replace this development placeholder with real product copy, gallery, demo link, features, specifications, and use cases from the admin dashboard.",
      youtubeUrl: "https://www.youtube.com/watch?v=TODO",
      useCases: ["Asset monitoring", "Field reporting", "Workflow tracking"],
      status: ProductStatus.PUBLISHED,
      featured: true,
      sortOrder: 1,
      stack: ["Next.js", "PostgreSQL", "MQTT"],
      features: ["Real-time dashboard", "Role-based access", "Exportable reports"],
      specs: [
        ["Deployment", "Cloud or private server", null],
        ["Integration", "REST API and MQTT", null],
        ["Status", "TODO placeholder", null]
      ]
    },
    {
      slug: "todo-prototype-sensor-kit",
      name: "TODO Prototype Sensor Kit",
      category: "Engineering",
      divisionSlug: "engineering-prototype",
      shortDescription: "[TODO] Rapid sensor kit for validating hardware concepts before full product build.",
      fullDescription:
        "[TODO] Replace this placeholder with real prototype hardware description, technical limits, gallery, and demo references.",
      youtubeUrl: "https://www.youtube.com/watch?v=TODO",
      useCases: ["IoT validation", "Prototype testing", "Embedded experiments"],
      status: ProductStatus.PUBLISHED,
      featured: true,
      sortOrder: 2,
      stack: ["ESP32", "C", "3D CAD"],
      features: ["Fast sensor wiring", "Firmware sample", "Prototype enclosure"],
      specs: [
        ["Controller", "ESP32 class", null],
        ["Connectivity", "Wi-Fi / BLE", null],
        ["Status", "TODO placeholder", null]
      ]
    },
    {
      slug: "todo-secure-mobile-suite",
      name: "TODO Secure Mobile Suite",
      category: "Mobile App",
      divisionSlug: "mobile-app",
      shortDescription: "[TODO] Mobile app foundation with secure auth, offline sync, and API integration.",
      fullDescription:
        "[TODO] Replace this placeholder with real mobile app scope, supported platform notes, screenshots, and demo video.",
      youtubeUrl: "https://www.youtube.com/watch?v=TODO",
      useCases: ["Field mobile app", "Offline forms", "API-connected workflow"],
      status: ProductStatus.DRAFT,
      featured: true,
      sortOrder: 3,
      stack: ["Flutter", "REST", "Auth"],
      features: ["Secure login", "Offline sync", "Push-ready architecture"],
      specs: [
        ["Platform", "Android / iOS", null],
        ["API", "REST / JSON", null],
        ["Status", "TODO placeholder", null]
      ]
    }
  ];

  for (const seed of products) {
    const product = await prisma.product.upsert({
      where: { slug: seed.slug },
      update: {
        name: seed.name,
        category: seed.category,
        divisionId: divisionsBySlug.get(seed.divisionSlug),
        shortDescription: seed.shortDescription,
        fullDescription: seed.fullDescription,
        youtubeUrl: seed.youtubeUrl,
        useCases: seed.useCases,
        status: seed.status,
        featured: seed.featured,
        sortOrder: seed.sortOrder,
        seoTitle: `${seed.name} | Lumiatech`,
        seoDescription: seed.shortDescription
      },
      create: {
        slug: seed.slug,
        name: seed.name,
        category: seed.category,
        divisionId: divisionsBySlug.get(seed.divisionSlug),
        shortDescription: seed.shortDescription,
        fullDescription: seed.fullDescription,
        youtubeUrl: seed.youtubeUrl,
        useCases: seed.useCases,
        status: seed.status,
        featured: seed.featured,
        sortOrder: seed.sortOrder,
        seoTitle: `${seed.name} | Lumiatech`,
        seoDescription: seed.shortDescription
      }
    });

    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productFeature.deleteMany({ where: { productId: product.id } });
    await prisma.productSpecification.deleteMany({ where: { productId: product.id } });
    await prisma.productTechStack.deleteMany({ where: { productId: product.id } });

    await prisma.productImage.createMany({
      data: [
        {
          productId: product.id,
          url: "/images/hero-engineering-lab.png",
          altText: `${seed.name} placeholder visual`,
          sortOrder: 1
        }
      ]
    });

    await prisma.productFeature.createMany({
      data: seed.features.map((title, index) => ({
        productId: product.id,
        title,
        description: "TODO replace this seed feature with production product content.",
        sortOrder: index + 1
      }))
    });

    await prisma.productSpecification.createMany({
      data: seed.specs.map(([label, value, unit], index) => ({
        productId: product.id,
        label: String(label),
        value: String(value),
        unit: unit ? String(unit) : null,
        sortOrder: index + 1
      }))
    });

    await prisma.productTechStack.createMany({
      data: seed.stack.map((name, index) => ({
        productId: product.id,
        name,
        sortOrder: index + 1
      }))
    });

    await upsertTranslations("Product", product.id, {
      name: { EN: seed.name, ID: seed.name, ZH: seed.name },
      shortDescription: {
        EN: seed.shortDescription,
        ID: seed.shortDescription,
        ZH: "[TODO] \u8bf7\u5728\u7ba1\u7406\u540e\u53f0\u66ff\u6362\u4e3a\u771f\u5b9e\u4ea7\u54c1\u63cf\u8ff0\u3002"
      }
    });
  }
}

async function seedPartners() {
  const partners = [
    ["todo-nusa-research", "TODO Nusa Research", PartnerType.ACADEMIC, true, 1],
    ["todo-astra-aerolab", "TODO Astra AeroLab", PartnerType.CLIENT, true, 2],
    ["todo-mitra-robotics", "TODO Mitra Robotics", PartnerType.PARTNER, true, 3],
    ["todo-sagara-university", "TODO Sagara University", PartnerType.ACADEMIC, true, 4],
    ["todo-teknocloud", "TODO TeknoCloud", PartnerType.VENDOR, true, 5],
    ["todo-sentra-energy", "TODO Sentra Energy", PartnerType.CLIENT, true, 6]
  ] as const;

  for (const [slug, name, type, featured, sortOrder] of partners) {
    await prisma.partner.upsert({
      where: { slug },
      update: {
        name,
        type,
        featured,
        sortOrder,
        status: VisibilityStatus.VISIBLE,
        description: "TODO replace this placeholder partner description from admin dashboard.",
        logoUrl: null,
        websiteUrl: "https://example.com"
      },
      create: {
        slug,
        name,
        type,
        featured,
        sortOrder,
        status: VisibilityStatus.VISIBLE,
        description: "TODO replace this placeholder partner description from admin dashboard.",
        websiteUrl: "https://example.com"
      }
    });
  }
}

async function seedEmployees(divisionsBySlug: Map<string, string>) {
  const employees = [
    ["todo-engineering-lead", "TODO Engineering Lead", "Engineering Lead", "engineering-prototype", ["IoT", "Prototype", "CAD"]],
    ["todo-backend-engineer", "TODO Backend Engineer", "Backend Engineer", "it-solution", ["API", "Cloud", "Automation"]],
    ["todo-mobile-engineer", "TODO Mobile Engineer", "Mobile Engineer", "mobile-app", ["Android", "iOS", "UX"]],
    ["todo-security-analyst", "TODO Security Analyst", "Security Analyst", "cyber-security", ["VA", "Pentest", "Monitoring"]]
  ] as const;

  for (const [slug, name, role, divisionSlug, skills] of employees) {
    const employee = await prisma.employee.upsert({
      where: { slug },
      update: {
        name,
        role,
        divisionId: divisionsBySlug.get(divisionSlug),
        shortBio: "TODO replace this placeholder employee bio from admin dashboard.",
        experienceHistory: "TODO add real experience and history.",
        status: EmployeeStatus.ACTIVE,
        sortOrder: Number(employees.findIndex((item) => item[0] === slug)) + 1
      },
      create: {
        slug,
        name,
        role,
        divisionId: divisionsBySlug.get(divisionSlug),
        shortBio: "TODO replace this placeholder employee bio from admin dashboard.",
        experienceHistory: "TODO add real experience and history.",
        status: EmployeeStatus.ACTIVE,
        sortOrder: Number(employees.findIndex((item) => item[0] === slug)) + 1
      }
    });

    await prisma.employeeSkill.deleteMany({ where: { employeeId: employee.id } });
    await prisma.employeeSkill.createMany({
      data: skills.map((name, index) => ({ employeeId: employee.id, name, sortOrder: index + 1 }))
    });

    await upsertTranslations("Employee", employee.id, {
      name: { EN: name, ID: name, ZH: name },
      role: { EN: role, ID: role, ZH: role },
      shortBio: {
        EN: "TODO replace this placeholder employee bio from admin dashboard.",
        ID: "TODO ganti bio employee placeholder ini dari admin dashboard.",
        ZH: "TODO \u8bf7\u5728\u7ba1\u7406\u540e\u53f0\u66ff\u6362\u6b64\u5458\u5de5\u7b80\u4ecb\u5360\u4f4d\u5185\u5bb9\u3002"
      }
    });
  }
}

async function seedAcademicAndCareers(divisionsBySlug: Map<string, string>) {
  const academicContent = await prisma.academicContent.upsert({
    where: { slug: "todo-internship-studio" },
    update: {
      title: "TODO Internship Studio",
      category: "Internship",
      shortDescription: "[TODO] Structured internship projects connected to real engineering and product problems.",
      content: "TODO replace this academic content from admin dashboard.",
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date("2026-06-29T00:00:00.000Z"),
      seoTitle: "TODO Internship Studio | Lumiatech",
      seoDescription: "Structured internship projects connected to real engineering and product problems."
    },
    create: {
      slug: "todo-internship-studio",
      title: "TODO Internship Studio",
      category: "Internship",
      shortDescription: "[TODO] Structured internship projects connected to real engineering and product problems.",
      content: "TODO replace this academic content from admin dashboard.",
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date("2026-06-29T00:00:00.000Z"),
      seoTitle: "TODO Internship Studio | Lumiatech",
      seoDescription: "Structured internship projects connected to real engineering and product problems."
    }
  });

  await upsertTranslations("AcademicContent", academicContent.id, {
    title: {
      EN: "TODO Internship Studio",
      ID: "TODO Internship Studio",
      ZH: "TODO \u5b9e\u4e60\u5de5\u4f5c\u5ba4"
    },
    category: {
      EN: "Internship",
      ID: "Magang",
      ZH: "\u5b9e\u4e60"
    },
    shortDescription: {
      EN: "[TODO] Structured internship projects connected to real engineering and product problems.",
      ID: "[TODO] Project magang terstruktur yang terhubung dengan masalah engineering dan produk nyata.",
      ZH: "[TODO] \u4e0e\u771f\u5b9e\u5de5\u7a0b\u548c\u4ea7\u54c1\u95ee\u9898\u76f8\u8fde\u63a5\u7684\u7ed3\u6784\u5316\u5b9e\u4e60\u9879\u76ee\u3002"
    }
  });

  const careers = [
    ["todo-prototype-engineer", "TODO Prototype Engineer", "engineering-prototype", WorkType.HYBRID, EmploymentType.FULL_TIME, CareerStatus.OPEN],
    ["todo-full-stack-developer", "TODO Full-stack Developer", "it-solution", WorkType.REMOTE, EmploymentType.FULL_TIME, CareerStatus.OPEN],
    ["todo-mobile-developer-intern", "TODO Mobile Developer Intern", "mobile-app", WorkType.REMOTE, EmploymentType.INTERNSHIP, CareerStatus.DRAFT]
  ] as const;

  for (const [slug, jobTitle, divisionSlug, workType, employmentType, status] of careers) {
    const career = await prisma.career.upsert({
      where: { slug },
      update: {
        jobTitle,
        divisionId: divisionsBySlug.get(divisionSlug),
        location: "Remote-first, Indonesia",
        workType,
        employmentType,
        shortDescription: "[TODO] Replace this job summary from admin dashboard.",
        requirements: "TODO add real requirements.",
        responsibilities: "TODO add real responsibilities.",
        benefits: "Remote collaboration, documented workflows, and engineering mentorship.",
        status,
        applyEmail: "career@lumiatech.example"
      },
      create: {
        slug,
        jobTitle,
        divisionId: divisionsBySlug.get(divisionSlug),
        location: "Remote-first, Indonesia",
        workType,
        employmentType,
        shortDescription: "[TODO] Replace this job summary from admin dashboard.",
        requirements: "TODO add real requirements.",
        responsibilities: "TODO add real responsibilities.",
        benefits: "Remote collaboration, documented workflows, and engineering mentorship.",
        status,
        applyEmail: "career@lumiatech.example"
      }
    });

    await upsertTranslations("Career", career.id, {
      jobTitle: { EN: jobTitle, ID: jobTitle, ZH: jobTitle },
      shortDescription: {
        EN: "[TODO] Replace this job summary from admin dashboard.",
        ID: "[TODO] Ganti ringkasan lowongan ini dari admin dashboard.",
        ZH: "[TODO] \u8bf7\u5728\u7ba1\u7406\u540e\u53f0\u66ff\u6362\u6b64\u804c\u4f4d\u6458\u8981\u3002"
      }
    });
  }
}

async function seedMediaAndContact() {
  await prisma.media.upsert({
    where: { key: "images/hero-engineering-lab.png" },
    update: {
      filename: "hero-engineering-lab.png",
      url: "/images/hero-engineering-lab.png",
      mimeType: "image/png",
      size: 1668588,
      provider: "local",
      altText: "Original generated engineering technology hero visual"
    },
    create: {
      key: "images/hero-engineering-lab.png",
      filename: "hero-engineering-lab.png",
      url: "/images/hero-engineering-lab.png",
      mimeType: "image/png",
      size: 1668588,
      provider: "local",
      altText: "Original generated engineering technology hero visual"
    }
  });

  const existingContact = await prisma.contactSubmission.count({
    where: { email: "sample.contact@example.com", subject: "TODO sample inquiry" }
  });

  if (existingContact === 0) {
    await prisma.contactSubmission.create({
      data: {
        name: "TODO Sample Contact",
        email: "sample.contact@example.com",
        company: "TODO Sample Organization",
        phone: "+62 812 1111 2222",
        subject: "TODO sample inquiry",
        message: "This is a development seed contact submission for admin dashboard testing.",
        interestCategory: ContactInterest.IT_SOLUTION,
        status: ContactStatus.NEW
      }
    });
  }
}

async function main() {
  await seedAdmin();
  await seedCompany();
  const divisionsBySlug = await seedDivisions();
  await seedProducts(divisionsBySlug);
  await seedPartners();
  await seedEmployees(divisionsBySlug);
  await seedAcademicAndCareers(divisionsBySlug);
  await seedMediaAndContact();

  const [divisionCount, productCount, employeeCount, partnerCount, academicCount, careerCount, contactCount] =
    await Promise.all([
      prisma.division.count(),
      prisma.product.count(),
      prisma.employee.count(),
      prisma.partner.count(),
      prisma.academicContent.count(),
      prisma.career.count(),
      prisma.contactSubmission.count()
    ]);

  console.log({
    divisionCount,
    productCount,
    employeeCount,
    partnerCount,
    academicCount,
    careerCount,
    contactCount
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
