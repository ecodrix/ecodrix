/**
 * Screens for "Inside ERIX" (home) and the module tours (/platform/erix-crm,
 * -connect, -flow): server components driven by the Scene stepper, so each
 * plays only while on screen, pauses off it, and the server HTML (no JS,
 * reduced motion) is the finished frame. Redrawn from the SaaS: the CRM
 * contact timeline and invoice, the Flow canvas (FlowNode run states: done,
 * running, needs approval, skipped), Analytics (only the two live charts:
 * new contacts over time, open deal value by stage), a hosted form, Flow
 * templates and the website chat widget. Example data only.
 */

import type { ReactNode } from "react";
import { CheckCircle2, Clock, type IconComponent, Link2, MessageCircle, Sparkles, Workflow } from "@/components/icons";
import { Scene } from "@/components/motion/scene";
import { LiveDot } from "@/components/motion/surface";
import { cn } from "@/lib/utils";
import { AppFrame, Avatar, at, Bubble, Channel, Pill, Ticks, Typing } from "./parts";

const box = "rounded-[10px] bg-surface shadow-[var(--shadow-card)]";

/** Shows `a` until `step`, then `b` (the swap shares one grid cell). */
const swap = (a: ReactNode, b: ReactNode, step: number, end?: number) => (
  <span className="inline-grid *:[grid-area:1/1]">
    <span className="scene-in" style={at(0, step)}>
      {a}
    </span>
    <span className="scene-in" style={at(step, end)}>
      {b}
    </span>
  </span>
);

/* ── CRM: pipeline → contact timeline → proposal, GST invoice, paid ──── */

const crmEvents: { icon: IconComponent; ai?: boolean; text: string; time: string; step: number }[] = [
  { icon: MessageCircle, text: "WhatsApp: “Is the 3BHK at Baner still available?”", time: "Fri, 9:42 pm", step: 3 },
  { icon: Sparkles, ai: true, text: "AI agent answered from the Baner listing", time: "Fri, 9:42 pm", step: 4 },
  { icon: CheckCircle2, text: "Site visit booked for Sat, 11:30 am", time: "Fri, 9:44 pm", step: 5 },
  { icon: CheckCircle2, text: "Proposal PRO-0018 accepted on a phone", time: "Mon, 11:20 am", step: 6 },
];

