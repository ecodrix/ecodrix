import type { ChannelPage } from "@/lib/platform/employee-pages";

/** Every sentence checked against server and console code on 24 Nov 2026 (spec claims E/S). */
export const email: ChannelPage = {
  slug: "email",
  catalogId: "connect.email",
  name: "Email",
  status: "soon", // catalog connect.email is listed, not live
  icon: "mail",
  title: "AI employee for email",
  description:
    "How an AI employee drafts replies to customer email from your own facts, then waits for you to press send unless you allow more.",
  hero: {
    title: "An AI employee that drafts your email replies",
    lead: "It reads the customer email that reaches ERIX, writes a reply from your own facts and leaves it for you to send, unless you allow more.",
  },
  heroFacts: [
    { icon: "send", label: "You press send" },
    { icon: "globe", label: "Your own domain" },
    { icon: "calendar-clock", label: "Bookings wait for your OK" },
  ],
  heroTurns: [1, 3],
  blurb: "Writes replies from your facts. You send, unless you let it.",
  example: {
    title: "An example thread, with notes",
    lead: "Disha Coaching is invented. A parent writes to the centre.",
    bar: "Email · Disha Coaching",
    customer: "Mr. Verma, writing from his email address",
    messages: [
      { from: "customer", text: "Is the Class 10 weekend batch open? What are the timings?" },
      {
        from: "draft",
        text: "Dear Mr. Verma, the Class 10 weekend batch is open. Classes run on Saturday and Sunday from 9 am to 12 noon.",
        source: "Batch timings",
      },
      { from: "system", label: "Your Inbox only", text: "You pressed Send. The reply left from your address." },
      {
        from: "customer",
        text: "Please book a demo class for my son on Sunday. My number is +91 55501 00456.",
      },
      {
        from: "draft",
        text: "Sunday 9 am is free. I will book a demo class for Aarav.",
        action: "Book appointment, runs only when you approve",
      },
      {
        from: "system",
        label: "Your Inbox only",
        text: "You pressed Approve & send. The booking was made and the reply sent.",
      },
      { from: "customer", text: "Can you give a fee discount for two siblings?" },
      {
        from: "system",
        label: "Your Inbox only",
        text: "Handed to the team. The parent is told nothing automatic.",
      },
    ],
    notes: [
      {
        at: 2,
        title: "Draft first",
        text: "It is a draft because email is draft-first. The timings came from your Knowledge, and the card lists its sources under Based on.",
      },
      {
        at: 3,
        title: "Your address",
        text: "The reply goes out from the sender address you verified, as a reply: Re: and the customer's subject.",
      },
      {
        at: 5,
        title: "Bookings wait",
        text: "The parent gave a number, so a booking can be proposed. On email a booking is held until you press Approve & send.",
      },
      {
        at: 8,
        title: "Discount goes to your team",
        text: "A question about a discount goes to your team. Sometimes the AI also leaves a draft for you to read. The parent is told nothing.",
      },
    ],
  },
  pathLead: "Six steps from the customer's mailbox to a sent reply.",
  path: [
    {
      title: "The customer writes to your business address",
      text: "Your mailbox forwards it to an ERIX address, or the customer replies to a mail sent from ERIX. ERIX does not read your mailbox.",
      icon: "mail",
    },
    {
      title: "ERIX checks the mail",
      text: "Newsletters, auto-replies, no-reply senders and mail that looks forged or automated are saved in Inbox but not answered. That helps stop two auto-replies answering each other.",
      icon: "shield-check",
    },
    {
      title: "It is saved in your Inbox",
      text: "One thread per sender address.",
      icon: "inbox",
    },
    {
      title: "The AI writes a draft",
      text: "It reads the message text and your business facts.",
      icon: "sparkles",
    },
    {
      title: "You decide",
      text: "You open the AI draft card and press Send, Edit or Approve & send.",
      icon: "user-check",
    },
    {
      title: "The reply leaves from your address",
      text: "It goes out from the sender address you verified.",
      icon: "send",
    },
  ],
  jobs: [
    {
      title: "Drafts a reply from your Knowledge",
      text: "Every reply starts as a draft in your Inbox. The card says Based on and lists its sources.",
      example: "A clinic patient asks the Saturday timings and the fee, and the draft quotes both.",
    },
    {
      title: "Proposes a booking",
      text: "It is held until you approve.",
      example: "A salon client asks for Friday at 5.",
    },
    {
      title: "Sends on its own only when you allow it",
      text: "Switch on Send replies and set the limits.",
      example: "A parent started the thread and asked something your Knowledge can answer.",
    },
    {
      title: "Skips most robot mail",
      text: "Newsletters, auto-replies and no-reply senders are saved in Inbox but not answered.",
    },
  ],
  doesNot: [
    { title: "Read your mailbox", text: "Mail arrives by forwarding." },
    { title: "Connect Gmail today", text: "Only addresses on your own domain can be added." },
    { title: "Open or send attachments", text: "Only their names show in the Inbox." },
    {
      title: "Book, update a contact or add a tag on its own",
      text: "Bookings wait for your approval.",
    },
    { title: "Send cold email", text: "It only answers mail that arrived." },
    {
      title: "Give medical, legal or money advice",
      text: "Those go to your team. Refunds, complaints, discounts and cancellations go to your team unless you switch that off in Agents, Rules.",
    },
    { title: "Tell the customer a person has taken over", text: "Nothing automatic is sent." },
    { title: "Take payments", text: "Your team handles money." },
  ],
  needsLead: "Domain record changes can take up to 72 hours. Your plan has a monthly limit on emails sent.",
  setup: [
    {
      title: "Add your domain",
      text: "In Channels, Email, add an address on a domain you own. Add 3 DNS settings where you bought the domain, then verify it.",
    },
    {
      title: "Tell it the job",
      text: "Add your business facts in Knowledge, then type the job or pick a template. In Who answers email, pick the assistant.",
    },
    {
      title: "Forward, test, switch on",
      text: "Forward your support mailbox to the ERIX address and send a test mail to yourself. Press Switch on on the Email overview. Then publish, and turn on AI replies in Agents, Rules.",
    },
  ],
  needs: [
    {
      text: "A domain you own. That is your website address. You add 3 settings where you bought it, and your web person can do this.",
      icon: "globe",
    },
    { text: "A sender address on that domain. Replies go out from the sender address you verified.", icon: "mail" },
    {
      text: "A way to forward your support mailbox to the ERIX address, for example in Gmail, Settings, Forwarding.",
      icon: "send",
    },
    { text: "Your business facts added in Knowledge.", icon: "book-open" },
    {
      text: "A published assistant, switched to Email in Who answers email, and AI replies switched on.",
      icon: "list-checks",
    },
    {
      text: "A verified domain, a test mail sent to yourself, then Switch on on the Email overview.",
      icon: "circle-check",
    },
    { text: "A paid plan.", icon: "file-text" },
    { text: "Owner or admin role to connect.", icon: "key-round" },
  ],
  controls: [
    {
      title: "Draft for my team, or Send replies",
      text: "Draft is the default.",
    },
    {
      title: "Sign AI replies",
      text: "Adds Written with ERIX AI under replies the assistant sends by itself. It is on by default.",
    },
    {
      title: "Who answers email",
      text: "Pick the assistant or Nobody: my team in Inbox.",
    },
    {
      title: "Turn on AI replies",
      text: "Plus the confidence slider (how sure the AI must be), Always send to a person, and Hand over to.",
    },
    { title: "Identity and Knowledge", text: "Tone, language and role in Identity, and your facts in Knowledge." },
    { title: "Per thread", text: "Take over and Resume AI on one thread." },
    { title: "Test chat", text: "Try it as a customer before you go live." },
  ],
  rules: [
    {
      title: "Draft first",
      text: "Every reply waits for you, unless you switch on Send replies.",
      icon: "pause",
    },
    {
      title: "When it may send alone",
      text: "Only if you switched on Send replies, the customer started the thread, the thread has fewer than 20 messages, and the answer comes from Knowledge with enough confidence. A short thanks follows the same limits.",
      icon: "shield",
    },
    {
      title: "Held changes",
      text: "A booking waits for you to press Approve & send.",
      icon: "hand",
    },
    {
      title: "One thread per sender address",
      text: "A new topic from the same person lands in the same thread.",
      icon: "inbox",
    },
    {
      title: "What it reads",
      text: "The message text, up to 10,000 characters. The old mail pasted below the new message is left out.",
      icon: "eye",
    },
    {
      title: "No 24-hour window",
      text: "It may answer an email at any time.",
      icon: "clock",
    },
    {
      title: "STOP",
      text: "A reply that is only STOP or UNSUBSCRIBE stops your promotional messages to that person and gets one confirmation. The AI does not answer it.",
      icon: "ban",
    },
    {
      title: "Language",
      text: "It writes in the one language you chose.",
      icon: "languages",
    },
    {
      title: "If it is not sure",
      text: "The draft waits in your Inbox. No Needs you alert is raised for it.",
      icon: "bell",
    },
  ],
  handoffNote:
    "On email the customer sees nothing automatic when a chat is handed over. A topic that must go to a person usually writes no draft, and the thread goes to your team. If the AI only writes a low-confidence draft, the draft waits in your Inbox and no alert is raised. The AI stays out for 24 hours, or until you press Resume AI.",
  faqs: [
    {
      q: "Can I connect Gmail?",
      a: "Not today. Only an address on your own domain can be added.",
    },
    {
      q: "Does it read my whole mailbox?",
      a: "No. It sees mail you forward, and replies to mail sent from ERIX.",
    },
    {
      q: "Does it send replies on its own?",
      a: "Not by default. Replies wait as drafts. You can switch on Send replies, with limits.",
    },
    { q: "Can it open attachments?", a: "No." },
    {
      q: "Will a booking happen without my OK?",
      a: "No. It is held until you approve.",
    },
    {
      q: "What does the customer see when a person takes over?",
      a: "Nothing automatic. You can press Resume AI to bring the assistant back.",
    },
    {
      q: "Does it answer newsletters or auto-replies?",
      a: "No. They are saved in the Inbox only.",
    },
    {
      q: "How long does the domain check take?",
      a: "Domain record changes can take up to 72 hours.",
    },
  ],
};
