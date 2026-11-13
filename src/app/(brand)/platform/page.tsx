import Link from "next/link";
import { ChannelBeam } from "@/components/home/Integrations";
import { type GlyphName, Icon } from "@/components/icons";
import { BrowserFrame, Faq, MkHero, MkSection, PrimaryCta, WhatsAppCta } from "@/components/marketing/kit";
import { type Chapter, Story } from "@/components/marketing/story";
import { ClosingCta } from "@/components/platform/ModulePage";
import { ModuleRow } from "@/components/platform/ModuleRow";
import { LazyScreen } from "@/components/scenes/lazy-screen";
import { TimelineScene } from "@/components/scenes/timeline-scene";
import { JsonLd } from "@/components/seo/JsonLd";
import { SoonControl } from "@/components/ui/soon";
import { StatusBadge } from "@/components/ui/status-badge";
import { getPlatformNav } from "@/lib/catalog";
import { getBreadcrumbSchema, getFAQSchema, getItemListSchema } from "@/lib/jsonld";
import { PLATFORM_MODULES } from "@/lib/platform-modules";
import { pageMetadata } from "@/lib/seo";
import { PLATFORM_NAV } from "@/lib/site";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────────────
   /platform — index page covering every module served by api.ecodrix.com.
   Designed so any organic search about a feature surfaces this page
   (and the per-module landing page beneath it).
─────────────────────────────────────────────────────────────────────── */

export const metadata = {
  ...pageMetadata({
    title: "ERIX platform: CRM, inbox, AI and automation",
    description:
      "Every module in ERIX by ECODrIx: CRM, the WhatsApp and Instagram inbox, AI agents, automation and storage on one customer record, plus what's coming next.",
    path: "/platform",
  }),
  keywords: [
    "ECODrIx platform",
    "ECODrIx products",
    "ECODrIx API",
    "ECODrIx modules",
    "ECODrIx features",
    "unified business platform",
    "CRM WhatsApp automation",
  ],
};

const PLATFORM_FAQS = [
  {
    q: "What does ERIX include today?",
    a: "ERIX 1.0 is live with four parts on one customer record. ERIX CRM: contacts, pipeline, forms, appointments, proposals, projects with documents, e-sign and a client portal, GST invoices and payment links. ERIX Connect: WhatsApp, Instagram DMs, email, website chat, Google Calendar and Meet, and Razorpay. ERIX Flow: automations, templates, approvals, Wait for a reply and AI reply. AI agents: the sales, channels and website agents. ERIX Storage keeps files inside projects.",
  },
  {
    q: "Is there a public ERIX API?",
    a: "Yes. The same modules are available through the REST API at https://api.ecodrix.com, with keys per workspace, webhooks and the public SDK @ecodrix/erix-api. The docs are at ecodrix.com/docs.",
  },
  {
    q: "Can I use just one part of ERIX?",
    a: "Yes. Most teams start with the inbox or the pipeline and switch on the rest as they go. Everything writes to the same contact, so nothing has to be moved later.",
  },
  {
    q: "Does ERIX update in real time?",
    a: "Yes. New messages, ticks, typing, pipeline moves and automation runs appear live, so nobody on your team has to refresh.",
  },
];

/** How one customer moves through the live v1.0 modules, each with a coded
 *  mock of its real screen. Every line is a shipped behaviour
 *  (ECOD/docs/modules/*.md, VERSION_PLAN v1.0). */
