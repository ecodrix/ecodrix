import type { ChannelPage } from "@/lib/platform/employee-pages";

/** Every sentence checked against server and console code on 24 Nov 2026 (spec claims I/S). */
export const instagram: ChannelPage = {
  slug: "instagram",
  catalogId: "connect.instagram",
  name: "Instagram",
  status: "soon", // catalog connect.instagram is listed, not live
  icon: "instagram",
  title: "AI employee for Instagram DMs",
  description:
    "How an AI employee answers your Instagram DMs from your own facts, can book visits and hands the chat to your team when needed.",
  hero: {
    title: "An AI employee for your Instagram DMs",
    lead: "It answers the direct messages people send to your Business or Creator account, from your own facts, and passes the chat to your team when it should.",
  },
  heroFacts: [
    { icon: "message-circle", label: "DMs, not comments" },
    { icon: "clock", label: "Free replies for 24 hours" },
    { icon: "user-check", label: "Business or Creator account" },
  ],
  heroTurns: [2, 4],
  blurb: "Answers DMs from your business account in the shared inbox.",
  example: {
    title: "An example chat, with notes",
    lead: "Fitline Gym is invented. A customer replies to the gym's story.",
    bar: "Instagram DM · Fitline Gym",
    customer: "Karan, +91 55501 00345",
    messages: [
      { from: "customer", text: "How much is a day pass? Do you give a trial?" },
      {
        from: "ai",
        text: "A free trial class is available on weekdays. A day pass is ₹150. Want me to book a trial?",
        source: "Passes and trials",
      },
      { from: "customer", text: "Yes. Thursday 7 am." },
      { from: "ai", text: "Thursday 7 am is free. Please type your phone number and name so I can book it." },
      { from: "customer", text: "Karan, +91 55501 00345" },
      { from: "ai", text: "Booked: trial class, Thursday 7 am. See you, Karan." },
      { from: "customer", text: "Thanks" },
      { from: "ai", text: "See you Thursday." },
    ],
    notes: [
      {
        at: 1,
        title: "Story reply",
        text: "A reply to a story arrives as a normal DM with the story link saved. The AI answers the words the customer typed.",
      },
      { at: 2, title: "Facts", text: "The pass and the trial came from your Knowledge." },
      {
        at: 4,
        title: "Phone number",
        text: "Instagram does not give the shop the customer's phone number, so the AI asks for it before it books.",
      },
      {
        at: 6,
        title: "Booking",
        text: "With the main job Book appointments, it books after the customer says yes.",
      },
      { at: 8, title: "Short thanks", text: "A short thanks can go out on its own." },
    ],
  },
  pathLead: "Five steps from the customer's DM to your Inbox.",
  path: [
    {
      title: "The customer sends a DM",
      text: "Instagram passes it to ERIX, and ERIX checks it is genuine before reading it.",
      icon: "message-circle",
    },
    {
      title: "It is saved in your Inbox",
      text: "The person is added to Customers, unless you switched that off.",
      icon: "inbox",
    },
    {
      title: "The AI checks its reply window",
      text: "The window is open when the customer wrote in the last 24 hours.",
      icon: "clock",
    },
    {
      title: "It replies in text",
      text: "It reads your business facts and writes a short text reply.",
      icon: "sparkles",
    },
    {
      title: "Bookings and sensitive topics",
      text: "It asks for a phone number before a booking. Topics that need a person go to your team, as in the example.",
      icon: "hand",
    },
  ],
  jobs: [
    {
      title: "Answers DMs from your Knowledge",
      text: "It answers in the one language you chose.",
      example: "A price question is answered from your price list.",
    },
    {
      title: "Handles story replies",
      text: "A reply to a story arrives as a normal DM with the story link saved. The AI answers the words the customer typed.",
    },
    {
      title: "Books appointments",
      text: "When the assistant's main job is Book appointments, it asks for a phone number and books the visit.",
      example: "A coaching parent books a demo class after typing a number.",
    },
    {
      title: "Drafts a reply to a comment for you",
      text: "In Channels, Instagram, Posts, a person presses Suggest a reply with AI and posts it.",
    },
  ],
  doesNot: [
    { title: "Reply to comments on its own", text: "A person posts the reply." },
    {
      title: "Reply to media with no text",
      text: "A photo, voice note, sticker, shared reel or story mention with no text waits in your Inbox.",
    },
    {
      title: "Reply after 24 hours, start a chat or send templates",
      text: "After 24 hours only a person on your team can reply.",
    },
    {
      title: "Tell the customer a person will take over",
      text: "Nothing automatic is sent.",
    },
    { title: "Send photos, videos or files", text: "It sends text only." },
    { title: "Take payments", text: "Your team handles money." },
    { title: "Post to Instagram or read reach figures", text: "It works in DMs." },
  ],
  needsLead:
    "How many Instagram accounts you can connect depends on your plan. Your plan has a monthly limit on Instagram messages.",
  setup: [
    {
      title: "Connect your account",
      text: "Use a Business or Creator account with Allow access to messages switched on in the Instagram app. In Channels, Instagram, connect in the Instagram window and tap Allow.",
    },
    {
      title: "Tell it the job",
      text: "Add your business facts in Knowledge, then type the job or pick a template. Tick Instagram on the assistant.",
    },
    {
      title: "Test, then go live",
      text: "Chat with it in the test chat; nothing is sent to anyone. Then publish, and turn on AI replies in Agents, Rules. Publishing alone does not turn them on.",
    },
  ],
  needs: [
    { text: "A Business or Creator Instagram account. A personal account is refused.", icon: "user-check" },
    {
      text: "In the Instagram app, Settings, Messages, Allow access to messages switched on.",
      icon: "settings",
    },
    {
      text: "Your Instagram login. You connect in an Instagram window and tap Allow to let ERIX read and answer your messages.",
      icon: "key-round",
    },
    { text: "An owner or admin role to connect.", icon: "lock" },
    { text: "A plan that includes Instagram.", icon: "circle-check" },
    { text: "Your business facts added in Knowledge.", icon: "book-open" },
    { text: "A teammate for hand-overs.", icon: "users" },
    {
      text: "To book visits: weekly hours in Booking settings and at least one appointment type switched on.",
      icon: "calendar-clock",
    },
    { text: "A published assistant, ticked for Instagram, and AI replies switched on.", icon: "list-checks" },
  ],
  controls: [
    {
      title: "Who answers Instagram",
      text: "Pick the assistant, or Nobody: my team in Inbox.",
    },
    {
      title: "Turn on AI replies",
      text: "Plus the confidence slider (how sure the AI must be before it sends alone), Always send to a person, and Hand over to.",
    },
    {
      title: "Inbox and Customers",
      text: "Bring messages into Inbox, and Add people who message to Customers.",
    },
    { title: "Per chat", text: "Take over and Resume AI on one chat." },
    { title: "Test chat", text: "Chat as a customer before you go live." },
    { title: "Disconnect Instagram", text: "Past chats stay in your Inbox." },
    {
      title: "Alerts",
      text: "Get told when the Instagram login is about to run out. It is on by default.",
    },
  ],
  rules: [
    {
      title: "The 24-hour rule",
      text: "The AI can reply within 24 hours of the customer's last message. After that only a person on your team can reply, for up to 7 days when your account is connected the standard way.",
      icon: "clock",
    },
    {
      title: "Nobody messages first",
      text: "You cannot start a chat with someone who has not messaged or commented. There are no templates.",
      icon: "ban",
    },
    {
      title: "Which messages",
      text: "Text messages and story replies get an answer. Pictures, voice notes, stickers, reels and story mentions without text do not.",
      icon: "message-circle",
    },
    {
      title: "Comments",
      text: "Replying to comments is a person's job, helped by a draft. A keyword in a comment can send an automatic DM through Automations, within 7 days of the comment.",
      icon: "users",
    },
    {
      title: "Your login",
      text: "It lasts 60 days and renews itself. If renewing fails, you get an email and a banner 7 days before it runs out, unless you switched that alert off.",
      icon: "key-round",
    },
    {
      title: "Language",
      text: "The AI replies in the one language you chose.",
      icon: "languages",
    },
    {
      title: "Being an AI",
      text: "It does not say it is an AI unless asked.",
      icon: "sparkles",
    },
  ],
  handoffNote:
    "On Instagram the customer is sent nothing automatic. They see your team's reply when it comes. Pick who is alerted in Hand over, so your team knows. The AI stays out for 24 hours, or until you press Resume AI.",
  faqs: [
    {
      q: "Can it reply to comments?",
      a: "Not on its own. It can draft a reply that a person posts.",
    },
    {
      q: "Can it reply after 24 hours?",
      a: "No. The AI can reply within 24 hours of the customer's last message. After that only a person on your team can reply, for up to 7 days when your account is connected the standard way.",
    },
    {
      q: "What if a customer sends a voice note?",
      a: "It waits in your Inbox. The AI does not reply to it.",
    },
    { q: "Which Instagram account do I need?", a: "A Business or Creator account." },
    {
      q: "How long does my login last?",
      a: "60 days, and it renews itself. You get a warning before it runs out if renewing fails.",
    },
    {
      q: "Can I connect more than one account?",
      a: "Yes, if your plan allows more than one. Only one assistant answers a channel.",
    },
    {
      q: "What does the customer see when a person takes over?",
      a: "Nothing from ERIX. They just see your team's reply.",
    },
    { q: "What if I disconnect?", a: "Your past chats stay in the Inbox." },
  ],
};
