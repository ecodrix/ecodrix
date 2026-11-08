import type { HelpArticle } from "./types";

const UPDATED = "2026-11-08";

export const AGENTS: HelpArticle[] = [
  {
    slug: "teach-the-agent",
    collection: "agents",
    title: "Teach the agent about your business",
    summary: "Add your timings, fees and FAQs so the AI answers from your facts instead of guessing.",
    kind: "how-to",
    updated: UPDATED,
    minutes: 3,
    blocks: [
      {
        kind: "p",
        text: "The agent only answers from what you give it. Without knowledge, its replies wait for you as drafts.",
      },
      {
        kind: "steps",
        steps: [
          {
            text: "Open **Agents › Knowledge**. Choose how to add it: **Paste text**, **Add web page**, **Add website** or **Upload file**.",
          },
          {
            text: "For **Paste text**, give it a title and paste your FAQ, price list or timings. Select **Add text**.",
            shot: { src: "knowledge-2-paste", alt: "The Paste text window with timings and fees for a dental clinic." },
          },
          {
            text: "Type a question a customer might ask in the test box and select **Test** to see what the agent would answer.",
            shot: { src: "knowledge-3-added", alt: "AI knowledge with one source ready and the test box highlighted." },
          },
        ],
      },
      {
        kind: "note",
        tone: "tip",
        title: "Unanswered questions",
        text: "When customers ask something your knowledge doesn't cover, it shows under **Unanswered questions** on the same page. Add the answer once and the agent uses it from then on.",
      },
    ],
    problems: [
      {
        q: 'The page says "Not available in your workspace".',
        a: "Agents are switched on per workspace. Ask us from **Help & support** and we'll switch them on.",
      },
      {
        q: "The agent quoted an old price.",
        a: "Edit or remove the source that has it, then test the question again.",
      },
    ],
    related: ["agents/how-much-the-agent-does", "agents/approve-what-the-agent-drafts"],
  },
  {
    slug: "how-much-the-agent-does",
    collection: "agents",
    title: "Choose how much the agent does on its own",
    summary: "Decide whether an agent only suggests, waits for your approval, or acts and reports back.",
    kind: "explanation",
    updated: UPDATED,
    minutes: 3,
    blocks: [
      {
        kind: "p",
        text: "**Agents** lists your AI assistants: one answers customers, one works your contacts and deals, one looks after your channels. Each card shows how much it may do alone.",
      },
      {
        kind: "shot",
        shot: {
          src: "agents-1-agents",
          alt: "AI agents: chats handled without you, handed to your team, waiting for approval, AI cost, the always-with-a-person rule and agent cards.",
        },
      },
      {
        kind: "table",
        head: ["Level", "What happens"],
        rows: [
          ["**Off**", "The agent does nothing."],
          ["**Suggest**", "It reads and suggests. Replies and changes wait as drafts; a person makes them."],
          ["**With approval**", "It prepares the action and waits in **Approvals** for a yes."],
          ["**Act and report**", "It acts on its own and tells you what it did."],
        ],
      },
      {
        kind: "steps",
        steps: [
          {
            text: "Select **Edit** on an agent. Under **How much this agent may do on its own**, pick a level. Change what it says or does by chatting with it, and switch tools on or off under **What it can use**.",
            shot: {
              src: "agents-2-edit",
              alt: "The Assistant agent editor: change it by chatting, what it can use and the autonomy levels.",
            },
          },
          { text: "Select **Publish changes**. Nothing changes for customers until you publish." },
        ],
      },
      {
        kind: "note",
        tone: "warn",
        title: "Always with a person",
        text: "No agent acts or advises on money, medical, legal, investment, tax or loan matters, or emergencies, on chat or calls. It does the work around them and hands the rest to your team. No setting turns this off.",
      },
    ],
    related: ["agents/approve-what-the-agent-drafts", "agents/teach-the-agent"],
  },
  {
    slug: "approve-what-the-agent-drafts",
    collection: "agents",
    title: "Approve what the agent drafts",
    summary: "Send, change or dismiss replies and actions the agent held back for you.",
    kind: "how-to",
    updated: UPDATED,
    minutes: 2,
    blocks: [
      {
        kind: "p",
        text: "Drafts and held actions, such as a payment link or a booking, wait in **Agents › Approvals**. Home shows the newest ones too.",
      },
      {
        kind: "steps",
        steps: [
          {
            text: "Open **Agents › Approvals**. Each item shows the customer's question and what the agent wants to send or do.",
            shot: {
              src: "approvals-1-empty",
              alt: "Approvals with nothing waiting: held automations and new AI drafts appear here.",
            },
          },
          {
            text: "Select **Review in inbox** to read it in the conversation, change it if needed and send it, or **Dismiss** to drop it. On Home, the same drafts offer **Approve and send** to send as they are.",
          },
        ],
      },
      {
        kind: "note",
        tone: "tip",
        text: "Once the agent's drafts are right most of the time, raise it to **With approval** or **Act and report** for the jobs you trust it with. See [Choose how much the agent does on its own](/agents/how-much-the-agent-does).",
      },
    ],
    related: ["agents/how-much-the-agent-does", "inbox/reply-to-a-customer"],
  },
];

