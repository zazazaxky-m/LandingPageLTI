import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductListing } from "@/components/public/product-listing";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPublicProductIndex, parsePublicProductFilters } from "@/features/products/product-service";

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const dictionary = getDictionary(locale);

  return {
    title: dictionary.productsPage.title,
    description: dictionary.productsPage.description
  };
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale: Locale = locale;
  const dictionary = getDictionary(typedLocale);
  const filters = parsePublicProductFilters(await searchParams);
  const content = await getPublicProductIndex(typedLocale, filters);

  return <ProductListing content={content} dictionary={dictionary} locale={typedLocale} />;
}
