import type { ChannelPage } from "@/lib/platform/employee-pages";

/** Every sentence checked against server and console code on 24 Nov 2026 (spec claims W/S). */
export const whatsapp: ChannelPage = {
  slug: "whatsapp",
  catalogId: "connect.whatsapp",
  name: "WhatsApp",
  status: "live",
  icon: "whatsapp",
  title: "AI employee for WhatsApp: answers and books",
  description:
    "An AI employee on your own WhatsApp Business number. It answers from your facts, books visits and hands the chat to your team when needed.",
  hero: {
    title: "An AI employee on your own WhatsApp number",
    lead: "It replies to customers who message your WhatsApp Business number, answers from your own facts, can book a visit and hands the chat to your team when it should.",
  },
  heroFacts: [
    { icon: "smartphone", label: "Your own number" },
    { icon: "clock", label: "Free replies for 24 hours" },
    { icon: "hand", label: "Hands over to you" },
  ],
  heroTurns: [1, 4],
  blurb: "Answers on your own WhatsApp Business number and books visits.",
  example: {
    title: "An example chat, with notes",
    lead: "Nila Dental is an invented clinic. Here is one chat with its AI employee, and what happened behind each reply.",
    bar: "WhatsApp · Nila Dental",
    customer: "Anita, +91 55501 00123",
    messages: [
      { from: "customer", text: "Is Dr. Rao free tomorrow evening? What is the consultation fee?" },
      {
        from: "ai",
        text: "Yes. Dr. Rao sees patients from 5 pm to 8 pm tomorrow. The consultation fee is ₹400. I have 5:30 pm and 6:00 pm free. Which one suits you?",
        source: "Timings and fees",
      },
      { from: "customer", text: "6 pm please. I am Anita." },
      { from: "ai", text: "Booked: Dr. Rao, tomorrow at 6:00 pm, Nila Dental, Main Road. See you then, Anita." },
      { from: "customer", text: "Thank you. My gum has been paining since morning. Which tablet should I take?" },
      {
        from: "system",
        label: "Your Inbox only",
        text: "AI is paused on this chat. Asks for medical advice - always goes to a person.",
      },
      {
        from: "team",
        text: "Hello Anita, this is Priya at the Nila Dental front desk. Please tell Dr. Rao about the pain at 6 pm. He will advise you.",
      },
    ],
    notes: [
      {
        at: 2,
        title: "Where the answer came from",
        text: "The timings and the fee came from Knowledge, the facts you add in Agents. The open times came from your weekly hours in Booking settings, minus visits already booked. It sent this on its own because the answer came from your Knowledge and the open slots.",
      },
      {
        at: 4,
        title: "Booking",
        text: "This assistant's main job is Book appointments, so it can book. For a clinic it books only after the patient says yes. If the assistant also has the Keep contacts up to date ability, it saves the name too.",
      },
      {
        at: 5,
        title: "Medical advice goes to a person",
        text: "Asking which tablet to take is a request for medical advice. That topic always goes to your team, so the AI does not answer it. The customer is told nothing automatic on WhatsApp. Your team sees the chat under Needs you in the Inbox.",
      },
      {
        at: 7,
        title: "Free text from your team",
        text: "Your team can reply with free text because the customer wrote less than 24 hours ago.",
      },
    ],
  },
  pathLead: "From the customer's phone to your Inbox, in five steps.",
  path: [
    {
      title: "The customer writes to your number",
      text: "WhatsApp passes the message to ERIX. ERIX checks it is genuine before reading it, and a repeated message is stored once.",
      icon: "message-circle",
    },
    {
      title: "It lands in your Inbox",
      text: "The thread shows as unread and your team sees it live. ERIX finds the contact by phone number and may create one, if your workspace allows it.",
      icon: "inbox",
    },
    {
      title: "The AI checks it may answer",
      text: "It checks that AI replies are on, that your plan allows them, and that the chat is not already with a person.",
      icon: "shield-check",
    },
    {
      title: "It writes a short reply",
      text: "It reads your business facts, the last 20 messages and the contact's details. It sends the reply on its own when the answer comes from your Knowledge and it is sure. Otherwise the reply waits as a draft.",
      icon: "sparkles",
    },
    {
      title: "A booking is made, or a person takes over",
      text: "If the assistant can book, a visit goes on your calendar. If the AI is not sure or the topic is sensitive, a person gets the chat instead.",
      icon: "hand",
    },
  ],
  jobs: [
    {
      title: "Answers from your Knowledge",
      text: "FAQs, price lists, web pages and files. It quotes them instead of guessing, and sends on its own when its answer comes from your Knowledge or from a booking it just made, and it is sure. Short greetings like hi and thanks also go out.",
      example: '"What time do you open on Sunday?" is answered from your timings.',
    },
    {
      title: "Books appointments",
      text: "When the assistant's main job is Book appointments, it reads the open slots and books one.",
      example: "A salon customer asks for Saturday 4 pm and gets it, if the slot is free.",
    },
    {
      title: "Keeps the contact up to date",
      text: "If the assistant has the Keep contacts up to date ability, it saves the customer's name and answers, adds tags and logs the chat.",
      example: "A buyer's budget and area are saved on the contact.",
    },
  ],
  doesNot: [
    {
      title: "Start a chat or send reminders",
      text: "Those are separate automations. They use a template, a ready-made message that Meta has approved in advance.",
    },
    {
      title: "Send a template, a photo, a PDF or buttons",
      text: "Replies are plain text and kept short.",
    },
    {
      title: "Understand voice notes, photos or documents",
      text: "Your team can see them in the Inbox. The AI only gets a placeholder (or the caption of a photo).",
    },
    {
      title: "Work in groups or calls",
      text: "Groups and calls stay in the WhatsApp Business app.",
    },
    {
      title: "Take payments",
      text: "It does not take payments.",
    },
    {
      title: "Give medical, legal or money advice",
      text: "Those questions, and emergencies, go to your team. Refunds, complaints, discounts and cancellations go to your team unless you switch that off in Agents, Rules.",
    },
    {
      title: "Tell the customer a person is taking over",
      text: "Nothing automatic is sent. The reply from your team arrives when it is ready.",
    },
    {
      title: "Use a different assistant per number",
      text: "One assistant answers all your numbers.",
    },
  ],
  needsLead:
    "Meta business verification is done in Meta's Business Settings, not in ERIX. After it, your daily limit can grow.",
  setup: [
    {
      title: "Connect your number",
      text: "In Channels, WhatsApp, sign up through Meta with your Facebook login, business name and website. Keep your WhatsApp Business app number or use a new one.",
    },
    {
      title: "Tell it the job",
      text: "Add your business facts in Knowledge, then type the job or pick a template. ERIX fills the short steps from your business; you tick and change.",
    },
    {
      title: "Test, then go live",
      text: "Chat with it in the test chat; nothing is sent to anyone. Then publish, and turn on AI replies in Agents, Rules. Publishing alone does not turn them on.",
    },
  ],
  needs: [
    {
      text: "Your WhatsApp Business number. Either the number already on the WhatsApp Business app, which needs app version 2.24.17 or later, or a new number that is not on WhatsApp yet.",
      icon: "smartphone",
    },
    {
      text: "A Facebook login that manages your business on Meta, plus your business name and website.",
      icon: "key-round",
    },
    {
      text: "A payment method in Meta. Meta charges for messages you start, and bills you directly.",
      icon: "file-text",
    },
    { text: "Your business facts added in Knowledge. Without them, replies wait as drafts.", icon: "book-open" },
    { text: "A teammate to take hand-overs. The builder needs one before you can publish.", icon: "users" },
    { text: "To let it book: booking hours in Customers, Bookings, Booking settings.", icon: "calendar-clock" },
    { text: "A paid plan. The free plan cannot use AI replies.", icon: "circle-check" },
  ],
  controls: [
    {
      title: "Turn on AI replies",
      text: "One switch in Agents, Rules. It is off until you turn it on. Off means no replies and no drafts.",
    },
    { title: "How sure the AI must be", text: "A slider from 50% to 100%. The default is 85%." },
    {
      title: "Always send to a person",
      text: "Switches for refunds, complaints, medical questions, legal matters, discounts and cancellations, plus up to 50 words of your own.",
    },
    {
      title: "Hand over to",
      text: "The teammate who is given the chat once the customer is a contact. You can also pick a person to be alerted when a chat is handed over, and alerted again if nobody replies within 1 to 120 minutes.",
    },
    {
      title: "Reply hours",
      text: "All day, every day, or Business hours only. With business hours only and your open hours set, it stays silent when you are closed and the message waits in the Inbox. With no hours set it answers all day.",
    },
    { title: "Fees and offers", text: "Quote only the fees you listed, and make no discounts or offers." },
    { title: "Per chat", text: "Take over, or Pause AI on this chat, in the Inbox. Then Resume AI." },
    { title: "Pause, versions and rollback", text: "You can pause the assistant, and the last 10 versions are kept." },
  ],
  rules: [
    {
      title: "The 24-hour window",
      text: "You can chat freely for 24 hours after the customer's last message. After that only an approved template works, for your team too, until they write again. The auto-reply answers messages that arrive and never sends free text after that.",
      icon: "clock",
    },
    {
      title: "STOP",
      text: "If a customer sends STOP, they stop getting offers and campaigns. They can still message you and the AI still answers their questions.",
      icon: "ban",
    },
    {
      title: "Your name on WhatsApp",
      text: "Meta reviews the display name, the name customers see instead of your number. You can start while it is being checked.",
      icon: "eye",
    },
    {
      title: "Daily limit on chats you start",
      text: "Meta sets how many people you can start a chat with each day: 250, 1,000, 2,000, 10,000 or 100,000. Replies to people who wrote first have no limit.",
      icon: "shield",
    },
    {
      title: "Your phone app",
      text: "If you reply from the WhatsApp Business app, the AI steps back from that chat for 24 hours.",
      icon: "smartphone",
    },
    {
      title: "Language",
      text: "In the builder you pick one language for the assistant: English, Hindi, Telugu, Tamil, Kannada or Malayalam.",
      icon: "languages",
    },
    { title: "Typing", text: "The customer does not see typing while it works.", icon: "pause" },
  ],
  handoffNote:
    "On WhatsApp the customer is sent nothing automatic. The AI stops replying, the chat moves to Needs you in your Inbox, and your reply arrives later. The AI stays out of that chat for 24 hours, or until you press Resume AI.",
  faqs: [
    {
      q: "Do I need my own WhatsApp Business number?",
      a: "Yes. You connect it through Meta's sign-up in Channels, WhatsApp. You can keep your Business app number or use a new one. Meta bills the messages you start to you directly.",
    },
    {
      q: "Will it answer at night?",
      a: "Yes, once AI replies are on, unless you set Business hours only. With that setting and your open hours set, it stays silent when you are closed, sends no closed message, and the chat waits in the Inbox.",
    },
    {
      q: "Can it send reminders or follow up quiet leads?",
      a: "Not the auto-reply. It answers messages that arrive. Reminders and follow-ups are separate automations that use templates you get approved.",
    },
    {
      q: "What happens when it is not sure?",
      a: 'If it is set to reply on its own, it keeps the reply as a draft and hands the chat to your team with the reason "AI wasn\'t sure of the answer, please reply". The customer is not told.',
    },
    {
      q: "Can it understand voice notes and photos?",
      a: "No. Your team sees them in the Inbox, but the AI only gets a placeholder (or the caption of a photo).",
    },
    {
      q: "Does STOP block everything?",
      a: "No. STOP stops offers and campaigns for that contact. The AI still answers their questions.",
    },
    {
      q: "Can I stop it on one chat?",
      a: "Yes. Use Take over or Pause AI on this chat in the Inbox, then Resume AI when you are done.",
    },
    {
      q: "Is it on as soon as I publish?",
      a: "No. You also turn on AI replies in Agents, Rules.",
    },
  ],
};
