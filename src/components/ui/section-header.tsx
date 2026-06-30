import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  className?: string;
};

export function SectionHeader({ eyebrow, title, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-9 max-w-3xl", className)}>
      <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-lumen-400">{eyebrow}</p>
      <h2 className="text-3xl font-black leading-tight text-white md:text-5xl">{title}</h2>
    </div>
  );
}
