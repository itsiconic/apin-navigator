import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  hint?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, hint, id, ...props }, ref) => {
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
        <textarea
          id={inputId}
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border bg-white px-3 py-2 text-sm text-surface-900 shadow-xs transition-colors",
            "placeholder:text-surface-400",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-50",
            error
              ? "border-danger-500 focus:ring-danger-500 focus:border-danger-500"
              : "border-surface-300 hover:border-surface-400",
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-surface-500">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-danger-600">{error}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
