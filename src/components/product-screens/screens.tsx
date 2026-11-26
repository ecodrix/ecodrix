/**
 * Coded mocks of the real ERIX screens (redrawn from the SaaS: the AI's
 * knowledge and approvals, an invoice, the public booking page, documents,
 * a broadcast). Shared by the home product tour and /platform.
 * Each loops only while on screen (Scene); data is example data. The inbox,
 * pipeline and Flow editor are live demos people can use (components/demos).
 */

import type { CSSProperties, ReactNode } from "react";
import { CheckCircle2, Clock, Link2, MessageCircle, Send, Sparkles } from "@/components/icons";
import { Scene } from "@/components/motion/scene";
import { FlowEditorDemo } from "@/components/product-screens/flow-editor-demo";
import { InboxDemo } from "@/components/product-screens/inbox-demo";
import { CoachingInbox, LocalBrandInbox } from "@/components/product-screens/inbox-variants";
import { AppFrame, at, Pill } from "@/components/product-screens/parts";
import { PipelineDemo } from "@/components/product-screens/pipeline-demo";
import { CrmScreen } from "@/components/product-screens/showcase-scenes";
import { VoiceCallScreen } from "@/components/product-screens/voice-scene";
import type { ScreenKey } from "@/lib/platform/product-pages";
import { cn } from "@/lib/utils";

const box = "rounded-[10px] bg-surface shadow-[var(--shadow-card)]";

/** A ring that "presses" a button for one step. */
function Press({ show }: { show: CSSProperties }) {
  return (
    <span
      aria-hidden="true"
      style={show}
      className="scene-in scene-pop pointer-events-none absolute -inset-1 rounded-[6px] ring-2 ring-accent"
    />
  );
}

/* ── AI: knowledge + approvals ─────────────────────────────────────────── */

export function AiScreen() {
  return (
    <Scene
      steps={5}
      timing={[0, 1300, 1300, 1500, 900]}
      label="ERIX AI: a new knowledge source is read and becomes ready, the latest draft shows the source it came from, and on the Approvals page the sales agent's request to book an appointment waits for a person and is approved."
    >
      <AppFrame title="Approvals" nav="approvals" className="h-[25rem]">
        <div className="grid h-full gap-3 overflow-hidden p-3 sm:p-4 @2xl:grid-cols-[1fr_1.5fr]">
          <div className={cn(box, "hidden p-3 @2xl:block")}>
            <p className="text-[12px] font-semibold text-foreground">AI knowledge</p>
            <ul className="mt-2 space-y-2 text-[11px]">
              <li className="flex items-center justify-between gap-2">
                <span className="truncate text-foreground">Office hours and prices</span>
                <Pill tone="success">Ready</Pill>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="truncate text-foreground">Baner listing</span>
                <span className="inline-grid *:[grid-area:1/1] justify-items-end">
                  <Pill tone="primary" className="scene-in" style={at(0, 2)}>
                    Reading
                  </Pill>
                  <Pill tone="success" className="scene-in scene-pop" style={at(2)}>
                    Ready
                  </Pill>
                </span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="truncate text-foreground">Refund policy</span>
                <Pill tone="success">Ready</Pill>
              </li>
            </ul>
            <p className="mt-4 text-[11px] text-muted-foreground">Latest draft</p>
            <p className="mt-1 rounded-[6px] border border-border-strong px-2 py-1.5 text-[11px] text-foreground">
              Is parking included?
            </p>
            <p style={at(3)} className="scene-in mt-2 text-[11px] text-muted-foreground">
              From: <span className="font-semibold text-foreground">Baner listing</span>
            </p>
          </div>
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-[10px] bg-[var(--brand-purple)] p-2.5 text-white">
                <p className="text-[11px] text-white/85">AI drafts to review</p>
                <p className="mt-1 font-display text-xl font-bold text-white">2</p>
              </div>
              <div className="rounded-[10px] bg-[var(--brand-blue)] p-2.5 text-white">
                <p className="text-[11px] text-white/85">Automations on hold</p>
                <p className="inline-grid *:[grid-area:1/1] mt-1 font-display text-xl font-bold text-white">
                  <span className="scene-in" style={at(0, 5)}>
                    1
                  </span>
                  <span className="scene-in" style={at(5)}>
                    0
                  </span>
                </p>
              </div>
            </div>
            <div className={cn(box, "p-3")}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[12px] font-semibold text-foreground">Sales agent: qualify a new enquiry</span>
                <span className="inline-grid *:[grid-area:1/1]">
                  <Pill tone="warning" icon={Clock} className="scene-in" style={at(0, 5)}>
                    Waiting for approval
                  </Pill>
                  <Pill tone="success" icon={CheckCircle2} className="scene-in scene-pop" style={at(5)}>
                    Approved
                  </Pill>
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Contact: Meera Iyer</p>
              <div className="mt-2 rounded-[10px] border border-[var(--purple-500)] bg-ai-subtle p-2.5 text-[11px]">
                <p className="flex items-center gap-1 font-semibold text-foreground">
                  <Sparkles aria-hidden="true" className="size-3 text-ai" /> The assistant wants to: Book appointment
                </p>
                <dl className="mt-1.5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 text-muted-foreground">
                  <dt>Day</dt>
                  <dd className="text-foreground">Saturday</dd>
                  <dt>Time</dt>
                  <dd className="text-foreground">11:30 am</dd>
                </dl>
              </div>
              <div className="inline-grid *:[grid-area:1/1] mt-3 w-full">
                <span style={at(0, 5)} className="scene-in flex flex-wrap justify-end gap-2">
                  <span className="rounded-[6px] border border-error px-2.5 py-1 text-[11px] font-semibold text-error">
                    Stop
                  </span>
                  <span className="relative rounded-[6px] bg-accent px-2.5 py-1 text-[11px] font-semibold text-white">
                    Approve
                    <Press show={at(4, 5)} />
                  </span>
                </span>
                <p style={at(5)} className="scene-in text-right text-[11px] text-accent">
                  Appointment booked.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AppFrame>
    </Scene>
  );
}

