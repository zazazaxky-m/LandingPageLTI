import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EmployeeListing } from "@/components/public/employee-listing";
import { getPublicEmployeeIndex, parsePublicEmployeeFilters } from "@/features/employees/employee-service";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type EmployeePageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: EmployeePageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const dictionary = getDictionary(locale);

  return {
    title: dictionary.employeePage.title,
    description: dictionary.employeePage.description
  };
}

export default async function EmployeePage({ params, searchParams }: EmployeePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale: Locale = locale;
  const dictionary = getDictionary(typedLocale);
  const filters = parsePublicEmployeeFilters(await searchParams);
  const content = await getPublicEmployeeIndex(typedLocale, filters);

  return <EmployeeListing content={content} dictionary={dictionary} locale={typedLocale} />;
}
