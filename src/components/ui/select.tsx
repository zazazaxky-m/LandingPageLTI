import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-md border border-white/10 bg-white/[0.055] px-3 text-sm text-white outline-none transition focus:border-lumen-500/70",
        className
      )}
      {...props}
    />
  );
}
