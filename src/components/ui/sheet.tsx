"use client";

import { AnimatePresence, m, type PanInfo, useDragControls } from "framer-motion";
import { Dialog as SheetPrimitive } from "radix-ui";
import type * as React from "react";
import { X } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * shadcn Sheet (radix-nova) on ERIX tokens, animated with framer-motion: the
 * panel springs in from the right, the scrim fades, and both leave before
 * Radix unmounts them (AnimatePresence + forceMount), so focus still returns
 * to the trigger. Radix Dialog gives the focus trap, Esc, outside click and
 * scroll lock. Controlled: pass the same `open` to Sheet and SheetContent.
 *
 * `side="bottom"` is a bottom sheet: it rises from the bottom edge, is at most
 * 82% of the screen tall (the caller's content scrolls inside it) and, when
 * `onDismiss` is given, can be pulled down by its grab handle to close.
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
  side = "right",
  closeClassName,
  onDismiss,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  open: boolean;
  closeLabel?: string;
  side?: "right" | "bottom";
  closeClassName?: string;
  /** Bottom sheets only: called when the sheet is pulled down far or fast enough. */
  onDismiss?: () => void;
}) {
  const drag = useDragControls();
  const bottom = side === "bottom";
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
                "fixed z-[310] flex flex-col bg-surface text-foreground outline-none",
                bottom
                  ? "inset-x-0 bottom-0 mx-auto max-h-[82dvh] w-full overflow-hidden rounded-t-[28px]"
                  : "inset-y-0 right-0 h-dvh w-[min(380px,90vw)] shadow-[var(--shadow-lg)]",
                className,
              )}
              initial={bottom ? { y: "100%" } : { x: "100%" }}
              animate={{
                ...(bottom ? { y: 0 } : { x: 0 }),
                transition: { type: "spring", bounce: 0.12, duration: 0.45 },
              }}
              exit={{
                ...(bottom ? { y: "100%" } : { x: "100%" }),
                transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
              }}
              {...(bottom && onDismiss
                ? {
                    drag: "y" as const,
                    dragControls: drag,
                    dragListener: false, // only the grab handle starts a pull, so the list inside can scroll
                    dragConstraints: { top: 0, bottom: 0 },
                    dragElastic: { top: 0, bottom: 0.7 },
                    onDragEnd: (_: unknown, info: PanInfo) => {
                      if (info.offset.y > 110 || info.velocity.y > 600) onDismiss();
                    },
                  }
                : {})}
            >
              {bottom && onDismiss && (
                <div
                  aria-hidden="true"
                  onPointerDown={(e) => drag.start(e)}
                  className="absolute inset-x-0 top-0 z-10 flex h-7 cursor-grab touch-none items-center justify-center active:cursor-grabbing"
                >
                  <span className="h-1 w-10 rounded-full bg-current opacity-30" />
                </div>
              )}
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
