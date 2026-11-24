/**
 * The AI Employee section (/platform/ai-employee): ONE kind of AI employee
 * that a business sets up per channel. Every page is data here; EmployeePage renders
 * them all. Each job below was checked against the server and the console builder
 * on 24 Nov 2026 (references in docs: 2026-11-24 agents-pages report). Add a claim
 * only after finding it in code: payment links and pipeline-stage moves are NOT
 * offered to an agent in a customer chat (`shared/flow/custom-agents.ts` AUTO_REPLY_TOOLS).
 */

import type { LazyScreenName } from "@/components/product-screens/lazy-screen";
import type { ModuleStatus } from "@/lib/site";

type Faq = { q: string; a: string };
type Item = { title: string; text: string };

/** The visual a page leads with: a lazy console scene, or the agent's three outcomes. */
export type EmployeeVisual = LazyScreenName | "outcomes";

export interface EmployeePage {
  slug: "whatsapp" | "website-chat" | "instagram" | "email";
  /** Card and breadcrumb name. */
  name: string;
  /** Brand mark or glyph for the card. */
  icon: "whatsapp" | "globe" | "instagram" | "mail";
  /** SEO title (the root template adds " | ECODrIx"). */
  title: string;
  description: string;
  hero: { title: string; lead: string };
  visual: EmployeeVisual;
  /** One line on the hub card. */
  blurb: string;
  jobs: Item[];
  handoff: Item[];
  /** Said once under the hand-over list, only when this channel differs. */
  handoffNote?: string;
  /** What must exist before step 1. */
  needs: string;
  faqs: Faq[];
  /** Absent = live. Follows admin › Catalog; a not-yet-live desk keeps its page with a badge. */
  status?: ModuleStatus;
}

/** A desk on the hub. `href` absent = Coming soon, no page. */
export interface Desk {
  name: string;
  icon: "whatsapp" | "globe" | "instagram" | "mail" | "phone" | "facebook" | "telegram";
  status: ModuleStatus;
  blurb: string;
  href?: string;
}

/** The console's own step names (saas `agents/new/HireAgent.tsx` STEPS). */
export const HIRE_STEPS = [
  { title: "Tell it the job", text: "Type it, or pick a template." },
  { title: "Check the short steps", text: "ERIX fills them from your business; you tick and change." },
  { title: "Test, then go live", text: "Chat with it, then switch it on. Nothing goes live until you publish." },
];

/** Why a chat reaches a person on every desk (`human-topics.ts`, `buildModel.ts` HANDOVER_OPTIONS). */
export const HANDOFF_COMMON: Item[] = [
  { title: "The customer asks for a person", text: "Always. You cannot switch this off." },
  { title: "An emergency or safety problem", text: "Always. You cannot switch this off." },
  {
    title: "Refunds, complaints, discounts, cancellations",
    text: "It never answers these on its own. Medical, legal and money advice questions go to you too.",
  },
  {
    title: "It cannot find the answer",
    text: "It does not guess. It tells your team the AI was not sure and asks them to reply.",
  },
  { title: "Your own words", text: "Add keywords of your own. A chat with one of them goes to your team." },
];