const chapters: Chapter[] = [
  {
    id: "connect",
    marker: "Step 1",
    module: "ERIX Connect",
    icon: "inbox",
    title: "Every channel lands in one inbox",
    body: "WhatsApp, Instagram, email and your website chat arrive in one list, live, each on the right contact.",
    points: [
      "Official WhatsApp Business API on your own account: Meta bills you, no ERIX markup",
      "Templates, broadcasts and the 24-hour window handled",
      "A chat widget for your website, with WhatsApp-style ticks",
    ],
    link: { href: "/platform/erix-connect", label: "Explore ERIX Connect" },
    visual: <LazyScreen name="inbox" />,
  },
  {
    id: "agents",
    anchor: "agents",
    marker: "Step 2",
    module: "AI agents",
    ai: true,
    title: "Agents answer from your knowledge and ask before they act",
    body: "Give the agent your price list, hours, FAQs and listings. It answers what it knows, drafts the rest, and anything that touches money waits on Approvals.",
    points: [
      "Sales, channels and website agents, replying in the customer's language",
      "Describe a new agent in a sentence: ERIX shows the plan first, then saves a draft",
      "Starts in Suggest: it drafts and a person sends, until you raise its autonomy",
      "Refunds, complaints and medical questions always go to a person",
      "Monthly limits, a pause button and usage you can see",
    ],
    link: { href: "/#story-agent", label: "See the agent in the story" },
    visual: <LazyScreen name="ai" />,
  },
  {
    id: "crm",
    marker: "Step 3",
    module: "ERIX CRM",
    icon: "square-kanban",
    title: "The enquiry becomes a deal with its whole story",
    body: "Chats, bookings, proposals and invoices sit on one record, so anyone on the team can pick up where the last person stopped.",
    points: [
      "Pipeline stages made for your industry, totals in rupees",
      "Forms and booking pages that add contacts by themselves",
      "Appointments in IST on Google Calendar, with no double bookings",
    ],
    link: { href: "/platform/erix-crm", label: "Explore ERIX CRM" },
    visual: <LazyScreen name="pipeline" />,
  },
  {
    id: "projects",
    marker: "Step 4",
    module: "ERIX CRM · Projects",
    icon: "folder-open",
    title: "The work runs in a project your client can follow",
    body: "Tasks, documents and click-to-sign in one place, and a portal where your client signs, downloads and sees progress without a status call.",
    link: { href: "/platform/erix-crm/client-portal", label: "Projects, e-sign and the client portal" },
    visual: <LazyScreen name="documents" />,
  },
  {
    id: "invoices",
    marker: "Step 5",
    module: "ERIX CRM · Invoices",
    icon: "receipt",
    title: "GST invoices that get paid",
    body: "CGST and SGST in the same state, IGST across states, numbered by financial year, sent on WhatsApp or email with a Razorpay payment link.",
    points: ["A proposal accepted on a phone becomes an advance invoice", "Marked Paid the moment the money lands"],
    link: { href: "/platform/erix-crm/commerce", label: "Proposals, invoices and payment links" },
    visual: <LazyScreen name="invoice" />,
  },
  {
    id: "flow",
    marker: "Step 6",
    module: "ERIX Flow",
    ai: true,
    icon: "workflow",
    title: "Follow-ups run on their own, with you in control",
    body: "Start from a template and switch it on. Confirmations, reminders and nudges go out on time, and anything risky waits for approval.",
    points: [
      "Starts on a new lead, a stage change, a form, a message, a payment or a booking",
      "Send, wait, or wait for a reply: Replied or No reply",
      "Every run visible step by step, live",
    ],
    link: { href: "/platform/erix-flow", label: "Explore ERIX Flow" },
    visual: <LazyScreen name="flow" />,
  },
];

/** Everything a workspace can use in ERIX 1.0, matched against the server (audit, 27 Oct 2026).
 *  Anything flag-gated or unbuilt goes in LATER, never here. */
