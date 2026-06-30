import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DivisionDetail } from "@/components/public/division-detail";
import { getPublicDivisionDetail } from "@/features/divisions/division-service";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type DivisionDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: DivisionDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const division = await getPublicDivisionDetail(locale, slug);

  if (!division) {
    return {};
  }

  return {
    title: division.name,
    description: division.shortDescription
  };
}

export default async function DivisionDetailPage({ params }: DivisionDetailPageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale: Locale = locale;
  const division = await getPublicDivisionDetail(typedLocale, slug);

  if (!division) {
    notFound();
  }

  return <DivisionDetail dictionary={getDictionary(typedLocale)} division={division} locale={typedLocale} />;
}
