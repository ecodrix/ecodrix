"use client";

import { m } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Icon, type IconName } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { SoonControl } from "@/components/ui/soon";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  COMPANY_NAV,
  COMPARE_NAV,
  CONTACT_EMAIL,
  GUIDE_NAV,
  INDUSTRY_NAV,
  type ModuleStatus,
  RESOURCE_NAV,
} from "@/lib/site";
import { cn } from "@/lib/utils";
import { isCurrent, NAV_SECTIONS, type NavSection } from "./nav-data";
import { type PlatformNavItem, usePlatformNav } from "./platform-nav";

/* ── Panels: a list on the left, a preview of the active row on the right ── */

type Row = {
  href: string;
  name: string;
  summary: string;
  icon?: IconName;
  ai?: boolean;
  status?: ModuleStatus;
};

type Spot = {
  /** The href of the row it describes; the first spot of a panel is its default (no CTA of its own). */
  key: string;
  kicker: string;
  icon?: IconName;
  headline: string;
  text?: string;
  /** The default spot's links, always shown in the strip under the preview. */
  links?: readonly { label: string; href: string }[];
  cta?: { label: string; href: string };
};

type PanelData = { rows: readonly Row[]; spots: readonly Spot[]; foot?: { label: string; href: string } };

const LINK_ARROW =
  "group inline-flex items-center gap-1.5 font-sans text-[15px]/5 font-[650] text-accent hover:underline hover:underline-offset-3 motion-safe:focus-visible:animate-focus";

/** One row of the list. A Coming soon row is shown but is not a link. */
function PanelRow({
  row,
  path,
  on,
  plain,
  onActive,
}: {
  row: Row;
  path: string | null;
  on: boolean;
  plain: boolean;
  onActive: () => void;
}) {
  const soon = row.status === "soon";
  const current = isCurrent(path, row.href);
  const cls = cn(
    "flex items-center gap-3 rounded-[10px] pr-3 pl-1.5 transition-colors duration-150 motion-reduce:transition-none",
    plain ? "h-13 pl-3.5" : "h-11",
    on && "bg-hover",
  );
  const body = (
    <>
      {row.icon && (
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-[8px]",
            row.ai ? "bg-ai-subtle text-ai" : "bg-accent-muted text-accent",
            on && "bg-surface",
          )}
        >
          <Icon name={row.icon} size={16} variant="line" />
        </span>
      )}
      <span className={cn("min-w-0 text-[15px]/5 font-semibold", current ? "text-accent" : "text-foreground")}>
        {row.name}
      </span>
      {current && <span aria-hidden="true" className="-ml-1 size-1.5 shrink-0 rounded-full bg-[var(--hero-dot)]" />}
      {(row.status === "invite" || soon) && <StatusBadge status={row.status as ModuleStatus} className="shrink-0" />}
    </>
  );
  return (
    <li onPointerEnter={onActive} onFocus={onActive}>
      {soon ? (
        <SoonControl role="link" className={cls}>
          {body}
        </SoonControl>
      ) : (
        <NavigationMenuLink asChild active={current}>
          <Link href={row.href} className={cls}>
            {body}
            <ArrowRight
              aria-hidden="true"
              className={cn(
                "ml-auto size-4 shrink-0 text-accent transition-[opacity,translate] duration-150 motion-reduce:transition-none",
                on ? "opacity-100" : "-translate-x-1 opacity-0",
              )}
            />
          </Link>
        </NavigationMenuLink>
      )}
    </li>
  );
}

/**
 * A panel: the list (and the section's foot link) on the left, the preview pane on the right. The
 * top of the pane follows the active row (pointer or keyboard focus) and shows the section's default
 * spot when the pointer leaves the panel; the strip under it never changes. Every state is stacked
 * in one grid cell, so the pane keeps the tallest height and nothing jumps; inactive ones are inert.
 */
