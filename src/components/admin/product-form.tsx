"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Plus, Save, Trash2, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition, type ChangeEvent } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createProductAction, updateProductAction, type ProductActionResult } from "@/features/products/product-actions";
import type { ProductFormOptions } from "@/features/products/product-service";
import { emptyProductFormValues, productFormSchema, type ProductFormInput } from "@/lib/validations/product";

type ProductFormProps = {
  mode: "create" | "edit";
  productId?: string;
  initialValues: ProductFormInput;
  options: ProductFormOptions;
};

const statusOptions = [
  ["DRAFT", "Draft"],
  ["PUBLISHED", "Published"],
  ["ARCHIVED", "Archived"]
] as const;

function withArrayDefaults(values: ProductFormInput): ProductFormInput {
  const empty = emptyProductFormValues();

  return {
    ...empty,
    ...values,
    images: values.images && values.images.length > 0 ? values.images : [],
    features: values.features && values.features.length > 0 ? values.features : empty.features,
    specifications: values.specifications && values.specifications.length > 0 ? values.specifications : empty.specifications,
    techStack: values.techStack && values.techStack.length > 0 ? values.techStack : empty.techStack,
    useCases: values.useCases && values.useCases.length > 0 ? values.useCases : empty.useCases
  };
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-xs font-bold text-red-300">{message}</p>;
}

