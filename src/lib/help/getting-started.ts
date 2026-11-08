import type { HelpArticle } from "./types";

const UPDATED = "2026-11-08";

export const GETTING_STARTED: HelpArticle[] = [
  {
    slug: "create-your-account",
    collection: "getting-started",
    title: "Create your ERIX account",
    summary: "Sign up, tell ERIX what kind of business you run, and land in a workspace that is already set up for it.",
    kind: "tutorial",
    updated: UPDATED,
    minutes: 3,
    before: ["An email address you can open now, to confirm it.", "Your business name, the way customers know it."],
    blocks: [
      {
        kind: "p",
        text: "ERIX sets up your first pipeline, your automations and the words in your menus from the kind of business you pick. This takes about three minutes, and you can change everything later.",
      },
      {
        kind: "steps",
        steps: [
          {
            text: "Go to [console.ecodrix.com/auth/signup](https://console.ecodrix.com/auth/signup). Fill in your **Full name**, your **Business name** and, if you like, your **Industry**. Choose a password with at least 8 characters, a letter and a number, then select **Create account**.",
            shot: {
              src: "gs-1-signup",
              alt: "The Create your account form with name, business name, industry, email and password filled in.",
            },
          },
          {
            text: "Check your inbox for an email from ERIX and open the link in it to confirm your address. You can keep going while you wait for it.",
          },
          {
            text: "On **Welcome to ERIX**, check your workspace name, your name and your country. The country sets your currency, phone format and time zone. Select **Continue**.",
            shot: { src: "gs-2-about", alt: "Step 1 of onboarding: workspace name, your name and country." },
          },
          {
            text: "Pick what kind of business you run: **Real estate**, **Clinic** or **Something else**. A clinic can also pick the kind of practice, such as Dental. The preview on the right shows the checklist, pipeline and automations you will get. Select **Continue**.",
            shot: {
              src: "gs-3-business",
              alt: "Step 2 of onboarding: Clinic is selected, Dental is chosen, and a preview shows the clinic's setup checklist and Patient Journey pipeline.",
            },
          },
          {
            text: "Connect WhatsApp or Instagram now, or select **Skip for now** and do it later from **Channels**. Then select **Finish setup**.",
            shot: {
              src: "gs-4-channels",
              alt: "Step 3 of onboarding: Connect WhatsApp and Instagram, with Finish setup highlighted.",
            },
          },
          {
            text: "Your workspace is ready. Pick a first job from the list, or select **Go to your dashboard** to open Home.",
            shot: { src: "gs-5-ready", alt: "Your workspace is ready, with four suggested first steps." },
          },
        ],
      },
      {
        kind: "note",
        tone: "info",
        title: "Words that fit your business",
        text: "A clinic's menus say Patients, Appointments and Bills. A broker's say Buyers and Site visits. The screens in this help center come from a demo dental clinic, so you may see different words in your own workspace. See [Use your business's own words](/getting-started/use-your-own-words).",
      },
    ],
    problems: [
      {
        q: "The confirmation email didn't arrive.",
        a: "Look in spam and promotions. Then open ERIX and use the banner at the top of Home to send it again.",
      },
      {
        q: "I picked the wrong kind of business.",
        a: "Change it in **Settings › Business profile › Industry**. Your words change with it; the pipeline and automations you already have stay as they are.",
      },
    ],
    related: ["getting-started/find-your-way-around", "channels/connect-whatsapp", "agents/teach-the-agent"],
  },
  {
    slug: "find-your-way-around",
    collection: "getting-started",
    title: "Find your way around ERIX",
    summary: "What each part of the sidebar is for, and the fastest way to get anywhere.",
    kind: "explanation",
    updated: UPDATED,
    minutes: 3,
    blocks: [
      {
        kind: "p",
        text: "The sidebar follows the way your day works: who you serve, who answers, the rules behind them, and where it all comes in.",
      },
      {
        kind: "shot",
        shot: {
          src: "home-1-home",
          alt: "Home for a dental clinic: the setup checklist, pipeline value, approvals waiting, unread conversations and new contacts.",
          caption: "Home: your setup checklist, money in the pipeline, what waits for you and what came in.",
        },
      },
      {
        kind: "table",
        head: ["Place", "What it's for"],
        rows: [
          ["**Home**", "The day at a glance: chats, bookings, money in the pipeline and anything waiting for you."],
          ["**Inbox**", "Every chat and call in one list, one row per person, whatever channel they used."],
          ["**Ask**", 'Ask about your business in plain words, such as "who hasn\'t paid this month?"'],
          ["**Customers** (or Patients, Buyers…)", "Contacts, your pipeline, bookings, forms and invoices."],
          ["**Agents**", "Your AI assistants, what they know, and what they held back for you to approve."],
          ["**Automations**", "Rules that run on their own, such as a reminder the day before a visit, and campaigns."],
          [
            "**Channels**",
            "Connect WhatsApp, Instagram, email, website chat, your phone number and apps like Razorpay.",
          ],
          ["**Add-ons**", "Extra products your workspace has switched on, such as SEO. Hidden when there are none."],
          [
            "**Subscriptions**, **Help & support**, **Settings**",
            "Your plan and usage, raising a ticket, and settings for you and your workspace.",
          ],
        ],
      },
      { kind: "h", text: "Go anywhere with search" },
      {
        kind: "steps",
        steps: [
          {
            text: "Press **Ctrl + K** (or **⌘ K** on a Mac), or select the search bar at the top.",
            shot: {
              src: "tour-2-search",
              alt: "The search window with quick actions: create invoice, invite teammate, new campaign, new automation.",
            },
          },
          { text: 'Type a page, a contact\'s name or an action such as "invoice", then press **Enter**.' },
        ],
      },
      {
        kind: "note",
        tone: "tip",
        text: "Every page has its own address. Copy it from your browser to send a teammate straight to a chat, a contact or a filtered list.",
      },
    ],
    related: ["getting-started/use-your-own-words", "inbox/reply-to-a-customer"],
  },
  {
    slug: "use-your-own-words",
    collection: "getting-started",
    title: "Use your business's own words",
    summary:
      "Call your customers Patients, Students or Members, and your bookings Appointments or Site visits, everywhere in ERIX.",
    kind: "how-to",
    updated: UPDATED,
    minutes: 2,
    before: ["You are the owner or an admin of the workspace."],
    blocks: [
      {
        kind: "p",
        text: "The kind of business you picked at sign-up sets these words. You can change any of them. Menus, page titles and buttons use them, and so does your AI assistant when it talks to customers.",
      },
      {
        kind: "steps",
        steps: [
          { text: "Open **Settings** at the bottom of the sidebar, then **Business profile**." },
          {
            text: "Scroll to **Words your workspace uses**. Each box shows your business type's word in grey. Type your own word in any box.",
            shot: {
              src: "words-1-card",
              alt: "Settings, Business profile: the Words your workspace uses card, with Patients & families typed for Customers.",
            },
          },
          {
            text: "Select **Save words**. The sidebar and pages change straight away.",
            shot: { src: "words-2-save", alt: "The Save words button at the end of the Words card." },
          },
        ],
      },
      {
        kind: "note",
        tone: "tip",
        text: 'To go back to the default for one word, select **Use "…"** next to its box, then **Save words**.',
      },
      {
        kind: "table",
        head: ["Word", "Clinic", "Real estate", "Coaching"],
        rows: [
          ["Customers", "Patients", "Buyers", "Students"],
          ["Bookings", "Appointments", "Site visits", "Classes"],
          ["Deals", "Patient journey", "Deal pipeline", "Enrollments"],
          ["Payments", "Bills", "Payments", "Fees"],
        ],
      },
    ],
    problems: [
      {
        q: "A page still shows the old word.",
        a: "Refresh the page. Words are loaded with your workspace when a page opens.",
      },
    ],
    related: ["getting-started/find-your-way-around", "agents/teach-the-agent"],
  },
  {
    slug: "invite-your-team",
    collection: "getting-started",
    title: "Invite your team",
    summary: "Add teammates and choose what each of them can see and change.",
    kind: "how-to",
    updated: UPDATED,
    minutes: 2,
    before: ["You are the owner or an admin of the workspace."],
    blocks: [
      {
        kind: "steps",
        steps: [
          {
            text: "Open **Settings › Team** and select **Invite teammate**.",
            shot: { src: "team-1-team", alt: "Settings, Team, with the Invite teammate button." },
          },
          {
            text: "Enter their email and pick what they can do: **Everything**, **Manager**, **Sales**, **Analyst** or **Read-only**. Select **Customise access** to fine-tune it.",
            shot: { src: "team-2-invite", alt: "The Invite a teammate window with an email box and the role choices." },
          },
          {
            text: "Select **Send invite**. They get an email link to join and set their own password. The link works for 7 days.",
          },
        ],
      },
      {
        kind: "note",
        tone: "info",
        text: "You can only hand out access you hold yourself. Approving money, such as payment links, stays with the owner, admins or a named reviewer.",
      },
    ],
    problems: [
      { q: "The invite link expired.", a: "Open **Settings › Team**, find the teammate and send the invite again." },
    ],
    related: ["account/subscriptions-and-usage"],
  },
];
