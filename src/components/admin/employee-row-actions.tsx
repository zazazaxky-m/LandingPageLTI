"use client";

import Link from "next/link";
import { Pencil, Trash2, UserMinus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { buttonClasses } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { deactivateEmployeeAction, deleteEmployeeAction, type EmployeeActionResult } from "@/features/employees/employee-actions";

type EmployeeRowActionsProps = {
  employeeId: string;
  status: string;
};

type PendingAction = "deactivate" | "delete" | null;

export function EmployeeRowActions({ employeeId, status }: EmployeeRowActionsProps) {
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<EmployeeActionResult | null>(null);

  function runAction() {
    if (!pendingAction) {
      return;
    }

    startTransition(async () => {
      const actionResult =
        pendingAction === "deactivate" ? await deactivateEmployeeAction(employeeId) : await deleteEmployeeAction(employeeId);

      setResult(actionResult);
      setPendingAction(null);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Link className={buttonClasses("ghost", "min-h-9 px-3 text-xs")} href={`/admin/employees/${employeeId}/edit`}>
        <Pencil className="h-4 w-4" />
        Edit
      </Link>
      {status !== "INACTIVE" ? (
        <button className={buttonClasses("ghost", "min-h-9 px-3 text-xs")} onClick={() => setPendingAction("deactivate")} type="button">
          <UserMinus className="h-4 w-4" />
          Inactive
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
        title={pendingAction === "delete" ? "Delete employee?" : "Set employee inactive?"}
      >
        <div className="grid gap-4">
          <p className="leading-7 text-zinc-400">
            {pendingAction === "delete"
              ? "This will permanently delete the employee and skill records."
              : "This will hide the employee from the public team page while keeping the record editable."}
          </p>
          <div className="flex justify-end gap-3">
            <button className={buttonClasses("ghost")} onClick={() => setPendingAction(null)} type="button">
              Cancel
            </button>
            <button className={buttonClasses("solid")} disabled={isPending} onClick={runAction} type="button">
              {isPending ? "Working..." : pendingAction === "delete" ? "Delete" : "Set inactive"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
