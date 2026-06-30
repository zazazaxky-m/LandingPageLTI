import Link from "next/link";
import { Plus, Search } from "lucide-react";

import { ProductRowActions } from "@/components/admin/product-row-actions";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, Td, Th } from "@/components/ui/table";
import { getAdminProducts, parseAdminProductFilters } from "@/features/products/product-service";

type AdminProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const statusOptions = [
  ["", "All statuses"],
  ["DRAFT", "Draft"],
  ["PUBLISHED", "Published"],
  ["ARCHIVED", "Archived"]
] as const;

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const filters = parseAdminProductFilters(await searchParams);
  const content = await getAdminProducts(filters);

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-lumen-400">Products</p>
          <h1 className="mt-2 text-3xl font-black">Product Catalog</h1>
          <p className="mt-3 max-w-2xl leading-7 text-zinc-400">
            Manage product copy, gallery, technical features, specifications, tech stack, status, and featured placement.
          </p>
        </div>
        <Link className={buttonClasses("solid")} href="/admin/products/new">
          <Plus className="h-4 w-4" />
          Add product
        </Link>
      </div>

      <Card className="p-4">
        <form className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_auto_auto]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input className="pl-9" defaultValue={filters.query} name="q" placeholder="Search product" />
          </label>
          <Select defaultValue={filters.status} name="status">
            {statusOptions.map(([value, label]) => (
              <option key={value || "all"} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <Select defaultValue={filters.division} name="division">
            <option value="">All divisions</option>
            {content.divisions.map((division) => (
              <option key={division.id} value={division.id}>
                {division.name}
              </option>
            ))}
          </Select>
          <button className={buttonClasses("solid")} type="submit">
            Filter
          </button>
          <Link className={buttonClasses("ghost")} href="/admin/products">
            Reset
          </Link>
        </form>
      </Card>

      {content.products.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <Th>Product</Th>
              <Th>Division</Th>
              <Th>Status</Th>
              <Th>Content</Th>
              <Th>Updated</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {content.products.map((product) => (
              <tr key={product.id}>
                <Td>
                  <div>
                    <p className="font-black text-white">{product.name}</p>
                    <p className="mt-1 text-xs text-zinc-500">/{product.slug}</p>
                    {product.category ? <p className="mt-2 text-xs text-zinc-400">{product.category}</p> : null}
                  </div>
                </Td>
                <Td>{product.divisionName || "-"}</Td>
                <Td>
                  <div className="flex flex-wrap gap-2">
                    <Badge>{product.status}</Badge>
                    {product.featured ? <Badge>Featured</Badge> : null}
                  </div>
                </Td>
                <Td>
                  <div className="grid gap-1 text-xs text-zinc-400">
                    <span>{product.counts.images} images</span>
                    <span>{product.counts.features} features</span>
                    <span>{product.counts.specifications} specs</span>
                    <span>{product.counts.techStack} stack</span>
                  </div>
                </Td>
                <Td>{new Date(product.updatedAt).toLocaleDateString("en-GB")}</Td>
                <Td>
                  <ProductRowActions productId={product.id} slug={product.slug} status={product.status} />
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Card className="p-8">
          <h2 className="text-lg font-black text-white">No products found</h2>
          <p className="mt-3 text-zinc-400">Create a product or clear the filters.</p>
        </Card>
      )}
    </div>
  );
}
