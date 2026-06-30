import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/public/contact-form";
import type { PublicContactContent } from "@/features/contact/contact-service";
import type { Dictionary } from "@/i18n/dictionaries";

type ContactPageProps = {
  dictionary: Dictionary;
  content: PublicContactContent;
};

function telHref(value: string) {
  return value.replace(/[^\d+]/g, "");
}

export function ContactPage({ dictionary, content }: ContactPageProps) {
  const social = content.company.socialLinks;

  return (
    <main>
      <section className="border-b border-white/10 pb-16 pt-32">
        <Container>
          <div className="max-w-4xl">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-lumen-400">
              {dictionary.contactPage.eyebrow}
            </p>
            <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">{dictionary.contactPage.title}</h1>
            <p className="mt-6 max-w-3xl leading-8 text-zinc-400">{dictionary.contactPage.description}</p>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="grid content-start gap-5">
            <Card className="p-7">
              <h2 className="text-xl font-black text-white">{content.company.name}</h2>
              <p className="mt-3 leading-7 text-zinc-400">{content.company.shortDescription}</p>
              <div className="mt-7 grid gap-4 text-zinc-300">
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
            </Card>

            {social.linkedin || social.github ? (
              <Card className="p-7">
                <h2 className="text-lg font-black text-white">{dictionary.contactPage.socialTitle}</h2>
                <div className="mt-5 flex flex-wrap gap-3">
                  {social.linkedin ? (
                    <a className="inline-flex items-center gap-2 text-sm font-bold text-lumen-400" href={social.linkedin} rel="noreferrer" target="_blank">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  ) : null}
                  {social.github ? (
                    <a className="inline-flex items-center gap-2 text-sm font-bold text-lumen-400" href={social.github} rel="noreferrer" target="_blank">
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  ) : null}
                </div>
              </Card>
            ) : null}
          </div>

          <Card className="p-6">
            <ContactForm dictionary={dictionary} interests={content.interests} />
          </Card>
        </Container>
      </section>
    </main>
  );
}
