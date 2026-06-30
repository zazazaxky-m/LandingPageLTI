import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

import { locales } from "@/i18n/config";
import { prisma } from "@/lib/prisma";

function baseUrl() {
  return (process.env.NEXTAUTH_URL || "http://localhost:3000").replace(/\/$/, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, divisions, academic, careers] = await Promise.all([
    prisma.product.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true }
    }),
    prisma.division.findMany({
      where: { status: "VISIBLE" },
      select: { slug: true, updatedAt: true }
    }),
    prisma.academicContent.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true }
    }),
    prisma.career.findMany({
      where: { status: "OPEN" },
      select: { slug: true, updatedAt: true }
    })
  ]);
  const staticPaths = ["", "/solutions", "/products", "/employee", "/partners", "/academic", "/career", "/contact"];
  const urls: MetadataRoute.Sitemap = [];
  const origin = baseUrl();

  for (const locale of locales) {
    for (const path of staticPaths) {
      urls.push({
        url: `${origin}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path ? "weekly" : "daily",
        priority: path ? 0.7 : 1
      });
    }

    for (const division of divisions) {
      urls.push({
        url: `${origin}/${locale}/solutions/${division.slug}`,
        lastModified: division.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7
      });
    }

    for (const product of products) {
      urls.push({
        url: `${origin}/${locale}/products/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8
      });
    }

    for (const item of academic) {
      urls.push({
        url: `${origin}/${locale}/academic/${item.slug}`,
        lastModified: item.updatedAt,
        changeFrequency: "monthly",
        priority: 0.6
      });
    }

    for (const career of careers) {
      urls.push({
        url: `${origin}/${locale}/career/${career.slug}`,
        lastModified: career.updatedAt,
        changeFrequency: "weekly",
        priority: 0.6
      });
    }
  }

  return urls;
}
