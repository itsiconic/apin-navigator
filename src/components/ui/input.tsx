import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  hint?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, hint, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-surface-700"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            "flex h-10 w-full rounded-xl border bg-white/85 backdrop-blur-xs px-3.5 py-2 text-sm text-surface-900 shadow-xs transition-all duration-200",
            "placeholder:text-surface-400",
            "focus:outline-none focus:ring-2 focus:ring-primary-400/40 focus:border-primary-500/80 focus:bg-white",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-50",
            error
              ? "border-danger-500 focus:ring-danger-500/30 focus:border-danger-500"
              : "border-surface-200/90 hover:border-surface-300",
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-danger-500">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-sm text-surface-500">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
