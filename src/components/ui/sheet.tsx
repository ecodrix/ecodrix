"use client";

import { AnimatePresence, m } from "framer-motion";
import { Dialog as SheetPrimitive } from "radix-ui";
import type * as React from "react";
import { X } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * shadcn Sheet (radix-nova) on ERIX tokens, animated with framer-motion: a
 * side panel that floats 8px in from the screen edges with every corner
 * rounded, like the header pill. It springs in from the right, the scrim
 * fades, and both leave before Radix unmounts them (AnimatePresence +
 * forceMount), so focus still returns to the trigger. Radix Dialog gives the
 * focus trap, Esc, outside click and scroll lock. Controlled: pass the same
 * `open` to Sheet and SheetContent.
 */
const Sheet = SheetPrimitive.Root;
const SheetTitle = SheetPrimitive.Title;
const SheetDescription = SheetPrimitive.Description;
const SheetClose = SheetPrimitive.Close;

function SheetContent({
  open,
  className,
  children,
  closeLabel = "Close menu",
  closeClassName,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  open: boolean;
  closeLabel?: string;
  closeClassName?: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <SheetPrimitive.Portal forceMount>
          <SheetPrimitive.Overlay forceMount asChild>
            <m.div
              className="fixed inset-0 z-[310] bg-[rgb(18_21_29/0.48)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
          </SheetPrimitive.Overlay>
          <SheetPrimitive.Content forceMount asChild {...props}>
            <m.div
              data-lenis-prevent
              className={cn(
                // The width leaves 48px of the page showing beside the panel on a phone, to tap outside.
                // forced-colors:border: the scrim and the fill vanish in Windows high contrast, so the edge is drawn.
                "fixed top-2 right-2 z-[310] flex h-[calc(100dvh-1rem)] w-[min(400px,calc(100vw-3.5rem))] flex-col overflow-hidden rounded-[28px] bg-surface text-foreground outline-none forced-colors:border",
                className,
              )}
              // 105%, not 100%: the panel sits 8px in from the edge and has to leave the screen fully.
              initial={{ x: "105%" }}
              animate={{ x: 0, transition: { type: "spring", bounce: 0.12, duration: 0.45 } }}
              exit={{ x: "105%", transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }}
            >
              {children}
              <SheetPrimitive.Close
                className={cn(
                  "absolute top-2.5 right-3 z-10 flex size-11 items-center justify-center rounded-full text-muted-foreground hover:bg-hover hover:text-foreground",
                  closeClassName,
                )}
              >
                <X aria-hidden="true" className="size-5" />
                <span className="sr-only">{closeLabel}</span>
              </SheetPrimitive.Close>
            </m.div>
          </SheetPrimitive.Content>
        </SheetPrimitive.Portal>
      )}
    </AnimatePresence>
  );
}

export { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle };
