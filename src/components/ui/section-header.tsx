import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  index: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeader({ index, title, description, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
      <div className="flex items-start gap-3">
        <span className="mt-2.5 font-mono text-xs text-muted-foreground">{index}</span>
        <h2 className="text-balance-tight text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
          {title}
        </h2>
      </div>
      {description ? (
        <p className="max-w-md text-sm leading-relaxed text-muted md:text-right">{description}</p>
      ) : null}
    </div>
  );
}
