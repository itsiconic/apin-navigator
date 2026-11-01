import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200 shadow-[0_2px_6px_rgba(58,15,52,0.04),inset_0_1px_1px_0_rgba(255,255,255,0.8)] hover:scale-105 hover:-translate-y-0.5 hover:shadow-sm cursor-default",
  {
    variants: {
      variant: {
        default:
          "bg-primary-100/90 backdrop-blur-xs text-primary-900 border border-primary-200/80 shadow-[0_2px_8px_rgba(58,15,52,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] font-semibold",
        marigold:
          "bg-accent-100/90 text-accent-950 border border-accent-300/80 shadow-[0_2px_10px_rgba(234,170,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.9)] font-bold",
        secondary:
          "bg-surface-100/90 backdrop-blur-xs text-surface-700 border border-surface-300/80",
        success:
          "bg-success-50 text-success-700 border border-success-500/30 shadow-[0_2px_6px_rgba(27,131,77,0.1)]",
        warning:
          "bg-accent-50 text-accent-800 border border-accent-500/30 shadow-[0_2px_6px_rgba(234,170,0,0.15)]",
        danger:
          "bg-danger-50 text-danger-600 border border-danger-500/30 shadow-[0_2px_6px_rgba(211,47,47,0.1)]",
        info:
          "bg-info-50 text-info-600 border border-info-500/30 shadow-[0_2px_6px_rgba(59,126,161,0.1)]",
        outline:
          "border border-surface-300/90 bg-white/85 backdrop-blur-xs text-surface-700 hover:border-accent-400/60",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
