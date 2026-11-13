// Icons are glyph names, not components: this file is imported by client
// code (the header), and importing an icon component would ship the whole
// icon set with it.
import type { IconName } from "@/components/icons";

/**
 * Site-wide navigation data: the one main call to action and the Platform
 * menu. Used by the navbar, footer, home page and /platform.
 */

/**
 * The main call to action, everywhere on the site. Signups aren't open yet,
 * so it leads to the early-access form. When the founder opens signups, change it to:
 *   { label: "Start free", href: "https://console.ecodrix.com/auth/register" }
 */
export const PRIMARY_CTA = {
  label: "Request early access",
  href: "/#contact",
} as const;

/** The header's one action: the contact section on the home page (its form is answered by a person). */
export const CONTACT_CTA = { label: "Contact", href: PRIMARY_CTA.href } as const;

/**
 * The second action: a WhatsApp chat. This is the ECODrIx number already
 * published on /about ("Want to talk to the founder?"); don't invent another.
 */
export const WHATSAPP_CTA = {
  label: "Chat on WhatsApp",
  href: "https://wa.me/918143963821",
} as const;

export type ModuleStatus = "live" | "soon" | "invite";

export const STATUS_LABEL: Record<ModuleStatus, string> = {
  live: "Live",
  soon: "Coming soon",
  invite: "Invite only",
};

/**
 * The Platform menu. `ai` marks AI/automation (purple, brand rule). Status
 * follows ECOD/docs/VERSION_PLAN.md: v1.0 is live, ERIX Store is coming
 * soon. LAIE stays private until it proves itself (founder, 3 Nov 2026) and
 * voice isn't launched, so neither is here.
 */
export const PLATFORM_NAV = [
  {
    key: "crm",
    icon: "square-kanban",
    name: "ERIX CRM",
    href: "/platform/erix-crm",
    summary: "Contacts, pipeline, forms and bookings.",
    status: "live",
    card: {
      headline: "One record, from first message to booked visit.",
      text: "Pipeline, forms and bookings on one contact. GST invoices and payment links are coming soon.",
    },
  },
  {
    key: "connect",
    icon: "graph-star",
    name: "ERIX Connect",
    href: "/platform/erix-connect",
    summary: "One inbox for WhatsApp and phone calls.",
    status: "live",
    card: {
      headline: "WhatsApp and calls in one inbox, on the right contact.",
      text: "The official WhatsApp API on your own number, plus phone calls. Instagram, email and website chat are coming soon.",
    },
  },
  {
    key: "agents",
    icon: "sparkles",
    name: "AI agents",
    href: "/platform#agents",
    summary: "Answers from your knowledge, books, and hands off to you.",
    status: "live",
    card: {
      headline: "Replies at 9:42 pm, from your own price list.",
      text: "Answers from your FAQs and pages, drafts when unsure, and asks you before anything about money.",
    },
    ai: true,
  },
  {
    key: "flow",
    icon: "workflow",
    name: "ERIX Flow",
    href: "/platform/erix-flow",
    summary: "Follow-ups and reminders that run on their own.",
    status: "live",
    card: {
      headline: "Follow-ups that run on their own.",
      text: "A new lead, a stage change or a paid invoice starts it: send, wait for a reply, ask for approval.",
    },
    ai: true,
  },
  {
    key: "storage",
    icon: "folder-open",
    name: "ERIX Storage",
    href: "/platform/erix-storage",
    summary: "Files kept with the client and project they belong to.",
    status: "live",
    card: {
      headline: "Files that stay with the deal.",
      text: "Documents and images kept on the client and project they belong to, inside your workspace.",
    },
  },
] as const satisfies readonly {
  key: string;
  icon: IconName;
  name: string;
  href: string;
  summary: string;
  status: ModuleStatus;
  card: { headline: string; text: string };
  ai?: boolean;
}[];

/** Industries: the use-case pages under ERIX CRM (lib/product-pages.ts). */
export const INDUSTRY_NAV = [
  {
    icon: "building-2",
    name: "Real estate",
    href: "/platform/erix-crm/real-estate",
    summary: "Night enquiries, weekend site visits, the token amount.",
    card: {
      headline: "Night enquiries answered, site visits booked.",
      text: "The agent replies from your project details, books the weekend visit, and follow-ups go out on their own.",
    },
  },
  {
    icon: "stethoscope",
    name: "Clinics",
    href: "/platform/erix-crm/healthcare",
    summary: "Bookings in IST, reminders, medical questions to your team.",
    card: {
      headline: "Bookings in IST, reminders on WhatsApp.",
      text: "Patients book a slot and get a reminder; medical questions always go to your team.",
    },
  },
  {
    icon: "graduation-cap",
    name: "Coaching institutes",
    href: "/platform/erix-crm/education",
    summary: "Answers at 10:30 pm, counselling bookings, follow-ups.",
    card: {
      headline: "Answers at 10:30 pm, while parents decide.",
      text: "Course and fee questions answered from your own details, counselling booked, follow-ups sent on WhatsApp.",
    },
  },
  {
    icon: "store",
    name: "D2C and local brands",
    href: "/platform/erix-crm/d2c-ecommerce",
    summary: "Every DM in one list, festive offers on WhatsApp.",
    card: {
      headline: "Every DM in one list.",
      text: "WhatsApp messages and calls on one contact, and festive offers sent as approved WhatsApp broadcasts.",
    },
  },
] as const satisfies readonly {
  icon: IconName;
  name: string;
  href: string;
  summary: string;
  /** The header menu's spotlight card while this row is hovered or focused. */
  card: { headline: string; text: string };
}[];