export function ProductForm({ mode, productId, initialValues, options }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ProductActionResult | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const form = useForm<ProductFormInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: withArrayDefaults(initialValues)
  });

  const images = useFieldArray({ control: form.control, name: "images" });
  const features = useFieldArray({ control: form.control, name: "features" });
  const specifications = useFieldArray({ control: form.control, name: "specifications" });
  const techStack = useFieldArray({ control: form.control, name: "techStack" });
  const useCases = useFieldArray({ control: form.control, name: "useCases" });

  const onSubmit = form.handleSubmit((values) => {
    setResult(null);

    startTransition(async () => {
      const actionResult =
        mode === "create" ? await createProductAction(values) : await updateProductAction(productId ?? "", values);

      setResult(actionResult);

      if (actionResult.ok) {
        router.push(mode === "create" && actionResult.productId ? `/admin/products/${actionResult.productId}/edit` : "/admin/products");
        router.refresh();
      }
    });
  });

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setUploadMessage("Uploading image...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      const payload = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !payload.url) {
        setUploadMessage(payload.error ?? "Image upload failed.");
        return;
      }

      images.append({
        url: payload.url,
        altText: file.name,
        sortOrder: images.fields.length + 1
      });
      setUploadMessage("Image uploaded.");
    } catch {
      setUploadMessage("Image upload failed.");
    }
  }

  return (
    <form className="grid gap-5" onSubmit={onSubmit}>
      {result ? (
        <div className={result.ok ? "rounded-ui border border-green-400/30 bg-green-400/10 p-4 text-sm font-bold text-green-200" : "rounded-ui border border-red-400/30 bg-red-400/10 p-4 text-sm font-bold text-red-200"}>
          {result.message}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="grid gap-5 p-6">
          <div>
            <h2 className="text-lg font-black text-white">Product content</h2>
            <p className="mt-2 text-sm text-zinc-500">Main catalog copy shown on listing and detail pages.</p>
          </div>

          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Product name
            <Input {...form.register("name")} placeholder="FieldOps Control Hub" />
            <FieldError message={form.formState.errors.name?.message} />
          </label>

          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Slug
            <Input {...form.register("slug")} placeholder="auto-generated-if-empty" />
            <FieldError message={form.formState.errors.slug?.message} />
          </label>

          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Short description
            <Textarea {...form.register("shortDescription")} className="min-h-24" />
            <FieldError message={form.formState.errors.shortDescription?.message} />
          </label>

          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Full description
            <Textarea {...form.register("fullDescription")} className="min-h-44" />
            <FieldError message={form.formState.errors.fullDescription?.message} />
          </label>
        </Card>

        <Card className="grid content-start gap-5 p-6">
          <div>
            <h2 className="text-lg font-black text-white">Publishing</h2>
            <p className="mt-2 text-sm text-zinc-500">Status controls whether product appears on the public website.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Division
              <Select {...form.register("divisionId")}>
                <option value="">No division</option>
                {options.divisions.map((division) => (
                  <option key={division.id} value={division.id}>
                    {division.name}
                  </option>
                ))}
              </Select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Category
              <Input {...form.register("category")} placeholder="IT Solution" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Status
              <Select {...form.register("status")}>
                {statusOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Sort order
              <Input {...form.register("sortOrder", { valueAsNumber: true })} min={0} type="number" />
            </label>
          </div>

          <label className="flex items-center gap-3 rounded-ui border border-white/10 bg-white/[0.03] p-4 text-sm font-bold text-zinc-300">
            <input className="h-4 w-4 accent-lumen-500" type="checkbox" {...form.register("featured")} />
            Featured product
          </label>

          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            YouTube/demo link
            <Input {...form.register("youtubeUrl")} placeholder="https://www.youtube.com/watch?v=..." />
            <FieldError message={form.formState.errors.youtubeUrl?.message} />
          </label>

          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            SEO title
            <Input {...form.register("seoTitle")} />
          </label>

          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            SEO description
            <Textarea {...form.register("seoDescription")} className="min-h-24" />
          </label>
        </Card>
      </div>

      <Card className="grid gap-5 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-black text-white">Gallery</h2>
            <p className="mt-2 text-sm text-zinc-500">Upload local images or paste image paths/URLs.</p>
          </div>
          <label className={buttonClasses("ghost", "cursor-pointer")}>
            <UploadCloud className="h-4 w-4" />
            Upload image
            <input accept="image/*" className="sr-only" onChange={handleImageUpload} type="file" />
          </label>
        </div>
        {uploadMessage ? <p className="text-sm font-bold text-lumen-300">{uploadMessage}</p> : null}
        <div className="grid gap-3">
          {images.fields.map((field, index) => (
            <div className="grid gap-3 rounded-ui border border-white/10 bg-white/[0.03] p-4 lg:grid-cols-[1fr_1fr_100px_auto]" key={field.id}>
              <label className="grid gap-2 text-sm font-bold text-zinc-300">
                URL/path
                <Input {...form.register(`images.${index}.url`)} />
              </label>
              <label className="grid gap-2 text-sm font-bold text-zinc-300">
                Alt text
                <Input {...form.register(`images.${index}.altText`)} />
              </label>
              <label className="grid gap-2 text-sm font-bold text-zinc-300">
                Order
                <Input {...form.register(`images.${index}.sortOrder`, { valueAsNumber: true })} min={0} type="number" />
              </label>
              <button className={buttonClasses("ghost", "self-end px-3")} onClick={() => images.remove(index)} type="button">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button className={buttonClasses("outline", "justify-self-start")} onClick={() => images.append({ url: "", altText: "", sortOrder: images.fields.length + 1 })} type="button">
            <ImagePlus className="h-4 w-4" />
            Add image URL
          </button>
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="grid gap-5 p-6">
          <ArrayHeader title="Features" onAdd={() => features.append({ title: "", description: "" })} />
          {features.fields.map((field, index) => (
            <div className="grid gap-3 rounded-ui border border-white/10 bg-white/[0.03] p-4" key={field.id}>
              <div className="flex items-center justify-between gap-3">
                <strong className="text-sm text-zinc-300">Feature {index + 1}</strong>
                <button className={buttonClasses("ghost", "min-h-9 px-3")} onClick={() => features.remove(index)} type="button">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <Input {...form.register(`features.${index}.title`)} placeholder="Real-time dashboard" />
              <Textarea {...form.register(`features.${index}.description`)} className="min-h-24" placeholder="Feature description" />
            </div>
          ))}
        </Card>

        <Card className="grid gap-5 p-6">
          <ArrayHeader title="Specifications" onAdd={() => specifications.append({ label: "", value: "", unit: "" })} />
          {specifications.fields.map((field, index) => (
            <div className="grid gap-3 rounded-ui border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[1fr_1fr_0.6fr_auto]" key={field.id}>
              <Input {...form.register(`specifications.${index}.label`)} placeholder="Deployment" />
              <Input {...form.register(`specifications.${index}.value`)} placeholder="Cloud or private server" />
              <Input {...form.register(`specifications.${index}.unit`)} placeholder="Unit" />
              <button className={buttonClasses("ghost", "px-3")} onClick={() => specifications.remove(index)} type="button">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </Card>

        <Card className="grid gap-5 p-6">
          <ArrayHeader title="Tech stack" onAdd={() => techStack.append({ name: "", version: "" })} />
          {techStack.fields.map((field, index) => (
            <div className="grid gap-3 rounded-ui border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[1fr_1fr_auto]" key={field.id}>
              <Input {...form.register(`techStack.${index}.name`)} placeholder="Next.js" />
              <Input {...form.register(`techStack.${index}.version`)} placeholder="Version optional" />
              <button className={buttonClasses("ghost", "px-3")} onClick={() => techStack.remove(index)} type="button">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </Card>

        <Card className="grid gap-5 p-6">
          <ArrayHeader title="Use cases" onAdd={() => useCases.append({ value: "" })} />
          {useCases.fields.map((field, index) => (
            <div className="grid gap-3 rounded-ui border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[1fr_auto]" key={field.id}>
              <Input {...form.register(`useCases.${index}.value`)} placeholder="Asset monitoring" />
              <button className={buttonClasses("ghost", "px-3")} onClick={() => useCases.remove(index)} type="button">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </Card>
      </div>

      <div className="sticky bottom-0 z-10 flex justify-end border-t border-white/10 bg-charcoal-950/90 py-4 backdrop-blur">
        <button className={buttonClasses("solid")} disabled={isPending} type="submit">
          <Save className="h-4 w-4" />
          {isPending ? "Saving..." : "Save product"}
        </button>
      </div>
    </form>
  );
}

function ArrayHeader({ title, onAdd }: { title: string; onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-lg font-black text-white">{title}</h2>
      <button className={buttonClasses("outline", "min-h-9 px-3")} onClick={onAdd} type="button">
        <Plus className="h-4 w-4" />
        Add
      </button>
    </div>
  );
}
