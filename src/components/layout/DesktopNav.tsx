"use client";

import { AnimatePresence, m, type Variants } from "framer-motion";
import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";
import { ArrowRight, Icon, type IconName } from "@/components/icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { SoonControl } from "@/components/ui/soon";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  COMPANY_NAV,
  COMPARE_NAV,
  GUIDE_NAV,
  INDUSTRY_NAV,
  RESOURCE_NAV,
  SUPPORT_EMAIL,
  WHATSAPP_CTA,
} from "@/lib/site";
import { cn } from "@/lib/utils";
import { isCurrent, NAV_SECTIONS, type NavSection } from "./nav-data";
import { type PlatformNavItem, usePlatformNav } from "./platform-nav";

/* ── Panels ──────────────────────────────────────────────────────────── */

const list: Variants = { open: { transition: { staggerChildren: 0.025, delayChildren: 0.04 } } };
const row: Variants = {
  closed: { opacity: 0, y: -4 },
  open: { opacity: 1, y: 0, transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] } },
};

/** A menu row: Radix link (closes the menu, arrow-key focus) around a Next link. */
function PanelLink({
  href,
  path,
  className,
  onSpotlight,
  disabled,
  children,
}: {
  href: string;
  path: string | null;
  className?: string;
  /** Item not available yet: shown, announced as disabled, no link. */
  disabled?: boolean;
  /** Pointer or keyboard landed on this row (drives the platform spotlight card). */
  onSpotlight?: () => void;
  children: ReactNode;
}) {
  if (disabled)
    return (
      <m.li variants={row}>
        <SoonControl role="link" className={cn("flex gap-3 rounded-[10px] p-2.5", className)}>
          {children}
        </SoonControl>
      </m.li>
    );
  return (
    <m.li variants={row}>
      <NavigationMenuLink asChild active={isCurrent(path, href)}>
        <Link
          href={href}
          aria-current={isCurrent(path, href) ? "page" : undefined}
          onPointerEnter={onSpotlight}
          onFocus={onSpotlight}
          className={cn(
            "group/row flex gap-3 rounded-[10px] p-2.5 hover:bg-hover focus-visible:bg-hover data-[active]:bg-accent-muted",
            className,
          )}
        >
          {children}
        </Link>
      </NavigationMenuLink>
    </m.li>
  );
}

function Glyph({ ai, children }: { ai?: boolean; children: ReactNode }) {
  return (
    <span
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-[8px]",
        ai ? "bg-ai-subtle text-ai" : "bg-accent-muted text-accent",
      )}
    >
      {children}
    </span>
  );
}

function RowText({ title, text, badge }: { title: string; text: string; badge?: ReactNode }) {
  return (
    <span className="min-w-0">
      <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[14.5px] font-semibold text-foreground">
        {title}
        {badge}
      </span>
      <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">{text}</span>
    </span>
  );
}

/* ── Spotlight card: the navy card beside every panel's rows ─────────── */

type Spot = {
  key: string;
  kicker: string;
  icon?: IconName;
  headline: string;
  text?: string;
  /** Internal links close the menu (Radix); `external` opens a new tab or mail app. */
  links?: readonly { label: string; href: string; icon?: ReactNode; external?: boolean }[];
  cta?: { label: string; href: string };
};

/**
 * The band's swoosh and red dot, small. Every card of a panel is stacked in one grid cell, so the
 * panel keeps the tallest card's height and never jumps; the active one fades in, the rest are
 * inert (not focusable, hidden from screen readers).
 */
