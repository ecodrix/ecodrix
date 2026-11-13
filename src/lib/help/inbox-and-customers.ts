import type { HelpArticle } from "./types";

const UPDATED = "2026-11-08";

export const INBOX: HelpArticle[] = [
  {
    slug: "reply-to-a-customer",
    collection: "inbox",
    title: "Reply to a customer",
    summary: "Open a conversation from any channel and answer it from one place.",
    kind: "how-to",
    updated: UPDATED,
    minutes: 2,
    before: ["At least one channel connected, such as WhatsApp."],
    blocks: [
      {
        kind: "p",
        text: "Every chat lands in **Inbox**, whatever channel it came from. Each person has one row; if they wrote on more than one channel, you get a tab for each above the chat.",
      },
      {
        kind: "steps",
        steps: [
          {
            text: "Open **Inbox**. Unread conversations show a red count. Select the one you want to answer.",
            shot: {
              src: "reply-1-list",
              alt: "The inbox list with website-chat conversations; one about parking is highlighted.",
            },
          },
          {
            text: "Type your reply in the box at the bottom, then select the send button.",
            shot: { src: "reply-2-type", alt: "A reply typed in the message box, with the send button highlighted." },
          },
          {
            text: "Your reply appears on the right with its delivery ticks. The customer gets it on the channel they used.",
            shot: { src: "reply-3-sent", alt: "The sent reply shown in the conversation." },
          },
        ],
      },
      {
        kind: "note",
        tone: "info",
        title: "WhatsApp's 24-hour window",
        text: "WhatsApp lets a business reply freely for 24 hours after the customer's last message. After that the box shows **Templates only until they reply**: select **Send a template** to send an approved message instead.",
      },
    ],
    problems: [
      {
        q: "My reply shows a red mark.",
        a: "It wasn't delivered. Open the message to see why, for example a closed 24-hour window or a disconnected number, and check **Channels**.",
      },
      {
        q: "The same person shows up twice.",
        a: "ERIX groups threads by phone number and by the contact they're linked to. Link the other thread to the same contact and they show as one person.",
      },
    ],
    related: ["inbox/work-on-many-chats", "agents/approve-what-the-agent-drafts", "channels/connect-whatsapp"],
  },
  {
    slug: "work-on-many-chats",
    collection: "inbox",
    title: "Find chats and work on many at once",
    summary: "Filter the inbox by channel or unread, and mark many chats read or delete them in one go.",
    kind: "how-to",
    updated: UPDATED,
    minutes: 2,
    blocks: [
      { kind: "h", text: "Show only some chats" },
      {
        kind: "steps",
        steps: [
          {
            text: "Select the filter button next to the search box. Pick **Unread**, or a channel under **Source**.",
            shot: {
              src: "bulk-2-filter",
              alt: "The inbox filter menu: All conversations, Unread, and Website chat under Source.",
            },
          },
          { text: "To clear it, open the menu again and pick **All conversations**." },
        ],
      },
      {
        kind: "note",
        tone: "tip",
        text: "The filter and the open chat are part of the page address (for example `?channel=whatsapp&conversation=…`). Copy it to send a teammate to the exact same view.",
      },
      { kind: "h", text: "Mark many chats read, or delete them" },
      {
        kind: "steps",
        steps: [
          {
            text: "Hover a chat and tick the box over its picture. Tick as many as you need, or use the box at the top to pick every chat shown.",
            shot: {
              src: "bulk-1-picked",
              alt: "Two chats ticked, with the bar showing 2 picked, Mark read and delete.",
            },
          },
          { text: "Select **Mark read**, or the bin to delete the picked chats. Deleting asks you to confirm first." },
        ],
      },
    ],
    related: ["inbox/reply-to-a-customer"],
  },
];

