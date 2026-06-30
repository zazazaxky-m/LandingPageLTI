import Link from "next/link";
import { Search } from "lucide-react";

import { ProductCard } from "@/components/public/product-card";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { PublicProductIndex } from "@/features/products/product-service";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type ProductListingProps = {
  locale: Locale;
  dictionary: Dictionary;
  content: PublicProductIndex;
};

export function ProductListing({ locale, dictionary, content }: ProductListingProps) {
  return (
    <main>
      <section className="border-b border-white/10 pb-16 pt-32">
        <Container>
          <div className="mb-9 max-w-3xl">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-lumen-400">
              {dictionary.productsPage.eyebrow}
            </p>
            <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">{dictionary.productsPage.title}</h1>
          </div>
          <p className="-mt-4 max-w-3xl leading-8 text-zinc-400">{dictionary.productsPage.description}</p>

          <form className="mt-10 grid gap-3 rounded-ui border border-white/10 bg-white/[0.035] p-4 md:grid-cols-[1.5fr_1fr_1fr_auto_auto]">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                className="pl-9"
                defaultValue={content.filters.query}
                name="q"
                placeholder={dictionary.productsPage.searchPlaceholder}
              />
            </label>
            <label className="sr-only" htmlFor="division">{dictionary.productsPage.filterDivision}</label>
            <Select defaultValue={content.filters.division} id="division" name="division">
              <option value="">{dictionary.productsPage.allDivisions}</option>
              {content.divisions.map((division) => (
                <option key={division.id} value={division.slug}>
                  {division.name}
                </option>
              ))}
            </Select>
            <label className="sr-only" htmlFor="category">{dictionary.productsPage.filterCategory}</label>
            <Select defaultValue={content.filters.category} id="category" name="category">
              <option value="">{dictionary.productsPage.allCategories}</option>
              {content.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
            <button className={buttonClasses("solid", "w-full md:w-auto")} type="submit">
              {dictionary.productsPage.applyFilters}
            </button>
            <Link className={buttonClasses("ghost", "w-full md:w-auto")} href={`/${locale}/products`}>
              {dictionary.productsPage.clearFilters}
            </Link>
          </form>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          {content.products.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {content.products.map((product) => (
                <ProductCard dictionary={dictionary} key={product.id} locale={locale} product={product} />
              ))}
            </div>
          ) : (
            <Card className="p-8">
              <h2 className="text-xl font-black text-white">{dictionary.productsPage.emptyTitle}</h2>
              <p className="mt-3 leading-7 text-zinc-400">{dictionary.productsPage.emptyBody}</p>
            </Card>
          )}
        </Container>
      </section>
    </main>
  );
}
