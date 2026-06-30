import Link from "next/link";
import { CalendarDays, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { PublicAcademicCard, PublicAcademicIndex } from "@/features/academic/academic-service";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type AcademicListingProps = {
  locale: Locale;
  dictionary: Dictionary;
  content: PublicAcademicIndex;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

export function AcademicListing({ locale, dictionary, content }: AcademicListingProps) {
  return (
    <main>
      <section className="border-b border-white/10 pb-16 pt-32">
        <Container>
          <div className="max-w-4xl">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-lumen-400">
              {dictionary.academicPage.eyebrow}
            </p>
            <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">{dictionary.academicPage.title}</h1>
            <p className="mt-6 max-w-3xl leading-8 text-zinc-400">{dictionary.academicPage.description}</p>
          </div>

          <form className="mt-10 grid gap-3 rounded-ui border border-white/10 bg-white/[0.035] p-4 md:grid-cols-[1.5fr_1fr_auto_auto]">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                className="pl-9"
                defaultValue={content.filters.query}
                name="q"
                placeholder={dictionary.academicPage.searchPlaceholder}
              />
            </label>
            <Select defaultValue={content.filters.category} name="category">
              <option value="">{dictionary.academicPage.allCategories}</option>
              {content.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
            <button className={buttonClasses("solid", "w-full md:w-auto")} type="submit">
              {dictionary.academicPage.applyFilters}
            </button>
            <Link className={buttonClasses("ghost", "w-full md:w-auto")} href={`/${locale}/academic`}>
              {dictionary.academicPage.clearFilters}
            </Link>
          </form>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          {content.items.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {content.items.map((item) => (
                <AcademicCard item={item} key={item.id} locale={locale} />
              ))}
            </div>
          ) : (
            <Card className="p-8">
              <h2 className="text-xl font-black text-white">{dictionary.academicPage.emptyTitle}</h2>
              <p className="mt-3 leading-7 text-zinc-400">{dictionary.academicPage.emptyBody}</p>
            </Card>
          )}
        </Container>
      </section>
    </main>
  );
}

function AcademicCard({ item, locale }: { item: PublicAcademicCard; locale: Locale }) {
  return (
    <Card className="overflow-hidden">
      <Link className="block" href={`/${locale}/academic/${item.slug}`}>
        <div className="relative flex min-h-52 items-end overflow-hidden bg-[linear-gradient(135deg,rgba(255,106,0,0.22),transparent),#17191c] p-5">
          {item.imageUrl ? <img alt={item.title} className="absolute inset-0 h-full w-full object-cover opacity-40" src={item.imageUrl} /> : null}
          <div className="absolute inset-7 border border-white/15" />
          <Badge className="relative">{item.category}</Badge>
        </div>
        <div className="p-6">
          <div className="mb-4 inline-flex items-center gap-2 text-xs font-bold text-zinc-500">
            <CalendarDays className="h-4 w-4" />
            {formatDate(item.publishedAt)}
          </div>
          <h2 className="text-lg font-black text-white">{item.title}</h2>
          <p className="mt-3 line-clamp-4 leading-7 text-zinc-400">{item.shortDescription}</p>
        </div>
      </Link>
    </Card>
  );
}
