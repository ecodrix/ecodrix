"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { SoonControl } from "@/components/ui/soon";
import { StatusBadge } from "@/components/ui/status-badge";
import { COMPANY_NAV, COMPARE_NAV, CONTACT_CTA, EMAIL_CTA, GUIDE_NAV, INDUSTRY_NAV, RESOURCE_NAV } from "@/lib/site";
import { cn } from "@/lib/utils";
import { isCurrent } from "./nav-data";
import { type PlatformNavItem, usePlatformNav } from "./platform-nav";

type Row = { href: string; label: string; badge?: ReactNode; disabled?: boolean };
/** `small`: a secondary list (guides, comparisons) in quieter, smaller type. */
type Group = { key: string; label: string; rows: Row[]; small?: boolean };

/** Every header section as one flat list of groups, so nothing needs opening. */
const groupsFor = (platform: readonly PlatformNavItem[]): Group[] => [
  {
    key: "platform",
    label: "Platform",
    rows: [
      ...platform.map((m) => ({
        href: m.href,
        label: m.name,
        // "New" is left out here: the list is names only; Invite only and Coming soon still show.
        badge: <StatusBadge status={m.status} />,
        disabled: m.status === "soon",
      })),
      { href: "/platform", label: "How it all fits together" },
    ],
  },
  { key: "industries", label: "Industries", rows: INDUSTRY_NAV.map((i) => ({ href: i.href, label: i.name })) },
  { key: "resources", label: "Resources", rows: RESOURCE_NAV.map((r) => ({ href: r.href, label: r.name })) },
  { key: "company", label: "Company", rows: COMPANY_NAV.map((c) => ({ href: c.href, label: c.name })) },
  { key: "guides", label: "Guides", small: true, rows: GUIDE_NAV.map((g) => ({ href: g.href, label: g.name })) },
  {
    key: "compare",
    label: "Side by side",
    small: true,
    rows: COMPARE_NAV.map((c) => ({ href: c.href, label: c.name })),
  },
];

function Item({
  r,
  small,
  path,
  onNavigate,
}: {
  r: Row;
  small?: boolean;
  path: string | null;
  onNavigate: () => void;
}) {
  const cls = cn(
    "flex min-h-11 items-center gap-2.5 rounded-[10px] text-white",
    small
      ? "text-[15px] font-medium text-white/85"
      : "font-display text-[21px]/[1.15] font-semibold tracking-[-0.01em]",
  );
  if (r.disabled)
    return (
      <SoonControl role="link" className={cn(cls, "text-white/60")}>
        {r.label}
        {r.badge}
      </SoonControl>
    );
  // Help, API docs, the changelog and status live on their own hosts.
  const external = r.href.startsWith("http");
  const current = !external && isCurrent(path, r.href);
  return (
    <Link href={r.href} onClick={onNavigate} aria-current={current ? "page" : undefined} className={cls}>
      {/* The logo's red dot marks the current page, as in the desktop header. */}
      {current && <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-[var(--hero-dot)]" />}
      {r.label}
      {r.badge}
      {external && <Icon name="arrow-up-right" size={small ? 13 : 15} variant="line" className="text-white/55" />}
    </Link>
  );
}

/**
 * The phone menu: a navy bottom sheet (shadcn Sheet on Radix Dialog: focus
 * trap, Esc, outside tap, scroll lock, focus back to the button). It rises
 * from the bottom edge to at most 82% of the screen, lists every section at
 * once in large type (no accordions) and scrolls inside; the two actions stay
 * pinned under the list. Pull the grab handle down, tap outside or press the
 * close button to dismiss. Loaded on demand by the Navbar.
 */
export default function MobileNav({
  open,
  onOpenChange,
  onNavigate,
  onCloseAutoFocus,
  path,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** A link in the sheet was followed (focus then goes to the new page). */
  onNavigate: () => void;
  onCloseAutoFocus: (e: Event) => void;
  path: string | null;
}) {
  const groups = groupsFor(usePlatformNav());
  const close = () => {
    onNavigate();
    onOpenChange(false);
  };
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        open={open}
        side="bottom"
        onDismiss={() => onOpenChange(false)}
        onCloseAutoFocus={onCloseAutoFocus}
        className="bg-navy text-white ring-1 ring-white/12 sm:max-w-[640px]"
        closeClassName="text-white/80 hover:bg-white/10 hover:text-white"
      >
        {/* band-navy: the bloom, plus the on-dark button and focus-ring themes for what is inside. */}
        <div className="band-navy flex min-h-0 flex-1 flex-col">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SheetDescription className="sr-only">Pages on the ECODrIx site</SheetDescription>
          <nav
            aria-label="Main"
            // The mask fades the list out under the grab handle and close button as it scrolls.
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-11 pb-3 [mask-image:linear-gradient(to_bottom,transparent_18px,#000_44px)] sm:columns-2 sm:gap-x-10"
          >
            {groups.map((g) => (
              <div key={g.key} className="mb-5 break-inside-avoid">
                <p id={`mnav-${g.key}`} className="mb-1 font-sans text-[12.5px]/4 font-semibold text-white/60">
                  {g.label}
                </p>
                <ul aria-labelledby={`mnav-${g.key}`}>
                  {g.rows.map((r) => (
                    <li key={r.href}>
                      <Item r={r} small={g.small} path={path} onNavigate={close} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <div className="flex shrink-0 gap-2.5 border-t border-white/15 px-4 pt-3 pb-[max(0.875rem,env(safe-area-inset-bottom))]">
            <Link href={CONTACT_CTA.href} onClick={close} className={cn(buttonVariants({ size: "lg" }), "flex-1")}>
              {CONTACT_CTA.label}
              <Icon name="arrow-right" size={16} variant="line" />
            </Link>
            <a href={EMAIL_CTA.href} className={cn(buttonVariants({ size: "lg", variant: "ghost" }), "flex-1")}>
              <Icon name="mail" size={16} variant="line" />
              {EMAIL_CTA.label}
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
