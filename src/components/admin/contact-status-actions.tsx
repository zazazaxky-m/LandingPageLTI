"use client";

import type { ContactStatus } from "@prisma/client";
import { Archive, CheckCheck, Eye, MailCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { buttonClasses } from "@/components/ui/button";
import { updateContactSubmissionStatusAction, type ContactActionResult } from "@/features/contact/contact-actions";

type ContactStatusActionsProps = {
  submissionId: string;
  currentStatus: string;
};

const actions: Array<{ status: ContactStatus; label: string; icon: typeof Eye }> = [
  { status: "READ", label: "Mark read", icon: Eye },
  { status: "REPLIED", label: "Mark replied", icon: MailCheck },
  { status: "ARCHIVED", label: "Archive", icon: Archive },
  { status: "NEW", label: "Mark new", icon: CheckCheck }
];

export function ContactStatusActions({ submissionId, currentStatus }: ContactStatusActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ContactActionResult | null>(null);

  function runStatus(status: ContactStatus) {
    startTransition(async () => {
      const actionResult = await updateContactSubmissionStatusAction(submissionId, status);
      setResult(actionResult);
      router.refresh();
    });
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        {actions
          .filter((action) => action.status !== currentStatus)
          .map((action) => {
            const Icon = action.icon;

            return (
              <button className={buttonClasses("ghost", "min-h-9 px-3 text-xs")} disabled={isPending} key={action.status} onClick={() => runStatus(action.status)} type="button">
                <Icon className="h-4 w-4" />
                {action.label}
              </button>
            );
          })}
      </div>
      {result ? <span className={result.ok ? "text-xs font-bold text-green-300" : "text-xs font-bold text-red-300"}>{result.message}</span> : null}
    </div>
  );
}
