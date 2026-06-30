"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, Trash2, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition, type ChangeEvent } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createEmployeeAction, updateEmployeeAction, type EmployeeActionResult } from "@/features/employees/employee-actions";
import type { EmployeeFormOptions } from "@/features/employees/employee-service";
import { employeeFormSchema, emptyEmployeeFormValues, type EmployeeFormInput } from "@/lib/validations/employee";

type EmployeeFormProps = {
  mode: "create" | "edit";
  employeeId?: string;
  initialValues: EmployeeFormInput;
  options: EmployeeFormOptions;
};

const statusOptions = [
  ["ACTIVE", "Active"],
  ["INACTIVE", "Inactive"]
] as const;

function withSkillDefaults(values: EmployeeFormInput): EmployeeFormInput {
  const empty = emptyEmployeeFormValues();

  return {
    ...empty,
    ...values,
    skills: values.skills && values.skills.length > 0 ? values.skills : empty.skills
  };
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-xs font-bold text-red-300">{message}</p>;
}

export function EmployeeForm({ mode, employeeId, initialValues, options }: EmployeeFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<EmployeeActionResult | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const form = useForm<EmployeeFormInput>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: withSkillDefaults(initialValues)
  });
  const skills = useFieldArray({ control: form.control, name: "skills" });

  const onSubmit = form.handleSubmit((values) => {
    setResult(null);

    startTransition(async () => {
      const actionResult =
        mode === "create" ? await createEmployeeAction(values) : await updateEmployeeAction(employeeId ?? "", values);

      setResult(actionResult);

      if (actionResult.ok) {
        router.push(mode === "create" && actionResult.employeeId ? `/admin/employees/${actionResult.employeeId}/edit` : "/admin/employees");
        router.refresh();
      }
    });
  });

  async function handlePhotoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setUploadMessage("Uploading photo...");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      const payload = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !payload.url) {
        setUploadMessage(payload.error ?? "Photo upload failed.");
        return;
      }

      form.setValue("photoUrl", payload.url, { shouldDirty: true, shouldValidate: true });
      setUploadMessage("Photo uploaded.");
    } catch {
      setUploadMessage("Photo upload failed.");
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
            <h2 className="text-lg font-black text-white">Employee profile</h2>
            <p className="mt-2 text-sm text-zinc-500">Public team card content and profile metadata.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Name
              <Input {...form.register("name")} placeholder="TODO Backend Engineer" />
              <FieldError message={form.formState.errors.name?.message} />
            </label>
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Slug
              <Input {...form.register("slug")} placeholder="auto-generated-if-empty" />
              <FieldError message={form.formState.errors.slug?.message} />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Role
              <Input {...form.register("role")} placeholder="Backend Engineer" />
              <FieldError message={form.formState.errors.role?.message} />
            </label>
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
          </div>

          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Short bio
            <Textarea {...form.register("shortBio")} className="min-h-28" />
            <FieldError message={form.formState.errors.shortBio?.message} />
          </label>

          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Experience/history
            <Textarea {...form.register("experienceHistory")} className="min-h-36" />
          </label>
        </Card>

        <Card className="grid content-start gap-5 p-6">
          <div>
            <h2 className="text-lg font-black text-white">Display and links</h2>
            <p className="mt-2 text-sm text-zinc-500">Photo, status, ordering, contact, and social links.</p>
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
              Sort order
              <Input {...form.register("sortOrder", { valueAsNumber: true })} min={0} type="number" />
            </label>
          </div>

          <div className="grid gap-3">
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Photo URL/path
              <Input {...form.register("photoUrl")} placeholder="/uploads/team.png" />
              <FieldError message={form.formState.errors.photoUrl?.message} />
            </label>
            <label className={buttonClasses("ghost", "cursor-pointer justify-self-start")}>
              <UploadCloud className="h-4 w-4" />
              Upload photo
              <input accept="image/*" className="sr-only" onChange={handlePhotoUpload} type="file" />
            </label>
            {uploadMessage ? <p className="text-sm font-bold text-lumen-300">{uploadMessage}</p> : null}
          </div>

          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Email
            <Input {...form.register("email")} type="email" />
            <FieldError message={form.formState.errors.email?.message} />
          </label>

          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            LinkedIn URL
            <Input {...form.register("linkedinUrl")} />
            <FieldError message={form.formState.errors.linkedinUrl?.message} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            GitHub URL
            <Input {...form.register("githubUrl")} />
            <FieldError message={form.formState.errors.githubUrl?.message} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Portfolio URL
            <Input {...form.register("portfolioUrl")} />
            <FieldError message={form.formState.errors.portfolioUrl?.message} />
          </label>
        </Card>
      </div>

      <Card className="grid gap-5 p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-white">Skills</h2>
            <p className="mt-2 text-sm text-zinc-500">Skill tags are displayed on public team cards.</p>
          </div>
          <button className={buttonClasses("outline", "min-h-9 px-3")} onClick={() => skills.append({ name: "" })} type="button">
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {skills.fields.map((field, index) => (
            <div className="grid grid-cols-[1fr_auto] gap-3 rounded-ui border border-white/10 bg-white/[0.03] p-4" key={field.id}>
              <Input {...form.register(`skills.${index}.name`)} placeholder="API" />
              <button className={buttonClasses("ghost", "px-3")} onClick={() => skills.remove(index)} type="button">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <div className="sticky bottom-0 z-10 flex justify-end border-t border-white/10 bg-charcoal-950/90 py-4 backdrop-blur">
        <button className={buttonClasses("solid")} disabled={isPending} type="submit">
          <Save className="h-4 w-4" />
          {isPending ? "Saving..." : "Save employee"}
        </button>
      </div>
    </form>
  );
}
