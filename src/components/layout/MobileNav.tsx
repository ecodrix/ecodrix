"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/icons";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { SoonControl } from "@/components/ui/soon";
import { StatusBadge } from "@/components/ui/status-badge";
import { COMPANY_NAV, COMPARE_NAV, CONTACT_CTA, GUIDE_NAV, INDUSTRY_NAV, RESOURCE_NAV } from "@/lib/site";
import { cn } from "@/lib/utils";
import { LogoMark } from "./LogoMark";
import { isCurrent, NAV_SECTIONS, type NavSection } from "./nav-data";
import { type PlatformNavItem, usePlatformNav } from "./platform-nav";

type Row = {
  href: string;
  label: string;
  text?: string;
  icon: IconName;
  ai?: boolean;
  badge?: ReactNode;
  disabled?: boolean;
};

/** Two-line rows (name and what it's for), the same words as the desktop panels. */
const rowsFor = (platform: readonly PlatformNavItem[]): Record<NavSection, Row[]> => ({
  platform: platform.map((m) => ({
    href: m.href,
    label: m.name,
    text: m.summary,
    icon: m.icon,
    ai: "ai" in m,
    badge: <StatusBadge status={m.status} isNew={m.isNew} />,
    disabled: m.status === "soon",
  })),
  industries: INDUSTRY_NAV.map((i) => ({ href: i.href, label: i.name, text: i.summary, icon: i.icon })),
  resources: RESOURCE_NAV.map((r) => ({ href: r.href, label: r.name, text: r.summary, icon: r.icon })),
  company: [
    ...COMPANY_NAV.map((c, n) => ({
      href: c.href,
      label: c.name,
      text: c.summary,
      icon: (n === 0 ? "building-2" : "user-round") as IconName,
    })),
    {
      href: CONTACT_CTA.href,
      label: "Contact us",
      text: "Join the list or ask a question; a person replies.",
      icon: "message-circle",
    },
  ],
});

function RowBody({ r }: { r: Row }) {
  return (
    <>
      <span
        className={cn(
          "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[8px]",
          r.ai ? "bg-ai-subtle text-ai" : "bg-accent-muted text-accent",
        )}
      >
        <Icon name={r.icon} size={16} variant="line" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] font-semibold text-foreground group-aria-[current=page]:text-accent">
          {r.label}
          {r.badge}
        </span>
        {r.text && <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">{r.text}</span>}
      </span>
    </>
  );
}

