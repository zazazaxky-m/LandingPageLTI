import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LandingPage } from "@/components/public/landing-page";
import { getLandingContent } from "@/features/company/landing-service";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const dictionary = getDictionary(locale);
  const content = await getLandingContent(locale);

  return {
    title: content.company.seoTitle || `${content.company.name} - ${content.company.tagline || dictionary.hero.title}`,
    description: content.company.seoDescription || content.company.shortDescription || dictionary.hero.description
  };
}

export default async function LocaleHomePage({ params }: LocalePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale: Locale = locale;
  const dictionary = getDictionary(typedLocale);
  const content = await getLandingContent(typedLocale);

  return <LandingPage content={content} dictionary={dictionary} locale={typedLocale} />;
}
