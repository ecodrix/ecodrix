/**
 * Platform module catalog: one entry per /platform/{slug} page.
 *
 * Drives:
 *  - /platform/[module]  → the module page (components/platform/ModulePage)
 *  - /platform           → JSON-LD ItemList
 *  - /sitemap.xml        → discovery (slugs only)
 *
 * Copy follows the design system's product page (what is live in v1.0 and
 * what comes in which version) and ECOD/docs/VERSION_PLAN.md. Anything not
 * live carries its status word. Status matches PLATFORM_NAV in lib/site.ts
 * (Voice is open by request; its claims come from ECOD/docs/voice/):
 * Store is coming soon. LAIE is private (founder, 3 Nov 2026), so it isn't here.
 */

import type { ModuleStatus } from "@/lib/site";

export interface PlatformModule {
  slug: string;
  brand: string;
  /** Short name for lists and JSON-LD. */
  name: string;
  /** Page title (the root template adds " | ECODrIx"); ≤ 50 characters. */
  title: string;
  /** The h1 under the brand pill. */
  tagline: string;
  /** Meta description and JSON-LD; 120–160 characters. */
  description: string;
  /** Hero paragraph. */
  longDescription: string;
  features: { title: string; body: string }[];
  steps: string[];
  faqs: { q: string; a: string }[];
  status: ModuleStatus;
  /** AI / automation module (purple, brand rule). */
  ai?: boolean;
  searchQueries: string[];
  category: "product" | "infrastructure";
}

