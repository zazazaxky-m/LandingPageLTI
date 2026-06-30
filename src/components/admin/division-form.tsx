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
import { createDivisionAction, updateDivisionAction, type DivisionActionResult } from "@/features/divisions/division-actions";
import { divisionFormSchema, type DivisionFormInput } from "@/lib/validations/division";

type DivisionFormProps = {
  mode: "create" | "edit";
  divisionId?: string;
  initialValues: DivisionFormInput;
};

const statusOptions = [
  ["VISIBLE", "Visible"],
  ["HIDDEN", "Hidden"]
] as const;

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-xs font-bold text-red-300">{message}</p>;
}

export function DivisionForm({ mode, divisionId, initialValues }: DivisionFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<DivisionActionResult | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const form = useForm<DivisionFormInput>({
    resolver: zodResolver(divisionFormSchema),
    defaultValues: initialValues
  });

  const onSubmit = form.handleSubmit((values) => {
    setResult(null);

    startTransition(async () => {
      const actionResult =
        mode === "create" ? await createDivisionAction(values) : await updateDivisionAction(divisionId ?? "", values);

      setResult(actionResult);

      if (actionResult.ok) {
        router.push(mode === "create" && actionResult.divisionId ? `/admin/divisions/${actionResult.divisionId}/edit` : "/admin/divisions");
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
            <h2 className="text-lg font-black text-white">Division content</h2>
            <p className="mt-2 text-sm text-zinc-500">This content appears on the public Solutions pages and homepage cards.</p>
          </div>

          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Division name
            <Input {...form.register("name")} placeholder="Engineering / Prototype" />
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
            <Textarea {...form.register("description")} className="min-h-44" />
            <FieldError message={form.formState.errors.description?.message} />
          </label>
        </Card>

        <Card className="grid content-start gap-5 p-6">
          <div>
            <h2 className="text-lg font-black text-white">Display settings</h2>
            <p className="mt-2 text-sm text-zinc-500">Control public visibility, order, member count, and visual treatment.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Icon/code
              <Input {...form.register("icon")} placeholder="ENG" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Member count
              <Input {...form.register("memberCount", { valueAsNumber: true })} min={0} type="number" />
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

          <div className="grid gap-3">
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Image URL/path
              <Input {...form.register("imageUrl")} placeholder="/uploads/division.png" />
              <FieldError message={form.formState.errors.imageUrl?.message} />
            </label>
            <label className={buttonClasses("ghost", "cursor-pointer justify-self-start")}>
              <UploadCloud className="h-4 w-4" />
              Upload image
              <input accept="image/*" className="sr-only" onChange={handleImageUpload} type="file" />
            </label>
            {uploadMessage ? <p className="text-sm font-bold text-lumen-300">{uploadMessage}</p> : null}
          </div>
        </Card>
      </div>

      <div className="sticky bottom-0 z-10 flex justify-end border-t border-white/10 bg-charcoal-950/90 py-4 backdrop-blur">
        <button className={buttonClasses("solid")} disabled={isPending} type="submit">
          <Save className="h-4 w-4" />
          {isPending ? "Saving..." : "Save division"}
        </button>
      </div>
    </form>
  );
}
