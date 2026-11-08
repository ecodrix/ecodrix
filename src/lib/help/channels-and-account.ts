import type { HelpArticle } from "./types";

const UPDATED = "2026-11-08";

export const CHANNELS: HelpArticle[] = [
  {
    slug: "add-website-chat",
    collection: "channels",
    title: "Add website chat to your site",
    summary: "Put a chat box on your website so visitors' messages land in your inbox.",
    kind: "how-to",
    updated: UPDATED,
    minutes: 5,
    before: ["Access to edit your website, or someone who can paste one line of code into it."],
    blocks: [
      {
        kind: "steps",
        steps: [
          {
            text: "Open **Channels** and open **Website chat**. Enter your website's address, such as `yourclinic.in`, and select **Connect**.",
          },
          {
            text: "Copy the **Website code** and paste it just before `</body>` on every page of your site. Publish your site, then select **Check my website**.",
            shot: {
              src: "webchat-2-connected",
              alt: "Website Chat Widget: the code to copy and the Check my website button.",
            },
          },
          {
            text: "Under **How the chat looks**, set your name, greeting, colour, logo and which corner it sits in. The preview updates as you go. Select **Save changes**.",
            shot: {
              src: "webchat-3-settings",
              alt: "Website chat settings: business name, greeting, colour, position and a live preview.",
            },
          },
          {
            text: "Under **How the chat behaves**, choose when to ask visitors for their name and number: **Before the chat**, **When needed** or **Never**, and add your business hours.",
          },
        ],
      },
      {
        kind: "shot",
        shot: {
          src: "webchat-visitor",
          alt: "The chat box as a visitor sees it, with the clinic's greeting and a visitor's question.",
          caption: "What your visitors see. Their messages arrive in your Inbox.",
        },
      },
      {
        kind: "note",
        tone: "info",
        text: "The chat only works on the websites you list under **Your websites**. Add each domain you use; with or without `www` both work.",
      },
    ],
    problems: [
      {
        q: "The chat doesn't show on my site.",
        a: "Check the code is on the published page (not only in a draft), the domain matches one under **Your websites**, then select **Check my website** again.",
      },
    ],
    related: ["inbox/reply-to-a-customer", "agents/teach-the-agent"],
  },
  {
    slug: "connect-whatsapp",
    collection: "channels",
    title: "Connect your WhatsApp number",
    summary: "Add your business number through Meta's official WhatsApp API so chats and campaigns run from ERIX.",
    kind: "how-to",
    updated: UPDATED,
    minutes: 6,
    before: [
      "A laptop or computer with Chrome.",
      "The Facebook login that is an admin of your business.",
      "The number can get an SMS or a call for the verification code.",
      "A payment method in Meta for WhatsApp's message charges. Meta bills these to you directly.",
    ],
    blocks: [
      {
        kind: "steps",
        steps: [
          {
            text: "Open **Channels**. On **WhatsApp Business**, select **Add number**.",
            shot: {
              src: "whatsapp-1-channels",
              alt: "Channels with the list of apps and the Add number button on WhatsApp Business.",
            },
          },
          {
            text: "Choose where the number is today. A new number is the quickest. A number on the WhatsApp Business app or with another provider can be moved; the window says what to do first.",
            shot: {
              src: "whatsapp-2-dialog",
              alt: "Add a WhatsApp number: where is this number today, with four options and a checklist.",
            },
          },
          {
            text: "Select **Continue to Meta**. Sign in to Facebook, choose your business, and verify the number with the code Meta sends.",
          },
          {
            text: "Back in ERIX, give the number a name and pick who answers it. Chats on it arrive in your **Inbox**.",
          },
        ],
      },
      {
        kind: "note",
        tone: "warn",
        text: "A number registered on the API stops working in the WhatsApp Business app on your phone. Reply from ERIX on your phone or computer instead.",
      },
    ],
    problems: [
      {
        q: "The Meta window closed before it finished.",
        a: "Start again from **Add number**. Allow pop-ups for console.ecodrix.com if your browser blocked it.",
      },
      {
        q: 'My number shows "Needs attention".',
        a: "Open it from **Channels** to see what it needs before it can send.",
      },
    ],
    related: ["inbox/reply-to-a-customer", "automations/switch-on-a-rule"],
  },
];

export const ACCOUNT: HelpArticle[] = [
  {
    slug: "subscriptions-and-usage",
    collection: "account",
    title: "Your plan, add-ons and usage",
    summary: "See your plan, what you've used this month and what you pay for.",
    kind: "reference",
    updated: UPDATED,
    minutes: 2,
    blocks: [
      {
        kind: "p",
        text: "Open **Subscriptions** in the sidebar. **Overview** shows your current plan and trial, your active add-ons and the meters closest to their limit. **Usage** has every meter. **Payments** lists what you've paid, with GST invoices.",
      },
      {
        kind: "shot",
        shot: {
          src: "billing-1-billing",
          alt: "Subscriptions overview: the Growth plan on a free trial, add-ons, and usage meters for conversations, automation runs, AI requests and storage.",
        },
      },
      {
        kind: "list",
        items: [
          "Your plan includes a monthly allowance that resets each period and is used first.",
          "When you reach a limit, that work stops instead of running up a surprise bill.",
          "To change your plan or add more, select **Contact ECODrIx** or **Ask for add-ons**.",
        ],
      },
    ],
    related: ["getting-started/invite-your-team"],
  },
  {
    slug: "export-or-erase-data",
    collection: "account",
    title: "Export or erase a customer's data",
    summary: "Give a customer a copy of their data, or delete it when they ask.",
    kind: "how-to",
    updated: UPDATED,
    minutes: 2,
    before: ["You are the owner or an admin of the workspace."],
    blocks: [
      {
        kind: "steps",
        steps: [
          { text: "Open the contact from **Customers › All customers**." },
          {
            text: "Select **More**, then **Export data** to download everything ERIX holds about them, or **Erase contact** to delete it.",
            shot: {
              src: "privacy-1-contact",
              alt: "A contact's More menu with Export data and Erase contact highlighted.",
            },
          },
          { text: "Erasing asks you to confirm. It can't be undone." },
        ],
      },
      { kind: "h", text: "For the whole workspace" },
      {
        kind: "p",
        text: "**Settings › Data and privacy** lets you export all your workspace's data, set the privacy contact shown on your forms and consent text, and delete the workspace.",
      },
      {
        kind: "shot",
        shot: {
          src: "privacy-2-data",
          alt: "Settings, Data and privacy: Export all data, the privacy contact and Delete this workspace.",
        },
      },
    ],
    related: ["customers/add-a-contact"],
  },
];
