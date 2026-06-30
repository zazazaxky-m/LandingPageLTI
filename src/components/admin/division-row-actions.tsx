"use client";

import Link from "next/link";
import { ExternalLink, EyeOff, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { buttonClasses } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { deleteDivisionAction, hideDivisionAction, type DivisionActionResult } from "@/features/divisions/division-actions";

type DivisionRowActionsProps = {
  divisionId: string;
  slug: string;
  status: string;
};

type PendingAction = "hide" | "delete" | null;

export function DivisionRowActions({ divisionId, slug, status }: DivisionRowActionsProps) {
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<DivisionActionResult | null>(null);

  function runAction() {
    if (!pendingAction) {
      return;
    }

    startTransition(async () => {
      const actionResult =
        pendingAction === "hide" ? await hideDivisionAction(divisionId) : await deleteDivisionAction(divisionId);

      setResult(actionResult);
      setPendingAction(null);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Link className={buttonClasses("ghost", "min-h-9 px-3 text-xs")} href={`/admin/divisions/${divisionId}/edit`}>
        <Pencil className="h-4 w-4" />
        Edit
      </Link>
      <Link className={buttonClasses("outline", "min-h-9 px-3 text-xs")} href={`/id/solutions/${slug}`} target="_blank">
        <ExternalLink className="h-4 w-4" />
        Preview
      </Link>
      {status !== "HIDDEN" ? (
        <button className={buttonClasses("ghost", "min-h-9 px-3 text-xs")} onClick={() => setPendingAction("hide")} type="button">
          <EyeOff className="h-4 w-4" />
          Hide
        </button>
      ) : null}
      <button className={buttonClasses("ghost", "min-h-9 px-3 text-xs text-red-200")} onClick={() => setPendingAction("delete")} type="button">
        <Trash2 className="h-4 w-4" />
        Delete
      </button>
      {result ? <span className={result.ok ? "text-xs font-bold text-green-300" : "text-xs font-bold text-red-300"}>{result.message}</span> : null}

      <Modal
        onClose={() => setPendingAction(null)}
        open={pendingAction !== null}
        title={pendingAction === "delete" ? "Delete division?" : "Hide division?"}
      >
        <div className="grid gap-4">
          <p className="leading-7 text-zinc-400">
            {pendingAction === "delete"
              ? "This will delete the division. Related products, employees, and careers will keep their records but lose this division assignment."
              : "This will hide the division from public Solutions pages while keeping the record editable."}
          </p>
          <div className="flex justify-end gap-3">
            <button className={buttonClasses("ghost")} onClick={() => setPendingAction(null)} type="button">
              Cancel
            </button>
            <button className={buttonClasses("solid")} disabled={isPending} onClick={runAction} type="button">
              {isPending ? "Working..." : pendingAction === "delete" ? "Delete" : "Hide"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
