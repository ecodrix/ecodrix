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
import { LogoMark } from "./LogoMark";
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
    "flex min-h-11 items-center gap-2.5 rounded-[10px] px-3 text-navy",
    small ? "text-[15px] font-medium text-navy/85" : "font-display text-[21px]/[1.15] font-semibold tracking-[-0.01em]",
  );
  if (r.disabled)
    return (
      <SoonControl role="link" className={cn(cls, "text-navy/60")}>
        {r.label}
        {r.badge}
      </SoonControl>
    );
  // Help, API docs, the changelog and status live on their own hosts.
  const external = r.href.startsWith("http");
  const current = !external && isCurrent(path, r.href);
  return (
    <Link
      href={r.href}
      onClick={onNavigate}
      aria-current={current ? "page" : undefined}
      // Row fills as in the desktop menu. A blue label means "you are here" only, so hover keeps the navy label.
      // forced-colors (Windows high contrast) drops fills, so an outline marks the row there.
      className={cn(
        cls,
        current
          ? "bg-accent-muted text-accent forced-colors:outline-2 forced-colors:-outline-offset-2"
          : "hover:bg-hover focus-visible:bg-hover active:bg-hover forced-colors:hover:outline-2 forced-colors:hover:-outline-offset-2",
      )}
    >
      {/* The logo's red dot marks the current page too, as in the desktop header. */}
      {current && (
        <span
          aria-hidden="true"
          className="size-1.5 shrink-0 rounded-full bg-[var(--hero-dot)] forced-colors:bg-[CanvasText]"
        />
      )}
      {r.label}
      {r.badge}
      {external && <Icon name="arrow-up-right" size={small ? 13 : 15} variant="line" className="text-navy/55" />}
    </Link>
  );
}

/**
 * The menu below 1024px: a white side panel with dark-blue text (shadcn Sheet
 * on Radix Dialog: focus trap, Esc, outside tap, scroll lock, focus back to
 * the button). It slides in from the right, lists every section at once in
 * large type (no accordions) and scrolls inside; the two actions stay pinned
 * under the list: "Access" in blue, "Contact us" in purple. The row under the
 * pointer and the current page's row are filled across the full row. A side
 * panel, not a bottom sheet: the founder tried the sheet and found it
 * unsuitable (24 Nov 2026). Loaded on demand by the Navbar.
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
        onCloseAutoFocus={onCloseAutoFocus}
        className="bg-surface-white text-navy"
        closeClassName="text-navy/70 hover:bg-hover hover:text-navy"
      >
        <div className="flex h-16 shrink-0 items-center gap-2 border-b border-border-soft px-5">
          <LogoMark className="size-7" />
          <span aria-hidden="true" className="font-display text-[19px] font-bold tracking-[-0.02em]">
            ERIX
          </span>
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SheetDescription className="sr-only">Pages on the ECODrIx site</SheetDescription>
        </div>
        <nav
          aria-label="Main"
          // px-2 here plus px-3 on each row keeps text 20px from the edge, with the row fill wider than the label.
          // scroll-py-2: a row that Tab scrolls into view keeps its focus ring clear of the list edge.
          className="min-h-0 flex-1 scroll-py-2 overflow-y-auto overscroll-contain px-2 pt-4 pb-3"
        >
          {groups.map((g) => (
            <div key={g.key} className="mb-5">
              <p id={`mnav-${g.key}`} className="mb-1 px-3 font-sans text-[12.5px]/4 font-semibold text-navy/70">
                {g.label}
              </p>
              <ul aria-labelledby={`mnav-${g.key}`} className="grid gap-0.5">
                {g.rows.map((r) => (
                  <li key={r.href}>
                    <Item r={r} small={g.small} path={path} onNavigate={close} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        {/* The basis makes the two buttons sit side by side where the panel is wide enough and stack on narrow phones. */}
        <div className="flex shrink-0 flex-wrap gap-2.5 border-t border-border-soft px-4 pt-3 pb-[max(0.875rem,env(safe-area-inset-bottom))]">
          <Link
            href={CONTACT_CTA.href}
            onClick={close}
            className={cn(buttonVariants({ size: "lg" }), "flex-[1_1_9.5rem]")}
          >
            {CONTACT_CTA.label}
            <Icon name="arrow-right" size={16} variant="line" />
          </Link>
          {/* Purple here is the founder's choice for this one button; elsewhere purple marks AI. */}
          <a
            href={EMAIL_CTA.href}
            className={cn(buttonVariants({ size: "lg" }), "flex-[1_1_9.5rem] bg-brand-purple hover:bg-(--purple-700)")}
          >
            <Icon name="mail" size={16} variant="line" />
            {EMAIL_CTA.label}
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
