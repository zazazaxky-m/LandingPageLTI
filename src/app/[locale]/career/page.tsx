import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CareerListing } from "@/components/public/career-listing";
import { getPublicCareerIndex, parsePublicCareerFilters } from "@/features/careers/career-service";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type CareerPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: CareerPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const dictionary = getDictionary(locale);

  return {
    title: dictionary.careerPage.title,
    description: dictionary.careerPage.description
  };
}

export default async function CareerPage({ params, searchParams }: CareerPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale: Locale = locale;
  const dictionary = getDictionary(typedLocale);
  const filters = parsePublicCareerFilters(await searchParams);
  const content = await getPublicCareerIndex(typedLocale, filters);

  return <CareerListing content={content} dictionary={dictionary} locale={typedLocale} />;
}
