import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md border border-white/10 bg-white/[0.055] px-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-lumen-500/70",
        className
      )}
      {...props}
    />
  );
}
