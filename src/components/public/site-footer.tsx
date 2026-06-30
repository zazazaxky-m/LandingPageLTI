import Link from "next/link";

import { Container } from "@/components/ui/container";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type SiteFooterProps = {
  locale: Locale;
  dictionary: Dictionary;
  brandName: string;
  tagline: string;
};

function brandInitial(value: string) {
  return value.trim().charAt(0).toUpperCase() || "L";
}

export function SiteFooter({ locale, dictionary, brandName, tagline }: SiteFooterProps) {
  const links = [
    [dictionary.nav.home, ""],
    [dictionary.nav.solutions, "/solutions"],
    [dictionary.nav.products, "/products"],
    [dictionary.nav.team, "/employee"],
    [dictionary.nav.academic, "/academic"],
    [dictionary.nav.career, "/career"],
    [dictionary.nav.contact, "/contact"]
  ] as const;

  return (
    <footer className="border-t border-white/10 bg-black py-12">
      <Container className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <Link className="inline-flex items-center gap-3 font-black" href={`/${locale}`}>
            <span className="grid h-10 w-10 place-items-center rounded-ui bg-gradient-to-br from-lumen-500 to-lumen-400 text-charcoal-950 shadow-glow">
              {brandInitial(brandName)}
            </span>
            <span>{brandName}</span>
          </Link>
          <p className="mt-3 text-sm text-zinc-500">{tagline}</p>
        </div>

        <nav className="flex flex-wrap gap-5 text-sm text-zinc-400">
          {links.map(([label, href]) => (
            <Link className="transition hover:text-white" href={`/${locale}${href}`} key={label}>
              {label}
            </Link>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
