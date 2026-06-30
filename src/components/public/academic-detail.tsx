import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import type { PublicAcademicDetail } from "@/features/academic/academic-service";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type AcademicDetailProps = {
  locale: Locale;
  dictionary: Dictionary;
  item: PublicAcademicDetail;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function paragraphs(value: string) {
  return value
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function AcademicDetail({ locale, dictionary, item }: AcademicDetailProps) {
  return (
    <main>
      <section className="border-b border-white/10 pb-16 pt-32">
        <Container>
          <Link className={buttonClasses("ghost", "mb-7 inline-flex")} href={`/${locale}/academic`}>
            <ArrowLeft className="h-4 w-4" />
            {dictionary.academicPage.backToAcademic}
          </Link>
          <div className="max-w-4xl">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-lumen-400">
              {dictionary.academicPage.detailEyebrow}
            </p>
            <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">{item.title}</h1>
            <div className="mt-6 flex flex-wrap gap-3">
              <Badge>{item.category}</Badge>
              <Badge>{formatDate(item.publishedAt)}</Badge>
            </div>
            <p className="mt-6 max-w-3xl leading-8 text-zinc-400">{item.shortDescription}</p>
          </div>
        </Container>
      </section>

      {item.imageUrl ? (
        <section className="border-b border-white/10 bg-white/[0.03] py-10">
          <Container>
            <img alt={item.title} className="max-h-[520px] w-full rounded-ui object-cover" src={item.imageUrl} />
          </Container>
        </section>
      ) : null}

      <section className="py-20">
        <Container className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <Card className="p-7">
            <div className="grid gap-5 text-base leading-8 text-zinc-300">
              {paragraphs(item.content).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Card>

          <aside className="grid content-start gap-5">
            <Card className="p-6">
              <div className="inline-flex items-center gap-2 text-sm font-bold text-zinc-400">
                <CalendarDays className="h-4 w-4" />
                {formatDate(item.publishedAt)}
              </div>
              <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-lumen-400">{item.category}</p>
            </Card>
            {item.related.length > 0 ? (
              <Card className="p-6">
                <h2 className="font-black text-white">{dictionary.academicPage.relatedAcademic}</h2>
                <div className="mt-5 grid gap-4">
                  {item.related.map((related) => (
                    <Link className="rounded-ui border border-white/10 p-4 transition hover:border-lumen-500/40" href={`/${locale}/academic/${related.slug}`} key={related.id}>
                      <p className="font-bold text-white">{related.title}</p>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-500">{related.shortDescription}</p>
                    </Link>
                  ))}
                </div>
              </Card>
            ) : null}
          </aside>
        </Container>
      </section>
    </main>
  );
}