export const PLATFORM_MODULES: PlatformModule[] = [
  {
    slug: "erix-crm",
    brand: "ERIX CRM",
    name: "ERIX CRM: pipeline, forms and bookings",
    title: "ERIX CRM: pipeline, forms and bookings",
    tagline: "Every enquiry, from first chat to booked visit",
    category: "product",
    status: "live",
    description:
      "ERIX CRM keeps every enquiry on one board: contacts, pipeline, forms and bookings, priced in INR. GST invoices and payment links are coming soon.",
    longDescription:
      "Enquiries from your form links, booking page and chats land in your pipeline. Move deals in one drag and book appointments in Indian time. Proposals, GST invoices and payment links are coming soon.",
    features: [
      {
        title: "A pipeline for your trade",
        body: "Stages made for your business type, with the total deal value in rupees on every column.",
      },
      {
        title: "Form links that fill the pipeline",
        body: "Share a hosted form link on WhatsApp or on your Google Business Profile. Every answer becomes a contact in your first stage.",
      },
      {
        title: "Bookings in IST",
        body: "Your hours, gaps and notice period. Two people can never book the same slot.",
      },
      {
        title: "Invoices and payment links",
        body: "Coming soon: GST invoices and payment links through your own Razorpay.",
      },
    ],
    steps: [
      "Pick your business type. A real estate agent starts with Inquiry → Site Visit Scheduled → Site Visit Done → Shortlisted → Token Paid → Agreement Signed → Closed or Lost. Clinics, coaching institutes, online stores and agencies get their own stages.",
      "Share your form and booking links on WhatsApp or on your Google Business Profile. Each enquiry lands in the first stage of your pipeline.",
      "Chat from the inbox and drag the card forward as the enquiry moves on.",
    ],
    faqs: [
      {
        q: "Do I need a website to use ERIX CRM?",
        a: "No. ERIX hosts your lead forms and booking page. Share the links on WhatsApp or on your Google Business Profile, and every enquiry lands in your contacts.",
      },
      {
        q: "Does ERIX send GST invoices?",
        a: "Not yet. GST invoices and Razorpay payment links are coming soon.",
      },
      {
        q: "Can my staff use it on a phone?",
        a: "Yes. Contacts, the pipeline, forms, bookings and the inbox all fit a phone screen. Each person gets a role, so staff can work leads without touching your settings.",
      },
    ],
    searchQueries: ["ECODrIx CRM", "ERIX CRM", "WhatsApp CRM India", "kanban CRM with WhatsApp"],
  },
  {
    slug: "erix-connect",
    brand: "ERIX Connect",
    name: "ERIX Connect: WhatsApp and phone calls",
    title: "ERIX Connect: WhatsApp and phone calls",
    tagline: "One inbox for WhatsApp and phone calls",
    category: "infrastructure",
    status: "live",
    description:
      "ERIX Connect puts the official WhatsApp Business API and phone calls in one live inbox. Meta bills you directly, with no ERIX markup. Instagram, email and website chat are coming soon.",
    longDescription:
      "Connect your own WhatsApp Business account through Meta's signup. Every chat and call arrives live in one inbox, on the right contact, on your computer and your phone. Instagram, email and website chat are coming soon.",
    features: [
      {
        title: "Your own WhatsApp account",
        body: "Official WhatsApp Business API through Meta's Embedded Signup. Meta bills you directly, and ERIX adds no markup.",
      },
      {
        title: "Templates and broadcasts",
        body: "Approved templates, broadcasts and the 24-hour reply window handled for you.",
      },
      {
        title: "More channels",
        body: "Coming soon: Instagram DMs, email from your own domain and website chat.",
      },
      {
        title: "An inbox that shows what needs you",
        body: "Unread counts, a Needs you list for handed-over chats, and AI drafts that show where the answer came from.",
      },
      {
        title: "Calendar",
        body: "Google Calendar and Meet for bookings.",
      },
    ],
    steps: [
      "Connect WhatsApp with Meta's Embedded Signup, using your own WhatsApp Business account.",
      "Reply from one inbox. Your answer goes back on the channel the customer used.",
      "Send broadcasts with templates WhatsApp has approved.",
    ],
    faqs: [
      {
        q: "Is this the official WhatsApp API?",
        a: "Yes. ERIX connects to Meta's WhatsApp Business Platform. Your message templates need WhatsApp's approval before you can broadcast them.",
      },
      {
        q: "Who pays for WhatsApp messages?",
        a: "Your business pays Meta directly, because you connect your own WhatsApp Business account. ERIX adds no markup to Meta's charges.",
      },
      {
        q: "What is WhatsApp's 24-hour window?",
        a: "When a customer messages you, you can reply with anything for 24 hours. Each new message from them opens a fresh 24 hours. After that, WhatsApp allows only approved templates, and ERIX keeps track of the window for you.",
      },
      {
        q: "Can I put the chat on my own website?",
        a: "Not yet. Website chat is coming soon.",
      },
    ],
    searchQueries: ["ECODrIx connect", "ERIX Connect", "WhatsApp API India", "WhatsApp shared inbox"],
  },
  {
    slug: "erix-flow",
    brand: "ERIX Flow",
    name: "ERIX Flow: automations that follow up for you",
    title: "ERIX Flow: automations that follow up for you",
    tagline: "Follow-ups that run on their own, with you in control",
    category: "product",
    status: "live",
    ai: true,
    description:
      "ERIX Flow runs your follow-ups: messages on any channel, waits, Wait for a reply, approvals and AI replies, starting from templates made for your industry.",
    longDescription:
      "Start from a template such as Welcome Journey or Appointment Reminders, or build your own: pick what starts it, add steps and switch it on. Anything risky waits for a person to approve, and every contact keeps a history of its runs.",
    features: [
      {
        title: "Starts on what happens",
        body: "A new lead, a stage change, a won or lost deal, a tag, a form, an inbound message, a payment or a booking.",
      },
      {
        title: "Wait for a reply",
        body: "Pause until the customer answers, then carry on down Replied or No reply, each with its own next step.",
      },
      {
        title: "AI reply",
        body: "Let the AI agent answer inside an automation, from your own knowledge. It drafts for a person by default.",
      },
      {
        title: "Approvals before it acts",
        body: "Before money or a customer message goes out, the run waits for someone on your team to approve it.",
      },
      {
        title: "Templates for your industry",
        body: "Welcome messages, appointment reminders and follow-ups, ready to switch on.",
      },
      {
        title: "A run history on every contact",
        body: "Each run and what it did shows on the contact, live as it happens.",
      },
    ],
    steps: [
      "Open ERIX Flow → Automations and start from a template, or choose New automation.",
      "Choose what starts it, such as a new lead, a form submitted or a meeting booked.",
      "Add steps: send on WhatsApp or email, wait, Wait for a reply, ask for approval, AI reply or update the contact.",
      "Switch it on, and follow each run on the contact's history.",
    ],
    faqs: [
      {
        q: "Can I check a message before it goes out?",
        a: "Yes. Put an approval step before the message. The run waits until someone on your team approves or rejects it.",
      },
      {
        q: "What can't ERIX Flow do yet?",
        a: "Webhooks, schedules, branches beyond Replied and No reply, loops and connected apps are coming soon, in version 1.2. Today, automations start on events inside ERIX.",
      },
      {
        q: "Is ERIX Flow a separate product?",
        a: "No. ERIX Flow is part of ERIX and open to every workspace, on the same contacts and inbox.",
      },
    ],
    searchQueries: [
      "ECODrIx automation",
      "ERIX Flow",
      "WhatsApp automation India",
      "follow-up automation",
      "no-code automation India",
    ],
  },
  {
    slug: "erix-voice",
    brand: "ERIX Voice",
    name: "ERIX Voice: an AI assistant that answers your calls",
    title: "ERIX Voice: an AI assistant for your calls",
    tagline: "Every call answered, even when you can't pick up",
    category: "product",
    status: "invite",
    ai: true,
    description:
      "ERIX Voice answers calls on your own Indian number in English, Hindi or Telugu, books appointments, takes messages and puts every call in your inbox.",
    longDescription:
      "The assistant picks up on your own business number, tells the caller it is an AI assistant, and gets on with the job: booking a visit, taking a message or a callback request, or passing the call to your team during business hours. Every call lands in your Inbox with a transcript and a summary. ERIX Voice is open by request.",
    features: [
      {
        title: "Answers on your own number",
        body: "Callers ring the Indian number you already use. The assistant picks up, in English, Hindi or Telugu.",
      },
      {
        title: "Books appointments",
        body: "It books the slot during the call, so a clinic visit or a site visit is fixed before the caller hangs up.",
      },
      {
        title: "Messages and callback requests",
        body: "When it can't settle something, it takes the details and leaves a callback request for your team.",
      },
      {
        title: "Hands over in business hours",
        body: "During your business hours it can pass the call to your team. If nobody picks up, the caller is promised a callback.",
      },
      {
        title: "After hours, it still answers",
        body: "Outside your hours it answers and books, but never transfers. Anything that needs a person becomes a callback request.",
      },
      {
        title: "Every call in your Inbox",
        body: "Each call shows on the contact with a transcript and a summary, next to their WhatsApp chats.",
      },
      {
        title: "Says it is an AI",
        body: "The first thing a caller hears is that an AI assistant is speaking. The business can't switch this off.",
      },
    ],
    steps: [
      "Request access and tell us about your business and your calls.",
      "We switch ERIX Voice on for your workspace.",
      "Set your number, language, greeting, business hours and where to hand over.",
      "Make a test call to your own phone, then switch the assistant on.",
    ],
    faqs: [
      {
        q: "Which languages does it speak?",
        a: "English, Hindi and Telugu are live. Tamil, Kannada, Malayalam and more are coming soon.",
      },
      {
        q: "Will callers know it is an AI?",
        a: "Yes. Every call begins by saying an AI assistant is speaking, and that the call may be recorded.",
      },
      {
        q: "What happens outside business hours?",
        a: "The assistant still answers and can book appointments. It does not transfer calls after hours; it takes a callback request instead.",
      },
      {
        q: "Whose voices are these?",
        a: "The voices on customer calls are Bulbul voices from Sarvam AI.",
      },
      {
        q: "How much does it cost?",
        a: "Contact us and we will talk through your call volume and set it up around your business.",
      },
    ],
    searchQueries: [
      "AI receptionist India",
      "AI phone answering for clinics",
      "ERIX Voice",
      "Hindi Telugu voice agent",
      "AI voice agent for small business India",
    ],
  },
  {
    slug: "erix-storage",
    brand: "ERIX Storage",
    name: "ERIX Storage: files kept with the right client",
    title: "ERIX Storage: files kept with the right client",
    tagline: "Files kept with the client they belong to",
    category: "infrastructure",
    status: "live",
    description:
      "ERIX Storage keeps files inside each client's project: quotations to sign, documents your client sees in a portal, share links. A Storage page is coming soon.",
    longDescription:
      "ERIX Storage is live inside projects. Upload quotations, work orders, floor plans and photos to a project. Your client sees them in their own portal, signs what needs signing, and both signatures land on the PDF with an audit seal. A standalone Storage page is coming soon.",
    features: [
      {
        title: "Files on the project",
        body: "PDF, Word, PNG and JPG files, up to 100 MB each, kept on the project they belong to.",
      },
      {
        title: "Ask for a signature",
        body: "Your client signs first, then you. Their name goes on the signature stamp.",
      },
      {
        title: "Click-to-sign with a seal",
        body: "Every signature is stamped with the signer's name and the date, plus an audit seal of the signed file.",
      },
      {
        title: "The client sees only theirs",
        body: "Each client sees only the project you invited them to, on a page that works on a phone.",
      },
      { title: "Share links", body: "Send a file as a link instead of another WhatsApp attachment." },
      {
        title: "Separate for every workspace",
        body: "Every workspace's files are kept in a space of their own, and storage limits are checked before each upload.",
      },
    ],
    steps: [
      "Create a project under ERIX CRM → Active projects.",
      "Choose Documents, then Upload file.",
      "Choose Ask for signature on a file and add your client as the signer.",
      "Your client signs in their portal, then you sign. The status changes by itself.",
    ],
    faqs: [
      {
        q: "Is this an Aadhaar eSign?",
        a: "No. It's click-to-sign: each signature is stamped on the PDF with the signer's name and the date, with an audit seal. It suits quotations, work orders and service agreements. For papers that must be Aadhaar-signed, stamped or registered, use the official route.",
      },
      {
        q: "What can my client see?",
        a: "Only the project you invited them to: its progress, tasks, your documents to view and sign, and messages to you.",
      },
      {
        q: "Is there a separate Storage page?",
        a: "Not yet. Today your files live inside projects, next to the client they belong to. A standalone Storage page is coming soon.",
      },
      {
        q: "What happens when my storage is full?",
        a: "Uploading tells you the workspace's storage is full and suggests deleting files you no longer need. Talk to us if you need more.",
      },
    ],
    searchQueries: ["ECODrIx storage", "client document portal India", "e-sign quotation India"],
  },
];

/* ── Helpers ─────────────────────────────────────────────────────── */

export function getModuleBySlug(slug: string): PlatformModule | undefined {
  return PLATFORM_MODULES.find((m) => m.slug === slug);
}

export function getModuleSlugs(): string[] {
  return PLATFORM_MODULES.map((m) => m.slug);
}
