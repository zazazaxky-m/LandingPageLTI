import type { ReactNode } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
};

export function Modal({ open, title, children, onClose, className }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div className={cn("w-full max-w-lg rounded-ui border border-white/10 bg-charcoal-900 p-5 shadow-panel", className)}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-black">{title}</h2>
          <Button aria-label="Close modal" className="h-9 min-h-9 w-9 p-0" onClick={onClose} type="button" variant="ghost">
            <X className="h-4 w-4" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