/** A compact single-line link list under a small heading (guides, comparisons). */
function SubList({
  title,
  items,
  path,
  onNavigate,
}: {
  title: string;
  items: { href: string; label: string; icon?: IconName }[];
  path: string | null;
  onNavigate: () => void;
}) {
  return (
    <div className="mt-3 border-t border-border-soft pt-3">
      <p className="px-2 text-[13px] font-semibold text-muted-foreground">{title}</p>
      <ul className="mt-1 grid gap-0.5">
        {items.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              onClick={onNavigate}
              aria-current={isCurrent(path, l.href) ? "page" : undefined}
              className="flex min-h-11 items-center gap-2.5 rounded-[8px] px-2 text-[15px] font-medium text-foreground hover:bg-hover aria-[current=page]:text-accent"
            >
              {l.icon && <Icon name={l.icon} size={16} variant="line" className="shrink-0 text-muted-foreground" />}
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The phone menu: a shadcn Sheet (Radix Dialog: focus trap, Esc, outside
 * tap, scroll lock, focus back to the button) holding a shadcn Accordion of
 * the four header sections. Full width on phones; the current section starts
 * open and the current page is marked on its own row. Loaded on demand by the
 * Navbar.
 */
export default function MobileNav({
  open,
  onOpenChange,
  onNavigate,
  onCloseAutoFocus,
  path,
  current,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** A link in the sheet was followed (focus then goes to the new page). */
  onNavigate: () => void;
  onCloseAutoFocus: (e: Event) => void;
  path: string | null;
  current?: NavSection;
}) {
  const rows = rowsFor(usePlatformNav());
  const close = () => {
    onNavigate();
    onOpenChange(false);
  };
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent open={open} onCloseAutoFocus={onCloseAutoFocus} className="w-full sm:w-[min(420px,90vw)]">
        <div className="flex h-[3.75rem] shrink-0 items-center gap-2 border-b border-border-soft px-5">
          <LogoMark className="size-7" />
          <span aria-hidden="true" className="font-display text-[19px] font-bold tracking-[-0.02em] text-foreground">
            ERIX
          </span>
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SheetDescription className="sr-only">Pages on the ECODrIx site</SheetDescription>
        </div>
        <nav aria-label="Main" className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
          <Accordion type="single" collapsible defaultValue={current ?? "platform"}>
            {NAV_SECTIONS.map((s) => (
              <AccordionItem key={s.key} value={s.key} className="border-border-soft">
                <AccordionTrigger
                  icon={<Icon name="chevron-down" size={18} variant="line" />}
                  turn="chevron"
                  className="px-1 py-4 font-display text-[19px]"
                >
                  {s.label}
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <ul className="grid gap-0.5">
                    {rows[s.key].map((r) => (
                      <li key={r.href}>
                        {r.disabled ? (
                          <SoonControl role="link" className="flex min-h-14 items-start gap-3 rounded-[10px] p-2">
                            <RowBody r={r} />
                          </SoonControl>
                        ) : (
                          <Link
                            href={r.href}
                            onClick={close}
                            aria-current={isCurrent(path, r.href) ? "page" : undefined}
                            className="group flex min-h-14 items-start gap-3 rounded-[10px] p-2 hover:bg-hover aria-[current=page]:bg-accent-muted"
                          >
                            <RowBody r={r} />
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>

                  {s.key === "platform" && (
                    <>
                      <Link
                        href="/platform"
                        onClick={close}
                        className="mt-2 inline-flex min-h-11 items-center gap-1.5 px-2 text-[15px] font-[650] group text-accent hover:underline hover:underline-offset-3"
                      >
                        See how it all fits together
                        <Icon
                          name="arrow-right"
                          size={14}
                          variant="line"
                          className="group-hover:translate-x-1 transition-transform transform ease-in-out duration-150"
                        />
                      </Link>
                      {/* The navy story card, small: the band's swoosh and red dot. */}
                      <Link href="/#story" onClick={close} className="band-navy mt-2 block rounded-[12px] p-4">
                        <svg
                          className="pointer-events-none absolute inset-0 size-full"
                          viewBox="0 0 260 140"
                          preserveAspectRatio="xMaxYMax slice"
                          aria-hidden="true"
                        >
                          <path
                            d="M-30 170 C 70 110 160 96 290 100"
                            fill="none"
                            stroke="var(--hero-swoosh)"
                            strokeWidth="22"
                            strokeLinecap="round"
                            opacity="0.3"
                          />
                          <circle cx="238" cy="118" r="7" fill="var(--hero-dot)" />
                        </svg>
                        <span className="relative block text-[13px] font-semibold text-[var(--on-navy-link)]">
                          The ERIX story
                        </span>
                        <span className="relative mt-1 block max-w-[24ch] font-display text-[17px] leading-snug font-bold text-white">
                          One enquiry, from a 9:42 pm message to a paid invoice.
                        </span>
                        <span className="relative mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-white">
                          See the story
                          <Icon name="arrow-right" size={14} variant="line" />
                        </span>
                      </Link>
                    </>
                  )}

                  {s.key === "resources" && (
                    <>
                      <SubList
                        title="Guides"
                        items={GUIDE_NAV.map((g) => ({ href: g.href, label: g.name, icon: g.icon }))}
                        path={path}
                        onNavigate={close}
                      />
                      <SubList
                        title="Side by side"
                        items={COMPARE_NAV.map((c) => ({ href: c.href, label: c.name }))}
                        path={path}
                        onNavigate={close}
                      />
                    </>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </nav>
        <div className="shrink-0 border-t border-border-soft p-4">
          <Link href={CONTACT_CTA.href} onClick={close} className={cn(buttonVariants({ size: "lg" }), "w-full")}>
            {CONTACT_CTA.label}
            <Icon name="arrow-right" size={16} variant="line" />
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
