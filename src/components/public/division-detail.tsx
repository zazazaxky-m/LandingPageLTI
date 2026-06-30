import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, Users } from "lucide-react";

import { ProductCard } from "@/components/public/product-card";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import type { PublicDivisionDetail } from "@/features/divisions/division-service";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type DivisionDetailProps = {
  locale: Locale;
  dictionary: Dictionary;
  division: PublicDivisionDetail;
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

export function DivisionDetail({ locale, dictionary, division }: DivisionDetailProps) {
  return (
    <main>
      <section className="border-b border-white/10 pb-16 pt-32">
        <Container>
          <Link className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-zinc-400 transition hover:text-lumen-400" href={`/${locale}/solutions`}>
            <ArrowLeft className="h-4 w-4" />
            {dictionary.solutionsPage.backToSolutions}
          </Link>

          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-lumen-400">
                {dictionary.solutionsPage.divisionDetail}
              </p>
              <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">{division.name}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">{division.shortDescription}</p>
              <div className="mt-7 flex flex-wrap gap-2">
                <Badge>{division.memberCount} {dictionary.common.members}</Badge>
                <Badge>{division.productCount} {dictionary.solutionsPage.productCount}</Badge>
                <Badge>{division.employeeCount} {dictionary.solutionsPage.employeeCount}</Badge>
              </div>
              <Link className={buttonClasses("solid", "mt-9")} href={`/${locale}#contact`}>
                {dictionary.common.contactUs}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative min-h-[340px] overflow-hidden rounded-ui border border-white/10 bg-[linear-gradient(135deg,rgba(255,106,0,0.18),rgba(255,255,255,0.03)),#15171a]">
              {division.imageUrl ? <img alt={division.name} className="absolute inset-0 h-full w-full object-cover opacity-55" src={division.imageUrl} /> : null}
              <div className="absolute inset-8 skew-x-[-14deg] border border-white/15" />
              <div className="absolute -bottom-20 -right-12 h-64 w-64 rounded-full border-[32px] border-lumen-500/20" />
              <span className="absolute bottom-6 left-6 grid h-20 w-20 place-items-center rounded-ui border border-lumen-500/40 bg-lumen-500/10 text-2xl font-black text-lumen-400">
                {division.icon}
              </span>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="p-7">
            <SectionHeader eyebrow={dictionary.solutionsPage.eyebrow} title={division.name} className="mb-6" />
            <p className="whitespace-pre-line leading-8 text-zinc-300">{division.description}</p>
          </Card>

          <Card className="p-7">
            <div className="mb-7 flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-ui border border-lumen-500/30 bg-lumen-500/10 text-lumen-400">
                <Users className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-black text-white">{dictionary.solutionsPage.relatedEmployees}</h2>
                <p className="mt-1 text-sm text-zinc-500">{division.employeeCount} {dictionary.solutionsPage.employeeCount}</p>
              </div>
            </div>
            {division.employees.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {division.employees.map((employee) => (
                  <div className="rounded-ui border border-white/10 bg-white/[0.03] p-4" key={employee.id}>
                    <div className="mb-5 grid h-12 w-12 place-items-center overflow-hidden rounded-ui border border-white/10 bg-charcoal-800 font-black text-lumen-400">
                      {employee.photoUrl ? (
                        <img alt={employee.name} className="h-full w-full object-cover" src={employee.photoUrl} />
                      ) : (
                        initials(employee.name)
                      )}
                    </div>
                    <h3 className="font-black text-white">{employee.role}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">{employee.shortBio}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {employee.skills.map((skill) => (
                        <Badge key={skill}>{skill}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="leading-7 text-zinc-400">{dictionary.solutionsPage.noEmployees}</p>
            )}
          </Card>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-charcoal-900 py-20">
        <Container>
          <SectionHeader eyebrow={dictionary.nav.products} title={dictionary.solutionsPage.relatedProducts} />
          {division.relatedProducts.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {division.relatedProducts.map((product) => (
                <ProductCard dictionary={dictionary} key={product.id} locale={locale} product={product} />
              ))}
            </div>
          ) : (
            <Card className="p-6 text-zinc-400">{dictionary.solutionsPage.noProducts}</Card>
          )}
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <Card className="grid gap-6 p-7 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-2xl font-black text-white">{dictionary.solutionsPage.contactCtaTitle}</h2>
              <p className="mt-4 max-w-3xl leading-8 text-zinc-400">{dictionary.solutionsPage.contactCtaBody}</p>
            </div>
            <Link className={buttonClasses("solid")} href={`/${locale}#contact`}>
              {dictionary.common.contactUs}
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Card>
        </Container>
      </section>
    </main>
  );
}
