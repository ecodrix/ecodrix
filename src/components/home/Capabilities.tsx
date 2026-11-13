import Link from "next/link";
import { type GlyphName, Icon } from "@/components/icons";
import { MkSection } from "@/components/marketing/kit";
import { cn } from "@/lib/utils";

type Item = { icon: GlyphName; title: string; text: string };

/**
 * Everything live in ERIX 1.0, each as what it does for the owner. Source:
 * DS product.md ("1.0 (live)") and ECOD/docs/modules/*.md. Nothing from 1.1+
 * (no voice), no Google Sheets or Gmail, no prices.
 */
const groups: { name: string; href: string; icon: GlyphName; ai?: boolean; items: Item[] }[] = [
  {
    name: "ERIX CRM",
    href: "/platform/erix-crm",
    icon: "square-kanban",
    items: [
      {
        icon: "users",
        title: "Contacts",
        text: "One record per customer, with every chat, call and booking on its timeline.",
      },
      {
        icon: "square-kanban",
        title: "Pipeline",
        text: "Drag deals between stages made for your trade, totals in rupees.",
      },
      {
        icon: "file-text",
        title: "Forms",
        text: "Share a form link on WhatsApp; every reply becomes a contact.",
      },
      {
        icon: "calendar-check",
        title: "Appointments",
        text: "Booking pages in IST, Google Calendar and Meet, reminders, no double bookings.",
      },
      {
        icon: "receipt",
        title: "GST invoices and payment links",
        text: "Coming soon.",
      },
    ],
  },
  {
    name: "ERIX Connect",
    href: "/platform/erix-connect",
    icon: "inbox",
    items: [
      {
        icon: "message-circle",
        title: "WhatsApp",
        text: "The official Business API on your own account: templates, broadcasts, the 24-hour window handled, no ERIX markup.",
      },
      { icon: "phone", title: "Phone calls", text: "Voice calls in the same inbox, on the same contact." },
      { icon: "image", title: "More channels", text: "Coming soon: Instagram DMs, email and website chat." },
      {
        icon: "calendar",
        title: "Google Calendar and Meet",
        text: "Bookings land on your calendar, with a Meet link for online calls.",
      },
    ],
  },
  {
    name: "ERIX Flow",
    href: "/platform/erix-flow",
    icon: "workflow",
    ai: true,
    items: [
      {
        icon: "zap",
        title: "Automations",
        text: "Start on a new lead, a stage change, a form, a message or a booking.",
      },
      {
        icon: "layout-template",
        title: "Templates",
        text: "Welcome messages, appointment reminders and nudges, ready for your industry.",
      },
      {
        icon: "shield-check",
        title: "Approvals",
        text: "Anything that messages a customer can wait for your OK.",
      },
      {
        icon: "split",
        title: "Wait for a reply",
        text: "Two branches, Replied or No reply, so a follow-up only goes when it's needed.",
      },
      { icon: "sparkles", title: "AI reply", text: "A step that drafts the reply from your own knowledge." },
      { icon: "history", title: "Run history", text: "Every run, step by step and live, on the contact." },
    ],
  },
  {
    name: "AI agents",
    href: "/platform#agents",
    icon: "sparkles",
    ai: true,
    items: [
      {
        icon: "user-check",
        title: "Sales agent",
        text: "Works new leads: adds notes and drafts follow-ups that wait on Approvals.",
      },
      {
        icon: "messages-square",
        title: "Channels agent",
        text: "Answers WhatsApp from your knowledge, in the customer's language.",
      },
      {
        icon: "book-open",
        title: "Knowledge",
        text: "Price lists, FAQs, documents and up to 50 pages of your website, refreshed weekly.",
      },
      {
        icon: "sliders-horizontal",
        title: "Your controls",
        text: "Suggest by default, monthly limits, a pause button and answer review.",
      },
    ],
  },
];

export function Capabilities() {
  return (
    <MkSection
      id="everything"
      title="Everything in ERIX 1.0, in plain words"
      lead="Four parts, one customer record. All of it is live today, and it all updates without a refresh."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {groups.map((g) => (
          <div key={g.name} className="rounded-lg bg-surface shadow-card p-5 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <h3
                className={cn(
                  "flex items-center gap-2 font-sans text-[17px] font-semibold tracking-normal",
                  g.ai ? "text-ai" : "text-foreground",
                )}
              >
                <span
                  className={cn(
                    "grid size-8 place-items-center rounded-[8px]",
                    g.ai ? "bg-ai-subtle text-ai" : "bg-accent-muted text-accent",
                  )}
                >
                  <Icon name={g.icon} size={16} variant="duo" />
                </span>
                {g.name}
              </h3>
              <Link
                href={g.href}
                className="group inline-flex items-center gap-1.5 font-sans text-[15px]/5 font-[650] text-accent hover:underline hover:underline-offset-3 motion-safe:focus-visible:animate-focus"
              >
                More<span className="sr-only"> about {g.name}</span>
                <Icon name="arrow-right" size={14} variant="line" />
              </Link>
            </div>
            <ul className="mt-4 grid gap-x-6 gap-y-3.5 sm:grid-cols-2">
              {g.items.map((it) => (
                <li key={it.title} className="flex gap-2.5">
                  <Icon
                    name={it.icon}
                    size={16}
                    variant="line"
                    className={cn("mt-0.5 shrink-0", g.ai ? "text-ai" : "text-accent")}
                  />
                  <span>
                    <span className="block text-[14.5px] font-semibold text-foreground">{it.title}</span>
                    <span className="mt-0.5 block text-[13.5px] leading-snug text-muted-foreground">{it.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {[
          {
            icon: "activity" as GlyphName,
            text: "Live everywhere: new messages, ticks, typing, pipeline moves and automation runs appear without a refresh.",
          },
          {
            icon: "indian-rupee" as GlyphName,
            text: "Made for India: rupees with Indian grouping, IST for reminders, and replies in the customer's language.",
          },
        ].map((f) => (
          <li
            key={f.text}
            className="flex items-start gap-3 rounded-[12px] bg-background p-4 text-[14.5px] text-foreground"
          >
            <Icon name={f.icon} size={18} variant="duo" className="mt-0.5 shrink-0 text-accent" />
            {f.text}
          </li>
        ))}
      </ul>
    </MkSection>
  );
}
