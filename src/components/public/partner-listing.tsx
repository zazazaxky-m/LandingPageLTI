import Link from "next/link";
import { ExternalLink, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { PublicPartnerCard, PublicPartnerIndex } from "@/features/partners/partner-service";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type PartnerListingProps = {
  locale: Locale;
  dictionary: Dictionary;
  content: PublicPartnerIndex;
};

function initials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

export function PartnerListing({ locale, dictionary, content }: PartnerListingProps) {
  return (
    <main>
      <section className="border-b border-white/10 pb-16 pt-32">
        <Container>
          <div className="max-w-4xl">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-lumen-400">
              {dictionary.partnerPage.eyebrow}
            </p>
            <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">{dictionary.partnerPage.title}</h1>
            <p className="mt-6 max-w-3xl leading-8 text-zinc-400">{dictionary.partnerPage.description}</p>
          </div>

          <form className="mt-10 grid gap-3 rounded-ui border border-white/10 bg-white/[0.035] p-4 md:grid-cols-[1.5fr_1fr_auto_auto]">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                className="pl-9"
                defaultValue={content.filters.query}
                name="q"
                placeholder={dictionary.partnerPage.searchPlaceholder}
              />
            </label>
            <Select defaultValue={content.filters.type} name="type">
              <option value="">{dictionary.partnerPage.allTypes}</option>
              {content.types.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
            <button className={buttonClasses("solid", "w-full md:w-auto")} type="submit">
              {dictionary.partnerPage.applyFilters}
            </button>
            <Link className={buttonClasses("ghost", "w-full md:w-auto")} href={`/${locale}/partners`}>
              {dictionary.partnerPage.clearFilters}
            </Link>
          </form>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          {content.partners.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {content.partners.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          ) : (
            <Card className="p-8">
              <h2 className="text-xl font-black text-white">{dictionary.partnerPage.emptyTitle}</h2>
              <p className="mt-3 leading-7 text-zinc-400">{dictionary.partnerPage.emptyBody}</p>
            </Card>
          )}
        </Container>
      </section>
    </main>
  );
}

function PartnerCard({ partner }: { partner: PublicPartnerCard }) {
  const content = (
    <Card className="flex min-h-72 flex-col p-6 transition hover:-translate-y-0.5 hover:border-lumen-500/40">
      <div className="flex items-start justify-between gap-4">
        <div className="grid h-16 w-28 place-items-center overflow-hidden rounded-ui border border-white/10 bg-charcoal-800 px-3 text-center font-black text-lumen-400">
          {partner.logoUrl ? <img alt={partner.name} className="max-h-12 max-w-24 object-contain" src={partner.logoUrl} /> : initials(partner.name)}
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Badge>{partner.type}</Badge>
          {partner.featured ? <Badge>Featured</Badge> : null}
        </div>
      </div>
      <h2 className="mt-7 text-lg font-black text-white">{partner.name}</h2>
      <p className="mt-4 line-clamp-4 leading-7 text-zinc-400">{partner.description}</p>
      {partner.websiteUrl ? (
        <span className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-bold text-lumen-400">
          Website
          <ExternalLink className="h-4 w-4" />
        </span>
      ) : null}
    </Card>
  );

  if (!partner.websiteUrl) {
    return content;
  }

  return (
    <a href={partner.websiteUrl} rel="noreferrer" target="_blank">
      {content}
    </a>
  );
}
