"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { buttonClasses } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createContactSubmissionAction, type ContactActionResult } from "@/features/contact/contact-actions";
import type { PublicContactContent } from "@/features/contact/contact-service";
import type { Dictionary } from "@/i18n/dictionaries";
import { contactFormSchema, emptyContactFormValues, type ContactFormInput } from "@/lib/validations/contact";

type ContactFormProps = {
  dictionary: Dictionary;
  interests: PublicContactContent["interests"];
};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-xs font-bold text-red-300">{message}</p>;
}

export function ContactForm({ dictionary, interests }: ContactFormProps) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ContactActionResult | null>(null);
  const form = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: emptyContactFormValues()
  });

  const onSubmit = form.handleSubmit((values) => {
    setResult(null);

    startTransition(async () => {
      const actionResult = await createContactSubmissionAction(values);
      setResult(actionResult);

      if (actionResult.ok) {
        form.reset(emptyContactFormValues());
      }
    });
  });

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      {result ? (
        <div className={result.ok ? "rounded-ui border border-green-400/30 bg-green-400/10 p-4 text-sm font-bold text-green-200" : "rounded-ui border border-red-400/30 bg-red-400/10 p-4 text-sm font-bold text-red-200"}>
          {result.ok ? dictionary.contactPage.successMessage : result.message}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-zinc-300">
          {dictionary.form.name}
          <Input {...form.register("name")} />
          <FieldError message={form.formState.errors.name?.message} />
        </label>
        <label className="grid gap-2 text-sm font-bold text-zinc-300">
          {dictionary.form.email}
          <Input {...form.register("email")} type="email" />
          <FieldError message={form.formState.errors.email?.message} />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-zinc-300">
          {dictionary.form.company}
          <Input {...form.register("company")} />
        </label>
        <label className="grid gap-2 text-sm font-bold text-zinc-300">
          {dictionary.form.phone}
          <Input {...form.register("phone")} />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-zinc-300">
          {dictionary.form.interest}
          <Select {...form.register("interest")}>
            {interests.map((interest) => (
              <option key={interest.value} value={interest.value}>
                {interest.label}
              </option>
            ))}
          </Select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-zinc-300">
          {dictionary.form.subject}
          <Input {...form.register("subject")} />
          <FieldError message={form.formState.errors.subject?.message} />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-bold text-zinc-300">
        {dictionary.form.message}
        <Textarea {...form.register("message")} className="min-h-36" />
        <FieldError message={form.formState.errors.message?.message} />
      </label>

      <button className={buttonClasses("solid")} disabled={isPending} type="submit">
        <Send className="h-4 w-4" />
        {isPending ? dictionary.form.sending : dictionary.form.send}
      </button>
    </form>
  );
}