function SpotPanel({ data, path }: { data: PanelData; path: string | null }) {
  const { rows, spots, foot } = data;
  const [active, setActive] = useState<string | null>(null);
  const def = spots[0];
  const wide = rows.length > 5;
  const plain = rows.every((r) => !r.icon);
  const activeRow = rows.find((r) => r.href === active);

  const previewOf = (r?: Row): Partial<Spot> & Pick<Spot, "kicker" | "headline"> & { ai?: boolean } => {
    const spot = r && spots.find((s) => s.key === r.href);
    if (!r) return { kicker: def.kicker, headline: def.headline, text: def.text };
    // A row without a spot of its own says what it is, in its own words.
    if (!spot) return { icon: r.icon, kicker: r.name, headline: r.summary, ai: r.ai };
    return { ...spot, ai: r.ai, cta: spot === def ? undefined : spot.cta };
  };
  const strip = def.links ?? (def.cta ? [def.cta] : []);

  // A keyboard user's focused element is never removed from under them.
  const leave = (e: React.PointerEvent<HTMLDivElement>) => {
    const f = document.activeElement;
    if (f instanceof HTMLElement && e.currentTarget.contains(f) && f.matches(":focus-visible")) return;
    setActive(null);
  };

  return (
    <div
      onPointerLeave={leave}
      className={cn(
        "grid grid-rows-[auto_1fr] gap-x-6",
        wide
          ? "grid-cols-[minmax(0,3fr)_minmax(0,2fr)] min-[1280px]:grid-cols-[608px_minmax(0,1fr)]"
          : "grid-cols-[minmax(0,340px)_minmax(0,1fr)]",
      )}
    >
      <ul
        className={cn(
          "col-start-1 row-start-1 grid content-start gap-0.5",
          wide && "grid-flow-col grid-cols-2 grid-rows-[repeat(5,auto)] gap-x-2",
        )}
      >
        {rows.map((r) => (
          <PanelRow
            key={r.href}
            row={r}
            path={path}
            on={r.href === active}
            plain={plain}
            onActive={() => setActive(r.href)}
          />
        ))}
      </ul>
      {foot && (
        <div className="col-start-1 row-start-2 mt-2 self-start border-t border-border-soft px-1.5 pt-2.5">
          <NavigationMenuLink asChild>
            <Link href={foot.href} className={LINK_ARROW}>
              {foot.label}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </NavigationMenuLink>
        </div>
      )}
      <div
        className={cn(
          "col-start-2 row-span-2 row-start-1 flex min-w-0 flex-col rounded-2xl border p-7 transition-colors duration-150 motion-reduce:transition-none",
          activeRow?.ai ? "border-transparent bg-ai-subtle" : "border-border-soft bg-blue-50",
        )}
      >
        <div className="grid flex-1">
          {[undefined, ...rows].map((r) => {
            const p = previewOf(r);
            const on = r?.href === active || (!r && !activeRow);
            return (
              <div
                key={r?.href ?? "default"}
                inert={!on}
                className={cn(
                  "flex flex-col items-start [grid-area:1/1] transition-opacity duration-150 motion-reduce:transition-none",
                  on ? "opacity-100" : "opacity-0",
                )}
              >
                <span
                  className={cn(
                    "flex items-center gap-2 text-[13px]/5 font-semibold",
                    p.ai ? "text-ai" : "text-accent",
                  )}
                >
                  {p.icon && <Icon name={p.icon} size={16} variant="line" />}
                  {p.kicker}
                </span>
                <p className="mt-3 max-w-[470px] font-display text-[24px]/[30px] font-bold tracking-[-0.4px] text-balance text-navy">
                  {p.headline}
                </p>
                {p.text && <p className="mt-2 max-w-[52ch] text-[15px]/6 text-muted-foreground">{p.text}</p>}
                {p.cta && (
                  <div className="mt-auto pt-4">
                    <NavigationMenuLink asChild>
                      <Link href={p.cta.href} className={cn(buttonVariants({ size: "sm" }), "shadow-none!")}>
                        {p.cta.label}
                        <ArrowRight aria-hidden="true" className="size-4" />
                      </Link>
                    </NavigationMenuLink>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex min-h-10 w-full flex-wrap items-center gap-x-6 gap-y-2 border-t border-accent-border pt-3.5">
          <span className="text-[13px]/5 font-semibold text-subtle">{def.kicker}</span>
          {strip.map((l) =>
            l.href.startsWith("mailto:") ? (
              <a
                key={l.href}
                href={l.href}
                className="inline-flex items-center gap-2 text-[15px]/5 font-[650] text-foreground hover:underline hover:underline-offset-3 motion-safe:focus-visible:animate-focus"
              >
                <Icon name="mail" size={16} variant="line" className="text-accent" />
                {l.label}
              </a>
            ) : (
              <NavigationMenuLink asChild key={l.href}>
                <Link href={l.href} className={LINK_ARROW}>
                  {l.label}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </NavigationMenuLink>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

/** Resources rows: the blog and comparisons, then every guide (the hub is the panel's foot link). */
const RESOURCE_ROWS = [...RESOURCE_NAV.filter((r) => r.href !== "/guides"), ...GUIDE_NAV];

const platformData = (platform: readonly PlatformNavItem[]): PanelData => ({
  rows: platform.map((m) => ({
    href: m.href,
    name: m.name,
    summary: m.summary,
    icon: m.icon,
    ai: "ai" in m,
    status: m.status,
  })),
  foot: { label: "See how it all fits together", href: "/platform" },
  spots: [
    {
      key: "/#story",
      kicker: "The ERIX story",
      headline: "One enquiry, from a 9:42 pm message to a booked visit.",
      text: "Follow it through the inbox, the AI employee, the pipeline and Flow.",
      cta: { label: "See the story", href: "/#story" },
    },
    ...platform.map((mod) => ({
      key: mod.href,
      kicker: mod.name,
      icon: mod.icon,
      headline: mod.card.headline,
      text: mod.card.text,
      cta: { label: `Explore ${mod.name}`, href: mod.href },
    })),
  ],
});

const INDUSTRY_DATA: PanelData = {
  rows: INDUSTRY_NAV,
  foot: { label: "See a day in each trade", href: "/#verticals" },
  spots: [
    {
      key: "/#contact",
      kicker: "A day in each trade",
      headline: "Four trades, one workspace.",
      text: "Pick yours to see the enquiries and bookings ERIX takes care of.",
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
  ],
};

const RESOURCE_DATA: PanelData = {
  rows: RESOURCE_ROWS,
  foot: { label: "See all guides", href: "/guides" },
  spots: [
    {
      key: "/compare",
      kicker: "Side by side",
      headline: "How ERIX compares with the tools you know.",
      links: [
        ...COMPARE_NAV.map((c) => ({ label: c.name, href: c.href })),
        { label: "All comparisons", href: "/compare" },
      ],
    },
    ...RESOURCE_ROWS.flatMap((r) =>
      "card" in r
        ? [
            {
              key: r.href,
              kicker: r.name,
              icon: r.icon,
              headline: r.card.headline,
              text: r.card.text,
              cta: { label: "cta" in r.card ? r.card.cta : "Read the guide", href: r.href },
            },
          ]
        : [],
    ),
  ],
};

const COMPANY_DATA: PanelData = {
  rows: [
    ...COMPANY_NAV,
    { name: "Contact us", href: "/#contact", summary: "Join the list or ask a question; a person replies." },
  ],
  spots: [
    {
      key: "/#contact",
      kicker: "Contact",
      headline: "Talk to a person, not a ticket queue.",
      text: "Email us; a person replies on IST working hours.",
      links: [{ label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` }],
    },
    ...COMPANY_NAV.map((c) => ({
      key: c.href,
      kicker: c.name,
      headline: c.card.headline,
      text: c.card.text,
      cta: { label: c.card.cta, href: c.href },
    })),
  ],
};

function Panel({ section, path }: { section: NavSection; path: string | null }) {
  const platform = usePlatformNav();
  const data =
    section === "platform"
      ? platformData(platform)
      : section === "industries"
        ? INDUSTRY_DATA
        : section === "resources"
          ? RESOURCE_DATA
          : COMPANY_DATA;
  return <SpotPanel data={data} path={path} />;
}

/**
 * The desktop header menu on the shadcn NavigationMenu (Radix): four
 * sections sharing one panel that eases between them. A pill glides to
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
    <>
      {/* The page below dims a little (behind the header, which is its own stacking context). */}
      {value && <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-[rgb(11_27_100/0.06)]" />}
      <NavigationMenu value={value} onValueChange={setValue} aria-label="Main">
        <NavigationMenuList>
          {NAV_SECTIONS.map((s) => (
            <NavigationMenuItem key={s.key} value={s.key}>
              <NavigationMenuTrigger
                data-nav-key={s.key}
                data-current={current === s.key || undefined}
                // Arrow keys only move focus in Radix; with a menu open, focus arriving from another trigger
                // (not back from the panel after Esc) brings that section's panel.
                onFocus={(e) =>
                  value &&
                  e.relatedTarget instanceof HTMLElement &&
                  e.relatedTarget.dataset.navKey &&
                  e.currentTarget.matches(":focus-visible") &&
                  setValue(s.key)
                }
                className="data-[current]:text-foreground"
              >
                {value === s.key && (
                  <m.span
                    layoutId="nav-pill"
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 rounded-full bg-hover"
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
              <NavigationMenuContent data-lenis-prevent className="absolute inset-x-0 top-0 px-6 py-5">
                <Panel section={s.key} path={path} />
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
        {/* The pill's own width and edges (-1px = its border), attached under the bar; the bar squares its bottom corners meanwhile (Navbar). */}
        <NavigationMenuViewport className="absolute inset-x-[-1px] top-full overflow-hidden rounded-b-[28px] border border-border bg-surface text-foreground" />
      </NavigationMenu>
    </>
  );
}
