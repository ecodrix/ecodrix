import type { ChannelPage } from "@/lib/platform/employee-pages";

/** Every sentence checked against server and console code on 24 Nov 2026 (spec claims C/S). */
export const websiteChat: ChannelPage = {
  slug: "website-chat",
  catalogId: "connect.webchat",
  name: "Website chat",
  status: "soon", // catalog default for connect.webchat is "soon" (founder, 24 Nov 2026)
  icon: "globe",
  title: "AI employee for website chat",
  description:
    "How an AI employee answers visitors in the chat box on your website, can book visits and hands the chat to your team when needed.",
  hero: {
    title: "An AI employee in the chat box on your website",
    lead: "It answers visitors in a chat box on your own website, from your own facts, and can book a visit if you have set up booking. It passes the chat to your team when it should.",
  },
  heroFacts: [
    { icon: "code", label: "One line of code" },
    { icon: "lock", label: "Only on your sites" },
    { icon: "smartphone", label: "Full screen on small phones" },
  ],
  heroTurns: [6, 8],
  blurb: "A chat box on your site. Moves to WhatsApp when your team steps in.",
  example: {
    title: "An example chat, with notes",
    lead: "Meera Salon is an invented salon. A visitor is reading the bridal page.",
    bar: "Website chat · Meera Salon",
    customer: "Rani (website visitor)",
    messages: [
      { from: "customer", text: "Do you have a bridal package in July?" },
      {
        from: "ai",
        text: "Yes. The bridal package covers hair, makeup and a trial. Which date do you have in mind?",
        source: "Bridal packages",
      },
      { from: "customer", text: "July 14. Can I book a trial this Saturday?" },
      {
        from: "ai",
        text: "Saturday has 11:00 am and 3:00 pm free. Tell me which one, and your name and phone number.",
      },
      { from: "customer", text: "11 is fine. I am Rani, +91 55501 00234." },
      { from: "ai", text: "Booked: bridal trial, Saturday 11:00 am. See you, Rani." },
      { from: "customer", text: "Can you give me a discount on the package?" },
      {
        from: "system",
        label: "What the visitor sees",
        text: "I've passed your question to the team. They'll reply right here.",
      },
    ],
    notes: [
      {
        at: 2,
        title: "Page and facts",
        text: "It knew which page the visitor was on and used that as background only. The package came from your Knowledge.",
      },
      {
        at: 4,
        title: "Phone number",
        text: "If we do not have the visitor's phone yet, it books only with a number the visitor typed in this chat. The typed name and number are saved on a contact.",
      },
      {
        at: 6,
        title: "Booking",
        text: "If the assistant's main job is Book appointments, it books straight away.",
      },
      {
        at: 8,
        title: "Discount goes to your team",
        text: "A question about a discount goes to your team by default. You can switch that off in Agents, Rules. The visitor gets one notice, and the AI stays out of the chat for 24 hours unless you press Resume AI.",
      },
    ],
  },
  pathLead: "Five steps from the visitor's screen to your Inbox.",
  path: [
    {
      title: "A visitor opens the chat box",
      text: "Only the chat button loads first. The chat window opens when the visitor taps it, or in the background for a visitor who chatted before. On a small phone it fills the screen.",
      icon: "globe",
    },
    {
      title: "They type",
      text: "Visitors can send text only, up to 2,000 characters, and the chat works only on websites on your list.",
      icon: "message-circle",
    },
    {
      title: "It lands in your Inbox",
      text: "The message arrives as a website chat, unread, with the page the visitor is on.",
      icon: "inbox",
    },
    {
      title: "The AI reads and writes",
      text: "It reads your business facts, the last 20 messages and the page, and the visitor sees a writing notice.",
      icon: "sparkles",
    },
    {
      title: "It sends, or your team takes over",
      text: "It sends the reply only when it is sure. Otherwise your team gets the chat and the visitor sees a short notice that the team will reply.",
      icon: "hand",
    },
  ],
  jobs: [
    {
      title: "Answers from your Knowledge",
      text: "Fees, timings, packages. It quotes your facts instead of guessing.",
      example: '"How much is scaling and polishing?" is answered from your fee list.',
    },
    {
      title: "Offers follow-up buttons",
      text: "Up to three tap-to-send suggestions after a reply.",
      example: "A Book a visit button.",
    },
    {
      title: "Books appointments",
      text: "When the assistant's main job is Book appointments and you have set up booking, it reads free slots and books one.",
      example: "A clinic visitor books a Friday evening consult.",
    },
    {
      title: "Takes a booking without the AI",
      text: "A Book a visit button on the start screen opens a sheet where a visitor picks a service, day and time. It shows only when you have set up booking.",
      example: "A real-estate visitor books a Saturday site visit.",
    },
    {
      title: "Saves what the visitor types",
      text: "Name, phone or email become a contact.",
      example: "A coaching enquiry leaves a number in the chat.",
    },
    {
      title: "Takes a call-back request when you are closed",
      text: "The visitor picks a time and your team sees the request.",
      example: "A visitor at 9 pm picks 10 to 11 the next morning.",
    },
  ],
  doesNot: [
    { title: "Take photos, files or voice notes", text: "Text only." },
    { title: "Message a visitor after they leave the page", text: "The AI does not write first." },
    { title: "Take payments", text: "Your team handles money." },
    {
      title: "Recognise a visitor on another phone or computer",
      text: "It remembers only the same browser.",
    },
    {
      title: "Give medical, legal, land or money advice",
      text: "Those go to your team. Refunds, complaints, discounts and cancellations go to your team too, unless you switch that off in Agents, Rules.",
    },
    {
      title: "Copy the whole chat into WhatsApp",
      text: "A short code links the WhatsApp chat to the visitor's contact. The website messages are not copied.",
    },
  ],
  setup: [
    {
      title: "Add your website",
      text: "In Channels, Website chat, add your website address. The chat is off until you add it. Ask your web developer to paste one line at the bottom of every page, then press Check.",
    },
    {
      title: "Tell it the job",
      text: "Add your business facts in Knowledge, then type the job or pick a template. Tick Website chat on the assistant.",
    },
    {
      title: "Test, then go live",
      text: "Chat with it in the test chat; nothing is sent to anyone. Then publish, and turn on AI replies in Agents, Rules. Publishing alone does not turn them on.",
    },
  ],
  needs: [
    {
      text: "A website. Ask your web developer to paste one line at the bottom of every page.",
      icon: "code",
    },
    {
      text: "Your website address, for example yourshop.in, added in Channels, Website chat. The chat is off until you add it.",
      icon: "globe",
    },
    { text: "Owner or admin role in your workspace.", icon: "key-round" },
    { text: "Your business facts added in Knowledge.", icon: "book-open" },
    {
      text: "A published assistant that has Website chat ticked, and AI replies switched on. Without them the team answers from the Inbox.",
      icon: "circle-check",
    },
    { text: "A teammate for hand-overs.", icon: "users" },
    { text: "Your plan sets how many websites can show the chat.", icon: "list-checks" },
  ],
  controls: [
    {
      title: "Websites",
      text: "Add and remove sites, and press Check to see if your line is found on the page.",
    },
    { title: "Look", text: "Name, greeting, logo, colour, theme and button position." },
    {
      title: "Ask for visitor details",
      text: "Before the chat, When needed or Never.",
    },
    {
      title: "Start screen",
      text: "Up to 8 buttons, greetings by page, languages and a privacy notice.",
    },
    { title: "Hidden pages", text: "Keep the chat off pages such as checkout." },
    { title: "Turn off Website chat", text: "Hides it on all sites. Chats stay in the Inbox." },
    { title: "AI label", text: "Visitors are told it is an AI by default. You can switch that off." },
    {
      title: "Everything in Agents",
      text: "The confidence slider (how sure the AI must be), Always send to a person, Hand over to, and Test chat.",
    },
  ],
  rules: [
    { title: "Only your websites", text: "The chat works on the sites you list and nowhere else.", icon: "lock" },
    {
      title: "Message limit",
      text: "A visitor can send 20 messages in 5 minutes.",
      icon: "shield",
    },
    {
      title: "Open and closed",
      text: "The Business hours text is a line shown under your name and in the hand-over notice. Whether the chat shows open or closed comes from Settings, Open hours.",
      icon: "clock",
    },
    {
      title: "At night",
      text: "The AI answers any time, unless the assistant's Reply hours (set on its WhatsApp tab) is Business hours only. Then the AI does not answer when you are closed, and the visitor sees that the team will reply.",
      icon: "pause",
    },
    {
      title: "Language",
      text: "The chat window and notices come in English, Hindi and Telugu.",
      icon: "languages",
    },
    {
      title: "Privacy notice",
      text: "It is off until you turn it on. When on, visitors tick I agree before giving a phone number.",
      icon: "shield-check",
    },
    {
      title: "Same browser, same chat",
      text: "A returning visitor on the same browser sees the earlier chat.",
      icon: "history",
    },
    {
      title: "Ordinary words",
      text: "A single word such as pain can hand a clinic chat to your team, even if the visitor only wanted to book.",
      icon: "hand",
    },
  ],
  handoffNote:
    "The visitor gets one notice. If your WhatsApp is connected, it says Our team will answer on WhatsApp with a Continue on WhatsApp button. Without WhatsApp it says the question was passed to the team, with your hours. After a hand-over, a phone or email the visitor types is still saved, unless you set Ask for visitor details to Never.",
  faqs: [
    {
      q: "How do I add it to my website?",
      a: "Add your website address in Channels, Website chat. Ask your web developer to paste one line at the bottom of every page. Then press Check.",
    },
    {
      q: "Does it work on WordPress, Shopify or Wix?",
      a: "The console has guides for WordPress, Wix, Shopify and React or Next.js. It works where you can add a line of code to every page.",
    },
    {
      q: "What if my team is offline?",
      a: "When you are closed the chat shows when you reopen and offers a call-back request. The AI itself keeps answering unless Reply hours is Business hours only. Then the AI does not answer when you are closed, and the visitor sees that the team will reply.",
    },
    { q: "Can visitors send photos or voice notes?", a: "No. Text only." },
    {
      q: "Will the visitor know it is an AI?",
      a: "By default yes. You can switch that off.",
    },
    {
      q: "What does the visitor see when it hands over?",
      a: "One notice. It points to WhatsApp if your WhatsApp is connected, or says the team will reply in the chat.",
    },
    {
      q: "Does it remember a visitor?",
      a: "On the same browser, yes. On another device, it starts again.",
    },
    { q: "Is it on when I publish?", a: "No. You also turn on AI replies in Agents, Rules." },
  ],
};
