/**
 * The AI Employee section (/platform/ai-employee): ONE kind of AI employee
 * that a business sets up per channel. Every page is data here; EmployeePage renders
 * them all. Each job below was checked against the server and the console builder
 * on 24 Nov 2026 (references in docs: 2026-11-24 agents-pages report). Add a claim
 * only after finding it in code: payment links and pipeline-stage moves are NOT
 * offered to an agent in a customer chat (`shared/flow/custom-agents.ts` AUTO_REPLY_TOOLS).
 */

import type { GlyphName } from "@/components/icons";
import { email } from "@/lib/platform/employee/email";
import { instagram } from "@/lib/platform/employee/instagram";
import { websiteChat } from "@/lib/platform/employee/website-chat";
import { whatsapp } from "@/lib/platform/employee/whatsapp";
import type { ModuleStatus } from "@/lib/site";

export type Faq = { q: string; a: string };
export type Item = { title: string; text: string };
export type IconItem = Item & { icon?: GlyphName };

/** One turn of an example chat. `draft` is an AI draft waiting in the Inbox; `system` is a line in the owner's Inbox. */
export interface ExampleMsg {
  from: "customer" | "ai" | "team" | "system" | "draft";
  text: string;
  /** "Based on:" sources for ai and draft turns. */
  source?: string;
  /** Draft only: the "Proposed action" line. */
  action?: string;
  /** System only: who sees this line. */
  label?: string;
}

export interface ChannelPage {
  slug: "whatsapp" | "website-chat" | "instagram" | "email";
  /** Catalog item that decides this desk's state (admin › Catalog). */
  catalogId: string;
  /** Card and breadcrumb name. */
  name: string;
  /** Brand mark or glyph for the card. */
  icon: "whatsapp" | "globe" | "instagram" | "mail";
  /** SEO title (the root template adds " | ECODrIx"). */
  title: string;
  description: string;
  hero: { title: string; lead: string };
  heroFacts: { icon: GlyphName; label: string }[];
  /** Which turns of the example the hero shows: [from, to) of messages. Not the opening, which the example below starts with. */
  heroTurns: [number, number];
  /** One line on the hub card. */
  blurb: string;
  example: {
    /** Section heading and the line under it. */
    title: string;
    lead: string;
    /** Header strip of the chat card, for example "WhatsApp · Nila Dental". */
    bar: string;
    /** Who the customer is in the chat, for screen readers and labels. */
    customer: string;
    messages: ExampleMsg[];
    /** `at` is the 1-based turn the note sits under. */
    notes: { at: number; title: string; text: string }[];
  };
  path: { title: string; text: string; icon?: GlyphName }[];
  pathLead: string;
  jobs: { title: string; text: string; example?: string }[];
  doesNot: Item[];
  /** Three steps, the first one connects this channel. */
  setup: Item[];
  needs: { text: string; icon?: GlyphName }[];
  needsLead?: string;
  controls: Item[];
  rules: IconItem[];
  /** What the customer sees when a chat is handed over on this channel. */
  handoffNote: string;
  faqs: Faq[];
  /** Fallback when the catalog cannot be read; absent = live. The catalog decides otherwise, and a not-yet-live desk keeps its page with a badge. */
  status?: ModuleStatus;
}

export interface EmployeePage extends ChannelPage {
  handoff: Item[];
}

/** Said once under every example. */
export const EXAMPLE_NOTE = "This is an invented example. Names and numbers are made up.";

/** Shown in the hero only while the catalog says the desk is not live. */
export const notLiveLine = (name: string) => `${name} is not open yet. This is how it works when it opens.`;

