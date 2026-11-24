"use client";

import { type FocusEvent, type KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { HeroMotif } from "@/components/marketing/kit";
import { LiveDot } from "@/components/motion/surface";
import { SubscribeButton } from "@/components/status/SubscribeDialog";
import { buttonVariants } from "@/components/ui/button";
import { REPORT_EMAIL } from "@/lib/site";
import {
  fmtDay,
  fmtDuration,
  fmtIsoDay,
  fmtMs,
  fmtPct,
  fmtTime,
  type Overall,
  readStatusPage,
  type StatusDay,
  type StatusIncident,
  type StatusOutage,
  type StatusPayload,
  type StatusSystem,
  type Tick,
} from "@/lib/status/status-page";
import { cn } from "@/lib/utils";

const REPORT_HREF = `mailto:${REPORT_EMAIL}?subject=${encodeURIComponent("Status: problem report")}`;
const POLL_MS = 60_000;

/** Colour and a word for every state: colour is never the only signal. */
const TICK: Record<Tick, { word: string; bar: string; text: string }> = {
  operational: { word: "Operational", bar: "bg-success", text: "text-success" },
  degraded: { word: "Degraded", bar: "bg-warning", text: "text-warning" },
  down: { word: "Outage", bar: "bg-error", text: "text-error" },
  maintenance: { word: "Maintenance", bar: "bg-accent", text: "text-accent" },
  nodata: { word: "No data", bar: "bg-border", text: "text-subtle" },
};

const BANNER: Record<
  Overall,
  { title: string; body: string; icon: "circle-check" | "triangle-alert" | "circle-x" | "wrench"; tone: string }
> = {
  operational: {
    title: "We're fully operational",
    body: "We're not aware of any issues affecting our systems.",
    icon: "circle-check",
    tone: "bg-success-subtle text-success",
  },
  degraded: {
    title: "Some systems are degraded",
    body: "We're aware and working on it. Details below.",
    icon: "triangle-alert",
    tone: "bg-warning-subtle text-warning",
  },
  outage: {
    title: "We have a service disruption",
    body: "We're working on it. Details below.",
    icon: "circle-x",
    tone: "bg-error-subtle text-error",
  },
  maintenance: {
    title: "Scheduled maintenance in progress",
    body: "Some systems may be briefly unavailable.",
    icon: "wrench",
    tone: "bg-accent-muted text-accent",
  },
};

const IMPACT = { minor: "Minor", major: "Major", outage: "Outage" } as const;
const STATE = {
  investigating: "Investigating",
  identified: "Identified",
  monitoring: "Monitoring",
  resolved: "Resolved",
} as const;
const stamp = (iso: string) => `${fmtDay(new Date(iso))}, ${fmtTime(new Date(iso))} IST`;

/** One bar every PITCH px. Wide rows stretch the bars over every day; narrow ones keep the width and show fewer days. */
const BAR = 5;
const PITCH = BAR + 1;
/** The day card's width; a narrower row gets a card as wide as itself. */
const CARD = 288;
const DAY_MS = 86_400_000;

/** One line of a day's card, coloured by the state it reports. */
type Line = { text: string; tone?: Tick; href?: string };

/** What a day's card says when nothing else happened that day. */
const QUIET: Record<Tick, string> = {
  operational: "No downtime recorded on this day.",
  degraded: "No details kept for this day.",
  down: "No details kept for this day.",
  maintenance: "Planned maintenance on this day.",
  nodata: "No checks ran on this day.",
};

/** Whether a span touches an IST calendar day; an open span runs to now. */
const onDay = (date: string, from: string, to: string | null) => {
  const start = Date.parse(`${date}T00:00:00+05:30`);
  return Date.parse(from) < start + DAY_MS && (to ? Date.parse(to) : Date.now()) >= start;
};

/** "Dashboard outage, 11:02 am to 11:14 am (12 min)" for each outage that touched the day. */
function outageLines(outages: StatusOutage[], date: string, name: (id: string) => string): Line[] {
  return outages
    .filter((o) => onDay(date, o.startedAt, o.endedAt))
    .map((o) => {
      const tone = o.status === "down" ? "down" : "degraded";
      const end = o.endedAt ? ` to ${fmtTime(new Date(o.endedAt))}` : ", ongoing";
      return {
        tone,
        text: `${name(o.component)} ${TICK[tone].word.toLowerCase()}, ${fmtTime(new Date(o.startedAt))}${end} (${fmtDuration(o.durationMin)})`,
      };
    });
}

/** A day of one system (or, with `component`, of one of its components): what was hit, outages, incidents, maintenance. */
function dayLines(data: StatusPayload, s: StatusSystem, d: StatusDay, component?: string): Line[] {
  const name = (id: string) => s.components.find((c) => c.id === id)?.name ?? id;
  const outages = outageLines(
    (s.outages ?? []).filter((o) => !component || o.component === component),
    d.date,
    name,
  );
  if (component) return outages;
  const hit = s.components.filter((c) => {
    const state = c.days?.find((x) => x.date === d.date)?.state;
    return state === "degraded" || state === "down";
  });
  return [
    ...(hit.length && s.components.length > 1
      ? [{ text: `${hit.length} of ${s.components.length} components affected: ${hit.map((c) => c.name).join(", ")}` }]
      : []),
    ...outages,
    ...data.incidents
      .filter((i) => i.systems.includes(s.id) && onDay(d.date, i.startedAt, i.resolvedAt))
      .map(
        (i): Line => ({
          text: `Incident: ${i.title}`,
          tone: i.impact === "minor" ? "degraded" : "down",
          href: `#incident-${i.id}`,
        }),
      ),
    ...data.maintenance
      .filter((m) => m.systems.includes(s.id) && onDay(d.date, m.startsAt, m.endsAt))
      .map((m): Line => ({ text: `Maintenance: ${m.title}`, tone: "maintenance" })),
  ];
}

/**
 * One bar a day for one row. Hover, tap or the arrow keys open that day's card;
 * a click or Enter pins it until Esc, the close button or focus leaving the row.
 */
function Pipes({
  name,
  days,
  range,
  lines,
}: {
  name: string;
  days: StatusDay[];
  range: 30 | 90;
  lines: (d: StatusDay) => Line[];
}) {
  const id = useId();
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e?.contentRect.width ?? 0));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const wanted = days.slice(-range);
  const fits = width === 0 || wanted.length * PITCH <= width;
  const shown = fits ? wanted : wanted.slice(-Math.max(1, Math.floor(width / PITCH)));
  const last = shown.length - 1;
  const at = active == null || last < 0 ? null : Math.min(active, last);
  const day = at == null ? null : shown[at];

  const close = () => {
    setActive(null);
    setPinned(false);
  };
  const say = (d: StatusDay) => {
    const up = fmtPct(d.uptimePct ?? null);
    const ls = lines(d);
    return [
      `${fmtIsoDay(d.date)}: ${TICK[d.state].word}${up ? `, ${up} uptime` : ""}`,
      ...(ls.length ? ls.map((l) => l.text) : [QUIET[d.state]]),
    ].join(". ");
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, Home: -Infinity, End: Infinity };
    if (e.key in step && last >= 0) {
      e.preventDefault();
      // The first key opens today; the next ones move.
      setActive(at == null ? last : Math.max(0, Math.min(last, at + (step[e.key] ?? 0))));
    } else if ((e.key === "Enter" || e.key === " ") && last >= 0) {
      e.preventDefault();
      setActive(at ?? last);
      setPinned((p) => !p);
    } else if (e.key === "Escape" && at != null) {
      close();
    }
  };
  // Focus leaving the row (its bars and its card) closes the card, pinned or not.
  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) close();
  };

  const cardW = Math.min(CARD, width || CARD);
  const center = at == null ? 0 : fits ? ((at + 0.5) / shown.length) * width : at * PITCH + BAR / 2;
  const left = Math.max(0, Math.min(width - cardW, center - cardW / 2));
  const up = day ? fmtPct(day.uptimePct ?? null) : null;
  const ls = day ? lines(day) : [];

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: wraps the listbox and its card only to see focus and the pointer leave both
    <div
      className="relative"
      onBlur={onBlur}
      onPointerLeave={(e) => {
        if (e.pointerType !== "touch" && !pinned) setActive(null);
      }}
    >
      <div
        ref={box}
        role="listbox"
        tabIndex={0}
        aria-label={`${name}, one bar per day for the last ${shown.length} days. Arrow keys move between days.`}
        aria-activedescendant={at == null ? undefined : `${id}-${at}`}
        onKeyDown={onKey}
        className="flex h-8 cursor-pointer items-stretch gap-px overflow-hidden rounded-[4px] py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {shown.map((d, i) => (
          // biome-ignore lint/a11y/useFocusableInteractive lint/a11y/useKeyWithClickEvents: aria-activedescendant listbox, the listbox takes focus and keys
          <span
            key={d.date}
            id={`${id}-${i}`}
            role="option"
            aria-selected={i === at}
            aria-label={say(d)}
            onPointerEnter={(e) => {
              if (e.pointerType !== "touch" && !pinned) setActive(i);
            }}
            onClick={() => {
              setPinned(!(pinned && i === at));
              setActive(i);
            }}
            style={fits ? undefined : { width: BAR }}
            className={cn(
              "rounded-[1px] transition-[scale,opacity,filter] duration-150 ease-out motion-reduce:transition-none",
              fits ? "min-w-[2px] flex-1" : "flex-none",
              TICK[d.state].bar,
              at != null && (i === at ? "scale-y-[1.25] brightness-110" : "opacity-40"),
            )}
          />
        ))}
      </div>
      {day ? (
        <div
          className="absolute top-full z-20 pt-2 motion-safe:animate-rise motion-safe:[animation-duration:200ms]"
          style={{ left, width: cardW }}
        >
          <div className="rounded-[12px] bg-surface-white p-3 text-[13px] text-foreground shadow-lg ring-1 ring-border">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-semibold">{fmtIsoDay(day.date)}</p>
                <p className={cn("mt-0.5 flex flex-wrap items-center gap-x-1.5 font-semibold", TICK[day.state].text)}>
                  <span aria-hidden="true" className={cn("size-2 rounded-full", TICK[day.state].bar)} />
                  {TICK[day.state].word}
                  {up ? <span className="font-normal tabular-nums text-muted-foreground">· {up} uptime</span> : null}
                </p>
              </div>
              {pinned ? (
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close day details"
                  className="-m-1 grid size-8 shrink-0 place-items-center rounded-full text-subtle hover:bg-sunken hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
                >
                  <Icon name="x" size={16} variant="line" />
                </button>
              ) : null}
            </div>
            <ul className="mt-2 space-y-1.5 border-t border-border-soft pt-2">
              {(ls.length ? ls : [{ text: QUIET[day.state] } as Line]).map((l) => (
                <li key={l.text} className="flex gap-2 leading-snug">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-[5px] size-1.5 shrink-0 rounded-full",
                      l.tone ? TICK[l.tone].bar : "bg-current opacity-40",
                    )}
                  />
                  {l.href ? (
                    <a href={l.href} onClick={close} className="font-medium text-accent hover:underline">
                      {l.text}
                    </a>
                  ) : (
                    <span>{l.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const ICON = {
  operational: "circle-check",
  degraded: "triangle-alert",
  down: "circle-x",
  maintenance: "wrench",
  nodata: "circle-dashed",
} as const;

/** A component in plain words, then its last-24-hour figures, when the API sends them. */
function About({ c, className }: { c: StatusSystem["components"][number]; className?: string }) {
  const perf = (c.performance ?? []).map((p) => `${p.unit === "%" ? fmtPct(p.value) : fmtMs(p.value)} ${p.label}`);
  if (!c.description && !perf.length) return null;
  return (
    <p className={cn("text-[12.5px] leading-snug text-muted-foreground", className)}>
      {c.description}
      {perf.length ? (
        <span className="text-subtle">
          {c.description ? " · " : ""}Last 24 h: {perf.join(" · ")}
        </span>
      ) : null}
    </p>
  );
}

/**
 * One system. Folded, it shows one bar per day for all its components together;
 * open, a row per component. Starts open (and opens by itself) while it's hurting.
 */
function SystemGroup({ data, system, range }: { data: StatusPayload; system: StatusSystem; range: 30 | 90 }) {
  const hurt = system.status === "degraded" || system.status === "down";
  const [open, setOpen] = useState(hurt);
  const [seen, setSeen] = useState(hurt);
  if (hurt !== seen) {
    setSeen(hurt);
    if (hurt) setOpen(true);
  }
  const t = TICK[system.status];
  const n = system.components.length;
  const bodyId = `sys-${system.id}`;
  const summary = (
    <>
      <span className={cn("text-[13.5px] font-semibold", t.text)}>{t.word}</span>
      <span className="w-[4.5rem] shrink-0 text-right text-[13.5px] font-normal tabular-nums text-muted-foreground">
        {fmtPct(system.uptimePct) ?? "No data"}
      </span>
    </>
  );
  return (
    <li className="px-4 py-3.5 sm:px-5">
      {n > 1 ? (
        <h3>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={bodyId}
            onClick={() => setOpen(!open)}
            className="-mx-2 flex min-h-10 w-[calc(100%+1rem)] items-center gap-2 rounded-[8px] px-2 text-left transition-colors hover:bg-sunken focus-visible:outline-2 focus-visible:outline-accent"
          >
            <Icon
              name="chevron-right"
              size={16}
              variant="line"
              className={cn("shrink-0 text-subtle transition-transform", open && "rotate-90")}
            />
            <span className="min-w-0 flex-1 truncate text-[15.5px] font-semibold">
              {system.name} <span className="hidden text-[13px] font-normal text-subtle sm:inline">{n} components</span>
            </span>
            {summary}
          </button>
        </h3>
      ) : (
        <div className="flex min-h-10 items-center gap-2">
          <span aria-hidden="true" className="w-4 shrink-0" />
          <h3 className="min-w-0 flex-1 truncate text-[15.5px] font-semibold">{system.name}</h3>
          {summary}
        </div>
      )}
      {n === 1 && system.components[0] ? <About c={system.components[0]} className="pl-6" /> : null}
      {n > 1 && open ? (
        <ul id={bodyId} className="mt-2 ml-[7px] space-y-4 border-l-2 border-border-soft pl-4">
          {system.components.map((c) => (
            <li key={c.id}>
              <div className="flex items-center justify-between gap-3 text-[14px]">
                <span className="flex min-w-0 items-center gap-1.5">
                  <Icon
                    name={ICON[c.status]}
                    size={16}
                    variant="line"
                    className={cn("shrink-0", TICK[c.status].text)}
                  />
                  <span className="sr-only">{TICK[c.status].word}: </span>
                  <span className="truncate">{c.name}</span>
                </span>
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  {c.latencyMs?.p50 != null ? (
                    <span className="mr-3 text-subtle">
                      {fmtMs(c.latencyMs.p50)}
                      <span className="sr-only"> typical response, last 24 hours,</span>
                    </span>
                  ) : null}
                  {fmtPct(c.uptimePct) ?? "No data"}
                </span>
              </div>
              <About c={c} className="mt-0.5 pl-[22px]" />
              <div className="mt-1">
                <Pipes name={c.name} days={c.days ?? []} range={range} lines={(d) => dayLines(data, system, d, c.id)} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div id={n > 1 ? bodyId : undefined} className="mt-1.5 pl-6">
          <Pipes name={system.name} days={system.days} range={range} lines={(d) => dayLines(data, system, d)} />
        </div>
      )}
    </li>
  );
}

function Incident({ i, names }: { i: StatusIncident; names: (ids: string[]) => string }) {
  return (
    <article
      id={`incident-${i.id}`}
      className="scroll-mt-6 rounded-[12px] bg-surface-white p-4 shadow-[0_0_0_1px_var(--border)]"
    >
      <h3 className="text-[16px] font-semibold">{i.title}</h3>
      <p className="mt-0.5 text-[13.5px] text-muted-foreground">
        {IMPACT[i.impact]} impact{i.systems.length ? ` · ${names(i.systems)}` : ""} ·{" "}
        {i.resolvedAt ? "Resolved" : STATE[i.status]}
      </p>
      <ol className="mt-3 space-y-2.5 border-l border-border-soft pl-3.5">
        {i.updates.map((u) => (
          <li key={u.at + u.status} className="text-[14.5px]">
            <p className="text-[13px] text-subtle">
              <b className="font-semibold text-foreground">{STATE[u.status]}</b> · {stamp(u.at)}
            </p>
            <p className="mt-0.5 whitespace-pre-line">{u.message}</p>
          </li>
        ))}
      </ol>
    </article>
  );
}

/** "Next check in 42 s": its own component, so the page doesn't re-render every second. */
function NextCheck({ at }: { at: number }) {
  const [now, setNow] = useState(at);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const s = Math.min(POLL_MS / 1000, Math.ceil((at + POLL_MS - now) / 1000));
  return <span className="tabular-nums">{s > 0 ? `Next check in ${s} s` : "Checking…"}</span>;
}

/** status.ecodrix.com: brand band, the headline card, systems with daily bars, incidents, maintenance. Times in IST. */
export function StatusPageView({ initial }: { initial: StatusPayload | null }) {
  const [data, setData] = useState(initial);
  const [range, setRange] = useState<30 | 90>(90);
  const [polledAt, setPolledAt] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      setPolledAt(Date.now());
      const next = await readStatusPage({ cache: "no-store" });
      if (next) setData(next);
    };
    if (initial) setPolledAt(Date.now());
    else void load();
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  }, [initial]);

  const names = (ids: string[]) => ids.map((id) => data?.systems.find((s) => s.id === id)?.name ?? id).join(", ");
  const banner = data
    ? BANNER[data.overall]
    : {
        title: "We can't reach the status service",
        body: "This page can't load live data right now. ERIX itself may be fine. Try again in a minute, or message us.",
        icon: "triangle-alert" as const,
        tone: "bg-warning-subtle text-warning",
      };
  const open = data?.incidents.filter((i) => !i.resolvedAt) ?? [];
  const past = data?.incidents.filter((i) => i.resolvedAt) ?? [];

  const ups = data?.systems.flatMap((s) => (s.uptimePct == null ? [] : [s.uptimePct])) ?? [];
  const apiMs =
    data?.systems.find((s) => s.id === "api")?.components.find((c) => c.id === "api")?.latencyMs?.p50 ?? null;
  const stats = data
    ? [
        {
          label: "Uptime, 90 days",
          value: fmtPct(ups.length ? ups.reduce((a, b) => a + b, 0) / ups.length : null) ?? "No data",
        },
        {
          label: "Systems up",
          value: `${data.systems.filter((s) => s.status === "operational").length} of ${data.systems.length}`,
        },
        { label: "Open incidents", value: String(open.length) },
        ...(apiMs != null ? [{ label: "API response, typical", value: fmtMs(apiMs) }] : []),
      ]
    : [];

  return (
    <>
      <section className="band-navy pt-14">
        <HeroMotif />
        <div className="relative mx-auto w-full max-w-3xl px-4 pt-8 pb-24 sm:px-6 sm:pt-12 sm:pb-28">
          <p className="font-display text-[clamp(30px,5vw,44px)] font-bold leading-[1.05] tracking-[-0.03em]">
            ERIX status
          </p>
          <p className="mt-2 max-w-[52ch] text-[15.5px] text-muted-foreground">
            Live health of the console, API, inbox, phone calls, automations, email and the AI employee. Updated every
            minute.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <a href={REPORT_HREF} className={buttonVariants({ variant: "ghost", size: "sm" })}>
              <Icon name="mail" size={16} variant="line" />
              Report a problem
              <span className="sr-only"> (opens your email app)</span>
            </a>
            <SubscribeButton />
          </div>
        </div>
      </section>

      <div className="relative mx-auto -mt-20 w-full max-w-3xl px-4 pb-6 sm:px-6 sm:pb-8">
        <section className="rounded-[16px] bg-surface-white p-5 shadow-[var(--shadow-card)] sm:p-6">
          <div aria-live="polite" className="flex items-center gap-4">
            <span className={cn("relative grid size-14 shrink-0 place-items-center rounded-full", banner.tone)}>
              <span
                aria-hidden="true"
                className="absolute -inset-1.5 rounded-full ring-2 ring-current/25 motion-safe:animate-pulse"
              />
              <Icon name={banner.icon} size={30} variant="solid" />
            </span>
            <div className="min-w-0">
              <h1 className="text-[clamp(20px,3vw,26px)] font-semibold leading-tight tracking-[-0.015em]">
                {banner.title}
              </h1>
              <p className="mt-1 text-[14.5px] text-muted-foreground">{banner.body}</p>
            </div>
          </div>
          {data ? (
            <>
              <dl className="mt-5 grid grid-cols-2 gap-2.5 sm:flex">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-[12px] p-3 shadow-[inset_0_0_0_1px_var(--border-soft)] sm:flex-1"
                  >
                    <dt className="text-[12.5px] text-muted-foreground">{s.label}</dt>
                    <dd className="mt-0.5 text-[18px] font-semibold tabular-nums">{s.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-muted-foreground">
                <LiveDot />
                Live <span aria-hidden="true">·</span> Updated {fmtTime(new Date(data.generatedAt))} IST
                {polledAt ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <NextCheck at={polledAt} />
                  </>
                ) : null}
              </p>
            </>
          ) : null}
        </section>

        {data ? (
          <>
            {open.length > 0 ? (
              <section aria-labelledby="open-incidents" className="mt-8 space-y-3">
                <h2 id="open-incidents" className="text-[18px] font-semibold">
                  Active incidents
                </h2>
                {open.map((i) => (
                  <Incident key={i.id} i={i} names={names} />
                ))}
              </section>
            ) : null}

            <section aria-labelledby="system-status" className="mt-8">
              <div className="flex items-center justify-between gap-3">
                <h2 id="system-status" className="text-[18px] font-semibold">
                  System status
                </h2>
                <fieldset className="m-0 inline-flex min-w-0 rounded-full border-0 bg-sunken p-0.5">
                  <legend className="sr-only">Date range</legend>
                  {([30, 90] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      aria-pressed={range === r}
                      onClick={() => setRange(r)}
                      className={cn(
                        "min-h-9 rounded-full px-3 text-[13.5px] font-medium focus-visible:outline-2 focus-visible:outline-accent",
                        range === r
                          ? "bg-surface-white text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {r / 30} {r === 30 ? "month" : "months"}
                    </button>
                  ))}
                </fieldset>
              </div>
              <p className="mt-1 text-[13.5px] text-muted-foreground">
                One bar per day, today on the right. Times are IST. Hover or tap a bar, or use the arrow keys, for that
                day.
              </p>
              <ul className="mt-3 divide-y divide-border-soft rounded-[16px] bg-surface-white shadow-[0_0_0_1px_var(--border)]">
                {data.systems.map((s) => (
                  <SystemGroup key={s.id} data={data} system={s} range={range} />
                ))}
              </ul>
              <ul
                className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-muted-foreground"
                aria-label="Legend"
              >
                {(Object.keys(TICK) as Tick[]).map((k) => (
                  <li key={k} className="inline-flex items-center gap-1.5">
                    <span className={cn("size-2.5 rounded-[2px]", TICK[k].bar)} aria-hidden="true" />
                    {TICK[k].word}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="maintenance" className="mt-8">
              <h2 id="maintenance" className="text-[18px] font-semibold">
                Upcoming scheduled maintenance
              </h2>
              {data.maintenance.length === 0 ? (
                <p className="mt-2 text-[14.5px] text-muted-foreground">No scheduled maintenance.</p>
              ) : (
                <ul className="mt-2 space-y-2.5">
                  {data.maintenance.map((m) => (
                    <li key={m.id} className="rounded-[12px] bg-accent-muted p-4">
                      <p className="text-[16px] font-semibold">
                        {m.title}
                        {m.state === "in_progress" ? (
                          <span className="ml-2 text-[13px] font-semibold text-accent">In progress</span>
                        ) : null}
                      </p>
                      <p className="mt-0.5 text-[13.5px] text-muted-foreground">
                        {stamp(m.startsAt)} to {stamp(m.endsAt)}
                        {m.systems.length ? ` · ${names(m.systems)}` : ""}
                      </p>
                      <p className="mt-1.5 whitespace-pre-line text-[14.5px]">{m.message}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {past.length > 0 ? (
              <section aria-labelledby="past-incidents" className="mt-8 space-y-3">
                <h2 id="past-incidents" className="text-[18px] font-semibold">
                  Past incidents
                </h2>
                {past.map((i) => (
                  <Incident key={i.id} i={i} names={names} />
                ))}
              </section>
            ) : null}
          </>
        ) : null}
      </div>
    </>
  );
}
