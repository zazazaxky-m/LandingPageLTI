import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AcademicDetail } from "@/components/public/academic-detail";
import { getPublicAcademicDetail } from "@/features/academic/academic-service";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type AcademicDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: AcademicDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const item = await getPublicAcademicDetail(locale, slug);

  if (!item) {
    return {};
  }

  return {
    title: item.seoTitle || item.title,
    description: item.seoDescription || item.shortDescription
  };
}

export default async function AcademicDetailPage({ params }: AcademicDetailPageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale: Locale = locale;
  const item = await getPublicAcademicDetail(typedLocale, slug);

  if (!item) {
    notFound();
  }

  return <AcademicDetail dictionary={getDictionary(typedLocale)} item={item} locale={typedLocale} />;
}
