"use client";

import { Tabs as TabsPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "@/lib/utils";

/**
 * shadcn Tabs (radix-nova): Radix keyboard model (arrows, Home/End,
 * automatic activation). The list is the DS segmented control (shared with
 * the pricing switch: `segClass` / `segItemClass`). Panels are always mounted (`forceMount`),
 * so every panel is in the server HTML; globals.css hides inactive ones
 * only when scripts run, and without JavaScript the panels simply stack.
 */
function Tabs(props: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" {...props} />;
}

/** DS segmented control: a sunken track whose selected item is a raised pill. */
export const segClass = "relative inline-flex max-w-full gap-0.5 overflow-x-auto rounded-full bg-sunken p-[3px]";
/** One item. The selected pill is the item itself, or a sliding `data-seg-ind` child (the pill
 *  then carries the fill, so before hydration the selected item never flashes empty). */
export const segItemClass =
  "relative isolate inline-flex min-h-9 max-sm:min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 font-sans text-[14.5px]/5 font-semibold whitespace-nowrap text-muted-foreground hover:text-foreground aria-selected:bg-surface aria-selected:text-foreground aria-selected:shadow-sm aria-checked:bg-surface aria-checked:text-foreground aria-checked:shadow-sm has-[input:checked]:bg-surface has-[input:checked]:text-foreground has-[input:checked]:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent has-focus-visible:outline-2 has-focus-visible:outline-offset-1 has-focus-visible:outline-accent motion-safe:focus-visible:animate-focus has-[[data-seg-ind]]:bg-transparent! has-[[data-seg-ind]]:[box-shadow:none]!";

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return <TabsPrimitive.List data-slot="tabs-list" className={cn(segClass, className)} {...props} />;
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return <TabsPrimitive.Trigger data-slot="tabs-trigger" className={cn(segItemClass, className)} {...props} />;
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      forceMount
      className={cn("outline-none focus-visible:outline-offset-4", className)}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