export function CrmScreen() {
  return (
    <Scene
      steps={8}
      timing={[0, 1000, 1200, 900, 900, 900, 1200, 1100, 1300]}
      hold={3600}
      label="ERIX CRM: Rohan Mehta's deal moves from Enquiry to Site visit booked on the pipeline; his contact timeline fills with the WhatsApp enquiry, the AI agent's answer, the booked visit and the accepted proposal; then a GST invoice for ₹29,500 gets a Razorpay payment link and turns Paid."
    >
      <AppFrame title="CRM / Contacts / Rohan Mehta" nav="crm" className="h-[25rem]">
        <div className="flex h-full flex-col gap-2.5 overflow-hidden p-3">
          <div className="grid grid-cols-2 gap-2">
            {(["Enquiry", "Site visit booked"] as const).map((stage, i) => (
              <div key={stage} className="rounded-[10px] bg-sunken p-1.5">
                <p className="flex items-center justify-between px-1 pb-1.5 text-[11px] font-semibold text-foreground">
                  <span className="flex items-center gap-1.5">
                    <span
                      aria-hidden="true"
                      className={cn("size-1.5 rounded-full", i ? "bg-accent" : "bg-[var(--blue-500)]")}
                    />
                    {stage}
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {i ? swap("₹1,25,000", "₹3,10,000", 2) : swap("₹3,05,000", "₹1,20,000", 2)}
                  </span>
                </p>
                <div className="space-y-1.5">
                  <div className={cn(box, "p-2")}>
                    <p className="text-[11.5px] font-semibold text-foreground">{i ? "Ravi Kumar" : "Meera Iyer"}</p>
                    <p className="text-[10.5px] text-muted-foreground">
                      {i ? "Plot, Hinjewadi · ₹1,25,000" : "2BHK, Wakad · ₹1,20,000"}
                    </p>
                  </div>
                  {/* Rohan's card sits in both columns; only one shows at a time, so nothing reflows. */}
                  <div
                    style={i ? at(2) : at(0, 2)}
                    className={cn(box, "scene-in relative p-2", i && "scene-x ring-1 ring-accent-border")}
                  >
                    <p className="text-[11.5px] font-semibold text-foreground">Rohan Mehta</p>
                    <p className="text-[10.5px] text-muted-foreground">3BHK, Baner · ₹1,85,000</p>
                    {!i && (
                      <span
                        aria-hidden="true"
                        style={at(1, 2)}
                        className="scene-in pointer-events-none absolute inset-0 rounded-[10px] ring-2 ring-accent"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid min-h-0 flex-1 gap-2.5 md:grid-cols-[1.15fr_1fr]">
            <div className={cn(box, "min-h-0 p-2.5")}>
              <p className="flex items-center gap-2 text-[11.5px] font-semibold text-foreground">
                <Avatar name="Rohan Mehta" className="size-6 text-[9px]" /> Timeline
              </p>
              <ol className="mt-2 space-y-1.5">
                {crmEvents.map((e) => (
                  <li key={e.text} style={at(e.step)} className="scene-in flex gap-2">
                    <span
                      className={cn(
                        "mt-px grid size-5 shrink-0 place-items-center rounded-[6px]",
                        e.ai ? "bg-ai-subtle text-ai" : "bg-accent-muted text-accent",
                      )}
                    >
                      <e.icon aria-hidden="true" className="size-3" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[10.5px] leading-snug text-foreground">{e.text}</span>
                      <span className="block text-[9.5px] text-subtle">{e.time}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <div style={at(6)} className={cn(box, "scene-in hidden min-h-0 flex-col p-2.5 text-[10.5px] md:flex")}>
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-[10px] text-muted-foreground">INV/26-27/0042</p>
                <span className="inline-grid *:[grid-area:1/1] justify-items-end">
                  <Pill className="scene-in" style={at(0, 7)}>
                    Draft
                  </Pill>
                  <Pill tone="primary" icon={Link2} className="scene-in" style={at(7, 8)}>
                    Link sent
                  </Pill>
                  <Pill tone="success" icon={CheckCircle2} className="scene-in scene-pop" style={at(8)}>
                    Paid
                  </Pill>
                </span>
              </div>
              <p className="mt-1 text-[11px] font-semibold text-foreground">Booking advance · from PRO-0018</p>
              <dl className="mt-1.5 space-y-0.5 text-muted-foreground">
                {[
                  ["Subtotal", "₹25,000"],
                  ["CGST 9%", "₹2,250"],
                  ["SGST 9%", "₹2,250"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <dt>{k}</dt>
                    <dd className="tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-1.5 flex justify-between border-t border-border pt-1.5 text-[11.5px] font-semibold text-foreground">
                <span>Total</span>
                <span className="tabular-nums">₹29,500</span>
              </p>
              <p className="mt-auto flex items-center gap-1 pt-1.5 text-accent">
                <Link2 aria-hidden="true" className="size-3" /> Razorpay payment link
              </p>
            </div>
          </div>
        </div>
      </AppFrame>
    </Scene>
  );
}

/* ── Flow: the canvas, a run lighting the steps in turn ─────────────── */

/* ── Analytics: the two live charts ─────────────────────────────────── */

// New contacts per day, last 30 days (illustrative), summing to 142.
const daily = [2, 3, 3, 3, 4, 3, 4, 4, 5, 4, 4, 5, 5, 4, 5, 5, 6, 5, 5, 6, 6, 5, 6, 6, 7, 6, 6, 5, 6, 4];
const stages = [
  { name: "Enquiry", value: 305000, dot: "bg-[var(--blue-500)]" },
  { name: "Site visit booked", value: 310000, dot: "bg-accent" },
  { name: "Shortlisted", value: 240000, dot: "bg-[var(--purple-500)]" },
  { name: "Token paid", value: 185000, dot: "bg-[var(--blue-700)]" },
];
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export function AnalyticsScreen() {
  const max = Math.max(...daily);
  const pts = daily.map((v, i) => `${(i / (daily.length - 1)) * 100},${38 - (v / max) * 34}`);
  const top = Math.max(...stages.map((s) => s.value));
  return (
    <Scene
      steps={2}
      timing={[0, 1300, 1600]}
      hold={4200}
      label="ERIX Analytics: new contacts by day over the last 30 days, 142 in all, drawn as a rising line; and open deal value by stage: Enquiry ₹3,05,000, Site visit booked ₹3,10,000, Shortlisted ₹2,40,000 and Token paid ₹1,85,000, ₹10.4 lakh open in all."
    >
      <AppFrame
        title="CRM / Analytics"
        nav="crm"
        className="h-[25rem]"
        action={
          <span className="rounded-[6px] bg-sunken px-2 py-1 text-[10.5px] font-semibold text-foreground">30D</span>
        }
      >
        <div className="grid h-full content-start gap-2.5 overflow-hidden p-3 md:grid-cols-[1.25fr_1fr]">
          <div className={cn(box, "p-3")}>
            <p className="text-[11px] text-muted-foreground">New contacts by day</p>
            <p className="font-display text-[22px] leading-tight font-bold tabular-nums text-foreground">142</p>
            <p className="text-[10px] text-subtle">Last 30 days</p>
            <svg
              viewBox="0 0 100 40"
              preserveAspectRatio="none"
              className="scene-in scene-wipe mt-2 h-28 w-full"
              style={at(1)}
              aria-hidden="true"
            >
              <path d={`M0,40 L${pts.join(" L")} L100,40 Z`} fill="var(--blue-100)" />
              <path
                d={`M${pts.join(" L")}`}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={1.6}
                vectorEffect="non-scaling-stroke"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-1 flex justify-between text-[9.5px] text-subtle">
              <span>28 Sep</span>
              <span>13 Oct</span>
              <span>27 Oct</span>
            </p>
          </div>
          <div className={cn(box, "p-3")}>
            <p className="text-[11px] text-muted-foreground">Open deal value by stage</p>
            <p className="font-display text-[22px] leading-tight font-bold tabular-nums text-foreground">₹10.4 L</p>
            <ul className="mt-2.5 space-y-2">
              {stages.map((s) => (
                <li key={s.name}>
                  <p className="flex items-center justify-between gap-2 text-[10.5px]">
                    <span className="flex min-w-0 items-center gap-1.5 text-foreground">
                      <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", s.dot)} />
                      <span className="truncate">{s.name}</span>
                    </span>
                    <span className="tabular-nums text-muted-foreground">{inr(s.value)}</span>
                  </p>
                  <span className="mt-1 block h-1.5 rounded-full bg-sunken">
                    <span
                      className="scene-in scene-grow block h-full rounded-full bg-accent"
                      style={{ ...at(2), width: `${(s.value / top) * 100}%` }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AppFrame>
    </Scene>
  );
}

/* ── Forms: a shared link becomes a contact ─────────────────────────── */

const fields = [
  ["Your name", "Kavya Nair"],
  ["WhatsApp number", "+91 98450 12345"],
  ["Budget", "₹60 to 70 lakh"],
  ["Area", "Wakad"],
] as const;

export function FormScreen() {
  return (
    <Scene
      steps={3}
      timing={[0, 1300, 1200, 1400]}
      hold={3600}
      label="An ERIX hosted form, shared as a link: Kavya Nair fills in her name, WhatsApp number, budget and area and sends it; she appears in the owner's contacts at once, from the site visit form, and lands in the Enquiry stage."
    >
      <div className="surface-light grid h-[25rem] overflow-hidden rounded-[12px] bg-background text-foreground shadow-[var(--shadow-lg)] md:grid-cols-[1.2fr_1fr]">
        <div className="flex min-w-0 flex-col bg-surface p-4">
          <p className="text-[11px] text-subtle">Sharma Realty</p>
          <p className="font-display text-[17px] font-bold text-foreground">Book a free site visit</p>
          <div className="mt-3 space-y-2">
            {fields.map(([label, value]) => (
              <div key={label}>
                <p className="text-[10.5px] text-muted-foreground">{label}</p>
                <p className="mt-0.5 rounded-[6px] border border-border-strong px-2.5 py-1.5 text-[11.5px] text-foreground">
                  {value}
                </p>
              </div>
            ))}
          </div>
          <span className="relative mt-auto inline-flex w-full justify-center rounded-[8px] bg-accent py-2 text-[12px] font-semibold text-white">
            Send
            <span
              aria-hidden="true"
              style={at(1, 2)}
              className="scene-in scene-pop pointer-events-none absolute -inset-1 rounded-[10px] ring-2 ring-accent"
            />
          </span>
        </div>
        <div className="hidden min-w-0 flex-col border-l border-border p-4 md:flex">
          <p className="text-[12px] font-semibold text-foreground">Contacts · New</p>
          <ul className="mt-2 space-y-2 text-[11px]">
            <li style={at(2)} className={cn(box, "scene-in scene-x p-2 ring-1 ring-accent-border")}>
              <p className="flex items-center justify-between gap-1 font-semibold text-foreground">
                Kavya Nair <span className="text-[10px] font-normal text-subtle">Just now</span>
              </p>
              <p className="text-muted-foreground">From: Site visit form</p>
              <Pill tone="primary" className="scene-in mt-1.5" style={at(3)}>
                Added to Enquiry
              </Pill>
            </li>
            <li className={cn(box, "p-2")}>
              <p className="font-semibold text-foreground">Meera Iyer</p>
              <p className="text-muted-foreground">From: WhatsApp</p>
            </li>
            <li className={cn(box, "p-2")}>
              <p className="font-semibold text-foreground">Ravi Kumar</p>
              <p className="text-muted-foreground">From: WhatsApp</p>
            </li>
          </ul>
        </div>
      </div>
    </Scene>
  );
}

/* ── Flow templates: start from one, switch it on ────────────────────── */

const templates = [
  { name: "Welcome new enquiries", how: "New contact → WhatsApp welcome", icon: MessageCircle },
  { name: "Appointment reminders", how: "Before each booking → reminder", icon: Clock },
  { name: "Nudge when nobody replies", how: "Wait for a reply → follow-up", icon: Workflow },
  {
    name: "Sales agent: qualify a new enquiry",
    how: "New contact → AI agent, with approval",
    icon: Sparkles,
    ai: true,
  },
];

export function TemplatesScreen() {
  return (
    <Scene
      steps={2}
      timing={[0, 1400, 1400]}
      hold={3800}
      label="ERIX Flow templates: welcome new enquiries, appointment reminders, a nudge when nobody replies, and the sales agent qualifying a new enquiry. The owner picks Appointment reminders and switches it on."
    >
      <AppFrame title="Connect / WhatsApp / Templates" nav="connect" className="h-[25rem]">
        <div className="grid h-full content-start gap-2.5 overflow-hidden p-3 sm:grid-cols-2">
          {templates.map((t, i) => (
            <div key={t.name} className={cn(box, "relative flex flex-col p-3")}>
              <span
                className={cn(
                  "grid size-7 place-items-center rounded-[8px]",
                  t.ai ? "bg-ai-subtle text-ai" : "bg-accent-muted text-accent",
                )}
              >
                <t.icon aria-hidden="true" className="size-3.5" />
              </span>
              <p className="mt-2 text-[12px] font-semibold text-foreground">{t.name}</p>
              <p className="mt-0.5 text-[10.5px] text-muted-foreground">{t.how}</p>
              <span className="mt-2.5">
                {i === 1 ? (
                  swap(
                    <span className="relative inline-flex rounded-[6px] border border-border-strong px-2 py-1 text-[10.5px] font-semibold text-foreground">
                      Use template
                      <span
                        aria-hidden="true"
                        style={at(1, 2)}
                        className="scene-in scene-pop pointer-events-none absolute -inset-1 rounded-[8px] ring-2 ring-accent"
                      />
                    </span>,
                    <Pill tone="success">
                      <LiveDot className="mr-0.5" /> On
                    </Pill>,
                    2,
                  )
                ) : (
                  <span className="inline-flex rounded-[6px] border border-border-strong px-2 py-1 text-[10.5px] font-semibold text-foreground">
                    Use template
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </AppFrame>
    </Scene>
  );
}

/* ── The website chat widget, as a visitor sees it ───────────────────── */

export function WidgetScreen() {
  return (
    <Scene
      steps={5}
      timing={[0, 1000, 1300, 1100, 1300, 1500]}
      hold={3600}
      label="The ERIX chat widget on a business website: it greets the visitor, asks for her name and number with consent, she asks about a 2BHK in Wakad, the reply is typed live and labelled AI, and her message shows WhatsApp-style ticks."
    >
      <div className="surface-light relative h-[25rem] overflow-hidden rounded-[12px] bg-background shadow-[var(--shadow-lg)]">
        <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
          <span className="grid size-6 place-items-center rounded-[6px] bg-accent text-[10px] font-bold text-white">
            SR
          </span>
          <span className="text-[12px] font-semibold text-foreground">Sharma Realty</span>
          <span className="ml-auto hidden gap-3 text-[11px] text-muted-foreground sm:flex">
            <span>Projects</span>
            <span>Site visits</span>
            <span>Contact</span>
          </span>
        </div>
        <div aria-hidden="true" className="space-y-2 p-4">
          <span className="block h-4 w-2/5 rounded bg-sunken" />
          <span className="block h-2.5 w-3/5 rounded bg-sunken" />
          <span className="block h-2.5 w-1/2 rounded bg-sunken" />
        </div>
        <div className="absolute right-3 bottom-3 left-3 flex flex-col overflow-hidden rounded-[12px] bg-surface shadow-[var(--shadow-lg)] sm:left-auto sm:w-[17.5rem]">
          <div className="flex items-center gap-2 bg-accent px-3 py-2 text-white">
            <span className="grid size-6 place-items-center rounded-full bg-white/20 text-[10px] font-bold">SR</span>
            <span className="text-[12px] font-semibold text-white">Chat with Sharma Realty</span>
          </div>
          <div className="space-y-1.5 bg-background p-2.5">
            <Bubble show={at(1)} className="max-w-[92%] text-[11.5px]">
              Hi! Looking for a home in Pune? Ask me anything.
            </Bubble>
            <div style={at(2)} className={cn(box, "scene-in space-y-1 p-2 text-[10.5px]")}>
              <p className="font-semibold text-foreground">Before we chat</p>
              <p className="rounded-[6px] border border-border-strong px-2 py-1 text-foreground">Kavya Nair</p>
              <p className="rounded-[6px] border border-border-strong px-2 py-1 text-foreground">+91 98450 12345</p>
              <p className="flex items-center gap-1 text-muted-foreground">
                <CheckCircle2 aria-hidden="true" className="size-3 text-accent" /> OK to contact me about my enquiry
              </p>
            </div>
            <div
              style={at(3)}
              className="scene-in ml-auto w-fit max-w-[88%] rounded-[10px] border border-accent-border bg-accent-muted px-2.5 py-1.5 text-[11.5px] text-foreground"
            >
              Any 2BHK near Wakad under ₹70 lakh?
              <span className="mt-0.5 flex items-center justify-end gap-1 text-[9.5px] text-subtle">
                9:47 pm <Ticks from={3} />
              </span>
            </div>
            <div className="inline-grid *:[grid-area:1/1] w-full">
              <Typing show={at(4, 5)} className="mr-auto ml-0" />
              <Bubble ai show={at(5)} className="max-w-[92%] text-[11.5px]">
                Yes, two 2BHK flats in Wakad fit that budget. Shall I book a visit for Saturday?
              </Bubble>
            </div>
          </div>
          <p className="flex items-center gap-1 border-t border-border bg-surface px-2.5 py-1.5 text-[10.5px] text-subtle">
            <Channel name="web" className="text-[10px]" />
            <span className="ml-auto">Type a message…</span>
          </p>
        </div>
      </div>
    </Scene>
  );
}
