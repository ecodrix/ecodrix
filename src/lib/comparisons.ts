/**
 * Competitor comparison catalog — single source of truth.
 *
 * Drives:
 *  - /compare              → index page ("best WhatsApp CRM in India" hub)
 *  - /compare/[slug]       → individual "ECODrIx vs X" pages
 *  - /sitemap.xml          → discovery for search engines
 *  - JSON-LD FAQ + Breadcrumb → structured data for AI citations
 *
 * These pages target the highest-converting India queries ("ecodrix vs wati",
 * "wati alternative", "best whatsapp crm india") and are prime AI-citation
 * surfaces (ChatGPT / Perplexity / Gemini "alternatives to X" prompts).
 *
 * ⚠️ Accuracy guardrail: ERIX claims follow the design system's product page
 * (live v1.0 only). Competitor rows cover features and approach, never their
 * prices: prices stay off public pages until checked on the vendor's own site.
 * Claims are qualitative and dated (see `lastVerified`). Never fabricate ratings.
 *
 * Research pass 27 Oct 2026: every competitor claim below was checked against
 * the vendor's own site, docs or vendor-written marketplace listing (see
 * `sources`, internal only, not rendered). Meta's billing model was checked on
 * Meta's developer pricing page. Re-verify each entry at least every 90 days;
 * these vendors ship AI and CRM features monthly.
 */

export interface ComparisonRow {
  /** Feature/dimension being compared. */
  dimension: string;
  /** ECODrIx (ERIX) position — kept factual to our own product. */
  ecodrix: string;
  /** Competitor position — qualitative, hedged. */
  competitor: string;
  /** Does ERIX have the clear edge on this row? Drives the ✓ highlight. */
  ecodrixWins: boolean;
}

export interface Comparison {
  slug: string; // e.g. "ecodrix-vs-wati"
  competitor: string; // "Wati"
  /** SERP description, ~150–170 chars. */
  description: string;
  /** One-paragraph, AI-liftable TL;DR rendered server-side. */
  tldr: string;
  /** Honest "when the competitor is the better pick" framing (builds trust). */
  competitorBestFor: string;
  /** "When ERIX is the better pick." */
  ecodrixBestFor: string;
  /** Comparison table rows. */
  rows: ComparisonRow[];
  /** FAQ pairs → FAQPage schema + on-page accordion. */
  faqs: Array<{ q: string; a: string }>;
  /** Queries this page targets. */
  searchQueries: string[];
  /** ISO date this competitor info was last checked. */
  lastVerified: string;
  /** Vendor-owned pages the competitor claims were checked against. Internal only. */
  sources: string[];
}

/* Shared truths about ECODrIx / ERIX reused across comparisons. */
const ERIX_API = "Official Meta WhatsApp Business Platform (Cloud API).";
// Pilot (founder decision): no public plans or prices; terms are agreed per client.
const ERIX_PRICING =
  "During the pilot, our team sets up each workspace and agrees pricing with you. Meta bills WhatsApp messages to you directly, with no ERIX markup.";
const ERIX_AI =
  "Answers from your own price list and hours, drafts what it isn't sure of, and hands refunds and complaints to a person.";
const ERIX_CRM = "Built in: contacts, pipeline board, forms and bookings. GST invoices and projects are coming soon.";
// Verified on Meta's WhatsApp Business Platform pricing page, 27 Oct 2026.
const META_NOTE =
  "Since 1 July 2025, Meta charges per delivered template message, by category (marketing, utility or authentication) and by the recipient's country. Replies inside the 24-hour customer service window are free, and so are utility templates sent while that window is open. Meta changes India's rates (marketing went up on 1 January 2026), so check Meta's current rate card. With ERIX you connect your own WhatsApp Business account, so Meta bills you directly and ERIX adds no markup. With any provider, ask how Meta's charges reach your bill.";
const META_ROW = (competitor: string): ComparisonRow => ({
  dimension: "Meta's WhatsApp charges",
  ecodrix: "Your own WhatsApp account: Meta bills you directly, and ERIX adds no markup.",
  competitor: `Check how ${competitor} passes Meta's charges on before you compare totals.`,
  ecodrixWins: false,
});
const FLOW_ROW =
  "ERIX Flow: starts on leads, stages, forms, messages and bookings, with Wait for a reply, approvals and AI replies.";
