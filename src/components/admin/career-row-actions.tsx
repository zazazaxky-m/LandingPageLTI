"use client";

import Link from "next/link";
import { Lock, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { buttonClasses } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { closeCareerAction, deleteCareerAction, type CareerActionResult } from "@/features/careers/career-actions";

type CareerRowActionsProps = {
  careerId: string;
  status: string;
};

type PendingAction = "close" | "delete" | null;

export function CareerRowActions({ careerId, status }: CareerRowActionsProps) {
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<CareerActionResult | null>(null);

  function runAction() {
    if (!pendingAction) {
      return;
    }

    startTransition(async () => {
      const actionResult = pendingAction === "close" ? await closeCareerAction(careerId) : await deleteCareerAction(careerId);

      setResult(actionResult);
      setPendingAction(null);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Link className={buttonClasses("ghost", "min-h-9 px-3 text-xs")} href={`/admin/careers/${careerId}/edit`}>
        <Pencil className="h-4 w-4" />
        Edit
      </Link>
      {status !== "CLOSED" ? (
        <button className={buttonClasses("ghost", "min-h-9 px-3 text-xs")} onClick={() => setPendingAction("close")} type="button">
          <Lock className="h-4 w-4" />
          Close
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
        title={pendingAction === "delete" ? "Delete career?" : "Close career?"}
      >
        <div className="grid gap-4">
          <p className="leading-7 text-zinc-400">
            {pendingAction === "delete"
              ? "This will permanently delete this career record."
              : "This will close the role and remove it from public career listings."}
          </p>
          <div className="flex justify-end gap-3">
            <button className={buttonClasses("ghost")} onClick={() => setPendingAction(null)} type="button">
              Cancel
            </button>
            <button className={buttonClasses("solid")} disabled={isPending} onClick={runAction} type="button">
              {isPending ? "Working..." : pendingAction === "delete" ? "Delete" : "Close"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
