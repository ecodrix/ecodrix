/**
 * ERIX Help (doc.ecodrix.com): collections, the article registry, links and
 * the search index. The help center is served on its own host; `helpHref`
 * builds paths for it. Screens come from a fictional demo clinic on a local
 * stack (no customer data), refreshed when the console UI changes.
 */
import type { SearchEntry } from "@/components/docs/DocsSearch";
import { AGENTS, AUTOMATIONS } from "./agents-and-automations";
import { ACCOUNT, CHANNELS } from "./channels-and-account";
import { GETTING_STARTED } from "./getting-started";
import { CUSTOMERS, INBOX } from "./inbox-and-customers";
import { REFERENCE } from "./reference";
import type { HelpArticle, HelpCollection } from "./types";

export type { HelpArticle, HelpBlock, HelpCollection, HelpKind, Shot } from "./types";

/** The help center's public origin. */
export const HELP_ORIGIN = "https://doc.ecodrix.com";

/**
 * Path prefix of the help pages. Empty on doc.ecodrix.com, where the host
 * rewrite serves `app/(help)/help/*` at the root; set NEXT_PUBLIC_HELP_BASE
 * to "/help" for a deployment without that host (a preview, say).
 */
const HELP_BASE = process.env.NEXT_PUBLIC_HELP_BASE ?? "";

export function helpHref(path = "/"): string {
  if (path === "/") return HELP_BASE || "/";
  return `${HELP_BASE}${path}`;
}

export const CONSOLE_SIGNUP = "https://console.ecodrix.com/auth/signup";
export const CONSOLE_URL = "https://console.ecodrix.com";

export const HELP_COLLECTIONS: HelpCollection[] = [
  {
    slug: "getting-started",
    title: "Getting started",
    summary: "Create your account, find your way around and set ERIX up for your team.",
    icon: "compass",
  },
  { slug: "inbox", title: "Inbox", summary: "Answer customers from every channel in one place.", icon: "inbox" },
  {
    slug: "customers",
    title: "Customers",
    summary: "Contacts, your pipeline and online bookings.",
    icon: "users",
  },
  {
    slug: "agents",
    title: "Agents",
    summary: "Teach your AI assistant, decide what it may do, approve its drafts.",
    icon: "sparkles",
  },
  {
    slug: "automations",
    title: "Automations",
    summary: "Reminders and follow-ups that run on their own.",
    icon: "workflow",
  },
  {
    slug: "channels",
    title: "Channels",
    summary: "Connect WhatsApp, your phone number and your other apps.",
    icon: "plug",
  },
  {
    slug: "account",
    title: "Plan and data",
    summary: "Your plan and usage, and your customers' data rights.",
    icon: "shield-check",
  },
  { slug: "reference", title: "Reference", summary: "Common questions and the words ERIX uses.", icon: "book-open" },
];

/** Articles about Upcoming features: content kept, not listed or served until the feature is live. */
const NOT_LIVE = new Set(["customers/send-an-invoice", "channels/add-website-chat"]);

export const HELP_ARTICLES: HelpArticle[] = [
  ...GETTING_STARTED,
  ...INBOX,
  ...CUSTOMERS,
  ...AGENTS,
  ...AUTOMATIONS,
  ...CHANNELS,
  ...ACCOUNT,
  ...REFERENCE,
].filter((a) => !NOT_LIVE.has(`${a.collection}/${a.slug}`));

export function collection(slug: string): HelpCollection | undefined {
  return HELP_COLLECTIONS.find((c) => c.slug === slug);
}

export function articlesIn(slug: string): HelpArticle[] {
  return HELP_ARTICLES.filter((a) => a.collection === slug);
}

export function article(collectionSlug: string, slug: string): HelpArticle | undefined {
  return HELP_ARTICLES.find((a) => a.collection === collectionSlug && a.slug === slug);
}

/** "collection/slug" → the article, for related links. */
export function byKey(key: string): HelpArticle | undefined {
  const [c, s] = key.split("/");
  return article(c, s);
}

export function articleHref(a: HelpArticle): string {
  return helpHref(`/${a.collection}/${a.slug}`);
}

export const KIND_LABEL: Record<HelpArticle["kind"], string> = {
  tutorial: "Tutorial",
  "how-to": "How-to",
  reference: "Reference",
  explanation: "Explained",
};

/** The first articles a new owner should read, in order. */
export const START_HERE = [
  "getting-started/create-your-account",
  "channels/connect-whatsapp",
  "agents/teach-the-agent",
  "customers/take-bookings-online",
];

const plain = (s: string) => s.replace(/\*\*|`/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

export const HELP_SEARCH: SearchEntry[] = HELP_ARTICLES.flatMap((a) => [
  {
    href: articleHref(a),
    title: a.title,
    kind: collection(a.collection)?.title ?? "",
    hint: plain(a.summary),
  },
  ...(a.problems ?? []).map((p) => ({
    href: `${articleHref(a)}#questions`,
    title: plain(p.q),
    kind: "Question",
    hint: plain(p.a),
  })),
]);
