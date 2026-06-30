import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetail } from "@/components/public/product-detail";
import { getPublicProductDetail } from "@/features/products/product-service";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type ProductDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const product = await getPublicProductDetail(locale, slug);

  if (!product) {
    return {};
  }

  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.shortDescription
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale: Locale = locale;
  const product = await getPublicProductDetail(typedLocale, slug);

  if (!product) {
    notFound();
  }

  return <ProductDetail dictionary={getDictionary(typedLocale)} locale={typedLocale} product={product} />;
}
