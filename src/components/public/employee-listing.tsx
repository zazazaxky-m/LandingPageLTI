import Link from "next/link";
import { ExternalLink, Github, Linkedin, Mail, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { PublicEmployeeCard, PublicEmployeeIndex } from "@/features/employees/employee-service";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type EmployeeListingProps = {
  locale: Locale;
  dictionary: Dictionary;
  content: PublicEmployeeIndex;
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

export function EmployeeListing({ locale, dictionary, content }: EmployeeListingProps) {
  return (
    <main>
      <section className="border-b border-white/10 pb-16 pt-32">
        <Container>
          <div className="mb-9 max-w-4xl">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-lumen-400">
              {dictionary.employeePage.eyebrow}
            </p>
            <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">{dictionary.employeePage.title}</h1>
          </div>
          <p className="-mt-4 max-w-3xl leading-8 text-zinc-400">{dictionary.employeePage.description}</p>

          <div className="mt-10 grid gap-3 sm:grid-cols-3 md:max-w-2xl">
            <Card className="p-4">
              <strong className="block text-2xl text-white">{content.totals.employees}</strong>
              <span className="mt-2 block text-xs font-bold text-zinc-400">{dictionary.employeePage.totalEmployees}</span>
            </Card>
            <Card className="p-4">
              <strong className="block text-2xl text-white">{content.totals.divisions}</strong>
              <span className="mt-2 block text-xs font-bold text-zinc-400">{dictionary.employeePage.totalDivisions}</span>
            </Card>
            <Card className="p-4">
              <strong className="block text-2xl text-white">{content.totals.skills}</strong>
              <span className="mt-2 block text-xs font-bold text-zinc-400">{dictionary.employeePage.totalSkills}</span>
            </Card>
          </div>

          <form className="mt-10 grid gap-3 rounded-ui border border-white/10 bg-white/[0.035] p-4 md:grid-cols-[1.5fr_1fr_auto_auto]">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                className="pl-9"
                defaultValue={content.filters.query}
                name="q"
                placeholder={dictionary.employeePage.searchPlaceholder}
              />
            </label>
            <label className="sr-only" htmlFor="division">{dictionary.employeePage.filterDivision}</label>
            <Select defaultValue={content.filters.division} id="division" name="division">
              <option value="">{dictionary.employeePage.allDivisions}</option>
              {content.divisions.map((division) => (
                <option key={division.id} value={division.slug}>
                  {division.name}
                </option>
              ))}
            </Select>
            <button className={buttonClasses("solid", "w-full md:w-auto")} type="submit">
              {dictionary.employeePage.applyFilters}
            </button>
            <Link className={buttonClasses("ghost", "w-full md:w-auto")} href={`/${locale}/employee`}>
              {dictionary.employeePage.clearFilters}
            </Link>
          </form>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          {content.employees.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {content.employees.map((employee) => (
                <EmployeeCard dictionary={dictionary} employee={employee} key={employee.id} locale={locale} />
              ))}
            </div>
          ) : (
            <Card className="p-8">
              <h2 className="text-xl font-black text-white">{dictionary.employeePage.emptyTitle}</h2>
              <p className="mt-3 leading-7 text-zinc-400">{dictionary.employeePage.emptyBody}</p>
            </Card>
          )}
        </Container>
      </section>
    </main>
  );
}

function EmployeeCard({ employee, dictionary, locale }: { employee: PublicEmployeeCard; dictionary: Dictionary; locale: Locale }) {
  return (
    <Card className="flex min-h-[440px] flex-col p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-ui border border-white/10 bg-charcoal-800 text-lg font-black text-lumen-400">
          {employee.photoUrl ? <img alt={employee.name} className="h-full w-full object-cover" src={employee.photoUrl} /> : initials(employee.name)}
        </div>
        {employee.divisionSlug ? (
          <Link className="text-xs font-black uppercase tracking-[0.14em] text-lumen-400 transition hover:text-lumen-300" href={`/${locale}/solutions/${employee.divisionSlug}`}>
            {employee.divisionName}
          </Link>
        ) : null}
      </div>

      <div className="mt-7">
        <h2 className="text-lg font-black text-white">{employee.name}</h2>
        <p className="mt-2 font-bold text-zinc-300">{employee.role}</p>
        <p className="mt-4 line-clamp-4 leading-7 text-zinc-400">{employee.shortBio}</p>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-zinc-500">{dictionary.employeePage.skills}</p>
        <div className="flex flex-wrap gap-2">
          {employee.skills.map((skill) => (
            <Badge key={skill}>{skill}</Badge>
          ))}
        </div>
      </div>

      {employee.experienceHistory ? (
        <p className="mt-6 line-clamp-3 text-sm leading-6 text-zinc-500">{employee.experienceHistory}</p>
      ) : null}

      <div className="mt-auto flex flex-wrap gap-2 pt-7">
        {employee.linkedinUrl ? (
          <a className={buttonClasses("ghost", "min-h-9 px-3")} href={employee.linkedinUrl} rel="noreferrer" target="_blank" aria-label="LinkedIn">
            <Linkedin className="h-4 w-4" />
          </a>
        ) : null}
        {employee.githubUrl ? (
          <a className={buttonClasses("ghost", "min-h-9 px-3")} href={employee.githubUrl} rel="noreferrer" target="_blank" aria-label="GitHub">
            <Github className="h-4 w-4" />
          </a>
        ) : null}
        {employee.portfolioUrl ? (
          <a className={buttonClasses("ghost", "min-h-9 px-3")} href={employee.portfolioUrl} rel="noreferrer" target="_blank" aria-label="Portfolio">
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : null}
        {employee.email ? (
          <a className={buttonClasses("ghost", "min-h-9 px-3")} href={`mailto:${employee.email}`} aria-label="Email">
            <Mail className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </Card>
  );
}