/* ── Invoice ───────────────────────────────────────────────────────────── */

export function InvoiceScreen() {
  return (
    <Scene
      steps={4}
      timing={[0, 1400, 1400, 1400, 1600]}
      label="An ERIX GST invoice for ₹29,500: ₹25,000 plus 9% CGST and 9% SGST. A Razorpay payment link is created, the invoice is sent on WhatsApp, and it turns Paid when the money lands."
    >
      <AppFrame
        title="CRM / Invoices / INV/26-27/0042"
        nav="crm"
        className="h-[25rem]"
        action={
          <span className="inline-grid *:[grid-area:1/1] justify-items-end">
            <Pill className="scene-in" style={at(0, 2)}>
              Draft
            </Pill>
            <Pill tone="primary" icon={Send} className="scene-in" style={at(2, 4)}>
              Sent
            </Pill>
            <Pill tone="success" icon={CheckCircle2} className="scene-in scene-pop" style={at(4)}>
              Paid
            </Pill>
          </span>
        }
      >
        <div className="grid h-full gap-3 overflow-hidden p-3 sm:p-4 @2xl:grid-cols-[1fr_1.25fr]">
          <div className="hidden space-y-2.5 text-[11px] @2xl:block">
            <p className="flex items-center gap-1 rounded-[6px] bg-accent-muted px-2 py-1 text-accent">
              <CheckCircle2 aria-hidden="true" className="size-3" /> From proposal PRO-0018, accepted on a phone
            </p>
            <div>
              <p className="text-muted-foreground">Bill to</p>
              <p className="mt-1 rounded-[6px] border border-border-strong bg-surface px-2 py-1.5 text-foreground">
                Rohan Mehta
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Place of supply</p>
              <p className="mt-1 rounded-[6px] border border-border-strong bg-surface px-2 py-1.5 text-foreground">
                27 · Maharashtra
              </p>
              <p className="mt-1 text-subtle">Same state as yours: CGST + SGST. Another state: IGST.</p>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="relative inline-flex items-center gap-1 rounded-[6px] border border-border-strong bg-surface px-2 py-1 font-semibold text-foreground">
                <Link2 aria-hidden="true" className="size-3" /> Create payment link
                <Press show={at(1, 2)} />
              </span>
              <span className="relative inline-flex items-center gap-1 rounded-[6px] border border-border-strong bg-surface px-2 py-1 font-semibold text-foreground">
                <MessageCircle aria-hidden="true" className="size-3" /> Send on WhatsApp
                <Press show={at(2, 3)} />
              </span>
            </div>
          </div>
          <div className={cn(box, "flex flex-col p-3 text-[11px]")}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[13px] font-bold text-foreground">Sharma Realty</p>
                <p className="text-subtle">Pune · GSTIN 27ABCDE1234F1Z5</p>
              </div>
              <p className="font-display text-[13px] font-bold text-foreground">TAX INVOICE</p>
            </div>
            <div className="mt-2.5 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 border-y border-border py-2 text-muted-foreground">
              <span className="text-foreground">Booking advance, 3BHK Baner</span>
              <span className="tabular-nums text-foreground">₹25,000</span>
              <span>CGST 9%</span>
              <span className="tabular-nums">₹2,250</span>
              <span>SGST 9%</span>
              <span className="tabular-nums">₹2,250</span>
            </div>
            <p className="mt-2 flex justify-between text-[13px] font-semibold text-foreground">
              <span>Total</span>
              <span className="tabular-nums">₹29,500</span>
            </p>
            <p className="mt-1 text-subtle">Rupees Twenty Nine Thousand Five Hundred Only</p>
            <div className="inline-grid *:[grid-area:1/1] mt-auto w-full pt-2">
              <p style={at(1, 4)} className="scene-in flex items-center gap-1 text-accent">
                <Link2 aria-hidden="true" className="size-3" /> Razorpay payment link ready
              </p>
              <p style={at(4)} className="scene-in flex items-center gap-1 font-semibold text-foreground">
                <CheckCircle2 aria-hidden="true" className="size-3 text-success" /> Paid ₹29,500, marked the moment it
                landed
              </p>
            </div>
          </div>
        </div>
      </AppFrame>
    </Scene>
  );
}