function SpotlightCard({ spots, active, path }: { spots: readonly Spot[]; active: string; path: string | null }) {
  return (
    <m.div variants={row} className="band-navy grid rounded-[12px] p-5">
      <svg
        className="pointer-events-none absolute inset-0 size-full"
        viewBox="0 0 260 300"
        preserveAspectRatio="xMaxYMax slice"
        aria-hidden="true"
      >
        <path
          d="M-30 330 C 70 250 160 222 290 226"
          fill="none"
          stroke="var(--hero-swoosh)"
          strokeWidth="26"
          strokeLinecap="round"
          opacity="0.3"
        />
        <circle cx="236" cy="268" r="8" fill="var(--hero-dot)" />
      </svg>
      {spots.map((s) => {
        const on = s.key === active;
        return (
          <div
            key={s.key}
            inert={!on}
            className={cn(
              "relative flex flex-col [grid-area:1/1] transition-[opacity,translate] duration-200 ease-out",
              on ? "opacity-100" : "translate-y-1.5 opacity-0",
            )}
          >
            <span className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--on-navy-link)]">
              {s.icon && <Icon name={s.icon} size={14} variant="line" />}
              {s.kicker}
            </span>
            <p className="mt-2 font-display text-[19px] leading-snug font-bold text-white">{s.headline}</p>
            {s.text && <p className="mt-2 text-[13.5px] text-white/75">{s.text}</p>}
            {s.links && (
              <ul className="mt-3 grid gap-0.5">
                {s.links.map((l) => {
                  const cls =
                    "flex items-center gap-2 rounded-[8px] py-1.5 text-[14px] font-semibold text-white hover:underline";
                  return (
                    <li key={l.href}>
                      {l.external ? (
                        <a
                          href={l.href}
                          className={cls}
                          {...(l.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
                        >
                          {l.icon}
                          {l.label}
                          {l.href.startsWith("http") && <span className="sr-only"> (opens in a new tab)</span>}
                        </a>
                      ) : (
                        <NavigationMenuLink asChild active={isCurrent(path, l.href)}>
                          <Link href={l.href} className={cls}>
                            {l.icon}
                            {l.label}
                          </Link>
                        </NavigationMenuLink>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
            {s.cta && (
              <NavigationMenuLink asChild active={isCurrent(path, s.cta.href)}>
                <Link
                  href={s.cta.href}
                  className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[14px] font-semibold text-white hover:underline"
                >
                  {s.cta.label}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </NavigationMenuLink>
            )}
          </div>
        );
      })}
    </m.div>
  );
}

/**
 * A panel: rows on the left, the spotlight card on the right. The card follows the row under the
 * pointer or keyboard focus, keeps it while the pointer crosses to the card (so its links can be
 * clicked) and goes back to the first spot when the pointer leaves the panel.
 */
function SpotPanel({
  className,
  spots,
  path,
  children,
}: {
  className: string;
  spots: readonly Spot[];
  path: string | null;
  children: (spotlight: (key: string) => () => void) => ReactNode;
}) {
  const [active, setActive] = useState(spots[0].key);
  return (
    <div className={cn("grid gap-2", className)} onPointerLeave={() => setActive(spots[0].key)}>
      <div>{children((key) => () => setActive(key))}</div>
      <SpotlightCard spots={spots} active={active} path={path} />
    </div>
  );
}

const platformSpots = (platform: readonly PlatformNavItem[]): readonly Spot[] => [
  {
    key: "story",
    kicker: "The ERIX story",
    headline: "One enquiry, from a 9:42 pm message to a paid invoice.",
    text: "Follow it through the inbox, the agent, the pipeline and Flow.",
    cta: { label: "See the story", href: "/#story" },
  },
  ...platform.map((mod) => ({
    key: mod.key,
    kicker: mod.name,
    icon: mod.icon,
    headline: mod.card.headline,
    text: mod.card.text,
    cta: { label: `Explore ${mod.name}`, href: mod.href },
  })),
];

const INDUSTRY_SPOTS: readonly Spot[] = [
  {
    key: "trades",
    kicker: "A day in each trade",
    headline: "Six trades, one workspace.",
    text: "Pick yours to see the enquiries, bookings and invoices ERIX takes care of.",
    cta: { label: "Ask about your trade", href: "/#contact" },
  },
  ...INDUSTRY_NAV.map((i) => ({
    key: i.href,
    kicker: i.name,
    icon: i.icon,
    headline: i.card.headline,
    text: i.card.text,
    cta: { label: "See how it works", href: i.href },
  })),
];

const RESOURCE_SPOTS: readonly Spot[] = [
  {
    key: "/compare",
    kicker: "Side by side",
    headline: "How ERIX compares with the tools you know.",
    links: [
      ...COMPARE_NAV.map((c) => ({ label: c.name, href: c.href })),
      { label: "All comparisons", href: "/compare" },
    ],
  },
  ...RESOURCE_NAV.flatMap((r) =>
    "card" in r
      ? [
          {
            key: r.href,
            kicker: r.name,
            icon: r.icon,
            headline: r.card.headline,
            text: r.card.text,
            cta: { label: r.card.cta, href: r.href },
          },
        ]
      : [],
  ),
  ...GUIDE_NAV.map((g) => ({
    key: g.href,
    kicker: g.name,
    icon: g.icon,
    headline: g.card.headline,
    text: g.card.text,
    cta: { label: "Read the guide", href: g.href },
  })),
];

/** Resources rows: the blog and comparisons, then every guide (the hub is the panel's foot link). */
const RESOURCE_ROWS = [...RESOURCE_NAV.filter((r) => r.href !== "/guides"), ...GUIDE_NAV];

const COMPANY_SPOTS: readonly Spot[] = [
  {
    key: "contact",
    kicker: "Contact",
    headline: "Talk to a person, not a ticket queue.",
    text: "WhatsApp or email, answered on IST working hours.",
    links: [
      { label: WHATSAPP_CTA.label, href: WHATSAPP_CTA.href, icon: <Icon name="whatsapp" size={16} />, external: true },
      {
        label: SUPPORT_EMAIL,
        href: `mailto:${SUPPORT_EMAIL}`,
        icon: <Icon name="mail" size={16} variant="line" />,
        external: true,
      },
    ],
  },
  ...COMPANY_NAV.map((c) => ({
    key: c.href,
    kicker: c.name,
    headline: c.card.headline,
    text: c.card.text,
    cta: { label: c.card.cta, href: c.href },
  })),
];

function PanelFoot({ href, label, onSpotlight }: { href: string; label: string; onSpotlight?: () => void }) {
  return (
    <m.div variants={row} className="mt-1 border-t border-border-soft px-2.5 pt-2.5">
      <NavigationMenuLink asChild>
        <Link
          href={href}
          onPointerEnter={onSpotlight}
          onFocus={onSpotlight}
          className="group inline-flex items-center gap-1.5 font-sans text-[15px]/5 font-[650] text-accent hover:underline hover:underline-offset-3 motion-safe:focus-visible:animate-focus"
        >
          {label}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </NavigationMenuLink>
    </m.div>
  );
}

function Panel({ section, path }: { section: NavSection; path: string | null }) {
  const platform = usePlatformNav();
  if (section === "platform")
    return (
      <SpotPanel className="grid-cols-[minmax(0,1fr)_18rem] gap-6" spots={platformSpots(platform)} path={path}>
        {(spotlight) => (
          <>
            <m.ul variants={list} className="grid grid-cols-3 gap-1">
              {platform.map((mod) => (
                <PanelLink
                  key={mod.key}
                  href={mod.href}
                  path={path}
                  onSpotlight={spotlight(mod.key)}
                  disabled={mod.status === "soon"}
                >
                  <Glyph ai={"ai" in mod}>
                    <Icon name={mod.icon} size={16} variant="line" />
                  </Glyph>
                  <RowText
                    title={mod.name}
                    text={mod.summary}
                    badge={<StatusBadge status={mod.status} isNew={mod.isNew} />}
                  />
                </PanelLink>
              ))}
            </m.ul>
            <PanelFoot href="/platform" label="See how it all fits together" />
          </>
        )}
      </SpotPanel>
    );
  if (section === "industries")
    return (
      <SpotPanel className="grid-cols-[minmax(0,1fr)_18rem] gap-6" spots={INDUSTRY_SPOTS} path={path}>
        {(spotlight) => (
          <>
            <m.ul variants={list} className="grid grid-cols-3 gap-1">
              {INDUSTRY_NAV.map((i) => (
                <PanelLink key={i.href} href={i.href} path={path} onSpotlight={spotlight(i.href)}>
                  <Glyph>
                    <Icon name={i.icon} size={16} variant="duo" />
                  </Glyph>
                  <RowText title={i.name} text={i.summary} />
                </PanelLink>
              ))}
            </m.ul>
            <PanelFoot href="/#verticals" label="See a day in each trade" />
          </>
        )}
      </SpotPanel>
    );
  if (section === "resources")
    return (
      <SpotPanel className="grid-cols-[minmax(0,1fr)_18rem] gap-6" spots={RESOURCE_SPOTS} path={path}>
        {(spotlight) => (
          <>
            <m.ul variants={list} className="grid grid-cols-3 gap-1">
              {RESOURCE_ROWS.map((r) => (
                <PanelLink key={r.href} href={r.href} path={path} onSpotlight={spotlight(r.href)}>
                  <Glyph>
                    <Icon name={r.icon} size={16} variant="line" />
                  </Glyph>
                  <RowText title={r.name} text={r.summary} />
                </PanelLink>
              ))}
            </m.ul>
            <PanelFoot href="/guides" label="See all guides" onSpotlight={spotlight("/guides")} />
          </>
        )}
      </SpotPanel>
    );
  return (
    <SpotPanel className="grid-cols-[minmax(0,1fr)_18rem] gap-6" spots={COMPANY_SPOTS} path={path}>
      {(spotlight) => (
        <m.ul variants={list} className="grid grid-cols-3 content-start gap-1">
          {COMPANY_NAV.map((c) => (
            <PanelLink key={c.href} href={c.href} path={path} onSpotlight={spotlight(c.href)}>
              <RowText title={c.name} text={c.summary} />
            </PanelLink>
          ))}
          <PanelLink href="/#contact" path={path} onSpotlight={spotlight("contact")}>
            <RowText title="Contact us" text="Join the list or ask a question; a person replies." />
          </PanelLink>
        </m.ul>
      )}
    </SpotPanel>
  );
}

/**
 * The desktop header menu on the shadcn NavigationMenu (Radix): four
 * sections, each a panel that enters with framer-motion. A pill glides to
 * the open section and the logo's red dot marks the current one (both
 * `layoutId`). Loaded by the Navbar on wide screens only (see Navbar), so
 * phones never download it. `focusKey`: the section whose placeholder had
 * keyboard focus when this loaded; focus moves to its real trigger.
 */
export default function DesktopNav({
  path,
  current,
  focusKey,
}: {
  path: string | null;
  current?: NavSection;
  focusKey?: NavSection;
}) {
  const [value, setValue] = useState("");

  // Navigating closes the menu.
  const [lastPath, setLastPath] = useState(path);
  if (lastPath !== path) {
    setLastPath(path);
    setValue("");
  }

  useEffect(() => {
    if (focusKey) document.querySelector<HTMLElement>(`[data-nav-key="${focusKey}"]`)?.focus();
  }, [focusKey]);

  return (
    <NavigationMenu value={value} onValueChange={setValue} aria-label="Main">
      <NavigationMenuList>
        {NAV_SECTIONS.map((s) => (
          <NavigationMenuItem key={s.key} value={s.key}>
            <NavigationMenuTrigger
              data-nav-key={s.key}
              data-current={current === s.key || undefined}
              className="data-[current]:text-foreground"
            >
              {value === s.key && (
                <m.span
                  layoutId="nav-pill"
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 rounded-[8px] bg-hover"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                />
              )}
              {s.label}
              {current === s.key && (
                <m.span
                  layoutId="nav-current"
                  aria-hidden="true"
                  className="absolute bottom-0 left-[calc(50%-2.5px)] size-[5px] rounded-full bg-[var(--hero-dot)]"
                />
              )}
            </NavigationMenuTrigger>
            <AnimatePresence>
              {value === s.key && (
                <NavigationMenuContent forceMount asChild>
                  <m.div
                    className="absolute inset-x-0 top-full"
                    initial="closed"
                    animate="open"
                    exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  >
                    {/* Full-width panel under the header; the page below dims a little. */}
                    <m.div
                      data-lenis-prevent
                      variants={{
                        closed: { opacity: 0, y: -6 },
                        open: { opacity: 1, y: 0, transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] } },
                      }}
                      className="relative z-10 border-y border-border-soft bg-surface text-foreground shadow-[0_24px_48px_-24px_rgba(11,27,100,0.28)]"
                    >
                      <div className="mx-auto w-full max-w-wrap px-gutter py-5">
                        <Panel section={s.key} path={path} />
                      </div>
                    </m.div>
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-full h-dvh bg-[rgb(11_27_100/0.06)]"
                    />
                  </m.div>
                </NavigationMenuContent>
              )}
            </AnimatePresence>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