export const EMPLOYEE_PAGES: EmployeePage[] = [
  {
    slug: "whatsapp",
    name: "WhatsApp",
    icon: "whatsapp",
    title: "AI employee for WhatsApp",
    description:
      "An AI employee on your own WhatsApp Business number: it answers from your facts, books visits and passes the chat to your team when it should.",
    hero: {
      title: "An AI employee on your WhatsApp",
      lead: "It answers customers on your own WhatsApp Business number from your own facts, books the visit, and passes the chat to you when it should.",
    },
    visual: "inbox",
    blurb: "Answers on your own WhatsApp Business number and books visits.",
    jobs: [
      {
        title: "Answers from your Knowledge",
        text: "FAQs, price lists, policies, your website and files. It quotes them instead of guessing.",
      },
      {
        title: "Replies on its own only when it is sure",
        text: "When the answer is in your Knowledge and you have switched auto-reply on, it sends. Otherwise it leaves a draft for your team.",
      },
      {
        title: "Books appointments",
        text: "It checks open slots and books one. By default a booking waits for your OK; you can let it book on its own.",
      },
      {
        title: "Keeps the contact up to date",
        text: "It saves the name and the answers to your qualifying questions, adds tags and logs the chat on the contact. It never changes a phone, email, status or deal value because a customer asked.",
      },
      {
        title: "Answers replies to your campaigns",
        text: "When a contact replies to one of your campaigns, that campaign's AI employee can answer.",
      },
      {
        title: "Follows WhatsApp's 24-hour rule",
        text: "It replies freely within 24 hours of the customer's last message. After that it can only send an approved template you pick, and Meta bills that to your account. It honours STOP.",
      },
    ],
    handoff: HANDOFF_COMMON,
    needs: "Connect your WhatsApp Business number first (Channels, WhatsApp).",
    faqs: [
      {
        q: "Do I need my own WhatsApp Business number?",
        a: "Yes. You connect your own account through Meta's signup. Meta bills your messages to you directly, with no ERIX markup.",
      },
      {
        q: "Will it answer at night?",
        a: "Yes, unless you set it to business hours only. Then it stays quiet while your line is closed.",
      },
      {
        q: "What if it does not know the answer?",
        a: "It does not guess. It writes a draft for your team, and with auto-reply on, your team is told the AI was not sure.",
      },
      {
        q: "Can it send a payment link?",
        a: "Not in a customer chat today. Payments are never offered to it there, so your team sends the link.",
      },
      {
        q: "Can it move a deal to another pipeline stage?",
        a: "No. It can update contact details, add tags and log the chat. Stages and status stay with your team.",
      },
    ],
  },
  {
    slug: "website-chat",
    name: "Website chat",
    status: "soon", // catalog default for connect.webchat is "soon" (founder, 24 Nov 2026)
    icon: "globe",
    title: "AI employee for website chat",
    description:
      "An AI employee in the chat box on your website: it answers from your facts, asks for a number only if you want, and moves the chat to WhatsApp when your team steps in.",
    hero: {
      title: "An AI employee in your website chat",
      lead: "Visitors ask, your AI employee answers from your facts. When your team needs to step in, the chat moves to WhatsApp, or waits for your reply in the Inbox.",
    },
    visual: "widget",
    blurb: "A chat box on your site. Moves to WhatsApp when your team steps in.",
    jobs: [
      {
        title: "Answers from your Knowledge",
        text: "The visitor sees it typing. Replies are labelled as AI unless you choose otherwise.",
      },
      {
        title: "Knows which page the visitor is on",
        text: "The page they are reading helps it answer, and is treated as text to read, never as instructions.",
      },
      {
        title: "Asks for details only when you want",
        text: "Before the chat, only when needed, or never. What the visitor types is saved on their contact.",
      },
      {
        title: "Books appointments",
        text: "It books only with a phone number the visitor actually typed in the chat, never one it guessed.",
      },
      {
        title: "Keeps the chat in your Inbox",
        text: "Every visitor message lands in the same Inbox as WhatsApp and email, so your team can read it or take over.",
      },
    ],
    handoff: HANDOFF_COMMON,
    handoffNote:
      "When your WhatsApp is connected, the visitor gets a WhatsApp link with a short code, and the code ties their message back to the chat. Without WhatsApp, they are told the team will reply right here, with your hours, and your reply waits in the Inbox. Notices come in English, Hindi and Telugu.",
    needs: "Add your website's domain and paste one line of code before </body> (Channels, Website chat).",
    faqs: [
      {
        q: "How do I add it to my website?",
        a: "Add your domain in Channels, paste one line of code before </body> on every page, then click Check my website. It runs only on the domains you add.",
      },
      {
        q: "Does it work on WordPress, Shopify or Wix?",
        a: "Anywhere you can add code to every page. Wix needs a paid plan with your own domain.",
      },
      {
        q: "What if my team is offline?",
        a: "The visitor is told the team will reply in the chat, with your hours if you set them. The chat waits in your Inbox.",
      },
      {
        q: "Does the visitor know it is an AI?",
        a: "By default yes, its replies are labelled as AI. It is your choice in its settings.",
      },
      {
        q: "Does it work on phones?",
        a: "Yes. On small screens the chat opens full screen.",
      },
    ],
  },
  {
    slug: "instagram",
    name: "Instagram",
    icon: "instagram",
    title: "AI employee for Instagram DMs",
    description:
      "An AI employee on your Instagram business account: it answers DMs from your facts in your shared inbox and passes the chat to your team when it should.",
    hero: {
      title: "An AI employee on your Instagram",
      lead: "Customers message your business account. Your AI employee answers from your own facts in the same inbox as everything else, and hands over when a person should.",
    },
    visual: "outcomes",
    blurb: "Answers DMs from your business account in the shared inbox.",
    jobs: [
      {
        title: "Answers DMs from your Knowledge",
        text: "FAQs, prices, policies, your website. It quotes them instead of guessing.",
      },
      {
        title: "Books appointments",
        text: "It checks open slots and books one. By default a booking waits for your OK.",
      },
      {
        title: "Keeps the contact up to date",
        text: "It saves the name and the answers to your qualifying questions, adds tags and logs the chat on the contact.",
      },
      {
        title: "Writes a reply to a comment",
        text: "It can write a short reply to a comment on your post from your Knowledge.",
      },
      {
        title: "Follows Instagram's 24-hour rule",
        text: "It replies freely within 24 hours of the customer's last message. After that a person has to write.",
      },
    ],
    handoff: HANDOFF_COMMON,
    needs: "Connect your Instagram business account first (Channels, Instagram).",
    faqs: [
      {
        q: "Can it reply after 24 hours?",
        a: "No. Instagram allows free text only for 24 hours after the customer's last message, then a person has to write.",
      },
      {
        q: "Does it reply to comments on my posts?",
        a: "It can write a short reply to a comment for you. DMs are its main job.",
      },
      {
        q: "What if it does not know the answer?",
        a: "It does not guess. It leaves a draft for your team and, with auto-reply on, tells them the AI was not sure.",
      },
      {
        q: "Can it send a payment link?",
        a: "Not in a customer chat today. Your team sends the link.",
      },
    ],
  },
  {
    slug: "email",
    name: "Email",
    icon: "mail",
    title: "AI employee for email",
    description:
      "An AI employee on your business email: it writes the reply from your facts and leaves it as a draft for you to send, unless you let it send.",
    hero: {
      title: "An AI employee on your email",
      lead: "It reads customer email on your own domain and writes the reply from your facts. You read it and send, unless you choose to let it send.",
    },
    visual: "ai",
    blurb: "Writes replies from your facts. You send, unless you let it.",
    jobs: [
      {
        title: "Drafts replies from your Knowledge",
        text: "Every reply starts as a draft in your Inbox. A sent email cannot be recalled, so drafting is the default.",
      },
      {
        title: "Can send on its own, if you allow it",
        text: "Off by default. When on, it sends only a reply backed by your Knowledge, and only in a thread the customer started.",
      },
      {
        title: "Holds changes for you",
        text: "On email, bookings and contact changes do not run unattended. They wait for your OK.",
      },
      {
        title: "Works on your own domain",
        text: "Connect Gmail, AWS SES or your own SMTP. Mail lands in the same Inbox as your other channels.",
      },
    ],
    handoff: HANDOFF_COMMON,
    needs: "Connect your business email first (Channels, Email).",
    faqs: [
      {
        q: "Will it send emails by itself?",
        a: "Not unless you turn that on. By default every reply is a draft for you.",
      },
      {
        q: "Will it email people who never wrote to me?",
        a: "Auto-send is limited to a thread the customer started. It does not start cold emails.",
      },
      {
        q: "Which email can I connect?",
        a: "Gmail, AWS SES or your own SMTP server.",
      },
      {
        q: "What if it does not know the answer?",
        a: "It does not guess. Your team is asked to reply.",
      },
    ],
  },
];