/** Resources: the blog, the comparisons and the guides hub (footer, phone menu and header). */
export const RESOURCE_NAV = [
  {
    icon: "book-open",
    name: "Blog",
    href: "/blog",
    summary: "Notes on selling over WhatsApp.",
    card: {
      headline: "Short, practical reads for owners.",
      text: "Enquiries, follow-ups and getting paid, written for Indian small businesses.",
      cta: "Read the blog",
    },
  },
  { icon: "scale", name: "Compare ERIX", href: "/compare", summary: "ERIX next to Wati, AiSensy and more." },
  {
    icon: "compass",
    name: "Guides",
    href: "/guides",
    summary: "Step-by-step setup for every channel.",
    card: {
      headline: "Set up ERIX one step at a time.",
      text: "WhatsApp, website chat, email on your domain, Google Meet and Razorpay, in plain steps.",
      cta: "See all guides",
    },
  },
  {
    icon: "help-circle",
    name: "Help center",
    href: "https://doc.ecodrix.com",
    summary: "How to do each job in ERIX, with real screens.",
  },
] as const satisfies readonly {
  icon: IconName;
  name: string;
  href: string;
  summary: string;
  card?: { headline: string; text: string; cta: string };
}[];

/** Setup guides shown in the header's Resources menu (all of them are on /guides). Seven, so the
 *  panel fills three rows of three with the blog and the comparisons. */
export const GUIDE_NAV = [
  {
    icon: "whatsapp",
    name: "WhatsApp Business API",
    href: "/platform/erix-connect/whatsapp-api-guide",
    summary: "Connect your own number.",
    card: {
      headline: "Your own number on the official WhatsApp API.",
      text: "Connect through Meta's signup, get templates approved and reply within WhatsApp's 24-hour rule.",
    },
  },
  {
    icon: "megaphone",
    name: "Broadcast limits",
    href: "/platform/erix-connect/whatsapp-broadcast-limits",
    summary: "Meta's daily limits, explained.",
    card: {
      headline: "How many people can you message a day?",
      text: "Meta's messaging tiers, how a number moves up, and what keeps it in good standing.",
    },
  },
  {
    icon: "calendar-days",
    name: "Google Calendar and Meet",
    href: "/platform/erix-crm/google-meet-guide",
    summary: "Bookings with a Meet link.",
    card: {
      headline: "Bookings on your calendar, with a Meet link.",
      text: "Connect Google, create appointment types, set your hours and share one booking link.",
    },
  },
] as const satisfies readonly {
  icon: IconName;
  name: string;
  href: string;
  summary: string;
  card: { headline: string; text: string };
}[];

export const COMPARE_NAV = [
  { name: "ERIX vs WATI", href: "/compare/ecodrix-vs-wati" },
  { name: "ERIX vs AiSensy", href: "/compare/ecodrix-vs-aisensy" },
  { name: "ERIX vs Interakt", href: "/compare/ecodrix-vs-interakt" },
] as const;

export const COMPANY_NAV = [
  {
    name: "About ECODrIx",
    href: "/about",
    summary: "The Indian company behind ERIX.",
    card: {
      headline: "Building ERIX in Andhra Pradesh since August 2025.",
      text: "One workspace for Indian businesses that sell over WhatsApp and phone calls.",
      cta: "About ECODrIx",
    },
  },
  {
    name: "Founder",
    href: "/founder",
    summary: "Dhanesh M, and why ERIX exists.",
    card: {
      headline: "Dhanesh M, founder of ECODrIx.",
      text: "Why ERIX exists, and how to reach the person building it.",
      cta: "Meet the founder",
    },
  },
] as const;

export const SUPPORT_EMAIL = "support@ecodrix.com";

// Text labels, never other companies' logos (DS brand rule).
export const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/ecodrix" },
  { label: "GitHub", href: "https://github.com/ecodrix" },
  { label: "Instagram", href: "https://www.instagram.com/ecodr.ix/" },
] as const;
