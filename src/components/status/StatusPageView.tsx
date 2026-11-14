"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { SubscribeButton } from "@/components/status/SubscribeDialog";
import { buttonVariants } from "@/components/ui/button";
import { WHATSAPP_CTA } from "@/lib/site";
import { fmtDay, fmtIsoDay, fmtPct, fmtTime } from "@/lib/status";
import {
  type Overall,
  readStatusPage,
  type StatusIncident,
  type StatusPayload,
  type Tick,
} from "@/lib/status-page";
import { cn } from "@/lib/utils";

const HELP_HREF = `${WHATSAPP_CTA.href}?text=${encodeURIComponent("ERIX problem report: ")}`;

/** Colour and a word for every state: colour is never the only signal. */
const TICK: Record<Tick, { word: string; bar: string; text: string }> = {
  operational: { word: "Operational", bar: "bg-success", text: "text-success" },
  degraded: { word: "Degraded", bar: "bg-warning", text: "text-warning" },
  down: { word: "Outage", bar: "bg-error", text: "text-error" },
  maintenance: { word: "Maintenance", bar: "bg-accent", text: "text-accent" },
  nodata: { word: "No data", bar: "bg-border-strong", text: "text-subtle" },
};

const BANNER: Record<Overall, { title: string; body: string; icon: "circle-check" | "triangle-alert" | "circle-x" | "wrench"; tone: string }> = {
  operational: { title: "We're fully operational", body: "We're not aware of any issues affecting our systems.", icon: "circle-check", tone: "bg-success-subtle text-success" },
  degraded: { title: "Some systems are degraded", body: "We're aware and working on it. Details below.", icon: "triangle-alert", tone: "bg-warning-subtle text-warning" },
  outage: { title: "We have a service disruption", body: "We're working on it. Details below.", icon: "circle-x", tone: "bg-error-subtle text-error" },
  maintenance: { title: "Scheduled maintenance in progress", body: "Some systems may be briefly unavailable.", icon: "wrench", tone: "bg-accent-muted text-accent" },
};

const IMPACT = { minor: "Minor", major: "Major", outage: "Outage" } as const;
const STATE = { investigating: "Investigating", identified: "Identified", monitoring: "Monitoring", resolved: "Resolved" } as const;
const stamp = (iso: string) => `${fmtDay(new Date(iso))}, ${fmtTime(new Date(iso))} IST`;

function Ticks({ name, days, range }: { name: string; days: { date: string; state: Tick }[]; range: 30 | 90 }) {
  const shown = days.slice(-range);
  const counts = shown.reduce<Record<string, number>>((a, d) => ({ ...a, [d.state]: (a[d.state] ?? 0) + 1 }), {});
  const summary = (Object.keys(TICK) as Tick[])
    .filter((k) => counts[k])
    .map((k) => `${counts[k]} ${TICK[k].word.toLowerCase()}`)
    .join(", ");
  return (
    <>
      <div className="flex h-8 items-stretch gap-px" role="img" aria-label={`${name}, last ${shown.length} days: ${summary}`}>
        {shown.map((d) => (
          <span
            key={d.date}
            title={`${fmtIsoDay(d.date)}: ${TICK[d.state].word}`}
            className={cn("min-w-[2px] flex-1 rounded-[1px]", TICK[d.state].bar)}
          />
        ))}
      </div>
    </>
  );
}