/** Hub desks: live pages first, then Phone (existing page), then channels that are not live. */
export const DESKS: Desk[] = [
  ...EMPLOYEE_PAGES.map(toDesk),
  {
    name: "Phone calls",
    icon: "phone",
    status: "invite",
    blurb:
      "An AI employee for phone calls: 37 voices in 11 languages, on your own Indian number. It books appointments and takes messages.",
    href: "/platform/erix-voice",
  },
  { name: "Messenger", icon: "facebook", status: "soon", blurb: "Facebook Messenger from your Page." },
  { name: "Telegram", icon: "telegram", status: "soon", blurb: "A Telegram bot in the shared inbox." },
];

function toDesk(p: EmployeePage): Desk {
  return {
    name: p.name,
    icon: p.icon,
    status: p.status ?? "live",
    blurb: p.blurb,
    href: `/platform/ai-employee/${p.slug}`,
  };
}

export const HUB = {
  title: "ERIX AI Employee for your business",
  description:
    "One AI employee that you set up on each desk where customers reach you: WhatsApp, website chat, Instagram, email and Phone. It answers from your facts and hands over to you.",
  hero: {
    title: "Hire an AI employee for every desk",
    lead: "Pick where customers reach you. Your AI employee answers from your own facts, books visits and hands the chat to you when it should.",
  },
  one: [
    {
      title: "The same Knowledge",
      text: "FAQs, price lists, policies, your website and files live in one place. Every desk answers from it and quotes it instead of guessing.",
    },
    {
      title: "The same rules",
      text: "Refunds, complaints and medical questions go to your team on every desk. You set your own hand-over words once.",
    },
    {
      title: "The same customer record",
      text: "Every chat lands in one Inbox, on the contact in your CRM, with bookings and notes on the same record.",
    },
    {
      title: "A separate setup per desk",
      text: "Each channel gets its own setup, so you set the tone, hours and jobs for WhatsApp apart from email.",
    },
  ] as Item[],
  handoffLead:
    "It answers what it can from your Knowledge. Everything else goes to a person, and it pauses on that chat.",
  handoffAfter: [
    {
      title: "Your team is told",
      text: "You can name the teammate who takes the chat and who to alert if nobody replies after a wait you set.",
    },
    {
      title: "You decide how much it does alone",
      text: "Off, Suggest, With approval or Act and report. Replies go out on their own only when the answer is in your Knowledge.",
    },
  ] as Item[],
  faqs: [
    {
      q: "Is this one product or one per channel?",
      a: "One. ERIX has one kind of AI employee. You set it up once for each channel you want it on, so each desk can have its own tone, hours and jobs.",
    },
    {
      q: "Does it replace my team?",
      a: "No. It answers what your Knowledge covers and passes the rest to a person. Refunds, complaints and anything about money or health always go to your team.",
    },
    {
      q: "Does it tell customers it is an AI?",
      a: "By default yes. In chat its replies are labelled as AI, and on the phone it says so. You can change this for chat in its settings.",
    },
    {
      q: "Can it send payment links or move deals between stages?",
      a: "Not in a customer chat today. It can book appointments, update contact details, add tags and log the chat. Your team handles payments and stages.",
    },
    {
      q: "Which channels work today?",
      a: "WhatsApp, website chat, Instagram, email and Phone (Phone is open by request). Messenger and Telegram are coming soon.",
    },
  ] as Faq[],
};

export const getEmployeePage = (slug: string) => EMPLOYEE_PAGES.find((p) => p.slug === slug);