const INCLUDED: { icon: GlyphName; title: string; ai?: boolean; items: string[] }[] = [
  {
    icon: "square-kanban",
    title: "CRM",
    items: [
      "Contacts matched by phone and email across channels, with a full timeline",
      "Pipelines with stages, tags, notes, custom fields and saved views",
      "Forms and booking pages that create contacts, with consent recorded",
      "Proposals your client accepts online, turning into a GST invoice",
      "Projects with tasks, documents, e-sign and a client portal",
      "Analytics for your funnel, forecast, lead sources and revenue",
    ],
  },
  {
    icon: "receipt",
    title: "GST invoices and payments",
    items: [
      "CGST and SGST or IGST by place of supply, with GSTIN, HSN and SAC",
      "Numbering per Indian financial year, and a PDF for every invoice",
      "Payment links on your own Razorpay, marked paid when the money lands",
      "Part payments, and UPI, bank or cash payments recorded by hand",
      "Overdue invoices flagged every morning",
      "Export to Tally, Zoho or CSV",
    ],
  },
  {
    icon: "inbox",
    title: "Inbox and channels",
    items: [
      "The WhatsApp Business API on your own number, with approved templates",
      "Instagram DMs, email from your own domain and a website chat widget",
      "One inbox with sent, delivered and read ticks, on the right contact",
      "Broadcasts to a segment, paced, with quiet hours from 9 pm to 9 am",
      "WhatsApp opt-in, the 24-hour window and STOP replies handled for you",
      "Google Calendar and Meet links for online bookings",
    ],
  },
  {
    icon: "workflow",
    title: "Automations",
    items: [
      "Start on a new contact, a stage change, a form, a booking, a payment or a message",
      "Send, wait, wait for a reply, check a condition, ask AI, update the contact",
      "Approval steps, with approve-by-email links",
      "Test runs that preview every message before anything goes out",
      "Run history with retries, a workspace-wide pause and frequency caps",
      "Ready-made templates for your industry",
    ],
  },
  {
    icon: "sparkles",
    title: "AI agents",
    ai: true,
    items: [
      "Answers from your own text, web pages, PDFs and documents",
      "Sends only when it's confident and backed by your knowledge; otherwise it drafts for you",
      "Refunds, complaints, medical and legal questions go to a person, in English, Hindi, Hinglish, Telugu or Tamil",
      "Books slots and finds contacts using only the tools you allow",
      "Sales and channels agents with an autonomy level and a monthly budget",
      "Mark replies correct, wrong or risky to see how it's doing",
    ],
  },
  {
    icon: "shield-check",
    title: "Trust and your data",
    items: [
      "Each workspace's data kept separate at the database level",
      "Connection keys encrypted at rest and never shown in full",
      "Owner, admin and agent roles, with an activity log",
      "Export or erase a contact on request; GST invoices are kept",
      "Export your whole workspace at any time",
      "Delete a workspace with 30 days to change your mind",
    ],
  },
];

/** Built or planned but not in 1.0 for every workspace (VERSION_PLAN). */
const LATER = [
  { label: "Messenger and Telegram inboxes", when: "Version 1.2" },
  { label: "Webhooks, more schedules and connected apps", when: "Version 1.2" },
  { label: "Lead scoring, referrals, reviews and memberships", when: "Version 1.2" },
  { label: "Instagram posts and a content calendar", when: "Version 1.3" },
];

const moreCopy: Record<string, string> = {
  storage:
    "Files kept with the client and project they belong to: documents, secure share links and proposals signed online.",
};

// Which modules are listed (and which are Coming soon) follows admin › Catalog.
export const revalidate = 300;

