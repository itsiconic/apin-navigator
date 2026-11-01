import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer button-3d",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 text-white shadow-[0_4px_14px_rgba(58,15,52,0.28),inset_0_1px_1px_0_rgba(255,255,255,0.35)] hover:shadow-[0_8px_24px_rgba(58,15,52,0.38),inset_0_1px_1px_0_rgba(255,255,255,0.5)] hover:brightness-110 border border-primary-500/50",
        marigold:
          "bg-gradient-to-r from-accent-500 via-accent-400 to-accent-500 text-primary-950 font-bold shadow-[0_4px_16px_rgba(234,170,0,0.35),inset_0_1px_1px_0_rgba(255,255,255,0.6)] hover:shadow-[0_8px_24px_rgba(234,170,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.8)] hover:brightness-105 border border-accent-300/90",
        secondary:
          "bg-surface-100/90 backdrop-blur-sm text-surface-800 shadow-[0_2px_8px_rgba(58,15,52,0.06),inset_0_1px_1px_0_rgba(255,255,255,0.8)] hover:bg-surface-200/90 hover:shadow-[0_4px_14px_rgba(58,15,52,0.1)] active:bg-surface-300/80 border border-surface-300/80",
        outline:
          "border border-surface-300/90 bg-white/85 backdrop-blur-sm text-surface-800 shadow-[0_2px_8px_rgba(58,15,52,0.04),inset_0_1px_1px_0_rgba(255,255,255,0.9)] hover:bg-white hover:border-accent-400/80 hover:text-primary-900 hover:shadow-[0_4px_16px_rgba(234,170,0,0.15)]",
        ghost:
          "text-surface-600 hover:bg-surface-100/85 hover:text-surface-900 hover:shadow-xs",
        danger:
          "bg-danger-500 text-white shadow-[0_4px_14px_rgba(211,47,47,0.3),inset_0_1px_1px_0_rgba(255,255,255,0.3)] hover:bg-danger-600 hover:shadow-[0_6px_20px_rgba(211,47,47,0.4)]",
        success:
          "bg-success-600 text-white shadow-[0_4px_14px_rgba(27,131,77,0.3),inset_0_1px_1px_0_rgba(255,255,255,0.3)] hover:bg-success-700 hover:shadow-[0_6px_20px_rgba(27,131,77,0.4)]",
        link: "text-primary-700 hover:text-accent-600 underline-offset-4 hover:underline shadow-none",
      },
      size: {
        sm: "h-8 px-3 text-xs gap-1.5",
        md: "h-10 px-4 text-sm gap-2",
        lg: "h-12 px-6 text-base gap-2.5",
        xl: "h-14 px-8 text-lg gap-3",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
