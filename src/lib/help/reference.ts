import type { HelpArticle } from "./types";

const UPDATED = "2026-11-08";

export const REFERENCE: HelpArticle[] = [
  {
    slug: "troubleshooting",
    collection: "reference",
    title: "Common questions and fixes",
    summary: "Quick answers when something in ERIX doesn't look or work the way you expect.",
    kind: "reference",
    updated: UPDATED,
    minutes: 4,
    blocks: [
      {
        kind: "p",
        text: "Find your question below. If it isn't here, open **Help & support** in ERIX and raise a ticket: it carries the page you were on, so we can see what you saw.",
      },
    ],
    problems: [
      {
        q: 'A page says "Not available in your workspace".',
        a: "That part isn't switched on for your workspace yet. Ask us from **Help & support** and we'll switch it on, or tell you what it needs.",
      },
      {
        q: "I can't see a menu item a teammate can see.",
        a: "Your role doesn't include it. Ask the owner or an admin to change your access in **Settings › Team**.",
      },
      {
        q: "AI replies wait as drafts and never send by themselves.",
        a: "That's the safe default. Add your business facts in **Agents › Knowledge**, then raise the agent's level in **Agents**. Money, medical and legal questions always go to a person.",
      },
      {
        q: "I can't reply to a WhatsApp chat.",
        a: "WhatsApp's 24-hour reply window has closed. Use **Send a template**, or wait for the customer to write again.",
      },
      {
        q: "A customer wrote STOP.",
        a: "They've opted out. ERIX stops sending them WhatsApp messages until they write START again.",
      },
      {
        q: "My website chat isn't showing.",
        a: "The code must be on your published site, and the domain must be listed in **Channels › Website chat › Your websites**. Then select **Check my website**.",
      },
      {
        q: "My booking page shows no free times.",
        a: "Open **Bookings › Booking › Booking hours**: at least one day must be open and the appointment length must fit inside it.",
      },
      {
        q: 'My invoice shows "Your business name".',
        a: "Add your business name, address, GSTIN and logo once in **Payments › Settings**.",
      },
      {
        q: "An automation won't switch on.",
        a: "Each problem names its step. Usually a WhatsApp template or a channel is missing. Fix it and select **Switch on** again.",
      },
      {
        q: "Something is sending that shouldn't.",
        a: "Open **Automations › Rules** and select **Pause all automations**. Everything stops at its next step until you turn it back on.",
      },
      {
        q: "The screen is dark and I want it light (or the other way).",
        a: "Use the sun or moon button at the top of any page.",
      },
      {
        q: 'I see "Slow network" at the top.',
        a: "Live updates paused while your connection reconnects. Your work is safe; select **Retry** or wait a moment.",
      },
    ],
    related: ["getting-started/find-your-way-around", "reference/glossary"],
  },
  {
    slug: "glossary",
    collection: "reference",
    title: "Glossary",
    summary: "The words ERIX uses, in one place.",
    kind: "reference",
    updated: UPDATED,
    minutes: 3,
    blocks: [
      {
        kind: "table",
        head: ["Word", "Meaning"],
        rows: [
          [
            "Workspace",
            "Your business in ERIX: its contacts, chats, team and settings. One login can belong to more than one.",
          ],
          ["Contact", "A person you deal with. Your workspace may call them a patient, buyer, student or member."],
          ["Pipeline", "The stages a deal moves through, from first enquiry to won or lost."],
          ["Channel", "Where customers reach you: WhatsApp, Instagram, website chat, email, phone."],
          ["Agent", "An AI assistant that answers customers or works your contacts, at the level you allow."],
          ["Approval", "An action the agent or an automation held back for a person to confirm."],
          ["Knowledge", "The facts the agent answers from: FAQs, prices, timings, your website."],
          ["Rule", "An automation: a trigger, maybe some waits and checks, then actions."],
          ["Campaign", "A message sent to a list of people, for example a recall or an offer."],
          ["Template", "A WhatsApp message approved by Meta, needed outside the 24-hour reply window."],
          ["24-hour window", "WhatsApp lets a business reply freely for 24 hours after the customer's last message."],
          ["Opt-out", "A customer who wrote STOP. They get no marketing until they write START."],
          ["Appointment type", "Something people can book with you, with its own length, place and link."],
          ["Add-on", "An extra product or capacity added to your plan."],
        ],
      },
    ],
    related: ["reference/troubleshooting"],
  },
];
