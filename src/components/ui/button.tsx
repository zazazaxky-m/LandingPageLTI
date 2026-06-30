import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type ButtonVariant = "solid" | "ghost" | "outline";

export function buttonClasses(variant: ButtonVariant = "solid", className?: string) {
  return cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-extrabold transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lumen-400",
    variant === "solid" && "bg-gradient-to-br from-lumen-500 to-lumen-400 text-charcoal-950 shadow-glow",
    variant === "ghost" && "border border-white/20 bg-white/[0.05] text-white hover:border-white/30",
    variant === "outline" && "border border-lumen-500/50 text-lumen-400 hover:bg-lumen-500/10",
    className
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({ className, variant = "solid", ...props }: ButtonProps) {
  return <button className={buttonClasses(variant, className)} {...props} />;
}
