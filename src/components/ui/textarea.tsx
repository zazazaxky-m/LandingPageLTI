import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full resize-y rounded-md border border-white/10 bg-white/[0.055] p-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-lumen-500/70",
        className
      )}
      {...props}
    />
  );
}
