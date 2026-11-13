import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * What a link or button becomes while its catalog item is not available: still
 * visible, announced as disabled, but no href, not focusable, not clickable.
 * `hint` also prints "Coming soon" (CTAs); menu rows already carry a Coming soon badge.
 */
export function SoonControl({
  role,
  className,
  hint,
  children,
}: {
  role: "link" | "button";
  className?: string;
  hint?: boolean;
  children: ReactNode;
}) {
  return (
    <span role={role} aria-disabled="true" className={cn(className, "cursor-not-allowed")}>
      {children}
      {hint ? (
        <span className="text-[13px] font-medium">Coming soon</span>
      ) : (
        <span className="sr-only">Coming soon</span>
      )}
    </span>
  );
}

/** Dimmed look for a disabled button; keeps readable contrast (no opacity) and drops the shine and press. */
export const SOON_BUTTON =
  "bg-sunken! text-muted-foreground! shadow-none! hover:bg-sunken! before:hidden active:[scale:1] on-dark:bg-white/15! on-dark:text-white! on-dark:shadow-none!";