function SystemRow({ system, range }: { system: StatusPayload["systems"][number]; range: 30 | 90 }) {
  const [open, setOpen] = useState(false);
  const t = TICK[system.status];
  const pct = fmtPct(system.uptimePct);
  return (
    <li className="py-4">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <h3 className="text-[16px] font-semibold">{system.name}</h3>
        <p className="flex items-center gap-3 text-[14px]">
          <span className={cn("font-semibold", t.text)}>{t.word}</span>
          <span className="text-muted-foreground">{pct ? `${pct} uptime` : "No uptime data yet"}</span>
        </p>
      </div>
      <div className="mt-2.5">
        <Ticks name={system.name} days={system.days} range={range} />
        <div className="mt-1 flex justify-between text-[12px] text-subtle" aria-hidden="true">
          <span>{range} days ago</span>
          <span>Today</span>
        </div>
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`comp-${system.id}`}
        onClick={() => setOpen((v) => !v)}
        className="-ml-2 mt-1 inline-flex min-h-9 items-center gap-1 rounded-[8px] px-2 text-[13.5px] font-medium text-muted-foreground hover:bg-sunken hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
      >
        <Icon name="chevron-down" size={14} variant="line" className={cn("transition-transform", open && "rotate-180")} />
        {system.components.length} component{system.components.length === 1 ? "" : "s"}
      </button>
      {open ? (
        <ul id={`comp-${system.id}`} className="mt-1 divide-y divide-border-soft rounded-[12px] bg-sunken px-3">
          {system.components.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3 py-2 text-[14px]">
              <span>{c.name}</span>
              <span className="flex items-center gap-3">
                <span className={cn("font-medium", TICK[c.status].text)}>{TICK[c.status].word}</span>
                <span className="w-20 text-right text-muted-foreground">{fmtPct(c.uptimePct) ?? "-"}</span>
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function Incident({ i, names }: { i: StatusIncident; names: (ids: string[]) => string }) {
  return (
    <article className="rounded-[12px] bg-surface-white p-4 shadow-[0_0_0_1px_var(--border)]">
      <h3 className="text-[16px] font-semibold">{i.title}</h3>
      <p className="mt-0.5 text-[13.5px] text-muted-foreground">
        {IMPACT[i.impact]} impact{i.systems.length ? ` · ${names(i.systems)}` : ""} · {i.resolvedAt ? "Resolved" : STATE[i.status]}
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

/** status.ecodrix.com: banner, actions, systems with daily ticks, incidents, maintenance. Times in IST. */
export function StatusPageView({ initial }: { initial: StatusPayload | null }) {
  const [data, setData] = useState(initial);
  const [range, setRange] = useState<30 | 90>(90);

  useEffect(() => {
    const load = async () => {
      const next = await readStatusPage({ cache: "no-store" });
      if (next) setData(next);
    };
    if (!initial) void load();
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, [initial]);

  const names = (ids: string[]) => ids.map((id) => data?.systems.find((s) => s.id === id)?.name ?? id).join(", ");
  const banner = data ? BANNER[data.overall] : null;
  const open = data?.incidents.filter((i) => !i.resolvedAt) ?? [];
  const past = data?.incidents.filter((i) => i.resolvedAt) ?? [];

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <section
        aria-live="polite"
        className={cn("flex items-start gap-3 rounded-[16px] p-4 sm:p-5", banner?.tone ?? "bg-sunken text-foreground")}
      >
        <Icon name={banner?.icon ?? "triangle-alert"} size={24} variant="duo" className="mt-0.5 shrink-0" />
        <div>
          <h1 className="text-[20px] font-semibold leading-tight tracking-[-0.01em] sm:text-[22px]">
            {banner?.title ?? "We can't reach the status service"}
          </h1>
          <p className="mt-1 text-[14.5px] opacity-90">
            {banner?.body ?? "This page can't load live data right now. ERIX itself may be fine. Try again in a minute, or message us."}
          </p>
        </div>
      </section>

      <div className="mt-4 flex flex-wrap gap-2.5">
        <a href={HELP_HREF} target="_blank" rel="noopener" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          <Icon name="message-circle" size={16} variant="line" />
          Report a problem
          <span className="sr-only"> (opens WhatsApp in a new tab)</span>
        </a>
        <SubscribeButton />
      </div>

      {data ? (
        <>
          {open.length > 0 ? (
            <section aria-labelledby="open-incidents" className="mt-7 space-y-3">
              <h2 id="open-incidents" className="text-[18px] font-semibold">Active incidents</h2>
              {open.map((i) => (
                <Incident key={i.id} i={i} names={names} />
              ))}
            </section>
          ) : null}

          <section aria-labelledby="system-status" className="mt-7">
            <div className="flex items-center justify-between gap-3">
              <h2 id="system-status" className="text-[18px] font-semibold">System status</h2>
              <fieldset className="m-0 inline-flex min-w-0 rounded-[8px] border-0 bg-sunken p-0.5">
                <legend className="sr-only">Date range</legend>
                {([30, 90] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    aria-pressed={range === r}
                    onClick={() => setRange(r)}
                    className={cn(
                      "min-h-9 rounded-[6px] px-3 text-[13.5px] font-medium focus-visible:outline-2 focus-visible:outline-accent",
                      range === r ? "bg-surface-white text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {r / 30} {r === 30 ? "month" : "months"}
                  </button>
                ))}
              </fieldset>
            </div>
            <ul className="mt-1 divide-y divide-border-soft">
              {data.systems.map((s) => (
                <SystemRow key={s.id} system={s} range={range} />
              ))}
            </ul>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-muted-foreground" aria-label="Legend">
              {(Object.keys(TICK) as Tick[]).map((k) => (
                <li key={k} className="inline-flex items-center gap-1.5">
                  <span className={cn("size-2.5 rounded-[2px]", TICK[k].bar)} aria-hidden="true" />
                  {TICK[k].word}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="maintenance" className="mt-7">
            <h2 id="maintenance" className="text-[18px] font-semibold">Upcoming scheduled maintenance</h2>
            {data.maintenance.length === 0 ? (
              <p className="mt-2 text-[14.5px] text-muted-foreground">No scheduled maintenance.</p>
            ) : (
              <ul className="mt-2 space-y-2.5">
                {data.maintenance.map((m) => (
                  <li key={m.id} className="rounded-[12px] bg-accent-muted p-4">
                    <p className="text-[16px] font-semibold">
                      {m.title}
                      {m.state === "in_progress" ? <span className="ml-2 text-[13px] font-semibold text-accent">In progress</span> : null}
                    </p>
                    <p className="mt-0.5 text-[13.5px] text-muted-foreground">
                      {stamp(m.startsAt)} to {stamp(m.endsAt)}{m.systems.length ? ` · ${names(m.systems)}` : ""}
                    </p>
                    <p className="mt-1.5 whitespace-pre-line text-[14.5px]">{m.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {past.length > 0 ? (
            <section aria-labelledby="past-incidents" className="mt-7 space-y-3">
              <h2 id="past-incidents" className="text-[18px] font-semibold">Past incidents</h2>
              {past.map((i) => (
                <Incident key={i.id} i={i} names={names} />
              ))}
            </section>
          ) : null}
          <p className="mt-8 text-[12.5px] text-subtle">
            Updated {stamp(data.generatedAt)}. Times are India Standard Time (IST).
          </p>
        </>
      ) : null}
    </div>
  );
}
