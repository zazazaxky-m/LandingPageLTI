"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save, UploadCloud } from "lucide-react";
import { useState, useTransition, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";

import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  updateCompanySettingAction,
  type CompanySettingActionResult
} from "@/features/company-settings/company-settings-actions";
import { cursorVariantLabels, cursorVariantValues } from "@/lib/cursor-variants";
import { companySettingFormSchema, type CompanySettingFormInput } from "@/lib/validations/company-setting";

type CompanySettingFormProps = {
  companyId: string;
  initialValues: CompanySettingFormInput;
};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-xs font-bold text-red-300">{message}</p>;
}

export function CompanySettingForm({ companyId, initialValues }: CompanySettingFormProps) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<CompanySettingActionResult | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const form = useForm<CompanySettingFormInput>({
    resolver: zodResolver(companySettingFormSchema),
    defaultValues: initialValues
  });

  const onSubmit = form.handleSubmit((values) => {
    setResult(null);

    startTransition(async () => {
      const actionResult = await updateCompanySettingAction(companyId, values);
      setResult(actionResult);
    });
  });

  async function handleUpload(event: ChangeEvent<HTMLInputElement>, field: "logoUrl" | "faviconUrl") {
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

      form.setValue(field, payload.url, { shouldDirty: true, shouldValidate: true });
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
            <h2 className="text-lg font-black text-white">Company profile</h2>
            <p className="mt-2 text-sm text-zinc-500">Main brand content used by the public website.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Company name
              <Input {...form.register("companyName")} />
              <FieldError message={form.formState.errors.companyName?.message} />
            </label>
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Tagline
              <Input {...form.register("tagline")} />
              <FieldError message={form.formState.errors.tagline?.message} />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Short description
            <Textarea {...form.register("shortDescription")} className="min-h-24" />
            <FieldError message={form.formState.errors.shortDescription?.message} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Long description
            <Textarea {...form.register("longDescription")} className="min-h-36" />
            <FieldError message={form.formState.errors.longDescription?.message} />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Vision
              <Textarea {...form.register("vision")} className="min-h-32" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Mission
              <Textarea {...form.register("mission")} className="min-h-32" />
            </label>
          </div>
        </Card>

        <Card className="grid content-start gap-5 p-6">
          <div>
            <h2 className="text-lg font-black text-white">Brand and contact</h2>
            <p className="mt-2 text-sm text-zinc-500">Logo, CTA, contact info, social links, and SEO.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Default locale
              <Select {...form.register("defaultLocale")}>
                <option value="EN">English</option>
                <option value="ID">Indonesia</option>
                <option value="ZH">Chinese</option>
              </Select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Cursor effect
              <Select {...form.register("cursorVariant")}>
                {cursorVariantValues.map((variant) => (
                  <option key={variant} value={variant}>
                    {cursorVariantLabels[variant]}
                  </option>
                ))}
              </Select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Email
              <Input {...form.register("email")} type="email" />
              <FieldError message={form.formState.errors.email?.message} />
            </label>
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Phone
              <Input {...form.register("phone")} />
            </label>
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Address
              <Textarea {...form.register("address")} className="min-h-24" />
            </label>
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="grid gap-5 p-6">
          <h2 className="text-lg font-black text-white">Logo and CTA</h2>
          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Logo URL/path
            <Input {...form.register("logoUrl")} />
            <FieldError message={form.formState.errors.logoUrl?.message} />
          </label>
          <label className={buttonClasses("ghost", "cursor-pointer justify-self-start")}>
            <UploadCloud className="h-4 w-4" />
            Upload logo
            <input accept="image/*" className="sr-only" onChange={(event) => handleUpload(event, "logoUrl")} type="file" />
          </label>
          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Favicon URL/path
            <Input {...form.register("faviconUrl")} />
            <FieldError message={form.formState.errors.faviconUrl?.message} />
          </label>
          <label className={buttonClasses("ghost", "cursor-pointer justify-self-start")}>
            <UploadCloud className="h-4 w-4" />
            Upload favicon
            <input accept="image/*" className="sr-only" onChange={(event) => handleUpload(event, "faviconUrl")} type="file" />
          </label>
          {uploadMessage ? <p className="text-sm font-bold text-lumen-300">{uploadMessage}</p> : null}
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Main CTA text
              <Input {...form.register("mainCtaText")} />
            </label>
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Main CTA URL
              <Input {...form.register("mainCtaUrl")} />
              <FieldError message={form.formState.errors.mainCtaUrl?.message} />
            </label>
          </div>
        </Card>

        <Card className="grid gap-5 p-6">
          <h2 className="text-lg font-black text-white">Social and SEO</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Input {...form.register("linkedinUrl")} placeholder="LinkedIn URL" />
            <Input {...form.register("githubUrl")} placeholder="GitHub URL" />
            <Input {...form.register("instagramUrl")} placeholder="Instagram URL" />
            <Input {...form.register("youtubeUrl")} placeholder="YouTube URL" />
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

      <Card className="grid gap-5 p-6">
        <h2 className="text-lg font-black text-white">Remote collaboration highlight</h2>
        <label className="grid gap-2 text-sm font-bold text-zinc-300">
          Title
          <Input {...form.register("remoteHighlightTitle")} />
        </label>
        <label className="grid gap-2 text-sm font-bold text-zinc-300">
          Body
          <Textarea {...form.register("remoteHighlightBody")} className="min-h-28" />
        </label>
      </Card>

      <div className="sticky bottom-0 z-10 flex justify-end border-t border-white/10 bg-charcoal-950/90 py-4 backdrop-blur">
        <button className={buttonClasses("solid")} disabled={isPending} type="submit">
          <Save className="h-4 w-4" />
          {isPending ? "Saving..." : "Save company profile"}
        </button>
      </div>
    </form>
  );
}
