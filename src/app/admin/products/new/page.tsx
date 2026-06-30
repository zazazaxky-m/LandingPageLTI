import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ProductForm } from "@/components/admin/product-form";
import { buttonClasses } from "@/components/ui/button";
import { getProductFormOptions } from "@/features/products/product-service";
import { emptyProductFormValues } from "@/lib/validations/product";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const options = await getProductFormOptions();

  return (
    <div className="grid gap-6">
      <div>
        <Link className={buttonClasses("ghost", "mb-5 inline-flex")} href="/admin/products">
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-lumen-400">New Product</p>
        <h1 className="mt-2 text-3xl font-black">Create product</h1>
      </div>

      <ProductForm initialValues={emptyProductFormValues()} mode="create" options={options} />
    </div>
  );
}
