import type { Chapter } from "@/components/marketing/story";
import { AgentScene } from "@/components/scenes/agent-scene";
import { LazyScreen } from "@/components/scenes/lazy-screen";
import { ArrivalScene } from "@/components/scenes/story-scenes";
import { TimelineScene } from "@/components/scenes/timeline-scene";

/**
 * One chapter per live feature on /platform/erix-connect, -crm and -flow,
 * each with its redrawn screen. Every line is a live v1.0 behaviour (DS
 * product.md). Screens below the fold load near the viewport (LazyScreen).
 */
export const MODULE_TOURS: Record<string, { title: string; lead: string; chapters: Chapter[] }> = {
  "erix-connect": {
    title: "Every chat and call, and what each one does for you",
    lead: "One inbox for WhatsApp and phone calls, plus the calendar the conversation leads to. Instagram, email and website chat are coming soon.",
    chapters: [
      {
        id: "inbox",
        marker: "Inbox",
        module: "ERIX Connect",
        icon: "inbox",
        title: "Every chat in one list, on the right contact",
        body: "WhatsApp chats and phone calls arrive in one inbox, live. Each lands on its contact, matched by phone, so a customer is one record however they reach you.",
        points: [
          "Calls are answered by your phone agent or your team, and logged on the contact",
          "Unread counts, a chime, and “Needs you” on chats handed to your team",
          "AI drafts show where the answer came from: send them, or edit first",
        ],
        visual: <ArrivalScene />,
      },
      {
        id: "whatsapp",
        marker: "WhatsApp",
        module: "ERIX Connect",
        icon: "message-circle",
        title: "The official WhatsApp Business API, on your own account",
        body: "Connect your number through Meta's own sign-up. Meta bills you directly, and ERIX adds no markup.",
        points: [
          "Templates approved by WhatsApp, and broadcasts to the contacts you tag",
          "The 24-hour reply window handled for you",
          "Ticks you know: ✓ sent, ✓✓ delivered, blue ✓✓ read",
        ],
        visual: <LazyScreen name="broadcast" />,
      },
      {
        id: "calendar",
        marker: "Google Calendar",
        module: "ERIX Connect",
        icon: "calendar-check",
        title: "Google Calendar and Meet",
        body: "Bookings from your booking page, and the ones the agent makes, land on your Google Calendar. Online meetings get a Meet link, and a reminder goes out before.",
        visual: <LazyScreen name="booking" />,
      },
    ],
  },
  "erix-crm": {
    title: "Everything about a customer, from first chat to booked visit",
    lead: "Contacts, pipeline, forms, bookings and the numbers behind them, on one record.",
    chapters: [
      {
        id: "contacts",
        marker: "Contacts",
        module: "ERIX CRM",
        icon: "users",
        title: "One customer, one record, every channel",
        body: "Chats and calls land on the same contact, matched by phone. Custom fields, saved views and import, and a timeline of every message, call, run and booking.",
        visual: <TimelineScene />,
      },
      {
        id: "pipeline",
        marker: "Pipeline",
        module: "ERIX CRM",
        icon: "square-kanban",
        title: "Drag a deal, see the money move",
        body: "Board or list, with stages made for your trade, won and lost stages, and every total in rupees. Run more than one pipeline if you sell more than one thing.",
        points: ["Moving a deal to a stage can start an automation"],
        visual: <LazyScreen name="pipeline" />,
      },
      {
        id: "forms",
        marker: "Forms",
        module: "ERIX CRM",
        icon: "file-text",
        title: "Forms you share as a link",
        body: "ERIX hosts the form. Share the link on WhatsApp or on your Google Business Profile, and every reply becomes a contact in your pipeline.",
        visual: <LazyScreen name="form" />,
      },
      {
        id: "appointments",
        marker: "Appointments",
        module: "ERIX CRM",
        icon: "calendar-check",
        title: "Bookings in IST, never double-booked",
        body: "Appointment types, open slots and a public booking page, with Google Calendar and Meet links and reminders. The AI agent can offer slots and book too.",
        visual: <LazyScreen name="booking" />,
      },
      {
        id: "analytics",
        marker: "Analytics",
        module: "ERIX CRM",
        icon: "chart-line",
        title: "Numbers you can act on",
        body: "New contacts over time, and the open deal value at every stage of your pipeline, in rupees with lakh and crore in the summaries.",
        visual: <LazyScreen name="analytics" />,
      },
    ],
  },
  "erix-flow": {
    title: "Automations that do the follow-ups for you",
    lead: "Start from a template, decide what happens next, and keep the risky steps waiting for you.",
    chapters: [
      {
        id: "templates",
        marker: "Templates",
        module: "ERIX Flow",
        ai: true,
        icon: "layout-template",
        title: "Start from a template",
        body: "Welcome messages, appointment reminders, a nudge when nobody replies, and the sales agent qualifying a new enquiry, ready for your industry. Switch one on, or change it first.",
        visual: <LazyScreen name="templates" />,
      },
      {
        id: "wait-for-reply",
        marker: "Triggers and steps",
        module: "ERIX Flow",
        ai: true,
        icon: "workflow",
        title: "Wait for a reply, then do the right thing",
        body: "Start on a new lead, a stage change, a form, a message or a booking. Send on a channel, wait, or wait for a reply: Replied and No reply each take their own path.",
        points: ["Every run shows step by step, live, on the contact"],
        visual: <LazyScreen name="flow" />,
      },
      {
        id: "approvals",
        marker: "Approvals",
        module: "ERIX Flow",
        ai: true,
        icon: "shield-check",
        title: "Risky steps wait for your OK",
        body: "Anything that touches money or messages a customer can stop on Approvals. Held runs and AI drafts arrive there live; approve, edit or stop them.",
        visual: <LazyScreen name="ai" />,
      },
      {
        id: "ai-reply",
        marker: "AI reply",
        module: "ERIX Flow",
        ai: true,
        icon: "sparkles",
        title: "An AI reply step that knows your business",
        body: "It drafts from your own price list, hours and documents. It sends on its own only when the answer is there and auto-reply is on; anything else waits as a draft, and refunds or complaints go to a person.",
        visual: <AgentScene />,
      },
    ],
  },
};
