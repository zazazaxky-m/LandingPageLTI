"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";

import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createAcademicAction, updateAcademicAction, type AcademicActionResult } from "@/features/academic/academic-actions";
import { academicFormSchema, type AcademicFormInput } from "@/lib/validations/academic";

type AcademicFormProps = {
  mode: "create" | "edit";
  academicId?: string;
  initialValues: AcademicFormInput;
};

const statusOptions = [
  ["DRAFT", "Draft"],
  ["PUBLISHED", "Published"],
  ["ARCHIVED", "Archived"]
] as const;

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-xs font-bold text-red-300">{message}</p>;
}

export function AcademicForm({ mode, academicId, initialValues }: AcademicFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<AcademicActionResult | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const form = useForm<AcademicFormInput>({
    resolver: zodResolver(academicFormSchema),
    defaultValues: initialValues
  });

  const onSubmit = form.handleSubmit((values) => {
    setResult(null);

    startTransition(async () => {
      const actionResult =
        mode === "create" ? await createAcademicAction(values) : await updateAcademicAction(academicId ?? "", values);

      setResult(actionResult);

      if (actionResult.ok) {
        router.push(mode === "create" && actionResult.academicId ? `/admin/academic/${actionResult.academicId}/edit` : "/admin/academic");
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

      form.setValue("imageUrl", payload.url, { shouldDirty: true, shouldValidate: true });
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
            <h2 className="text-lg font-black text-white">Academic content</h2>
            <p className="mt-2 text-sm text-zinc-500">Research, internship, workshop, publication, and collaboration content.</p>
          </div>

          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Title
            <Input {...form.register("title")} placeholder="TODO Internship Studio" />
            <FieldError message={form.formState.errors.title?.message} />
          </label>

          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Slug
            <Input {...form.register("slug")} placeholder="auto-generated-if-empty" />
            <FieldError message={form.formState.errors.slug?.message} />
          </label>

          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Category
            <Input {...form.register("category")} placeholder="Internship" />
            <FieldError message={form.formState.errors.category?.message} />
          </label>

          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Short description
            <Textarea {...form.register("shortDescription")} className="min-h-24" />
            <FieldError message={form.formState.errors.shortDescription?.message} />
          </label>

          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Content
            <Textarea {...form.register("content")} className="min-h-56" />
            <FieldError message={form.formState.errors.content?.message} />
          </label>
        </Card>

        <Card className="grid content-start gap-5 p-6">
          <div>
            <h2 className="text-lg font-black text-white">Publishing</h2>
            <p className="mt-2 text-sm text-zinc-500">Status, date, image, and SEO controls.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
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
              Published date
              <Input {...form.register("publishedAt")} type="date" />
            </label>
          </div>

          <div className="grid gap-3">
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Image URL/path
              <Input {...form.register("imageUrl")} placeholder="/uploads/academic.png" />
              <FieldError message={form.formState.errors.imageUrl?.message} />
            </label>
            <label className={buttonClasses("ghost", "cursor-pointer justify-self-start")}>
              <UploadCloud className="h-4 w-4" />
              Upload image
              <input accept="image/*" className="sr-only" onChange={handleImageUpload} type="file" />
            </label>
            {uploadMessage ? <p className="text-sm font-bold text-lumen-300">{uploadMessage}</p> : null}
          </div>

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

      <div className="sticky bottom-0 z-10 flex justify-end border-t border-white/10 bg-charcoal-950/90 py-4 backdrop-blur">
        <button className={buttonClasses("solid")} disabled={isPending} type="submit">
          <Save className="h-4 w-4" />
          {isPending ? "Saving..." : "Save academic content"}
        </button>
      </div>
    </form>
  );
}
