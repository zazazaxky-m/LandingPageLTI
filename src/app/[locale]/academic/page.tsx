import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AcademicListing } from "@/components/public/academic-listing";
import { getPublicAcademicIndex, parsePublicAcademicFilters } from "@/features/academic/academic-service";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type AcademicPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: AcademicPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const dictionary = getDictionary(locale);

  return {
    title: dictionary.academicPage.title,
    description: dictionary.academicPage.description
  };
}

export default async function AcademicPage({ params, searchParams }: AcademicPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale: Locale = locale;
  const dictionary = getDictionary(typedLocale);
  const filters = parsePublicAcademicFilters(await searchParams);
  const content = await getPublicAcademicIndex(typedLocale, filters);

  return <AcademicListing content={content} dictionary={dictionary} locale={typedLocale} />;
}
