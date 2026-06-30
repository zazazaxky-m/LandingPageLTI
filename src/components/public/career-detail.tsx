import Link from "next/link";
import { ArrowLeft, ExternalLink, Mail, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import type { PublicCareerDetail } from "@/features/careers/career-service";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type CareerDetailProps = {
  locale: Locale;
  dictionary: Dictionary;
  job: PublicCareerDetail;
};

function paragraphs(value: string) {
  return value
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function DetailBlock({ title, body }: { title: string; body: string }) {
  if (!body) {
    return null;
  }

  return (
    <Card className="p-7">
      <h2 className="text-lg font-black text-white">{title}</h2>
      <div className="mt-5 grid gap-4 leading-8 text-zinc-300">
        {paragraphs(body).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </Card>
  );
}

export function CareerDetail({ locale, dictionary, job }: CareerDetailProps) {
  return (
    <main>
      <section className="border-b border-white/10 pb-16 pt-32">
        <Container>
          <Link className={buttonClasses("ghost", "mb-7 inline-flex")} href={`/${locale}/career`}>
            <ArrowLeft className="h-4 w-4" />
            {dictionary.careerPage.backToCareers}
          </Link>
          <div className="max-w-4xl">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-lumen-400">
              {dictionary.careerPage.detailEyebrow}
            </p>
            <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">{job.jobTitle}</h1>
            <div className="mt-6 flex flex-wrap gap-3">
              {job.divisionName ? <Badge>{job.divisionName}</Badge> : null}
              <Badge>{job.workType}</Badge>
              <Badge>{job.employmentType}</Badge>
              {job.isRemote ? <Badge>{dictionary.careerPage.remoteFriendly}</Badge> : null}
            </div>
            <p className="mt-6 max-w-3xl leading-8 text-zinc-400">{job.shortDescription}</p>
            {job.location ? (
              <p className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-zinc-400">
                <MapPin className="h-4 w-4" />
                {job.location}
              </p>
            ) : null}
          </div>
        </Container>
      </section>

      {job.isRemote ? (
        <section className="border-b border-lumen-500/20 bg-[linear-gradient(135deg,rgba(255,106,0,0.16),rgba(255,255,255,0.02))] py-12">
          <Container>
            <h2 className="text-2xl font-black text-white">{dictionary.careerPage.remoteHighlightTitle}</h2>
            <p className="mt-4 max-w-3xl leading-8 text-zinc-300">{dictionary.careerPage.remoteHighlightBody}</p>
          </Container>
        </section>
      ) : null}

      <section className="py-20">
        <Container className="grid gap-10 lg:grid-cols-[1fr_340px]">
          <div className="grid gap-5">
            <DetailBlock body={job.responsibilities} title={dictionary.careerPage.responsibilities} />
            <DetailBlock body={job.requirements} title={dictionary.careerPage.requirements} />
            <DetailBlock body={job.benefits} title={dictionary.careerPage.benefits} />
          </div>

          <aside className="grid content-start gap-5">
            <Card className="p-6">
              <h2 className="font-black text-white">{dictionary.careerPage.applyTitle}</h2>
              <p className="mt-3 leading-7 text-zinc-400">{dictionary.careerPage.applyBody}</p>
              <div className="mt-6 grid gap-3">
                {job.applyUrl ? (
                  <a className={buttonClasses("solid")} href={job.applyUrl} rel="noreferrer" target="_blank">
                    {dictionary.careerPage.applyNow}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}
                {job.applyEmail ? (
                  <a className={buttonClasses(job.applyUrl ? "ghost" : "solid")} href={`mailto:${job.applyEmail}`}>
                    <Mail className="h-4 w-4" />
                    {job.applyEmail}
                  </a>
                ) : null}
              </div>
            </Card>

            {job.related.length > 0 ? (
              <Card className="p-6">
                <h2 className="font-black text-white">{dictionary.careerPage.relatedCareers}</h2>
                <div className="mt-5 grid gap-4">
                  {job.related.map((related) => (
                    <Link className="rounded-ui border border-white/10 p-4 transition hover:border-lumen-500/40" href={`/${locale}/career/${related.slug}`} key={related.id}>
                      <p className="font-bold text-white">{related.jobTitle}</p>
                      <p className="mt-2 text-xs font-bold text-lumen-400">{related.workType}</p>
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
