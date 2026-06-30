import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PartnerListing } from "@/components/public/partner-listing";
import { getPublicPartnerIndex, parsePublicPartnerFilters } from "@/features/partners/partner-service";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type PartnersPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PartnersPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const dictionary = getDictionary(locale);

  return {
    title: dictionary.partnerPage.title,
    description: dictionary.partnerPage.description
  };
}

export default async function PartnersPage({ params, searchParams }: PartnersPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale: Locale = locale;
  const dictionary = getDictionary(typedLocale);
  const filters = parsePublicPartnerFilters(await searchParams);
  const content = await getPublicPartnerIndex(typedLocale, filters);

  return <PartnerListing content={content} dictionary={dictionary} locale={typedLocale} />;
}
