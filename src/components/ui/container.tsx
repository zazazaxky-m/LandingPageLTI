import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mx-auto w-[min(1180px,calc(100%_-_32px))] sm:w-[min(1180px,calc(100%_-_48px))]",
        className
      )}
      {...props}
    />
  );
}
