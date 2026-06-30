import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { PublicProductCard } from "@/features/products/product-service";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type ProductCardProps = {
  product: PublicProductCard;
  locale: Locale;
  dictionary: Dictionary;
};

export function ProductCard({ product, locale, dictionary }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden">
      <Link className="block" href={`/${locale}/products/${product.slug}`}>
        <div className="relative flex min-h-56 items-end overflow-hidden bg-[linear-gradient(135deg,rgba(255,106,0,0.2),rgba(255,255,255,0.03)),#15171a] p-5">
          {product.imageUrl ? (
            <img alt={product.name} className="absolute inset-0 h-full w-full object-cover opacity-35" src={product.imageUrl} />
          ) : null}
          <div className="absolute inset-7 skew-x-[-14deg] border border-white/15 transition group-hover:border-lumen-500/50" />
          <div className="absolute -bottom-12 -right-5 h-48 w-48 rounded-full border-[24px] border-lumen-500/20" />
          <div className="relative flex flex-wrap gap-2">
            {product.category ? <Badge>{product.category}</Badge> : null}
            {product.divisionName ? <Badge>{product.divisionName}</Badge> : null}
          </div>
        </div>
        <div className="p-6">
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge>{product.status}</Badge>
            <Badge>{product.featureCount} {dictionary.productsPage.features}</Badge>
          </div>
          <h3 className="text-lg font-black text-white">{product.name}</h3>
          <p className="mt-3 line-clamp-3 leading-7 text-zinc-400">{product.shortDescription}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {product.techStack.slice(0, 5).map((item) => (
              <Badge key={item}>{item}</Badge>
            ))}
          </div>
          <span className="mt-7 inline-flex items-center gap-2 text-sm font-black text-lumen-400">
            {dictionary.productsPage.viewDetail}
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </Card>
  );
}