export const AUTOMATIONS: HelpArticle[] = [
  {
    slug: "switch-on-a-rule",
    collection: "automations",
    title: "Test and switch on a ready-made rule",
    summary: "Turn on a reminder, follow-up or review request that ERIX set up for your business.",
    kind: "how-to",
    updated: UPDATED,
    minutes: 4,
    blocks: [
      {
        kind: "p",
        text: "Your workspace came with rules for your business type, saved as drafts. Drafts don't run until you switch them on.",
      },
      {
        kind: "steps",
        steps: [
          {
            text: "Open **Automations › Rules** and select a rule, for example **24hr Appointment Reminder**.",
            shot: {
              src: "rules-1-list",
              alt: "Rules: 0 live and 11 drafts, with names like Review Request and Post-Visit Follow-Up.",
            },
          },
          {
            text: "Read it left to right: what starts it, any wait, and what it sends. A step that still needs something says so, for example **Needs WhatsApp set up first**.",
            shot: {
              src: "rules-2-rule",
              alt: "The 24hr Appointment Reminder on the canvas: trigger Meeting booked, wait until 1440 minutes before, send a WhatsApp reminder.",
            },
          },
          {
            text: "Select **Test run**, pick one or more test contacts and select **Start test**. Messages, webhooks and payment links are shown on the run page, not sent.",
            shot: { src: "rules-3-test", alt: "Test this automation: a list of contacts to test with and Start test." },
          },
          {
            text: "When the test looks right, select **Switch on**. ERIX checks every step first and tells you what to fix if something is missing.",
          },
        ],
      },
      {
        kind: "note",
        tone: "tip",
        text: 'Select **Ask ERIX to change it** and describe the change in plain words, such as "send it 3 hours before instead".',
      },
    ],
    problems: [
      {
        q: "Switch on says there are problems.",
        a: "Each problem names its step. Open the step, fill in what it asks for (often a WhatsApp template or channel), and try again.",
      },
      {
        q: "A rule sent something I didn't expect.",
        a: "Open **Rules › Runs & logs** to see each run and step. Use **Pause all automations** if you need to stop everything.",
      },
    ],
    related: ["automations/pause-all-automations", "channels/connect-whatsapp"],
  },
  {
    slug: "pause-all-automations",
    collection: "automations",
    title: "Pause all automations",
    summary: "Stop every rule at its next step with one switch, and start them again later.",
    kind: "how-to",
    updated: UPDATED,
    minutes: 1,
    blocks: [
      {
        kind: "steps",
        steps: [
          {
            text: "Open **Automations › Rules** and select **Pause all automations**.",
            shot: { src: "rules-1-list", alt: "The rules list with the Pause all automations button." },
          },
          {
            text: "Select **Pause all automations** again in the window that asks you to confirm. Running automations stop at their next step, and nothing is sent until you turn them back on.",
          },
          { text: "To start again, open **Automations › Rules** and turn automations back on." },
        ],
      },
    ],
    related: ["automations/switch-on-a-rule"],
  },
];
