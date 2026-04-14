import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--brand-primary)] text-[var(--text-inverse)]",
        secondary:
          "border-[var(--border-default)] bg-[var(--bg-muted)] text-[var(--text-secondary)]",
        outline: "border-[var(--border-default)] text-[var(--text-secondary)]",
        success:
          "border-transparent bg-[var(--success)]/15 text-[var(--success)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
