import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-border bg-surface text-muted",
        accent: "border-border bg-accent text-accent-foreground",
        outline: "border-border bg-transparent text-muted-foreground",
      },
      size: {
        sm: "px-2 py-0.5 font-mono text-[10px] tracking-tight",
        md: "px-2.5 py-1 font-mono text-[11px] tracking-tight",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

type BadgeProps = ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { badgeVariants };
