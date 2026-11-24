import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

/**
 * shadcn Badge (radix-nova) on ERIX tokens: 6px corners, colour plus a word
 * (never colour alone). Green and amber are status signals only, never a
 * fill elsewhere; purple marks AI and automation.
 */
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11.5px] leading-4 font-semibold [&>svg]:size-3 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-accent-muted text-accent",
        ai: "bg-ai-subtle text-ai",
        success: "bg-success-subtle text-success",
        warning: "bg-warning-subtle text-warning",
        danger: "bg-error-subtle text-error",
        neutral: "bg-sunken text-muted-foreground",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
