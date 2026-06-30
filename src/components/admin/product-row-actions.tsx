"use client";

import Link from "next/link";
import { Archive, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { buttonClasses } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { archiveProductAction, deleteProductAction, type ProductActionResult } from "@/features/products/product-actions";

type ProductRowActionsProps = {
  productId: string;
  slug: string;
  status: string;
};

type PendingAction = "archive" | "delete" | null;

export function ProductRowActions({ productId, slug, status }: ProductRowActionsProps) {
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ProductActionResult | null>(null);

  function runAction() {
    if (!pendingAction) {
      return;
    }

    startTransition(async () => {
      const actionResult =
        pendingAction === "archive" ? await archiveProductAction(productId) : await deleteProductAction(productId);

      setResult(actionResult);
      setPendingAction(null);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Link className={buttonClasses("ghost", "min-h-9 px-3 text-xs")} href={`/admin/products/${productId}/edit`}>
        <Pencil className="h-4 w-4" />
        Edit
      </Link>
      <Link className={buttonClasses("outline", "min-h-9 px-3 text-xs")} href={`/id/products/${slug}`} target="_blank">
        <ExternalLink className="h-4 w-4" />
        Preview
      </Link>
      {status !== "ARCHIVED" ? (
        <button className={buttonClasses("ghost", "min-h-9 px-3 text-xs")} onClick={() => setPendingAction("archive")} type="button">
          <Archive className="h-4 w-4" />
          Archive
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
        title={pendingAction === "delete" ? "Delete product?" : "Archive product?"}
      >
        <div className="grid gap-4">
          <p className="leading-7 text-zinc-400">
            {pendingAction === "delete"
              ? "This will permanently delete the product and its child records."
              : "This will hide the product from public published listings while keeping the record."}
          </p>
          <div className="flex justify-end gap-3">
            <button className={buttonClasses("ghost")} onClick={() => setPendingAction(null)} type="button">
              Cancel
            </button>
            <button className={buttonClasses("solid")} disabled={isPending} onClick={runAction} type="button">
              {isPending ? "Working..." : pendingAction === "delete" ? "Delete" : "Archive"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
