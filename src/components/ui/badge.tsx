import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded border border-white/10 bg-white/[0.045] px-2.5 text-xs font-bold text-zinc-300",
        className
      )}
      {...props}
    />
  );
}
