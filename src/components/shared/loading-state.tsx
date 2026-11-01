import React from "react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingState({
  message = "Loading...",
  className,
  size = "md",
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4",
        className
      )}
    >
      <div className="relative">
        <div
          className={cn(
            "rounded-full border-2 border-surface-200 border-t-primary-500 animate-spin",
            sizeClasses[size]
          )}
        />
      </div>
      {message && (
        <p className="mt-4 text-sm text-surface-500 animate-pulse">{message}</p>
      )}
    </div>
  );
}
