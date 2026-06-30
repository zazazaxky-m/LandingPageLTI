export const locales = ["en", "id", "zh"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "id";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  id: "ID",
  zh: "中文"
};
