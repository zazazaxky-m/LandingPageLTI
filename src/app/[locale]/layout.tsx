import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { FooterDistortionPanel } from "@/components/public/footer-distortion-panel";
import { PageIntroTransition } from "@/components/public/page-intro-transition";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { TechCursor } from "@/components/public/tech-cursor";
import { getCompanyBrand } from "@/features/company/landing-service";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const brand = await getCompanyBrand(locale);

  return (
    <>
      <PageIntroTransition brandName={brand.name} />
      <SiteHeader brandName={brand.name} dictionary={dictionary} locale={locale} />
      {children}
      <SiteFooter brandName={brand.name} dictionary={dictionary} locale={locale} tagline={brand.tagline} />
      <FooterDistortionPanel brandName={brand.name} />
      <TechCursor variant={brand.cursorVariant} />
    </>
  );
}
