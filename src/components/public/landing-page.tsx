import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Briefcase, FlaskConical, Mail, MapPin, Phone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { ContactForm } from "@/components/public/contact-form";
import { ScrambleText } from "@/components/ui/scramble-text";
import type { LandingContent } from "@/features/company/landing-service";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type LandingPageProps = {
  locale: Locale;
  dictionary: Dictionary;
  content: LandingContent;
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

function telHref(value: string) {
  return value.replace(/[^\d+]/g, "");
}

function localizeCtaUrl(value: string, locale: Locale) {
  if (value.startsWith("/en") || value.startsWith("/id") || value.startsWith("/zh")) {
    return value.replace(/^\/(en|id|zh)/, `/${locale}`);
  }

  if (value.startsWith("#")) {
    return `/${locale}${value}`;
  }

  return value;
}

export function LandingPage({ locale, dictionary, content }: LandingPageProps) {
  const primaryCta = localizeCtaUrl(content.company.mainCtaUrl, locale);

  return (
    <main>
      <section className="relative grid min-h-[88vh] items-center overflow-hidden border-b border-white/10 pb-16 pt-32" id="home">
        <Image
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-60"
          fill
          priority
          src="/images/hero-engineering-lab.png"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.98),rgba(5,5,5,0.86)_42%,rgba(5,5,5,0.24)),linear-gradient(180deg,rgba(5,5,5,0.24),rgba(5,5,5,0.92))]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(90deg,rgba(0,0,0,0.7),transparent_72%)]" />

        <Container className="relative z-10">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-lumen-400">
            {content.company.name} / {dictionary.hero.eyebrow}
          </p>
          <h1 className="max-w-4xl text-5xl font-black leading-[0.96] text-white md:text-7xl">
            {content.company.tagline}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 md:text-lg">{content.company.shortDescription}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link className={buttonClasses("solid")} href={`/${locale}/solutions`}>
              <ScrambleText className="inline-block" text={dictionary.common.exploreSolutions} />
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link className={buttonClasses("ghost")} href={primaryCta}>
              <ScrambleText className="inline-block" text={content.company.mainCtaText || dictionary.common.contactUs} />
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap gap-2">
            {content.heroTags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>

          <div className="mt-11 grid gap-3 sm:grid-cols-3 md:max-w-xl">
            {content.heroStats.map((item) => (
              <Card className="p-4 backdrop-blur" key={item.label}>
                <strong className="block text-2xl leading-none text-white">{item.value}</strong>
                <span className="mt-2 block text-xs font-bold text-zinc-400">{item.label}</span>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-white/10 bg-white/[0.03] py-8" aria-label={dictionary.sections.partners}>
        <Container>
          <div className="mb-5 flex items-center gap-4 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
            <span>{dictionary.sections.partners}</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          {content.partners.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              {content.partners.map((partner) => (
                <a
                  className="rounded-ui border border-white/10 bg-white/[0.045] p-4 text-center shadow-panel transition hover:-translate-y-0.5 hover:border-lumen-500/40"
                  href={partner.websiteUrl ?? `/${locale}#contact`}
                  key={partner.id}
                  rel="noreferrer"
                  target={partner.websiteUrl ? "_blank" : undefined}
                >
                  <span className="grid min-h-16 place-items-center">
                    {partner.logoUrl ? (
                      <img alt={partner.name} className="max-h-12 max-w-32 object-contain" src={partner.logoUrl} />
                    ) : (
                      <span className="font-black text-white">{initials(partner.name)}</span>
                    )}
                  </span>
                  <small className="mt-2 block text-xs text-zinc-400">{partner.name}</small>
                </a>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-sm text-zinc-400">{dictionary.common.noPartners}</Card>
          )}
        </Container>
      </section>

      <section className="py-24" id="about">
        <Container className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeader eyebrow={dictionary.sections.aboutEyebrow} title={dictionary.sections.aboutTitle} />
          <div className="grid gap-4">
            <Card className="p-7">
              <p className="leading-8 text-zinc-300">{content.company.longDescription}</p>
            </Card>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-lumen-400">{dictionary.common.vision}</p>
                <p className="mt-4 leading-7 text-zinc-300">{content.company.vision}</p>
              </Card>
              <Card className="p-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-lumen-400">{dictionary.common.mission}</p>
                <p className="mt-4 leading-7 text-zinc-300">{content.company.mission}</p>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-24" id="solutions">
        <Container>
          <SectionHeader eyebrow={dictionary.sections.solutionsEyebrow} title={dictionary.sections.solutionsTitle} />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {content.divisions.map((division) => (
              <Card
                className="group relative flex min-h-80 flex-col overflow-hidden p-6 transition duration-300 hover:-translate-y-2 hover:border-lumen-500/50 hover:shadow-[0_26px_80px_rgba(255,106,0,0.16)]"
                key={division.id}
              >
                <div className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(105deg,transparent,rgba(255,157,47,0.12),transparent)] transition duration-700 group-hover:translate-x-[120%]" />
                <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full border-[22px] border-lumen-500/0 transition duration-500 group-hover:border-lumen-500/15" />
                <Link className="flex h-full flex-col" href={`/${locale}/solutions/${division.slug}`}>
                  <div className="mb-9 flex items-center justify-between gap-4">
                    <span className="relative grid h-14 w-14 place-items-center rounded-ui border border-lumen-500/40 bg-lumen-500/10 font-black text-lumen-400 transition duration-300 group-hover:scale-110 group-hover:border-lumen-400/70 group-hover:bg-lumen-500/20 group-hover:shadow-[0_0_28px_rgba(255,106,0,0.24)]">
                      <span className="absolute inset-0 rounded-ui opacity-0 transition duration-300 group-hover:opacity-100 group-hover:animate-pulse group-hover:bg-lumen-500/10" />
                      <span className="relative">
                      {division.icon}
                      </span>
                    </span>
                    <span className="text-right text-xs font-black uppercase text-zinc-500 transition duration-300 group-hover:text-lumen-300">
                      {division.memberCount} {dictionary.common.members}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white transition duration-300 group-hover:text-lumen-300">{division.name}</h3>
                  <p className="mt-4 leading-7 text-zinc-400 transition duration-300 group-hover:text-zinc-300">
                    {division.shortDescription || division.description}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-7">
                    <Badge className="transition duration-300 group-hover:border-lumen-500/40 group-hover:text-lumen-300">
                      {division.productCount} {dictionary.common.products}
                    </Badge>
                    <Badge className="transition duration-300 group-hover:border-lumen-500/40 group-hover:text-lumen-300">
                      {dictionary.common.published}
                    </Badge>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-charcoal-900 py-24" id="products">
        <Container>
          <SectionHeader eyebrow={dictionary.sections.productsEyebrow} title={dictionary.sections.productsTitle} />
          {content.featuredProducts.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-3">
              {content.featuredProducts.map((product) => (
                <Card
                  className="group overflow-hidden transition duration-300 hover:-translate-y-2 hover:border-lumen-500/50 hover:shadow-[0_26px_80px_rgba(255,106,0,0.18)]"
                  key={product.id}
                >
                  <Link className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lumen-400" href={`/${locale}/products/${product.slug}`}>
                    <div className="relative flex min-h-56 items-end overflow-hidden bg-[linear-gradient(135deg,rgba(255,106,0,0.22),transparent),#17191c] p-5">
                      {product.imageUrl ? (
                        <img
                          alt={product.name}
                          className="absolute inset-0 h-full w-full object-cover opacity-35 transition duration-700 group-hover:scale-110 group-hover:opacity-55"
                          src={product.imageUrl}
                        />
                      ) : null}
                      <div className="absolute inset-0 translate-x-[-120%] bg-[linear-gradient(105deg,transparent,rgba(255,157,47,0.22),transparent)] transition duration-700 group-hover:translate-x-[120%]" />
                      <div className="absolute inset-7 skew-x-[-14deg] border border-white/15 transition duration-500 group-hover:translate-x-2 group-hover:border-lumen-400/50" />
                      <div className="absolute -bottom-12 -right-5 h-48 w-48 rounded-full border-[24px] border-lumen-500/20 transition duration-500 group-hover:scale-110 group-hover:border-lumen-400/35" />
                      <span className="relative font-black text-white transition duration-300 group-hover:text-lumen-300">
                        {product.category || product.divisionName}
                      </span>
                    </div>
                    <div className="relative p-6">
                      <div className="mb-4 flex flex-wrap gap-2">
                        <Badge className="transition duration-300 group-hover:border-lumen-500/40 group-hover:text-lumen-300">
                          {dictionary.common.featured}
                        </Badge>
                        <Badge className="transition duration-300 group-hover:border-lumen-500/40 group-hover:text-lumen-300">
                          {product.status}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-black text-white transition duration-300 group-hover:text-lumen-300">
                        {product.name}
                      </h3>
                      <p className="mt-3 leading-7 text-zinc-400 transition duration-300 group-hover:text-zinc-300">
                        {product.shortDescription}
                      </p>
                      <div className="mt-6 flex flex-wrap gap-2">
                        {product.techStack.slice(0, 5).map((item) => (
                          <Badge className="transition duration-300 group-hover:border-white/20 group-hover:bg-white/[0.075]" key={item}>
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-sm text-zinc-400">{dictionary.common.noFeaturedProducts}</Card>
          )}
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <SectionHeader eyebrow={dictionary.sections.whyEyebrow} title={dictionary.sections.whyTitle} />
          <div className="grid gap-5 lg:grid-cols-3">
            {content.whyItems.map((item, index) => (
              <Card className="min-h-64 p-7" key={item.title}>
                <span className="mb-12 block font-black text-lumen-400">0{index + 1}</span>
                <h3 className="text-lg font-black text-white">{item.title}</h3>
                <p className="mt-4 leading-7 text-zinc-400">{item.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-lumen-500/20 bg-[linear-gradient(135deg,rgba(255,106,0,0.16),rgba(255,255,255,0.02))] py-20">
        <Container className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <SectionHeader
            eyebrow={dictionary.sections.remoteEyebrow}
            title={content.company.remoteHighlightTitle}
            className="mb-0"
          />
          <p className="text-lg leading-9 text-zinc-300">{content.company.remoteHighlightBody}</p>
        </Container>
      </section>

      <section className="py-24" id="team">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeader eyebrow={dictionary.sections.teamEyebrow} title={dictionary.sections.teamTitle} />
            <Link className={buttonClasses("ghost", "mb-9 md:shrink-0")} href={`/${locale}/employee`}>
              <ScrambleText className="inline-block" text={dictionary.nav.team} />
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {content.employees.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {content.employees.map((member) => (
                <Card className="p-6" key={member.id}>
                  <div className="mb-7 grid h-14 w-14 place-items-center overflow-hidden rounded-ui border border-white/10 bg-charcoal-800 font-black text-lumen-400">
                    {member.photoUrl ? (
                      <img alt={member.name} className="h-full w-full object-cover" src={member.photoUrl} />
                    ) : (
                      initials(member.name)
                    )}
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-lumen-400">{member.divisionName}</p>
                  <h3 className="mt-3 font-black text-white">{member.role}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-400">{member.shortBio}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {member.skills.map((skill) => (
                      <Badge key={skill}>{skill}</Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-sm text-zinc-400">{dictionary.common.noTeam}</Card>
          )}
        </Container>
      </section>

      <section className="bg-charcoal-900 py-24">
        <Container className="grid gap-5 lg:grid-cols-2">
          <Card className="p-7" id="academic">
            <div className="mb-7 flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-ui border border-lumen-500/30 bg-lumen-500/10 text-lumen-400">
                <FlaskConical className="h-5 w-5" />
              </span>
              <SectionHeader eyebrow={dictionary.sections.academicEyebrow} title={dictionary.sections.academicTitle} className="mb-0" />
            </div>
            {content.academic.length > 0 ? (
              <div className="grid gap-3">
                {content.academic.map((item) => (
                  <Link className="rounded-ui border border-white/10 bg-white/[0.03] p-4 transition hover:border-lumen-500/40" href={`/${locale}/academic/${item.slug}`} key={item.id}>
                    <Badge>{item.category}</Badge>
                    <h3 className="mt-4 font-black text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">{item.shortDescription}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="leading-8 text-zinc-400">{dictionary.common.noAcademic}</p>
            )}
          </Card>
          <Card className="p-7" id="career">
            <div className="mb-7 flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-ui border border-lumen-500/30 bg-lumen-500/10 text-lumen-400">
                <Briefcase className="h-5 w-5" />
              </span>
              <SectionHeader eyebrow={dictionary.sections.careerEyebrow} title={dictionary.sections.careerTitle} className="mb-0" />
            </div>
            {content.careers.length > 0 ? (
              <div className="grid gap-3">
                {content.careers.map((job) => (
                  <Link className="rounded-ui border border-white/10 bg-white/[0.03] p-4 transition hover:border-lumen-500/40" href={`/${locale}/career/${job.slug}`} key={job.id}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="font-bold text-white">{job.jobTitle}</span>
                      <Badge>{job.workType}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-zinc-500">{job.divisionName} / {job.employmentType}</p>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">{job.shortDescription}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="leading-8 text-zinc-400">{dictionary.common.noOpenCareers}</p>
            )}
          </Card>
        </Container>
      </section>

      <section className="py-24" id="contact">
        <Container className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionHeader eyebrow={dictionary.sections.contactEyebrow} title={dictionary.sections.contactTitle} />
            <div className="grid gap-4 text-zinc-400">
              {content.company.email ? (
                <a className="inline-flex items-center gap-3 transition hover:text-lumen-400" href={`mailto:${content.company.email}`}>
                  <Mail className="h-4 w-4" />
                  {content.company.email}
                </a>
              ) : null}
              {content.company.phone ? (
                <a className="inline-flex items-center gap-3 transition hover:text-lumen-400" href={`tel:${telHref(content.company.phone)}`}>
                  <Phone className="h-4 w-4" />
                  {content.company.phone}
                </a>
              ) : null}
              {content.company.address ? (
                <span className="inline-flex items-center gap-3">
                  <MapPin className="h-4 w-4" />
                  {content.company.address}
                </span>
              ) : null}
            </div>
          </div>
          <Card className="p-6">
            <ContactForm dictionary={dictionary} interests={content.contactInterests} />
          </Card>
        </Container>
      </section>
    </main>
  );
}
