import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type * as React from "react";
import { cn } from "@/lib/utils";

// ponytail: the ui/ primitives (accordion, badge, button, navigation-menu, separator, sheet, tabs) were ported by hand from the shadcn radix-nova registry, because `shadcn add` with iconLibrary "erix" emits broken imports (an npm package named `cn`, IconPlaceholder) — use the CLI again once components.json has an icon library it supports.

/**
 * shadcn Button (radix-nova), restyled to the ERIX marketing kit: pill (fully rounded) corners,
 * 44px default height, verb labels; solid buttons carry the 1px top highlight
 * (shadow-btn). `on-dark:` re-themes them inside a navy band or the blue
 * featured tile: the main action turns white, the second one glass.
 */
// Press: a 2% squeeze in 90ms, then a soft spring back.
// forced-colors:border: fills and shadows vanish in Windows high contrast, so the pill gets a drawn edge.
// Whole-pixel line boxes (20px) in even heights (40, 44, 48) keep the label's capitals on the pill's middle line at every display scale.
const pill =
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-[650] transition-[color,background-color,box-shadow,scale] duration-[var(--dur-fast),var(--dur-fast),var(--dur-fast),360ms] ease-[ease-out,ease-out,ease-out,var(--ease-soft-spring)] active:[scale:0.98] active:duration-[var(--dur-fast),var(--dur-fast),var(--dur-fast),90ms] motion-safe:focus-visible:animate-focus forced-colors:border";

// Disabled <button>s read as the "Coming soon" form (ui/soon.tsx): flat well, muted text, no opacity so contrast holds.
const solid = cn(
  pill,
  "disabled:cursor-not-allowed disabled:bg-sunken disabled:text-muted-foreground disabled:shadow-none disabled:before:hidden disabled:hover:bg-sunken disabled:active:[scale:1]",
);

/** The arrow after a CTA label nudges right on hover of its `group` link; no layout shift. */
export const ARROW_NUDGE =
  "transition-transform duration-150 ease-in-out motion-reduce:transition-none group-hover:translate-x-1";

const variants = cva("[&_svg]:pointer-events-none [&_svg]:shrink-0", {
  variants: {
    variant: {
      primary: cn(
        solid,
        "bg-accent text-white shadow-btn hover:bg-accent-hover",
        "on-dark:bg-white on-dark:text-blue-800 on-dark:hover:bg-blue-50",
        // Shine: a soft band of light sweeps across once per hover or keyboard focus (off with reduced motion).
        "relative isolate overflow-hidden before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-1/3 before:opacity-0 before:content-['']",
        "before:bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.5),transparent)] on-dark:before:bg-[linear-gradient(100deg,transparent,rgba(43,77,203,0.28),transparent)]",
        "motion-safe:hover:before:animate-sheen motion-safe:focus-visible:before:animate-sheen",
      ),
      ghost: cn(
        solid,
        "bg-surface-white text-foreground shadow-[0_0_0_1px_var(--border),var(--shadow-xs)] hover:bg-background hover:shadow-[0_0_0_1px_var(--border-mid),var(--shadow-xs)]",
        "on-dark:bg-[rgba(255,255,255,0.08)] on-dark:text-white on-dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)] on-dark:hover:bg-[rgba(255,255,255,0.14)]",
      ),
      /** Quiet text button: header items, icon buttons, text actions. */
      plain: cn(pill, "text-muted-foreground hover:bg-hover hover:text-foreground"),
    },
    // One scale: 40 / 44 / 48 tall, side padding 16 / 20 / 24, one 20px line box, 16px icons.
    size: {
      default: "min-h-11 px-5 text-[15px]/5 [&_svg]:size-4",
      sm: "min-h-10 px-4 text-[14px]/5 [&_svg]:size-4",
      lg: "min-h-12 px-6 text-[16px]/5 [&_svg]:size-4",
      icon: "size-11 px-0 text-[15px]/5 [&_svg]:size-5",
    },
  },
  defaultVariants: { variant: "primary", size: "default" },
});

// cva only joins classes; merge them so a size (its height, padding, text) beats the base it overrides
// even when `buttonVariants()` is used on its own as a className.
const buttonVariants = (props?: VariantProps<typeof variants>) => cn(variants(props));

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { Button, buttonVariants };