/** A desk on the hub. `href` absent = Coming soon, no page. */
export interface Desk {
  name: string;
  icon: "whatsapp" | "globe" | "instagram" | "mail" | "phone" | "facebook" | "telegram";
  /** Absent = hand-set `status`, the catalog is not asked. */
  catalogId?: string;
  /** Hand-set, or the fallback when the catalog cannot be read; null = left out then. */
  status: ModuleStatus | null;
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
  { title: "Medical, legal or money advice", text: "Questions asking for it always go to your team." },
  {
    title: "Refunds, complaints, discounts, cancellations",
    text: "These go to your team unless you switch that off in Agents, Rules.",
  },
  {
    title: "It cannot find the answer",
    text: 'If it is set to reply on its own and is not sure, it keeps the reply as a draft and hands the chat to your team with the reason "AI wasn\'t sure of the answer, please reply".',
  },
  { title: "Your own words", text: "Add keywords of your own. A chat with one of them goes to your team." },
];

/** Channel content lives one file per channel; the shared hand-over list joins here. */
export const EMPLOYEE_PAGES: EmployeePage[] = [whatsapp, websiteChat, instagram, email].map((c) => ({
  ...c,
  handoff: HANDOFF_COMMON,
}));

/** Hub desks: live pages first, then Phone (existing page), then channels that are not live. */
export const DESKS: Desk[] = [
  ...EMPLOYEE_PAGES.map(toDesk),
  {
    name: "Phone calls",
    icon: "phone",
    catalogId: "connect.voice",
    status: "live",
    blurb:
      "An AI employee for phone calls: 37 voices in 11 languages, on your own Indian number. It books appointments and takes messages.",
    href: "/platform/erix-voice",
  },
  // Hidden in the catalog today: null fallback keeps them out until staff list them.
  {
    name: "Messenger",
    icon: "facebook",
    catalogId: "connect.facebook",
    status: null,
    blurb: "Facebook Messenger from your Page.",
  },
  {
    name: "Telegram",
    icon: "telegram",
    catalogId: "connect.telegram",
    status: null,
    blurb: "A Telegram bot in the shared inbox.",
  },
];

function toDesk(p: EmployeePage): Desk {
  return {
    name: p.name,
    icon: p.icon,
    catalogId: p.catalogId,
    status: p.status ?? "live",
    blurb: p.blurb,
    href: `/platform/ai-employee/${p.slug}`,
  };
}

export const HUB = {
  title: "ERIX AI Employee for your business",
  description:
    "One AI employee you set up on each desk where customers reach you. It answers from your facts and hands over to you.",
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
      text: "Medical, legal and money advice always go to your team on every desk, and refunds and complaints do by default. You set your own hand-over words once.",
    },
    {
      title: "The same customer record",
      text: "Every chat lands in one Inbox, on the contact in your CRM, with bookings and notes on the same record.",
    },
    {
      title: "One assistant or several",
      text: "You can use one assistant on several channels, or a different assistant on each. Only one assistant answers a channel.",
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
      title: "When it sends on its own",
      text: "It sends on its own when the answer is in your Knowledge or comes from a booking it just made, and it is sure. Short greetings like hi and thanks also go out. Otherwise the reply waits as a draft.",
    },
  ] as Item[],
  faqs: [
    {
      q: "Is this one product or one per channel?",
      a: "One kind of AI employee. You can use one assistant on several channels, or a different assistant on each. Only one assistant answers a channel.",
    },
    {
      q: "Does it replace my team?",
      a: "No. It answers what your Knowledge covers and passes the rest to a person. Anything asking for medical, legal or money advice always goes to your team, and refunds and complaints do by default.",
    },
    {
      q: "Does it tell customers it is an AI?",
      a: "On phone calls and in website chat, yes by default, and you can switch it off. On WhatsApp, Instagram and email it says it is an AI when a customer asks.",
    },
    {
      q: "Can it send payment links or move deals between stages?",
      a: "Not in a customer chat today. It can book appointments, save the customer's name and answers, add tags and log the chat. Your team handles payments and stages.",
    },
    {
      q: "Which channels work today?",
      a: "Each desk on this page shows whether it is open yet. A desk that is not open has a badge, and its page explains how it will work.",
    },
  ] as Faq[],
};

export const getEmployeePage = (slug: string) => EMPLOYEE_PAGES.find((p) => p.slug === slug);
