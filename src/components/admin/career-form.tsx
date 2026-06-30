"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createCareerAction, updateCareerAction, type CareerActionResult } from "@/features/careers/career-actions";
import type { CareerFormOptions } from "@/features/careers/career-service";
import { careerFormSchema, type CareerFormInput } from "@/lib/validations/career";

type CareerFormProps = {
  mode: "create" | "edit";
  careerId?: string;
  initialValues: CareerFormInput;
  options: CareerFormOptions;
};

const statusOptions = [
  ["DRAFT", "Draft"],
  ["OPEN", "Open"],
  ["CLOSED", "Closed"]
] as const;

const workTypeOptions = [
  ["REMOTE", "Remote"],
  ["HYBRID", "Hybrid"],
  ["ONSITE", "Onsite"]
] as const;

const employmentTypeOptions = [
  ["FULL_TIME", "Full time"],
  ["PART_TIME", "Part time"],
  ["INTERNSHIP", "Internship"],
  ["FREELANCE", "Freelance"]
] as const;

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-xs font-bold text-red-300">{message}</p>;
}

export function CareerForm({ mode, careerId, initialValues, options }: CareerFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<CareerActionResult | null>(null);
  const form = useForm<CareerFormInput>({
    resolver: zodResolver(careerFormSchema),
    defaultValues: initialValues
  });

  const onSubmit = form.handleSubmit((values) => {
    setResult(null);

    startTransition(async () => {
      const actionResult =
        mode === "create" ? await createCareerAction(values) : await updateCareerAction(careerId ?? "", values);

      setResult(actionResult);

      if (actionResult.ok) {
        router.push(mode === "create" && actionResult.careerId ? `/admin/careers/${actionResult.careerId}/edit` : "/admin/careers");
        router.refresh();
      }
    });
  });

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
            <h2 className="text-lg font-black text-white">Job content</h2>
            <p className="mt-2 text-sm text-zinc-500">Public job listing and detail content.</p>
          </div>

          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Job title
            <Input {...form.register("jobTitle")} placeholder="TODO Full-stack Developer" />
            <FieldError message={form.formState.errors.jobTitle?.message} />
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
            Responsibilities
            <Textarea {...form.register("responsibilities")} className="min-h-36" />
          </label>

          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Requirements
            <Textarea {...form.register("requirements")} className="min-h-36" />
          </label>

          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Benefits
            <Textarea {...form.register("benefits")} className="min-h-28" />
          </label>
        </Card>

        <Card className="grid content-start gap-5 p-6">
          <div>
            <h2 className="text-lg font-black text-white">Role settings</h2>
            <p className="mt-2 text-sm text-zinc-500">Division, location, work mode, employment type, status, and apply route.</p>
          </div>

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
            Location
            <Input {...form.register("location")} placeholder="Remote-first, Indonesia" />
          </label>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Work type
              <Select {...form.register("workType")}>
                {workTypeOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Employment type
              <Select {...form.register("employmentType")}>
                {employmentTypeOptions.map(([value, label]) => (
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
          </div>

          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Apply URL
            <Input {...form.register("applyUrl")} placeholder="https://forms.example.com/apply" />
            <FieldError message={form.formState.errors.applyUrl?.message} />
          </label>

          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Apply email
            <Input {...form.register("applyEmail")} placeholder="career@lumiatech.example" type="email" />
            <FieldError message={form.formState.errors.applyEmail?.message} />
          </label>
        </Card>
      </div>

      <div className="sticky bottom-0 z-10 flex justify-end border-t border-white/10 bg-charcoal-950/90 py-4 backdrop-blur">
        <button className={buttonClasses("solid")} disabled={isPending} type="submit">
          <Save className="h-4 w-4" />
          {isPending ? "Saving..." : "Save career"}
        </button>
      </div>
    </form>
  );
}
