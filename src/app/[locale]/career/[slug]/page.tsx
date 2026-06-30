import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CareerDetail } from "@/components/public/career-detail";
import { getPublicCareerDetail } from "@/features/careers/career-service";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type CareerDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: CareerDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const job = await getPublicCareerDetail(locale, slug);

  if (!job) {
    return {};
  }

  return {
    title: job.jobTitle,
    description: job.shortDescription
  };
}

export default async function CareerDetailPage({ params }: CareerDetailPageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale: Locale = locale;
  const job = await getPublicCareerDetail(typedLocale, slug);

  if (!job) {
    notFound();
  }

  return <CareerDetail dictionary={getDictionary(typedLocale)} job={job} locale={typedLocale} />;
}