/* ── Booking page (what the customer sees) ─────────────────────────────── */

const days = [
  ["Thu", "26"],
  ["Fri", "27"],
  ["Sat", "28"],
  ["Sun", "29"],
  ["Mon", "30"],
] as const;
const slots = ["10:00 am", "10:45 am", "11:30 am", "12:15 pm"];

const SALES = {
  biz: "Sharma Realty",
  title: "Book a site visit",
  where: "30 minutes · at the project site",
  what: "Site visit",
  prev: "Meera Iyer",
  who: "Rohan Mehta",
};
const CLINIC = {
  biz: "Rao Dental Clinic",
  title: "Book a check-up",
  where: "30 minutes · at the clinic",
  what: "Check-up",
  prev: "Arjun Rao",
  who: "Sneha Rao",
};

export const ClinicBookingScreen = () => <BookingScreen {...CLINIC} />;

export function BookingScreen({ biz, title, where, what, prev, who }: Partial<typeof SALES> = SALES) {
  return (
    <Scene
      steps={3}
      timing={[0, 1200, 1300, 1500]}
      label="An ERIX booking page: the visitor picks Saturday 28 November and the 11:30 am slot in India Standard Time; 12:15 pm is already taken. The booking is confirmed and appears in the owner's upcoming appointments."
    >
      <div className="surface-light @container flex h-[25rem] overflow-hidden rounded-[12px] bg-background text-foreground shadow-[var(--shadow-lg)]">
        <div className="flex min-w-0 flex-[1.35_1_0%] flex-col bg-surface p-4">
          <p className="text-[11px] text-subtle">{biz}</p>
          <p className="font-display text-[17px] font-bold text-foreground">{title}</p>
          <p className="text-[11px] text-muted-foreground">{where}</p>
          <div className="mt-3 grid grid-cols-5 gap-1.5">
            {days.map(([d, n]) => (
              <span
                key={n}
                className="relative rounded-[6px] border border-border py-1.5 text-center text-[11px] text-muted-foreground"
              >
                {d}
                <span className="block text-[13px] font-semibold text-foreground">{n}</span>
                {n === "28" && (
                  <span
                    aria-hidden="true"
                    style={at(1)}
                    className="scene-in scene-pop absolute -inset-px rounded-[6px] border-2 border-accent bg-accent-muted/40"
                  />
                )}
              </span>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {slots.map((s) => (
              <span
                key={s}
                className={cn(
                  "relative rounded-[6px] border py-2 text-center text-[11px] font-semibold",
                  s === "12:15 pm" ? "border-border text-subtle line-through" : "border-border-strong text-foreground",
                )}
              >
                {s === "12:15 pm" ? "12:15 pm · booked" : s}
                {s === "11:30 am" && (
                  <span
                    aria-hidden="true"
                    style={at(2)}
                    className="scene-in scene-pop absolute -inset-px flex items-center justify-center rounded-[6px] bg-accent text-white"
                  >
                    11:30 am
                  </span>
                )}
              </span>
            ))}
          </div>
          <div className="inline-grid *:[grid-area:1/1] mt-auto w-full pt-3">
            <p style={at(0, 3)} className="scene-in text-[11px] text-subtle">
              Times in India Standard Time
            </p>
            <p
              style={at(3)}
              className="scene-in flex items-start gap-1.5 rounded-[10px] bg-accent-muted p-2 text-[11px] text-foreground"
            >
              <CheckCircle2 aria-hidden="true" className="mt-px size-3.5 shrink-0 text-success" />
              <span>
                <span className="font-semibold">Booked: Sat 28 Nov, 11:30 am IST.</span>
              </span>
            </p>
          </div>
        </div>
        <div className="hidden min-w-0 flex-[1_1_0%] border-l border-border p-4 @2xl:block">
          <p className="text-[12px] font-semibold text-foreground">Appointments · Upcoming</p>
          <ul className="mt-2 space-y-2 text-[11px]">
            <li className={cn(box, "p-2")}>
              <p className="font-semibold text-foreground">{prev}</p>
              <p className="text-muted-foreground">{what} · Fri 27 Nov, 10:00 am</p>
            </li>
            <li style={at(3)} className={cn(box, "scene-in scene-x border-accent-border p-2")}>
              <p className="flex items-center justify-between gap-1 font-semibold text-foreground">
                {who} <Pill tone="success">Scheduled</Pill>
              </p>
              <p className="text-muted-foreground">{what} · Sat 28 Nov, 11:30 am</p>
            </li>
          </ul>
        </div>
      </div>
    </Scene>
  );
}

/* ── Project documents + click-to-sign (CRM projects / Storage) ──────── */

const docStatus = (
  <span className="inline-grid *:[grid-area:1/1] justify-items-end">
    <Pill tone="warning" icon={Clock} className="scene-in" style={at(0, 2)}>
      Waiting for Ananya
    </Pill>
    <Pill tone="primary" className="scene-in" style={at(2, 4)}>
      Your turn to sign
    </Pill>
    <Pill tone="success" icon={CheckCircle2} className="scene-in scene-pop" style={at(4)}>
      Signed
    </Pill>
  </span>
);

export function DocumentsScreen() {
  return (
    <Scene
      steps={4}
      timing={[0, 1300, 1400, 1100, 1600]}
      label="A project in ERIX with its documents. The client signs the quotation in her portal, then the business signs; the file turns Signed with an audit seal. Other files are shared with the client."
    >
      <AppFrame
        title="CRM / Projects / 2BHK interiors, Vijay Nagar"
        nav="crm"
        className="h-[25rem]"
        action={<Pill tone="success">Active</Pill>}
      >
        <div className="grid h-full gap-3 overflow-hidden p-3 sm:p-4 @2xl:grid-cols-[1.4fr_1fr]">
          <div className="min-w-0 space-y-2.5">
            <div className={cn(box, "p-3")}>
              <p className="flex justify-between text-[11px] text-muted-foreground">
                <span>Overall progress</span>
                <span>2 of 5 tasks done</span>
              </p>
              <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-background">
                <span className="block h-full w-2/5 rounded-full bg-accent" />
              </span>
            </div>
            <p className="pt-1 text-[12px] font-semibold text-foreground">Documents</p>
            <div className={cn(box, "relative p-3")}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="truncate text-[12px] font-semibold text-foreground">Quotation 2BHK interiors.pdf</span>
                {docStatus}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">Client signs first, then you</p>
              <span className="relative mt-2 inline-flex">
                <span
                  style={at(2, 4)}
                  className="scene-in rounded-[6px] bg-accent px-2.5 py-1 text-[11px] font-semibold text-white"
                >
                  Sign
                </span>
                <Press show={at(3, 4)} />
              </span>
            </div>
            <div className={cn(box, "flex items-center justify-between gap-2 p-3")}>
              <span className="truncate text-[12px] text-foreground">Floor plan.png</span>
              <Pill>Shared with client</Pill>
            </div>
            <div className={cn(box, "flex items-center justify-between gap-2 p-3")}>
              <span className="truncate text-[12px] text-foreground">Work order.pdf</span>
              <Pill tone="success" icon={CheckCircle2}>
                Signed
              </Pill>
            </div>
          </div>
          <div className={cn(box, "hidden min-w-0 flex-col p-3 @2xl:flex")}>
            <p className="text-[12px] font-semibold text-foreground">Client portal</p>
            <p className="mt-1 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
              Ananya Rao <Pill tone="success">Active</Pill>
            </p>
            <ul className="mt-3 space-y-2 text-[11px]">
              <li style={at(2)} className="scene-in rounded-[10px] bg-background p-2 text-foreground">
                Ananya signed the quotation on her phone
              </li>
              <li style={at(4)} className="scene-in rounded-[10px] bg-accent-muted p-2 text-foreground">
                You signed. Audit seal added to the PDF.
              </li>
            </ul>
            <p className="mt-auto pt-3 text-[11px] text-subtle">Click-to-sign with an audit seal. Not Aadhaar eSign.</p>
          </div>
        </div>
      </AppFrame>
    </Scene>
  );
}

/* ── WhatsApp broadcast (CRM → Connect) ────────────────────────────────── */

export function BroadcastScreen() {
  return (
    <Scene
      steps={4}
      timing={[0, 1300, 1300, 1500, 1600]}
      label="An ERIX WhatsApp broadcast: the Diwali offer template, approved by WhatsApp, goes to the 1,186 customers tagged diwali, and the broadcast finishes. Meta bills the business directly, with no ERIX markup."
    >
      <AppFrame title="Flow / Campaigns / New broadcast" nav="flow" className="h-[25rem]">
        <div className="flex h-full flex-col gap-3 overflow-hidden p-3 sm:p-4">
          <div className={cn(box, "p-3")}>
            <p className="text-[11px] text-subtle">Template · approved by WhatsApp</p>
            <p className="mt-1 text-[12px] font-semibold text-foreground">diwali_offer</p>
            <p className="mt-1 rounded-[10px] bg-background p-2 text-[12px] text-foreground">
              Silk sarees from ₹2,499, this week only. Reply here to see the colours.
            </p>
          </div>
          <div className={cn(box, "p-3")}>
            <p className="text-[11px] text-subtle">Audience</p>
            <p className="mt-1 text-[12px] text-foreground">
              Deal status <span className="font-semibold">All contacts</span> · Tag{" "}
              <span className="font-semibold">diwali</span>
            </p>
            <p style={at(1)} className="scene-in mt-2 flex flex-wrap items-center gap-2 text-[12px] text-foreground">
              <Pill tone="primary">1,186 will get this</Pill>
            </p>
          </div>
          <div className={cn(box, "mt-auto p-3")}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[12px] font-semibold text-foreground">Diwali festive offer</span>
              <span className="inline-grid *:[grid-area:1/1] justify-items-end">
                <Pill className="scene-in" style={at(0, 2)}>
                  Ready
                </Pill>
                <Pill tone="primary" icon={Send} className="scene-in" style={at(2, 4)}>
                  Sending
                </Pill>
                <Pill tone="success" icon={CheckCircle2} className="scene-in scene-pop" style={at(4)}>
                  Sent
                </Pill>
              </span>
            </div>
            <span className="mt-2.5 block h-1.5 overflow-hidden rounded-full bg-background">
              <span className="inline-grid *:[grid-area:1/1] h-full">
                <span style={at(2, 3)} className="scene-in block h-full w-1/3 rounded-full bg-accent" />
                <span style={at(3, 4)} className="scene-in block h-full w-2/3 rounded-full bg-accent" />
                <span style={at(4)} className="scene-in block h-full w-full rounded-full bg-accent" />
              </span>
            </span>
            <p className="mt-2 text-[11px] text-subtle">
              Your own WhatsApp account: Meta bills you directly, no ERIX markup.
            </p>
          </div>
        </div>
      </AppFrame>
    </Scene>
  );
}

/** Screen by key, for data-driven pages (module pages, sub-pages). */
export const SCREENS: Record<ScreenKey, () => ReactNode> = {
  pipeline: PipelineDemo,
  inbox: InboxDemo,
  invoice: InvoiceScreen,
  flow: FlowEditorDemo,
  booking: BookingScreen,
  ai: AiScreen,
  documents: DocumentsScreen,
  crm: CrmScreen,
  flowCanvas: FlowEditorDemo,
  voiceCall: VoiceCallScreen,
  clinicBooking: ClinicBookingScreen,
  coachingInbox: CoachingInbox,
  localBrandInbox: LocalBrandInbox,
  broadcast: BroadcastScreen,
};
