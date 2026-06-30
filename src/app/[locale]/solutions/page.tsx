import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DivisionListing } from "@/components/public/division-listing";
import { getPublicDivisionIndex } from "@/features/divisions/division-service";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type SolutionsPageProps = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: SolutionsPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const dictionary = getDictionary(locale);

  return {
    title: dictionary.solutionsPage.title,
    description: dictionary.solutionsPage.description
  };
}

export default async function SolutionsPage({ params }: SolutionsPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale: Locale = locale;
  const dictionary = getDictionary(typedLocale);
  const content = await getPublicDivisionIndex(typedLocale);

  return <DivisionListing content={content} dictionary={dictionary} locale={typedLocale} />;
}