const MOVE_ANSWER = (competitor: string) =>
  `Yes. Import your contacts into ERIX CRM, and connect your own WhatsApp Business account in ERIX Connect through Meta's signup. A number works with one provider at a time, so plan the move with ${competitor}. ERIX is letting businesses in from its early-access list.`;

const VERIFIED = "2026-10-27";

export const COMPARISONS: Comparison[] = [
  /* ── Wati ─────────────────────────────────────────────────────── */
  {
    slug: "ecodrix-vs-wati",
    competitor: "Wati",
    description:
      "ECODrIx (ERIX) vs Wati for Indian SMBs: both use the official WhatsApp API. Wati leads on AI agents and calling; ERIX builds in the CRM, bookings and automation.",
    tldr: "Wati (by Clare.ai) is a mature WhatsApp Business API platform: a shared team inbox, broadcasts and drip campaigns, no-code chatbots, its Astra AI agent across chat and voice, WhatsApp Business Calling, and Instagram, Messenger and TikTok in the same inbox. For deals and pipeline it syncs with HubSpot, Zoho CRM or Salesforce. ERIX matches the official-API messaging and builds in the system around it: a pipeline, bookings, automations and an AI agent that answers from your own information, in one platform priced in rupees.",
    competitorBestFor:
      "Teams that want the broadest WhatsApp toolkit (AI agents across chat and voice, WhatsApp calling, Instagram and TikTok in one inbox) and already run a CRM such as HubSpot, Zoho or Salesforce.",
    ecodrixBestFor:
      "Indian SMBs that want WhatsApp and the system of record (pipeline, bookings and automation) in one login, priced in rupees.",
    rows: [
      {
        dimension: "WhatsApp API",
        ecodrix: ERIX_API,
        competitor: "Official Meta WhatsApp Business API; Meta Business Partner.",
        ecodrixWins: false,
      },
      {
        dimension: "Built-in CRM (pipeline, deals, bookings)",
        ecodrix: ERIX_CRM,
        competitor:
          "No built-in deal pipeline yet: its sales page lists funnel and deal-stage tracking as coming soon, and it syncs leads with HubSpot, Zoho CRM and Salesforce.",
        ecodrixWins: true,
      },
      {
        dimension: "No-code automation",
        ecodrix: FLOW_ROW,
        competitor: "No-code chatbot builder, drip campaigns, lead auto-assignment and follow-up reminders for reps.",
        ecodrixWins: true,
      },
      {
        dimension: "AI agent on your chats",
        ecodrix: ERIX_AI,
        competitor:
          "Astra AI agent trained on your documents, FAQs and CRM data, across chat and voice, with long-term memory and human handoff; Copilot inside the inbox.",
        ecodrixWins: false,
      },
      META_ROW("Wati"),
      {
        dimension: "Best-fit user",
        ecodrix: "Pan-India SMBs and agencies wanting one platform.",
        competitor: "Marketing, sales and support teams that pair it with an existing CRM.",
        ecodrixWins: false,
      },
    ],
    faqs: [
      {
        q: "Is ECODrIx a good Wati alternative in India?",
        a: `ERIX uses the same official Meta WhatsApp platform as Wati, and adds a pipeline, bookings, automations and an AI agent that answers from your own information. ${ERIX_PRICING}`,
      },
      {
        q: "Does Wati have a built-in CRM?",
        a: "Wati covers the conversation side well: team inbox, broadcasts, chatbots and AI agents. For deals and pipeline it connects to HubSpot, Zoho CRM or Salesforce, and its sales page lists funnel tracking as coming soon. ERIX includes the pipeline and bookings in the same platform.",
      },
      {
        q: "Do ECODrIx and Wati use the same WhatsApp API?",
        a: "Both use Meta's official WhatsApp platform, so the messaging itself and Meta's charges are comparable. The difference is what's built around it: ERIX includes the CRM and automation.",
      },
      { q: "How does WhatsApp pricing work with either tool?", a: META_NOTE },
      { q: "Can I move from Wati to ECODrIx?", a: MOVE_ANSWER("Wati") },
    ],
    searchQueries: [
      "ecodrix vs wati",
      "wati alternative india",
      "wati alternative for small business",
      "best wati alternative whatsapp crm",
      "wati with built in crm",
    ],
    lastVerified: VERIFIED,
    sources: [
      "https://www.wati.io/en/blog/whatsapp-tools/",
      "https://www.wati.io/wati-for-sales/",
      "https://www.wati.io/wati-ai/",
    ],
  },

  /* ── AiSensy ──────────────────────────────────────────────────── */
  {
    slug: "ecodrix-vs-aisensy",
    competitor: "AiSensy",
    description:
      "ECODrIx (ERIX) vs AiSensy for Indian SMBs: AiSensy leads on broadcasts, retargeting and click-to-WhatsApp ads; ERIX adds a CRM, bookings and automation.",
    tldr: "AiSensy is a WhatsApp marketing platform that says it serves over 2 lakh businesses. Its strengths are unlimited broadcasts, retargeting by who opened or clicked, Click-to-WhatsApp ads with an AI Ads Manager, a drag-and-drop chatbot builder, WhatsApp Forms, payments inside WhatsApp and AI agents. Its Chat CRM keeps tags, attributes and history on each contact. ERIX is for teams whose WhatsApp marketing has turned into a sales pipeline: deals, GST invoices, projects and automation in the same place you message customers.",
    competitorBestFor:
      "Marketing-led businesses running high-volume broadcasts, retargeting and Click-to-WhatsApp ads, with simple chatbot flows.",
    ecodrixBestFor:
      "SMBs whose WhatsApp marketing has turned into a real sales pipeline that needs a CRM and automation alongside messaging.",
    rows: [
      {
        dimension: "WhatsApp API",
        ecodrix: ERIX_API,
        competitor: "Official Meta WhatsApp Business API; Meta Business Partner.",
        ecodrixWins: false,
      },
      {
        dimension: "Broadcast marketing",
        ecodrix: "Broadcasts with templates WhatsApp has approved, to the contacts you pick, such as a tag.",
        competitor:
          "Core strength: unlimited broadcasts, scheduling, retargeting by opens and clicks, click tracking and carousel templates.",
        ecodrixWins: false,
      },
      {
        dimension: "Built-in CRM (pipeline, deals, bookings)",
        ecodrix: ERIX_CRM,
        competitor:
          "Chat CRM: tags, attributes and history on each contact. No deal pipeline on its features page; it connects to HubSpot, Salesforce and LeadSquared.",
        ecodrixWins: true,
      },
      {
        dimension: "No-code automation",
        ecodrix: FLOW_ROW,
        competitor:
          "Drag-and-drop chatbot flows, WhatsApp Forms and Flows, and Dialogflow bots; the chatbot builder is a paid add-on.",
        ecodrixWins: true,
      },
      {
        dimension: "Payments",
        ecodrix: "Coming soon: GST invoices with payment links.",
        competitor: "Payments inside WhatsApp by UPI, card or net banking through Razorpay or PayU.",
        ecodrixWins: false,
      },
      {
        dimension: "AI agent on your chats",
        ecodrix: ERIX_AI,
        competitor: "AI agents with a knowledge base, long-term memory and tool calling, sold as an add-on.",
        ecodrixWins: false,
      },
      META_ROW("AiSensy"),
      {
        dimension: "Best-fit user",
        ecodrix: "Sales-led SMBs wanting one platform.",
        competitor: "Marketing-led teams focused on broadcasts and ads.",
        ecodrixWins: false,
      },
    ],
    faqs: [
      {
        q: "Is ECODrIx an AiSensy alternative?",
        a: `Both run on Meta's official WhatsApp platform. AiSensy is marketing and broadcast-led, while ERIX adds a pipeline, bookings, automations and an AI agent on your chats. ${ERIX_PRICING}`,
      },
      {
        q: "What does ERIX cost?",
        a: `${ERIX_PRICING} For AiSensy, check its own pricing page, since plans and add-ons change often.`,
      },
      { q: "How does WhatsApp message pricing work?", a: META_NOTE },
      {
        q: "When should I choose ERIX over AiSensy?",
        a: "Choose ERIX when WhatsApp is no longer just marketing: when you need to track deals and bookings, and automate follow-ups from the same place you message customers. If your work is mostly broadcasts, retargeting and ads, AiSensy is built for that.",
      },
      { q: "Can I move from AiSensy to ECODrIx?", a: MOVE_ANSWER("AiSensy") },
    ],
    searchQueries: [
      "ecodrix vs aisensy",
      "aisensy alternative",
      "aisensy alternative india",
      "whatsapp crm better than aisensy",
    ],
    lastVerified: VERIFIED,
    sources: [
      "https://aisensy.com/features",
      "https://aisensy.com/features/whatsapp-flows",
      "https://aws.amazon.com/marketplace/pp/prodview-nte3egliknqku",
    ],
  },

  /* ── Interakt ─────────────────────────────────────────────────── */
  {
    slug: "ecodrix-vs-interakt",
    competitor: "Interakt",
    description:
      "ECODrIx (ERIX) vs Interakt for Indian SMBs: Interakt (Jio Haptik) leads on Shopify commerce; ERIX builds bookings into the CRM.",
    tldr: "Interakt is a Jio Haptik product built on the official WhatsApp API. Its deepest work is Shopify commerce: catalogue sync, WhatsApp carts turned into checkouts, COD confirmation, and AI agents for orders and sales, including a voice agent. It also sells a Sales CRM with a visual pipeline and lead auto-assignment. ERIX is built for service businesses: a pipeline plus bookings, for real estate, clinics and coaching institutes.",
    competitorBestFor:
      "Shopify and D2C brands selling from a WhatsApp catalogue, recovering carts and confirming COD orders.",
    ecodrixBestFor:
      "Service businesses (real estate, clinics, consultants) that need bookings and automation alongside the pipeline.",
    rows: [
      {
        dimension: "WhatsApp API",
        ecodrix: ERIX_API,
        competitor: "Official Meta WhatsApp Business API; official Business Solution Provider.",
        ecodrixWins: false,
      },
      {
        dimension: "Commerce / catalog selling",
        ecodrix:
          "Orders come in as chats. No catalogue or Shopify sync; invoices, payment links and storefront checkout are coming later.",
        competitor:
          "Strength: Shopify catalogue auto-sync, WhatsApp carts turned into Shopify checkouts, COD-to-prepaid conversion and AI order agents.",
        ecodrixWins: false,
      },
      {
        dimension: "Sales pipeline",
        ecodrix: "Built in: pipeline board with stages for your trade.",
        competitor: "Sales CRM with a visual pipeline, lead auto-assignment, tasks and WhatsApp payments.",
        ecodrixWins: false,
      },
      {
        dimension: "Bookings",
        ecodrix: "Built in: bookings in IST on your booking page. GST invoices and projects are coming soon.",
        competitor: "Not among its listed CRM features; payments are collected in chat with reminders.",
        ecodrixWins: true,
      },
      {
        dimension: "No-code automation",
        ecodrix: FLOW_ROW,
        competitor: "Workflow builder, no-code chatbots and campaign automations.",
        ecodrixWins: false,
      },
      {
        dimension: "AI agent on your chats",
        ecodrix: ERIX_AI,
        competitor: "AI agents for FAQs, lead qualification, sales and orders, plus voice AI agents for calls.",
        ecodrixWins: false,
      },
      META_ROW("Interakt"),
      {
        dimension: "Best-fit user",
        ecodrix: "Service businesses: real estate, clinics, coaching.",
        competitor: "Shopify and D2C brands selling on WhatsApp.",
        ecodrixWins: false,
      },
    ],
    faqs: [
      {
        q: "Is ECODrIx an Interakt alternative?",
        a: `Both use Meta's official WhatsApp platform. Interakt is strongest in Shopify commerce, while ERIX is a CRM, inbox and automation platform for service businesses, with bookings built in. ${ERIX_PRICING}`,
      },
      {
        q: "Which is better for real estate or clinics?",
        a: "Interakt covers these trades with its Sales CRM and chatbots. ERIX is built for service businesses: pipelines with stages for your trade, bookings in IST, and appointment reminders in one place. If you sell mainly through a Shopify store, Interakt fits better.",
      },
      { q: "How does WhatsApp pricing compare?", a: META_NOTE },
      {
        q: "Does ERIX support online selling too?",
        a: "Partly: orders arrive as chats. ERIX has no catalogue or Shopify sync today, and invoices, payment links and storefront checkout are coming later, so if you sell mainly from a WhatsApp catalogue, compare both against your workflow.",
      },
    ],
    searchQueries: [
      "ecodrix vs interakt",
      "interakt alternative",
      "interakt alternative india",
      "whatsapp crm for real estate vs interakt",
    ],
    lastVerified: VERIFIED,
    sources: [
      "https://www.interakt.shop/sales-crm/",
      "https://www.interakt.shop/integrations/integrating-whatsapp-business-api-with-shopify/",
      "https://apps.shopify.com/interakt-sales",
    ],
  },

  /* ── Gallabox ─────────────────────────────────────────────────── */
  {
    slug: "ecodrix-vs-gallabox",
    competitor: "Gallabox",
    description:
      "ECODrIx (ERIX) vs Gallabox for Indian SMBs: Gallabox brings AI agents on WhatsApp, Instagram and web chat; ERIX builds in the CRM, bookings and automation.",
    tldr: "Gallabox, founded in Chennai, runs on the official WhatsApp API with a shared inbox for WhatsApp and Instagram, bot flows, AI reply drafts, and a Chat AI Agent that answers on WhatsApp, Instagram and web chat from your own documents and websites. Deals and pipeline sit in a connected CRM such as HubSpot, Zoho, Pipedrive or LeadSquared. ERIX keeps the pipeline, bookings and automation in the same platform as your WhatsApp.",
    competitorBestFor:
      "Teams that want one AI agent across WhatsApp, Instagram and their website, and already keep deals in a CRM like HubSpot, Zoho or Pipedrive.",
    ecodrixBestFor: "SMBs without a separate CRM that want WhatsApp, pipeline and automation in one login.",
    rows: [
      {
        dimension: "WhatsApp API",
        ecodrix: ERIX_API,
        competitor: "Official Meta WhatsApp Business API.",
        ecodrixWins: false,
      },
      {
        dimension: "Built-in CRM (pipeline, deals, bookings)",
        ecodrix: ERIX_CRM,
        competitor:
          "Connects to HubSpot, Zoho CRM, Zoho Bigin, Pipedrive, LeadSquared and others; bot flows create leads and update deals there.",
        ecodrixWins: true,
      },
      {
        dimension: "No-code automation",
        ecodrix: FLOW_ROW,
        competitor: "Bot flows, including steps that wait for an order or payment and retry failed payments.",
        ecodrixWins: false,
      },
      {
        dimension: "Payments",
        ecodrix: "Coming soon: GST invoices with payment links.",
        competitor: "Payment links and WhatsApp Pay through connected payment gateways.",
        ecodrixWins: false,
      },
      {
        dimension: "AI agent on your chats",
        ecodrix: ERIX_AI,
        competitor:
          "Chat AI Agent on WhatsApp, Instagram and web chat, trained on your docs and websites, with actions such as assigning chats and calling APIs; WhatsApp agents need a higher plan.",
        ecodrixWins: false,
      },
      META_ROW("Gallabox"),
      {
        dimension: "Best-fit user",
        ecodrix: "Pan-India SMBs and agencies wanting one platform.",
        competitor: "Teams pairing a WhatsApp and Instagram inbox with an existing CRM.",
        ecodrixWins: false,
      },
    ],
    faqs: [
      {
        q: "Is ECODrIx a Gallabox alternative?",
        a: `Both use Meta's official WhatsApp platform. Gallabox focuses on the inbox, bots and AI agents across WhatsApp, Instagram and web chat, and connects to your CRM for deals. ERIX builds the pipeline, bookings and automation in. ${ERIX_PRICING}`,
      },
      {
        q: "Does Gallabox have a built-in CRM?",
        a: "Gallabox keeps contacts and conversations, and its docs point you to a connected CRM (HubSpot, Zoho, Pipedrive, LeadSquared and others) for leads, deals and pipeline. ERIX includes the pipeline and bookings in the same platform.",
      },
      { q: "How does WhatsApp pricing work with either tool?", a: META_NOTE },
      { q: "Can I move from Gallabox to ECODrIx?", a: MOVE_ANSWER("Gallabox") },
    ],
    searchQueries: [
      "ecodrix vs gallabox",
      "gallabox alternative",
      "gallabox alternative india",
      "whatsapp crm better than gallabox",
    ],
    lastVerified: VERIFIED,
    sources: [
      "https://docs.gallabox.com/ai-agents-and-bots/chat-ai-agent/overview.md",
      "https://docs.gallabox.com/concepts/channels.md",
      "https://docs.gallabox.com/integrations/overview.md",
      "https://docs.gallabox.com/integrations/crm/overview.md",
    ],
  },

  /* ── DoubleTick ───────────────────────────────────────────────── */
  {
    slug: "ecodrix-vs-doubletick",
    competitor: "DoubleTick",
    description:
      "ECODrIx (ERIX) vs DoubleTick: DoubleTick leads on multi-number inboxes and governance for large sales teams; ERIX is one platform with the CRM built in for SMBs.",
    tldr: "DoubleTick (by QuickSell, Mumbai) is a mobile-first WhatsApp platform for large sales and support teams: one inbox across hundreds of WhatsApp numbers, team hierarchy, AI agents, SLA tracking, masking of sensitive data, and embedding inside CRMs such as Salesforce, Bitrix24, HubSpot and Zoho with two-way sync. ERIX is aimed at SMBs that don't have a CRM to embed into: the pipeline, bookings and automation come built in.",
    competitorBestFor:
      "Enterprises and large sales teams running many WhatsApp numbers, with an existing CRM and strict governance needs.",
    ecodrixBestFor:
      "SMBs that want the CRM and automation built in, rather than a WhatsApp layer on top of another CRM.",
    rows: [
      {
        dimension: "WhatsApp API",
        ecodrix: ERIX_API,
        competitor: "Official Meta WhatsApp Business API; Meta Technology Partner.",
        ecodrixWins: false,
      },
      {
        dimension: "Built-in CRM (pipeline, deals, bookings)",
        ecodrix: ERIX_CRM,
        competitor:
          "Works inside your existing CRM: embedded inbox, deep links and two-way sync with Salesforce, Bitrix24, HubSpot, Zoho and LeadSquared.",
        ecodrixWins: true,
      },
      {
        dimension: "No-code automation",
        ecodrix: FLOW_ROW,
        competitor: "Bot Studio for no-code bots and workflows, lead auto-assignment and working-hours replies.",
        ecodrixWins: false,
      },
      {
        dimension: "AI agent on your chats",
        ecodrix: ERIX_AI,
        competitor:
          "Agent Studio for AI agents trained on your data, plus AI chat and call summaries, reminders and sentiment tracking.",
        ecodrixWins: false,
      },
      META_ROW("DoubleTick"),
      {
        dimension: "Best-fit user",
        ecodrix: "Pan-India SMBs and agencies wanting one platform.",
        competitor: "Large sales and support teams with many numbers and an existing CRM.",
        ecodrixWins: false,
      },
    ],
    faqs: [
      {
        q: "Is ECODrIx a DoubleTick alternative?",
        a: `For SMBs, yes. Both use Meta's official WhatsApp platform. DoubleTick is built for large teams that run many WhatsApp numbers and keep deals in a CRM like Salesforce or Bitrix24. ERIX builds the pipeline, bookings and automation in. ${ERIX_PRICING}`,
      },
      {
        q: "When is DoubleTick the better pick?",
        a: "When you run a large team across many WhatsApp numbers, need governance such as SLA tracking and masking of sensitive data, and already have a CRM you want WhatsApp embedded into.",
      },
      { q: "How does WhatsApp pricing work with either tool?", a: META_NOTE },
      { q: "Can I move from DoubleTick to ECODrIx?", a: MOVE_ANSWER("DoubleTick") },
    ],
    searchQueries: [
      "ecodrix vs doubletick",
      "doubletick alternative",
      "doubletick alternative india",
      "whatsapp crm for small business vs doubletick",
    ],
    lastVerified: VERIFIED,
    sources: [
      "https://doubletick.io/",
      "https://doubletick.io/salesforce",
      "https://learn.doubletick.io/automations-and-integrations/deep-linking-into-doubletick-from-any-crm",
      "https://docs.doubletick.io/docs/bitrix24-integration-with-doubletick",
    ],
  },
];

/* Helpers ─────────────────────────────────────────────────────────── */

export function getComparisonBySlug(slug: string): Comparison | undefined {
  return COMPARISONS.find((c) => c.slug === slug);
}

export function getComparisonSlugs(): string[] {
  return COMPARISONS.map((c) => c.slug);
}
