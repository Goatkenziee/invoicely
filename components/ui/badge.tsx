import * as React from "react";
import { cn } from "@/lib/utils";

const variants: Record<string, string> = {
  default: "bg-muted text-muted-foreground",
  draft: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  sent: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  paid: "bg-green-500/10 text-green-400 border-green-500/30",
  overdue: "bg-red-500/10 text-red-400 border-red-500/30",
  cancelled: "bg-gray-500/10 text-gray-400 border-gray-500/30",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variants[variant] || variants.default,
        className,
      )}
      {...props}
    />
  );
}
