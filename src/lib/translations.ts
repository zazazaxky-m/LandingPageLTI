import { Locale as DbLocale } from "@prisma/client";

import type { Locale } from "@/i18n/config";
import { prisma } from "@/lib/prisma";

export type TranslationLookup = Map<string, string>;

export type TranslationEntity = {
  entityType: string;
  entityId: string;
};

export const dbLocaleByLocale: Record<Locale, DbLocale> = {
  en: DbLocale.EN,
  id: DbLocale.ID,
  zh: DbLocale.ZH
};

const enumLabels: Record<Locale, Record<string, string>> = {
  en: {
    ACADEMIC: "Academic",
    ARCHIVED: "Archived",
    CLIENT: "Client",
    CLOSED: "Closed",
    COLLABORATION: "Collaboration",
    DRAFT: "Draft",
    FREELANCE: "Freelance",
    FULL_TIME: "Full time",
    HIDDEN: "Hidden",
    HYBRID: "Hybrid",
    INTERNSHIP: "Internship",
    ONSITE: "Onsite",
    OPEN: "Open",
    PARTNER: "Partner",
    PART_TIME: "Part time",
    PUBLISHED: "Published",
    REMOTE: "Remote",
    VENDOR: "Vendor",
    VISIBLE: "Visible"
  },
  id: {
    ACADEMIC: "Akademik",
    ARCHIVED: "Archived",
    CLIENT: "Client",
    CLOSED: "Closed",
    COLLABORATION: "Kolaborasi",
    DRAFT: "Draft",
    FREELANCE: "Freelance",
    FULL_TIME: "Full time",
    HIDDEN: "Hidden",
    HYBRID: "Hybrid",
    INTERNSHIP: "Magang",
    ONSITE: "Onsite",
    OPEN: "Open",
    PARTNER: "Partner",
    PART_TIME: "Part time",
    PUBLISHED: "Published",
    REMOTE: "Remote",
    VENDOR: "Vendor",
    VISIBLE: "Visible"
  },
  zh: {
    ACADEMIC: "学术",
    ARCHIVED: "已归档",
    CLIENT: "客户",
    CLOSED: "已关闭",
    COLLABORATION: "协作",
    DRAFT: "草稿",
    FREELANCE: "自由职业",
    FULL_TIME: "全职",
    HIDDEN: "隐藏",
    HYBRID: "混合办公",
    INTERNSHIP: "实习",
    ONSITE: "现场办公",
    OPEN: "开放",
    PARTNER: "合作伙伴",
    PART_TIME: "兼职",
    PUBLISHED: "已发布",
    REMOTE: "远程",
    VENDOR: "供应商",
    VISIBLE: "可见"
  }
};

function translationKey(entityType: string, entityId: string, field: string) {
  return `${entityType}:${entityId}:${field}`;
}

export function readTranslation(
  lookup: TranslationLookup,
  entityType: string,
  entityId: string,
  field: string,
  fallback?: string | null
) {
  return lookup.get(translationKey(entityType, entityId, field)) ?? fallback ?? "";
}

export async function getTranslationLookup(locale: Locale, entities: TranslationEntity[]) {
  if (entities.length === 0) {
    return new Map<string, string>();
  }

  const translations = await prisma.translation.findMany({
    where: {
      locale: dbLocaleByLocale[locale],
      OR: entities.map((entity) => ({
        entityType: entity.entityType,
        entityId: entity.entityId
      }))
    }
  });

  return new Map(
    translations.map((translation) => [
      translationKey(translation.entityType, translation.entityId, translation.field),
      translation.value
    ])
  );
}

export function formatEnumLabel(value: string, locale: Locale) {
  const translated = enumLabels[locale][value];

  if (translated) {
    return translated;
  }

  return value
    .toLowerCase()
    .split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}
