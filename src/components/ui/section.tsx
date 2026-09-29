import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Big lowercase word that opens a section, matching the site title treatment. */
export function PageTitle({ children, className }: { children: string; className?: string }) {
  return (
    <h2
      className={cn(
        "t-display lower col-span-6 leading-none md:col-span-8 md:col-start-1",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function Section({ className, children, ...props }: ComponentProps<"section">) {
  return (
    <section className={cn("py-20 md:py-32", className)} {...props}>
      <div className="shell">
        <div className="grid">{children}</div>
      </div>
    </section>
  );
}
