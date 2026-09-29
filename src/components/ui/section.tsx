import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type SectionProps = ComponentProps<"section">;

export function Section({ className, children, ...props }: SectionProps) {
  return (
    <section
      className={cn("border-t border-border py-20 sm:py-28", className)}
      {...props}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">{children}</div>
    </section>
  );
}
