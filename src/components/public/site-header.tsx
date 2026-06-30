"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ScrambleText } from "@/components/ui/scramble-text";
import { localeLabels, locales, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type SiteHeaderProps = {
  locale: Locale;
  dictionary: Dictionary;
  brandName: string;
};

const navKeys = [
  ["home", "#home"],
  ["solutions", "/solutions"],
  ["products", "/products"],
  ["team", "/employee"],
  ["academic", "/academic"],
  ["career", "/career"],
  ["contact", "/contact"]
] as const;

function brandInitial(value: string) {
  return value.trim().charAt(0).toUpperCase() || "L";
}

export function SiteHeader({ locale, dictionary, brandName }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);

  const nav = navKeys.map(([key, href]) => ({
    label: dictionary.nav[key],
    href: `/${locale}${href}`
  }));

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-charcoal-950/80 backdrop-blur-xl">
      <Container className="flex min-h-[72px] items-center justify-between gap-6">
        <Link className="inline-flex items-center gap-3 font-black" href={`/${locale}`}>
          <span className="grid h-10 w-10 place-items-center rounded-ui bg-gradient-to-br from-lumen-500 to-lumen-400 text-charcoal-950 shadow-glow">
            {brandInitial(brandName)}
          </span>
          <span className="hidden sm:inline">{brandName}</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-300 lg:flex">
          {nav.map((item) => (
            <Link className="transition hover:text-white" href={item.href} key={item.href}>
              <ScrambleText className="inline-block" corners text={item.label} />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden overflow-hidden rounded-ui border border-white/10 bg-white/[0.04] sm:flex">
            {locales.map((item) => (
              <Link
                className={
                  item === locale
                    ? "bg-lumen-500 px-3 py-2 text-xs font-black text-charcoal-950"
                    : "px-3 py-2 text-xs font-bold text-zinc-300 transition hover:text-white"
                }
                href={`/${item}`}
                key={item}
              >
                {localeLabels[item]}
              </Link>
            ))}
          </div>

          <Link className={buttonClasses("solid", "hidden min-h-10 px-4 text-xs lg:inline-flex")} href={`/${locale}/contact`}>
            <ScrambleText className="inline-block" text={dictionary.common.contactUs} />
          </Link>

          <button
            aria-expanded={open}
            aria-label="Toggle menu"
            className="grid h-10 w-10 place-items-center rounded-md border border-white/10 bg-white/[0.04] lg:hidden"
            onClick={() => setOpen((value) => !value)}
            type="button"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {open ? (
        <div className="border-t border-white/10 bg-charcoal-900 lg:hidden">
          <Container className="grid gap-2 py-4">
            {nav.map((item) => (
              <Link
                className="rounded-md px-3 py-3 text-sm font-bold text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
                href={item.href}
                key={item.href}
                onClick={() => setOpen(false)}
              >
                <ScrambleText className="inline-block" corners text={item.label} />
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              {locales.map((item) => (
                <Link
                  className={
                    item === locale
                      ? "rounded-md bg-lumen-500 px-3 py-2 text-xs font-black text-charcoal-950"
                      : "rounded-md border border-white/10 px-3 py-2 text-xs font-bold text-zinc-300"
                  }
                  href={`/${item}`}
                  key={item}
                >
                  {localeLabels[item]}
                </Link>
              ))}
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
