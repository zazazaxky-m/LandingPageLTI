import type { HTMLAttributes, TableHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Table({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-hidden rounded-ui border border-white/10">
      <table className={cn("w-full border-collapse text-left text-sm", className)} {...props} />
    </div>
  );
}

export function Th({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn("bg-white/[0.04] px-4 py-3 font-extrabold text-zinc-300", className)} {...props} />;
}

export function Td({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("border-t border-white/10 px-4 py-3 text-zinc-300", className)} {...props} />;
}
