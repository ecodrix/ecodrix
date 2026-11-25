import type * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex w-full min-h-24 px-4 py-3 text-sm text-foreground rounded-md outline-none transition-all duration-200",
        "bg-elevated border border-border-strong",
        "placeholder:text-muted-foreground",
        "hover:border-accent/40",
        "focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/25",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "aria-invalid:border-error aria-invalid:ring-2 aria-invalid:ring-error/25",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