export default async function PlatformIndexPage() {
  const nav = await getPlatformNav();
  const more = nav.filter((m) => m.key === "storage");
  return (
    <div className="w-full">
      {/* JSON-LD: ItemList + FAQ + Breadcrumb */}
      <JsonLd
        data={getItemListSchema(
          PLATFORM_MODULES.map((m) => ({ name: m.name, url: `/platform/${m.slug}`, description: m.description })),
        )}
      />
      <JsonLd data={getFAQSchema(PLATFORM_FAQS)} />
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Platform", url: "/platform" },
        ])}
      />

      <MkHero
        title="One customer record. Every tool around it."
        lead="ERIX CRM, Connect, Flow and the AI agents share one contact, so a chat, a booking, an invoice and a follow-up all land on the same record. Start with what you need today; the rest is already connected."
        actions={
          <>
            <PrimaryCta lg />
            <WhatsAppCta lg />
          </>
        }
        visual={
          <BrowserFrame>
            <TimelineScene />
          </BrowserFrame>
        }
      />

      {/* ── Module map ── */}
      <MkSection
        id="modules"
        title="Pick one. They all share the same contact."
        lead="Live means you can use it in ERIX today. Coming soon and invite-only are marked."
      >
        <ul className="grid gap-x-10 md:grid-cols-2">
          {nav.map((m) => (
            <li key={m.key} className="border-t border-border-soft">
              <ModuleRow m={m} />
            </li>
          ))}
        </ul>
      </MkSection>

      <ChannelBeam tone="subtle" />

      {/* ── How one customer moves through the live modules ── */}
      <Story
        id="journey"
        kicker={
          <p className="text-sm/5 font-semibold text-accent on-dark:text-on-navy-link">One customer, six hand-offs</p>
        }
        title="How an enquiry moves through ERIX"
        lead="Each part hands the customer to the next on the same record. The screens are redrawn from the real app."
        chapters={chapters}
      />

      {/* ── Everything in 1.0, and what isn't yet ── */}
      <MkSection
        id="included"
        title="Everything in ERIX 1.0"
        lead="What a workspace can use today. What comes later is listed under it, so nothing here is a promise."
      >
        <div className="grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {INCLUDED.map((g) => (
            <div key={g.title} className="border-t border-border-soft pt-6">
              <h3 className="flex items-center gap-3 font-sans text-[18px] font-semibold tracking-normal">
                <span
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-[11px]",
                    g.ai ? "bg-ai-subtle text-ai" : "bg-accent-muted text-accent",
                  )}
                >
                  <Icon name={g.icon} size={20} variant="duo" />
                </span>
                {g.title}
              </h3>
              <ul className="mt-4 grid gap-2.5">
                {g.items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[15px]/[22px] text-foreground">
                    <Icon
                      name="check"
                      size={15}
                      strokeWidth={2.2}
                      variant="line"
                      className={cn("mt-[3px] shrink-0", g.ai ? "text-ai" : "text-accent")}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 rounded-[16px] bg-background p-6">
          <h3 className="font-sans text-[16px] font-semibold tracking-normal">Coming later</h3>
          <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {LATER.map((l) => (
              <li key={l.label} className="flex flex-col text-[15px]">
                <span className="text-foreground">{l.label}</span>
                <span className="text-[13px] text-muted-foreground">{l.when}</span>
              </li>
            ))}
          </ul>
        </div>
      </MkSection>

      {/* ── Also in ERIX ── */}
      <MkSection id="more" tone="subtle" title="Storage and the API">
        <ul className="grid gap-x-10 md:grid-cols-3">
          {more.map((m) => (
            <li key={m.key} className="border-t border-border-soft pt-6 pb-2">
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "grid size-10 place-items-center rounded-[11px]",
                    "ai" in m ? "bg-ai-subtle text-ai" : "bg-accent-muted text-accent",
                  )}
                >
                  <Icon name={m.icon} size={20} variant="duo" />
                </span>
                <StatusBadge status={m.status} isNew={m.isNew} />
              </span>
              <h3 className="mt-4 font-sans text-[18px] font-semibold tracking-normal">{m.name}</h3>
              <p className="mt-1.5 text-[15px] text-muted-foreground">
                {m.summary === PLATFORM_NAV.find((n) => n.key === m.key)?.summary ? moreCopy[m.key] : m.summary}
              </p>
              {m.status === "soon" ? (
                <SoonControl
                  role="link"
                  className="mt-4 inline-flex items-center gap-1.5 font-sans text-[15px]/5 font-[650] text-muted-foreground"
                >
                  About {m.name}
                </SoonControl>
              ) : (
                <Link
                  href={m.href}
                  className="inline-flex items-center gap-1.5 font-sans text-[15px]/5 font-[650] text-accent hover:underline hover:underline-offset-3 motion-safe:focus-visible:animate-focus group mt-4"
                >
                  About {m.name}
                  <Icon name="arrow-right" size={14} variant="line" />
                </Link>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-12 flex items-start gap-3 rounded-[16px] bg-surface p-6 text-foreground shadow-[var(--shadow-xs)]">
          <Icon name="plug" size={20} variant="duo" className="mt-0.5 shrink-0 text-accent" />
          <span>
            <span className="font-semibold">For developers:</span> the same modules through one public API, with keys
            per workspace and the TypeScript SDK.{" "}
            <Link href="/docs" className="text-accent underline underline-offset-4">
              Read the API docs
            </Link>
          </span>
        </p>
      </MkSection>

      {/* ── FAQ ── */}
      <MkSection id="faq" title="How the platform works">
        <Faq items={PLATFORM_FAQS} />
      </MkSection>

      <ClosingCta
        title="Not sure where to start?"
        body="Request early access and tell us how you sell today. We'll set ERIX up around it."
      />
    </div>
  );
}
