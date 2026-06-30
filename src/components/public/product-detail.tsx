import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, PlayCircle } from "lucide-react";

import { ProductCard } from "@/components/public/product-card";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import type { PublicProductDetail } from "@/features/products/product-service";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type ProductDetailProps = {
  locale: Locale;
  dictionary: Dictionary;
  product: PublicProductDetail;
};

export function ProductDetail({ locale, dictionary, product }: ProductDetailProps) {
  const heroImage = product.images[0]?.url ?? product.imageUrl;

  return (
    <main>
      <section className="border-b border-white/10 pb-16 pt-32">
        <Container>
          <Link className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-zinc-400 transition hover:text-lumen-400" href={`/${locale}/products`}>
            <ArrowLeft className="h-4 w-4" />
            {dictionary.productsPage.backToProducts}
          </Link>

          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-lumen-400">
                {dictionary.productsPage.productDetail}
              </p>
              <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">{product.name}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">{product.shortDescription}</p>
              <div className="mt-7 flex flex-wrap gap-2">
                {product.category ? <Badge>{product.category}</Badge> : null}
                {product.divisionName ? <Badge>{product.divisionName}</Badge> : null}
                <Badge>{product.status}</Badge>
              </div>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link className={buttonClasses("solid")} href={`/${locale}#contact`}>
                  {dictionary.common.contactUs}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                {product.youtubeUrl ? (
                  <a className={buttonClasses("ghost")} href={product.youtubeUrl} rel="noreferrer" target="_blank">
                    <PlayCircle className="h-4 w-4" />
                    {dictionary.productsPage.demoVideo}
                  </a>
                ) : null}
              </div>
            </div>

            <div className="relative min-h-[340px] overflow-hidden rounded-ui border border-white/10 bg-[linear-gradient(135deg,rgba(255,106,0,0.18),rgba(255,255,255,0.03)),#15171a]">
              {heroImage ? <img alt={product.name} className="absolute inset-0 h-full w-full object-cover opacity-55" src={heroImage} /> : null}
              <div className="absolute inset-8 skew-x-[-14deg] border border-white/15" />
              <div className="absolute -bottom-20 -right-12 h-64 w-64 rounded-full border-[32px] border-lumen-500/20" />
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2">
                {product.techStack.slice(0, 5).map((stack) => (
                  <Badge className="backdrop-blur" key={stack}>{stack}</Badge>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="p-7">
            <SectionHeader eyebrow={dictionary.productsPage.overview} title={product.name} className="mb-6" />
            <p className="whitespace-pre-line leading-8 text-zinc-300">{product.fullDescription}</p>
          </Card>

          <div className="grid gap-5">
            <Card className="p-7">
              <h2 className="text-lg font-black text-white">{dictionary.productsPage.techStack}</h2>
              {product.techStackItems.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {product.techStackItems.map((stack) => (
                    <Badge key={stack.id}>
                      {stack.name}{stack.version ? ` ${stack.version}` : ""}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm leading-7 text-zinc-400">{dictionary.productsPage.emptyBody}</p>
              )}
            </Card>

            {product.useCases.length > 0 ? (
              <Card className="p-7">
                <h2 className="text-lg font-black text-white">{dictionary.productsPage.useCases}</h2>
                <div className="mt-5 grid gap-3">
                  {product.useCases.map((useCase) => (
                    <div className="rounded-ui border border-white/10 bg-white/[0.03] p-3 text-sm font-bold text-zinc-300" key={useCase}>
                      {useCase}
                    </div>
                  ))}
                </div>
              </Card>
            ) : null}
          </div>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-charcoal-900 py-20">
        <Container className="grid gap-5 lg:grid-cols-2">
          <Card className="p-7">
            <h2 className="text-xl font-black text-white">{dictionary.productsPage.features}</h2>
            {product.features.length > 0 ? (
              <div className="mt-6 grid gap-4">
                {product.features.map((feature, index) => (
                  <div className="rounded-ui border border-white/10 bg-white/[0.03] p-4" key={feature.id}>
                    <span className="text-sm font-black text-lumen-400">0{index + 1}</span>
                    <h3 className="mt-3 font-black text-white">{feature.title}</h3>
                    {feature.description ? <p className="mt-2 leading-7 text-zinc-400">{feature.description}</p> : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 leading-7 text-zinc-400">{dictionary.productsPage.emptyBody}</p>
            )}
          </Card>

          <Card className="p-7">
            <h2 className="text-xl font-black text-white">{dictionary.productsPage.specifications}</h2>
            {product.specifications.length > 0 ? (
              <div className="mt-6 overflow-hidden rounded-ui border border-white/10">
                {product.specifications.map((specification) => (
                  <div className="grid gap-2 border-b border-white/10 p-4 last:border-b-0 md:grid-cols-[0.8fr_1.2fr]" key={specification.id}>
                    <span className="text-sm font-bold text-zinc-500">{specification.label}</span>
                    <span className="font-bold text-zinc-200">
                      {specification.value}{specification.unit ? ` ${specification.unit}` : ""}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 leading-7 text-zinc-400">{dictionary.productsPage.emptyBody}</p>
            )}
          </Card>
        </Container>
      </section>

      {product.images.length > 1 ? (
        <section className="py-20">
          <Container>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {product.images.map((image) => (
                <div className="min-h-64 overflow-hidden rounded-ui border border-white/10 bg-charcoal-900" key={image.id}>
                  <img alt={image.altText || product.name} className="h-full min-h-64 w-full object-cover" src={image.url} />
                </div>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="py-20">
        <Container className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <Card className="p-7">
            <h2 className="text-2xl font-black text-white">{dictionary.productsPage.contactCtaTitle}</h2>
            <p className="mt-4 leading-8 text-zinc-400">{dictionary.productsPage.contactCtaBody}</p>
            <Link className={buttonClasses("solid", "mt-7")} href={`/${locale}#contact`}>
              {dictionary.common.contactUs}
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Card>

          <div>
            <SectionHeader eyebrow={dictionary.productsPage.relatedProducts} title={dictionary.productsPage.relatedProducts} className="mb-5" />
            {product.relatedProducts.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {product.relatedProducts.map((relatedProduct) => (
                  <ProductCard dictionary={dictionary} key={relatedProduct.id} locale={locale} product={relatedProduct} />
                ))}
              </div>
            ) : (
              <Card className="p-6 text-zinc-400">{dictionary.productsPage.emptyBody}</Card>
            )}
          </div>
        </Container>
      </section>
    </main>
  );
}
