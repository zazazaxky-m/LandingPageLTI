import Link from "next/link";
import { Briefcase, MapPin, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { PublicCareerCard, PublicCareerIndex } from "@/features/careers/career-service";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type CareerListingProps = {
  locale: Locale;
  dictionary: Dictionary;
  content: PublicCareerIndex;
};

export function CareerListing({ locale, dictionary, content }: CareerListingProps) {
  const remoteJobs = content.jobs.filter((job) => job.isRemote).length;

  return (
    <main>
      <section className="border-b border-white/10 pb-16 pt-32">
        <Container>
          <div className="max-w-4xl">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-lumen-400">
              {dictionary.careerPage.eyebrow}
            </p>
            <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">{dictionary.careerPage.title}</h1>
            <p className="mt-6 max-w-3xl leading-8 text-zinc-400">{dictionary.careerPage.description}</p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 md:max-w-lg">
            <Card className="p-4">
              <strong className="block text-2xl text-white">{content.jobs.length}</strong>
              <span className="mt-2 block text-xs font-bold text-zinc-400">{dictionary.careerPage.openRoles}</span>
            </Card>
            <Card className="p-4">
              <strong className="block text-2xl text-white">{remoteJobs}</strong>
              <span className="mt-2 block text-xs font-bold text-zinc-400">{dictionary.careerPage.remoteRoles}</span>
            </Card>
          </div>

          <form className="mt-10 grid gap-3 rounded-ui border border-white/10 bg-white/[0.035] p-4 lg:grid-cols-[1.3fr_1fr_1fr_auto_auto]">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                className="pl-9"
                defaultValue={content.filters.query}
                name="q"
                placeholder={dictionary.careerPage.searchPlaceholder}
              />
            </label>
            <Select defaultValue={content.filters.division} name="division">
              <option value="">{dictionary.careerPage.allDivisions}</option>
              {content.divisions.map((division) => (
                <option key={division.id} value={division.slug}>
                  {division.name}
                </option>
              ))}
            </Select>
            <Select defaultValue={content.filters.workType} name="workType">
              <option value="">{dictionary.careerPage.allWorkTypes}</option>
              {content.workTypes.map((workType) => (
                <option key={workType.value} value={workType.value}>
                  {workType.label}
                </option>
              ))}
            </Select>
            <button className={buttonClasses("solid", "w-full lg:w-auto")} type="submit">
              {dictionary.careerPage.applyFilters}
            </button>
            <Link className={buttonClasses("ghost", "w-full lg:w-auto")} href={`/${locale}/career`}>
              {dictionary.careerPage.clearFilters}
            </Link>
          </form>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          {content.jobs.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {content.jobs.map((job) => (
                <CareerCard dictionary={dictionary} job={job} key={job.id} locale={locale} />
              ))}
            </div>
          ) : (
            <Card className="p-8">
              <h2 className="text-xl font-black text-white">{dictionary.careerPage.emptyTitle}</h2>
              <p className="mt-3 leading-7 text-zinc-400">{dictionary.careerPage.emptyBody}</p>
            </Card>
          )}
        </Container>
      </section>
    </main>
  );
}

function CareerCard({ job, locale, dictionary }: { job: PublicCareerCard; locale: Locale; dictionary: Dictionary }) {
  return (
    <Card className="flex min-h-80 flex-col p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge>{job.workType}</Badge>
          <Badge>{job.employmentType}</Badge>
          {job.isRemote ? <Badge>{dictionary.careerPage.remoteFriendly}</Badge> : null}
        </div>
        <Briefcase className="h-5 w-5 text-lumen-400" />
      </div>
      <h2 className="mt-7 text-xl font-black text-white">{job.jobTitle}</h2>
      <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold text-zinc-400">
        {job.divisionName ? <span>{job.divisionName}</span> : null}
        {job.location ? (
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {job.location}
          </span>
        ) : null}
      </div>
      <p className="mt-5 line-clamp-4 leading-7 text-zinc-400">{job.shortDescription}</p>
      <Link className={buttonClasses("ghost", "mt-auto self-start")} href={`/${locale}/career/${job.slug}`}>
        {dictionary.careerPage.viewDetail}
      </Link>
    </Card>
  );
}
