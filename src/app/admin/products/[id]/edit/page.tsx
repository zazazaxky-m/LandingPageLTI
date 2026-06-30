import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ProductForm } from "@/components/admin/product-form";
import { buttonClasses } from "@/components/ui/button";
import { getProductForEdit, getProductFormOptions } from "@/features/products/product-service";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, options] = await Promise.all([getProductForEdit(id), getProductFormOptions()]);

  if (!product) {
    notFound();
  }

  return (
    <div className="grid gap-6">
      <div>
        <Link className={buttonClasses("ghost", "mb-5 inline-flex")} href="/admin/products">
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-lumen-400">Edit Product</p>
        <h1 className="mt-2 text-3xl font-black">{product.name}</h1>
      </div>

      <ProductForm initialValues={product} mode="edit" options={options} productId={id} />
    </div>
  );
}
