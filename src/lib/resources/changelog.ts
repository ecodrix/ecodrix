/**
 * ERIX release notes, newest first (moved from the API server's /changelog).
 * `text` is rendered by <Rich>: `code`, **bold** and [label](/path).
 */

import type { GlyphName } from "@/components/icons";

export type ReleaseBadge = "Launch" | "New" | "Breaking";

export interface Release {
  version: string;
  date: string;
  badges: ReleaseBadge[];
  items: { icon: GlyphName; title: string; text: string }[];
}

export const RELEASES: Release[] = [
  {
    version: "v1.0.0",
    date: "Oct 2026 · launch",
    badges: ["Launch", "New"],
    items: [
      {
        icon: "chart-line",
        title: "Status page",
        text: "Live status for every module, 90-day uptime, response times and incidents detected from health checks.",
      },
      {
        icon: "file-text",
        title: "Developer docs",
        text: "SDK and cURL samples side by side, with search.",
      },
      {
        icon: "workflow",
        title: "ERIX Flow for everyone",
        text: "Automations are open to every workspace, on the same contacts and inbox.",
      },
      {
        icon: "shield-check",
        title: "Consent and data rights",
        text: "Forms and booking pages record consent. Export or erase a contact on request; invoices are kept.",
      },
      {
        icon: "receipt",
        title: "GST invoices",
        text: "CGST and SGST or IGST, place of supply and financial-year numbering on every PDF, with Razorpay payment links.",
      },
      {
        icon: "lock",
        title: "Security",
        text: "API keys stay on the server, client portal sessions expire after 24 hours, rate limits cover IPv6, and destructive actions need an admin.",
      },
    ],
  },
  {
    version: "v0.9.0",
    date: "12 Oct 2026",
    badges: ["New", "Breaking"],
    items: [
      {
        icon: "sparkles",
        title: "One AI agent, every channel",
        text: "AI replies on WhatsApp, Instagram, Messenger, Telegram, email and webchat, with human handoff, WhatsApp's 24-hour rule and per-conversation caps.",
      },
      {
        icon: "bot",
        title: "Module agents",
        text: "Agents for sales, channels and the website, each with an autonomy level, a budget and limits on the tools it may use.",
      },
      {
        icon: "file-text",
        title: "Knowledge base",
        text: "Answers come from your own text, web pages and files, and every draft cites its source.",
      },
      {
        icon: "shield-check",
        title: "Approvals",
        text: "AI drafts and actions wait for a person to approve them. Flows can pause at an approval step, and an Ask AI step writes replies inside a flow.",
      },
      { icon: "bell", title: "Follow-ups", text: "Schedule a follow-up on any lead and get reminded when it's due." },
      {
        icon: "message-circle",
        title: "Feedback surveys",
        text: "Sent automatically after an invoice is paid, a deal is won or a project completes. Scores come back over WhatsApp.",
      },
      {
        icon: "inbox",
        title: "One inbox",
        text: "Media on Telegram, Instagram and Messenger. Every inbound message is linked to its lead, and each member has their own read state.",
      },
      {
        icon: "users",
        title: "CRM",
        text: "Lead summaries built from the full cross-channel history. The owner gets an alert when an invoice is more than 7 days overdue.",
      },
      { icon: "refresh-cw", title: "Realtime", text: "Live updates resume after a reconnect without missing events." },
      {
        icon: "triangle-alert",
        title: "Breaking (API)",
        text: "`/v1/api/product/erix/portal-inbox/*` is removed. Client-portal threads are now the `portal` channel of the one inbox.",
      },
    ],
  },
  {
    version: "v0.8.0",
    date: "Sep 2026",
    badges: ["New"],
    items: [
      {
        icon: "tag",
        title: "Template variables, rebuilt",
        text: "Email and WhatsApp template variables map to CRM fields, are checked before saving, and preview with a real contact's data.",
      },
      {
        icon: "refresh-cw",
        title: "Realtime everywhere",
        text: "Changes reach every open screen live over WebSockets.",
      },
      {
        icon: "key",
        title: "Google sign-in, hardened",
        text: "Signed sign-in state and an isolated popup protect the Google Calendar and Meet connection.",
      },
      {
        icon: "trash-2",
        title: "Workspace deletion",
        text: "Permanent deletion erases a workspace's data in the background through the job queue.",
      },
      {
        icon: "user-check",
        title: "One onboarding",
        text: "A single guided setup for every new workspace, whichever product it starts with.",
      },
    ],
  },
  {
    version: "v0.7.0",
    date: "Aug 2026",
    badges: ["New"],
    items: [
      { icon: "users", title: "Merge duplicate leads", text: "Combine two records of the same customer into one." },
      {
        icon: "receipt",
        title: "Invoice payments",
        text: "Record payments, finalise or void invoices, mark overdue ones every day, email the PDF and export invoices.",
      },
      {
        icon: "workflow",
        title: "Automation packs",
        text: "Ready-made automations for each industry, and role-based access for team members.",
      },
      {
        icon: "megaphone",
        title: "Campaign A/B tests",
        text: "Send two versions of a campaign and compare how each performs.",
      },
      {
        icon: "image",
        title: "Instagram publishing",
        text: "Post images, reels and carousels to Instagram from ERIX.",
      },
      { icon: "message-circle", title: "WhatsApp inbox", text: "Delete one conversation or many at once." },
    ],
  },
  {
    version: "v0.6.0",
    date: "Jul 2026",
    badges: ["New"],
    items: [
      {
        icon: "calendar",
        title: "Bookings with Google Meet",
        text: "Connect Google Calendar, create appointment types with hosts and questions, and get a Meet link on every online booking. Busy times are kept off your booking page.",
      },
      {
        icon: "user-plus",
        title: "Lead capture",
        text: "Public lead-capture forms create leads, with a switch to create them automatically or skip.",
      },
      {
        icon: "square-kanban",
        title: "A CRM for any trade",
        text: "Pipelines and fields set up for your type of business instead of one fixed layout.",
      },
      {
        icon: "send",
        title: "Instagram and Telegram",
        text: "Monthly messaging limits per plan, and automations that reply to Instagram comments.",
      },
      {
        icon: "list-checks",
        title: "Activity timeline",
        text: "Every change on a contact shows in plain words, with where the lead came from.",
      },
      {
        icon: "trash-2",
        title: "Safer deletes",
        text: "Deleted workspaces are kept for 30 days before they're erased.",
      },
    ],
  },
  {
    version: "v0.5.0",
    date: "1 Jun 2026",
    badges: ["New", "Breaking"],
    items: [
      {
        icon: "chart-bar",
        title: "Plans and usage",
        text: "Subscriptions, plan entitlements and usage metering per workspace.",
      },
      {
        icon: "user-check",
        title: "Sign-up",
        text: "Self-serve workspace sign-up with email verification and guided onboarding.",
      },
      { icon: "workflow", title: "Flow engine v2", text: "Workflows with conditions, waits and AI responses." },
      { icon: "receipt", title: "Invoices", text: "GST invoices with recurring billing." },
      {
        icon: "lock",
        title: "Tenant isolation",
        text: "All workspace data lives on one platform, scoped to each workspace.",
      },
      {
        icon: "triangle-alert",
        title: "Breaking (API)",
        text: "Routes reorganised under `/v1/api`. See the [docs](/docs) for the current paths.",
      },
    ],
  },
  {
    version: "v0.4.0",
    date: "16 May 2026",
    badges: ["New"],
    items: [
      {
        icon: "clock",
        title: "Job queue",
        text: "A durable queue with priorities and fair scheduling per workspace runs delayed automations and campaigns.",
      },
      {
        icon: "workflow",
        title: "Workflow engine",
        text: "Multi-step workflows with branching, conditions and wait steps.",
      },
      {
        icon: "tag",
        title: "Template variables",
        text: "WhatsApp and email templates fill from CRM fields in one consistent way.",
      },
    ],
  },
  {
    version: "v0.3.0",
    date: "Feb 2026",
    badges: ["New"],
    items: [
      { icon: "mail", title: "Email campaigns", text: "Send campaigns to your contacts and see opens and clicks." },
      { icon: "chart-line", title: "Lead scoring", text: "Leads get a score from their activity." },
      {
        icon: "zap",
        title: "Custom trigger events",
        text: "Send your own events to ERIX and start automations from them.",
      },
    ],
  },
  {
    version: "v0.2.0",
    date: "Nov 2025",
    badges: ["New"],
    items: [
      {
        icon: "message-circle",
        title: "Two-way WhatsApp",
        text: "Chat with customers on the official WhatsApp Business API, on the contact's record.",
      },
      { icon: "megaphone", title: "WhatsApp broadcasts", text: "Send approved templates to many contacts at once." },
    ],
  },
  {
    version: "v0.1.0",
    date: "Aug 2025 · first release",
    badges: ["New"],
    items: [
      {
        icon: "flag",
        title: "Pipelines and leads",
        text: "A kanban pipeline with your stages, and a record for every lead with their details and notes.",
      },
      { icon: "file-text", title: "File storage", text: "Keep files on the lead they belong to." },
    ],
  },
];
