import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactPage } from "@/components/public/contact-page";
import { getPublicContactContent } from "@/features/contact/contact-service";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type ContactRouteProps = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ContactRouteProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const dictionary = getDictionary(locale);

  return {
    title: dictionary.contactPage.title,
    description: dictionary.contactPage.description
  };
}

export default async function ContactRoute({ params }: ContactRouteProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale: Locale = locale;
  const dictionary = getDictionary(typedLocale);
  const content = await getPublicContactContent(typedLocale);

  return <ContactPage content={content} dictionary={dictionary} />;
}
