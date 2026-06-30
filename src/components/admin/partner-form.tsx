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
import { createPartnerAction, updatePartnerAction, type PartnerActionResult } from "@/features/partners/partner-actions";
import { partnerFormSchema, type PartnerFormInput } from "@/lib/validations/partner";

type PartnerFormProps = {
  mode: "create" | "edit";
  partnerId?: string;
  initialValues: PartnerFormInput;
};

const typeOptions = [
  ["CLIENT", "Client"],
  ["PARTNER", "Partner"],
  ["ACADEMIC", "Academic"],
  ["VENDOR", "Vendor"],
  ["COLLABORATION", "Collaboration"]
] as const;

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

export function PartnerForm({ mode, partnerId, initialValues }: PartnerFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<PartnerActionResult | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const form = useForm<PartnerFormInput>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: initialValues
  });

  const onSubmit = form.handleSubmit((values) => {
    setResult(null);

    startTransition(async () => {
      const actionResult =
        mode === "create" ? await createPartnerAction(values) : await updatePartnerAction(partnerId ?? "", values);

      setResult(actionResult);

      if (actionResult.ok) {
        router.push(mode === "create" && actionResult.partnerId ? `/admin/partners/${actionResult.partnerId}/edit` : "/admin/partners");
        router.refresh();
      }
    });
  });

  async function handleLogoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setUploadMessage("Uploading logo...");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      const payload = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !payload.url) {
        setUploadMessage(payload.error ?? "Logo upload failed.");
        return;
      }

      form.setValue("logoUrl", payload.url, { shouldDirty: true, shouldValidate: true });
      setUploadMessage("Logo uploaded.");
    } catch {
      setUploadMessage("Logo upload failed.");
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
            <h2 className="text-lg font-black text-white">Partner content</h2>
            <p className="mt-2 text-sm text-zinc-500">Logo grid and collaboration profile content.</p>
          </div>

          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Partner name
            <Input {...form.register("name")} placeholder="TODO Nusa Research" />
            <FieldError message={form.formState.errors.name?.message} />
          </label>

          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Slug
            <Input {...form.register("slug")} placeholder="auto-generated-if-empty" />
            <FieldError message={form.formState.errors.slug?.message} />
          </label>

          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Description
            <Textarea {...form.register("description")} className="min-h-36" />
          </label>

          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Website URL
            <Input {...form.register("websiteUrl")} placeholder="https://example.com" />
            <FieldError message={form.formState.errors.websiteUrl?.message} />
          </label>
        </Card>

        <Card className="grid content-start gap-5 p-6">
          <div>
            <h2 className="text-lg font-black text-white">Display settings</h2>
            <p className="mt-2 text-sm text-zinc-500">Controls visibility, type, homepage feature flag, and logo.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Type
              <Select {...form.register("type")}>
                {typeOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
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
            Featured on landing page
          </label>

          <div className="grid gap-3">
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Logo URL/path
              <Input {...form.register("logoUrl")} placeholder="/uploads/partner-logo.png" />
              <FieldError message={form.formState.errors.logoUrl?.message} />
            </label>
            <label className={buttonClasses("ghost", "cursor-pointer justify-self-start")}>
              <UploadCloud className="h-4 w-4" />
              Upload logo
              <input accept="image/*" className="sr-only" onChange={handleLogoUpload} type="file" />
            </label>
            {uploadMessage ? <p className="text-sm font-bold text-lumen-300">{uploadMessage}</p> : null}
          </div>
        </Card>
      </div>

      <div className="sticky bottom-0 z-10 flex justify-end border-t border-white/10 bg-charcoal-950/90 py-4 backdrop-blur">
        <button className={buttonClasses("solid")} disabled={isPending} type="submit">
          <Save className="h-4 w-4" />
          {isPending ? "Saving..." : "Save partner"}
        </button>
      </div>
    </form>
  );
}
