import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import type { PublicDivisionIndex } from "@/features/divisions/division-service";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type DivisionListingProps = {
  locale: Locale;
  dictionary: Dictionary;
  content: PublicDivisionIndex;
};

export function DivisionListing({ locale, dictionary, content }: DivisionListingProps) {
  return (
    <main>
      <section className="border-b border-white/10 pb-16 pt-32">
        <Container>
          <div className="mb-9 max-w-4xl">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-lumen-400">
              {dictionary.solutionsPage.eyebrow}
            </p>
            <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">{dictionary.solutionsPage.title}</h1>
          </div>
          <p className="-mt-4 max-w-3xl leading-8 text-zinc-400">{dictionary.solutionsPage.description}</p>

          <div className="mt-10 grid gap-3 sm:grid-cols-3 md:max-w-2xl">
            <Card className="p-4">
              <strong className="block text-2xl text-white">{content.totals.divisions}</strong>
              <span className="mt-2 block text-xs font-bold text-zinc-400">{dictionary.common.all}</span>
            </Card>
            <Card className="p-4">
              <strong className="block text-2xl text-white">{content.totals.members}+</strong>
              <span className="mt-2 block text-xs font-bold text-zinc-400">{dictionary.solutionsPage.memberCount}</span>
            </Card>
            <Card className="p-4">
              <strong className="block text-2xl text-white">{content.totals.products}</strong>
              <span className="mt-2 block text-xs font-bold text-zinc-400">{dictionary.solutionsPage.productCount}</span>
            </Card>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {content.divisions.map((division) => (
              <Card className="group flex min-h-[360px] flex-col overflow-hidden" key={division.id}>
                <Link className="flex h-full flex-col" href={`/${locale}/solutions/${division.slug}`}>
                  <div className="relative min-h-36 overflow-hidden bg-[linear-gradient(135deg,rgba(255,106,0,0.18),rgba(255,255,255,0.03)),#15171a] p-5">
                    {division.imageUrl ? (
                      <img alt={division.name} className="absolute inset-0 h-full w-full object-cover opacity-35" src={division.imageUrl} />
                    ) : null}
                    <div className="absolute inset-6 skew-x-[-14deg] border border-white/15 transition group-hover:border-lumen-500/50" />
                    <span className="relative grid h-14 w-14 place-items-center rounded-ui border border-lumen-500/40 bg-lumen-500/10 font-black text-lumen-400">
                      {division.icon}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="text-lg font-black text-white">{division.name}</h2>
                    <p className="mt-4 leading-7 text-zinc-400">{division.shortDescription || division.description}</p>
                    <div className="mt-auto flex flex-wrap gap-2 pt-7">
                      <Badge>{division.memberCount} {dictionary.common.members}</Badge>
                      <Badge>{division.productCount} {dictionary.solutionsPage.productCount}</Badge>
                    </div>
                    <span className="mt-7 inline-flex items-center gap-2 text-sm font-black text-lumen-400">
                      {dictionary.solutionsPage.viewDetail}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