export const CUSTOMERS: HelpArticle[] = [
  {
    slug: "add-a-contact",
    collection: "customers",
    title: "Add a contact",
    summary: "Add a customer by hand, or bring in your list from a spreadsheet.",
    kind: "how-to",
    updated: UPDATED,
    minutes: 2,
    blocks: [
      {
        kind: "p",
        text: "People who message you, fill a form or book online are added for you. Add someone yourself when they called, walked in or came by word of mouth.",
      },
      {
        kind: "steps",
        steps: [
          {
            text: "Open **Customers › All customers** (your workspace may say Patients, Buyers or Students). Select **Add contact**.",
            shot: {
              src: "contact-1-list",
              alt: "The contacts list with the Add contact and Import buttons highlighted.",
            },
          },
          {
            text: "Enter at least a **First name** and a **Phone** number. Add an email, company, deal value and source if you have them.",
            shot: {
              src: "contact-2-dialog",
              alt: "The New contact window with first name, last name and phone filled in.",
            },
          },
          {
            text: "Tick **Has agreed to WhatsApp messages** only if they clearly said yes. Then select **Create contact**.",
          },
        ],
      },
      {
        kind: "note",
        tone: "tip",
        title: "Bringing in a list",
        text: "Select **Import** to bring in your contacts from a spreadsheet instead of typing them one by one.",
      },
    ],
    problems: [
      {
        q: "The same person is saved twice.",
        a: "Open one of them and use **More › Merge with…** to combine the two records.",
      },
    ],
    related: ["customers/use-your-pipeline", "account/export-or-erase-data"],
  },
  {
    slug: "use-your-pipeline",
    collection: "customers",
    title: "Move people through your pipeline",
    summary: "See every deal by stage and move a card when something changes.",
    kind: "how-to",
    updated: UPDATED,
    minutes: 2,
    blocks: [
      {
        kind: "p",
        text: "Your pipeline is the path from first enquiry to paid. ERIX set one up for your business type, for example **Enquiry → Consultation Booked → Consultation Done → Treatment Plan Shared → Treatment Started** for a clinic.",
      },
      {
        kind: "steps",
        steps: [
          {
            text: "Open **Customers › Deals** (Patient journey, Deal pipeline…) and pick a pipeline. Select **Board** to see a column per stage, with the value of each.",
            shot: {
              src: "board-1-board",
              alt: "The Patient Journey board with contacts as cards in Enquiry, Consultation Booked and Consultation Done columns.",
            },
          },
          { text: "Drag a card to the next stage when something changes. Select a card to open the contact." },
        ],
      },
      {
        kind: "note",
        tone: "info",
        text: "Automations can watch these moves. For example, the clinic setup includes a review request that runs when a deal is won.",
      },
    ],
    related: ["customers/add-a-contact", "automations/switch-on-a-rule"],
  },
  {
    slug: "take-bookings-online",
    collection: "customers",
    title: "Take bookings online",
    summary: "Set your hours, create what people can book, and share one link on WhatsApp or your website.",
    kind: "tutorial",
    updated: UPDATED,
    minutes: 5,
    blocks: [
      { kind: "h", text: "Set your hours" },
      {
        kind: "steps",
        steps: [
          {
            text: "Open **Customers › Bookings** (Appointments, Site visits…). Select **Booking**, then **Booking hours**.",
            shot: {
              src: "booking-2-menu",
              alt: "The Booking menu: Copy booking link, Appointment types, Booking hours.",
            },
          },
          {
            text: "Set how long appointments run, the gap between them and the days and hours you're open. Leave **Confirm bookings automatically** on, or switch it off to approve each request yourself. Select **Save settings**.",
            shot: {
              src: "booking-3-hours",
              alt: "Booking settings: appointment length, gap, time zone, automatic confirmation and weekly hours.",
            },
          },
        ],
      },
      { kind: "h", text: "Create what people can book" },
      {
        kind: "steps",
        steps: [
          {
            text: "Open **Booking › Appointment types** and select **New appointment type**.",
            shot: { src: "types-1-list", alt: "Appointment types with the New appointment type button." },
          },
          {
            text: "Give it a name, a short description, a duration, a place (for example a phone call or Google Meet) and the host. The preview on the right shows what customers will see. Select **Create**.",
            shot: {
              src: "types-2-new",
              alt: "The new appointment type form for a dental check-up with a live preview.",
            },
          },
          {
            text: "Open the **Share** tab. Copy the **Direct link** to send anywhere, or copy the code to put a booking button on your website.",
            shot: { src: "types-4-share", alt: "The Share tab with the direct booking link and website embed code." },
          },
        ],
      },
      { kind: "h", text: "What your customer sees" },
      {
        kind: "steps",
        steps: [
          {
            text: "They open your link, pick a day and a free time.",
            shot: { src: "public-2-day", alt: "The public booking page with a day picked and free times listed." },
          },
          {
            text: "They enter their name and WhatsApp number, agree to be contacted, and select **Confirm booking**.",
            shot: { src: "public-3-details", alt: "The details step: name, WhatsApp number, email and a consent box." },
          },
          {
            text: "They see that they're booked, and the booking appears in your list straight away, already linked to a contact.",
            shot: { src: "home-5-upcoming", alt: "Appointments in ERIX showing two upcoming bookings made online." },
          },
        ],
      },
    ],
    problems: [
      {
        q: "My booking page shows no times.",
        a: "Check **Booking hours**: at least one day must be open, and the length plus gap must fit inside your hours.",
      },
      {
        q: "There's no Google Meet link.",
        a: "Connect Google in **Channels**. Bookings work without it, just without a meeting link.",
      },
    ],
    related: ["automations/switch-on-a-rule", "customers/add-a-contact"],
  },
  {
    slug: "send-an-invoice",
    collection: "customers",
    title: "Send a GST invoice",
    summary: "Create an invoice for a contact, then send it on WhatsApp or email with a payment link.",
    kind: "how-to",
    updated: UPDATED,
    minutes: 4,
    before: [
      "Your business name, address and GSTIN in **Payments › Settings**, so they print on every invoice.",
      "Razorpay connected in **Channels**, if you want customers to pay online.",
    ],
    blocks: [
      {
        kind: "steps",
        steps: [
          {
            text: "Open **Customers › Payments** (Bills, Fees…) and select **New invoice**.",
            shot: {
              src: "invoice-1-bills",
              alt: "The payments page with revenue, outstanding and overdue totals and the New invoice button.",
            },
          },
          {
            text: "Pick the **Contact**: their name, email and phone fill in for you. Add each item with a description, HSN/SAC code, quantity and rate, and set the GST rate that applies to you. The preview on the right updates as you type.",
            shot: {
              src: "invoice-2-form",
              alt: "A new invoice for a contact with a dental implant line item and the live preview.",
            },
          },
          { text: "Pick a **Due date** and select **Save draft**." },
          {
            text: "On the saved invoice, select **Send on WhatsApp** or **Send email**. Select **Connect to collect** to add a payment link, or **Record payment** when they pay you another way.",
            shot: {
              src: "invoice-3-saved",
              alt: "A saved draft invoice with Send on WhatsApp and Connect to collect highlighted.",
            },
          },
        ],
      },
      {
        kind: "note",
        tone: "info",
        title: "How GST is split",
        text: "If the customer is in your state, ERIX splits GST into CGST and SGST; if not, it uses IGST. It reads the state from their GSTIN, or uses yours. A GST-registered customer, or any invoice of ₹50,000 or more, needs their address. Ask your CA which rate and code apply to your services.",
      },
    ],
    problems: [
      {
        q: 'The invoice says "Your business name".',
        a: "Fill in **Payments › Settings** once: business name, address, GSTIN and logo.",
      },
      {
        q: "Can a customer pay an old link after I change the invoice?",
        a: "No. Changing an invoice's total cancels its old payment link.",
      },
    ],
    related: ["agents/approve-what-the-agent-drafts", "account/subscriptions-and-usage"],
  },
];
