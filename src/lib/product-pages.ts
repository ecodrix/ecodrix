/**
 * Sub-pages for each platform module: /platform/{module}/{slug}.
 *
 * Every feature claim follows the design system's product page (what is
 * live in v1.0, and what arrives in which version). Detail comes from the
 * customer guides (ECOD/docs/product/*.md). Anything not live is named with
 * its status word, such as "coming soon".
 * Pages without enough verified detail stay short and say so plainly
 * instead of padding; they're listed in the phase-2 report for a
 * merge-or-drop decision.
 */

export type ScreenKey =
  | "pipeline"
  | "inbox"
  | "invoice"
  | "flow"
  | "booking"
  | "ai"
  | "documents"
  | "crm"
  | "flowCanvas";

export interface SubPage {
  slug: string;
  /** h1 and <title> (the root template adds " | ECODrIx"); ≤ 50 characters. */
  title: string;
  /** Meta description; 120–160 characters. */
  description: string;
  type: "use-case" | "capability" | "guide" | "comparison";
  lead: string;
  /** Coded mock of the related screen (components/scenes/screens.tsx). */
  screen?: ScreenKey;
  /** "How it works", in order. */
  steps?: string[];
  sections: { heading: string; body: string[]; points?: string[] }[];
  faqs?: { q: string; a: string }[];
  /** What isn't available, said plainly. */
  notice?: string;
  /** Subject is Upcoming: noindex, out of the sitemap and lists; the URL shows a "Coming soon" page. Content kept. */
  soon?: boolean;
}

/* ═══════════════════════════════════════════════════════════════════════
 * ERIX CRM
 * ═════════════════════════════════════════════════════════════════════ */

export const CRM_PAGES: SubPage[] = [
  {
    slug: "lead-pipeline",
    title: "Contacts and pipeline for Indian SMBs",
    description:
      "Every enquiry on one board: stages made for your business, rupee totals per stage, drag to move, search and filters, and contacts that work on your phone.",
    type: "capability",
    lead: "Every enquiry on one board, so you always know who is new, who has visited and who is ready to pay, without a notebook or an Excel sheet.",
    screen: "pipeline",
    steps: [
      "Pick your business type when you sign up. Your pipeline and contact fields are ready in about a minute.",
      "Your lead forms put new enquiries in the first stage by themselves, and bookings from your booking page add the person to your contacts. Add walk-ins and phone enquiries by hand.",
      "Drag a card to the next column when the deal moves. It saves at once, and your whole team sees it.",
      "Tap a card to open the contact, with their chats, calls and bookings in one place.",
    ],
    sections: [
      {
        heading: "Stages made for your business",
        body: [
          "A real estate agent starts with Inquiry → Site Visit Scheduled → Site Visit Done → Shortlisted → Token Paid → Agreement Signed → Closed or Lost. Healthcare and clinics, education and coaching, and e-commerce and D2C each get their own stages. Any other business starts with a simple sales pipeline: New → Contacted → Qualified → Proposal → Won or Lost.",
          "You can change stages later. Need buyers and sellers apart? Add a second pipeline with New pipeline, and choose in each form's settings which pipeline it fills.",
        ],
      },
      {
        heading: "Fields that match what you track",
        body: [
          "Each business type adds the details it needs to every contact. Real estate adds property type, budget range, location preference, possession date and the property ID or project. Add your own fields for anything else you track.",
        ],
      },
      {
        heading: "See the money at every stage",
        body: [
          "Each column shows the total deal value sitting in it, in rupees with Indian grouping, so you can see how much business is waiting at site visit and how much at token paid. New contacts go to your default pipeline unless a form sends them somewhere else.",
        ],
      },
      {
        heading: "Find anyone fast",
        body: [
          "Search by name, phone number or email. Filter to the last 30 days to see this month's fresh enquiries. Archived contacts are kept, but they're hidden from the board, so the pipeline shows only live deals.",
        ],
      },
      {
        heading: "Safe for a team",
        body: [
          "Everyone with the right role can move cards and work leads. Only the owner or an admin can delete a pipeline or a stage, so nobody wipes a column by mistake.",
        ],
        points: [
          "Owner: everything, including the plan and inviting admins",
          "Admin: everything except the plan",
          "Agent: contacts, the pipeline, the inbox and broadcasts",
          "Viewer: can look around, can't change anything",
        ],
      },
      {
        heading: "Built for the phone in your pocket",
        body: [
          "Contacts and pipelines fit a phone screen, so you can update a lead from the site visit itself. Every move saves as you make it; there is no Save button to forget.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can I keep buyers and sellers apart?",
        a: "Yes. Add a second pipeline, for example Buyers and Sellers, and pick in each form's settings which one it fills.",
      },
      {
        q: "Where do enquiries from my forms go?",
        a: "To the first stage of the pipeline you choose in the form's settings, marked as coming from that form, with the consent the person gave.",
      },
      {
        q: "I dragged a card to the wrong column. What now?",
        a: "Drag it back. Every move saves as you make it, so the board always shows where each enquiry stands.",
      },
    ],
  },
  {
    slug: "client-portal",
    soon: true,
    title: "Projects, e-sign and a client portal",
    description:
      "Run each client job as a project: tasks, documents your client signs first and you sign after, and a portal where the client follows progress and messages you.",
    type: "capability",
    lead: "Every client job in one place, with its tasks, documents and signatures, plus a page of their own where the client follows progress. No more answering “what's the status?” on WhatsApp ten times a week.",
    screen: "documents",
    steps: [
      "Create a project under ERIX CRM → Active projects and add its tasks.",
      "Upload the quotation or work order and choose Ask for signature.",
      "Invite your client by email, and copy the invite link to send on WhatsApp too.",
      "Your client signs in the portal, then you sign. Both signatures land on the PDF.",
    ],
    sections: [
      {
        heading: "An example from Nagpur",
        body: [
          "An interior designer takes on a ₹6,50,000 2BHK job. She creates a project, adds Measurements, 3D design, Carpentry and Handover as tasks, and uploads the quotation for the client to sign. The client signs on her phone from the portal, sees Carpentry move to In progress, and asks her questions on the same page. After handover, the designer sends the final invoice and a payment link from ERIX.",
        ],
      },
      {
        heading: "Plan the work",
        body: [
          "Filter your projects by Active, On hold or Done. Tasks move across To do, In progress, Review and Done, and the bar at the top shows overall progress, such as 1 of 5 tasks done. The Overview tab shows the status, package, start and due dates, and a count of tasks in each column.",
        ],
      },
      {
        heading: "Documents your client signs first",
        body: [
          "Upload PDF, Word, PNG or JPG files up to 100 MB each. Choose Ask for signature, enter your client's name, and they see Needs your signature in their portal. They sign with a finger or mouse, type their full name, or decline. Then the file shows Waiting for your signature and a Sign button. The status changes by itself on both sides: Partly signed, then Signed, or Declined.",
        ],
      },
      {
        heading: "What this signature is",
        body: [
          "It is click-to-sign. Every signature, yours and your client's, is stamped on the PDF with the signer's name and the date, and ERIX keeps an audit seal, a digital fingerprint of the signed file, so you can show it wasn't changed afterwards. It works well for quotations, work orders and service agreements. It is not Aadhaar eSign: for papers that must be Aadhaar-signed, stamped or registered, such as a sale deed, use the official route.",
        ],
      },
      {
        heading: "What your client sees",
        body: ["Your client sees only the project you invited them to, on a page that works on their phone:"],
        points: [
          "the project name, its status and how far along it is",
          "each task and its status",
          "your documents, to view and sign",
          "messages to you, which you answer from your inbox, marked Portal",
        ],
      },
      {
        heading: "Invites and access",
        body: [
          "ERIX emails your client a link to set a password and open the project. The link works for 7 days; copy it and send it on WhatsApp if the email doesn't arrive. Each client shows as Invited, Active or Invite expired. Only owners and admins invite clients, sign for the business or remove access, and removing access ends it at once.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is this an Aadhaar eSign?",
        a: "No. It's click-to-sign with the signer's name, the date and an audit seal on the PDF. Use the official route for documents that must be Aadhaar-signed, stamped or registered.",
      },
      {
        q: "What if my client never got the invite email?",
        a: "Choose Copy invite link and send it on WhatsApp. If the email couldn't be sent, ERIX tells you, and the link is the way in for 7 days.",
      },
      {
        q: "Do project files count towards my storage?",
        a: "Yes. When your workspace's storage is full, uploading says so and suggests deleting files you no longer need.",
      },
    ],
  },
  {
    slug: "commerce",
    soon: true,
    title: "Proposals, GST invoices and payment links",
    description:
      "Send a proposal, turn it into a GST invoice with CGST, SGST or IGST worked out for you, and get paid through your own Razorpay link. Marked Paid by itself.",
    type: "capability",
    lead: "Send a proposal, the client says yes, a correct GST invoice goes out with a payment link, and you see Paid the moment the money lands.",
    screen: "invoice",
    steps: [
      "Add your GSTIN, business address and numbering once, in Invoice settings.",
      "Send a proposal to a contact. The client opens it on a phone and accepts it, without logging in.",
      "The accepted proposal becomes an advance GST invoice, linked to the proposal and the contact.",
      "Create a Razorpay payment link and send the invoice on WhatsApp or email.",
      "When the payment lands, the invoice turns Paid by itself, live on your screen.",
    ],
    sections: [
      {
        heading: "GST worked out from the place of supply",
        body: [
          "A buyer in your state gets CGST and SGST, split exactly to the paisa. A buyer in another state, or with another state's GSTIN, gets IGST. A ₹10,000 service at 18% becomes ₹900 CGST plus ₹900 SGST, or ₹1,800 IGST. A wrong GSTIN, state code or HSN/SAC code is refused with a sentence that says what to fix, and a 0% rate stays 0%.",
        ],
      },
      {
        heading: "A proper tax invoice",
        body: [
          "The PDF says TAX INVOICE and carries your GSTIN and the buyer's, the place of supply (for example 29 · Karnataka), HSN or SAC codes, the tax lines, the buyer's address, the amount in words (Rupees … Only) and a line for your authorised signatory. Amounts use Indian grouping, so ₹14,56,789.65 reads the way your accountant expects.",
        ],
      },
      {
        heading: "Numbered by financial year",
        body: [
          "Invoice numbers run per financial year, such as INV/26-27/0012, and stay within 16 characters. A save that fails never burns a number.",
        ],
      },
      {
        heading: "Payment links from your own Razorpay",
        body: [
          "Connect your Razorpay keys under Connect → Payments. ERIX creates the payment link and the money goes to your account. If Razorpay refuses your keys, ERIX says so plainly and creates no link. Change the total on an invoice that already has a live link, and the old link is cancelled first.",
        ],
      },
      {
        heading: "Sent where your client reads",
        body: [
          "Send the invoice PDF and its payment link on WhatsApp or by email, straight from the invoice. The client pays by phone, using the methods your Razorpay account accepts.",
        ],
      },
      {
        heading: "Paid, live",
        body: [
          "When Razorpay confirms the payment, the invoice turns Paid on your screen at once, without a refresh, and the contact's timeline shows it. A paid invoice becomes a read-only record.",
        ],
      },
    ],
    faqs: [
      {
        q: "Does ERIX handle IGST for customers in other states?",
        a: "Yes. When the buyer's GSTIN or place of supply is in another state, the invoice uses IGST instead of CGST and SGST.",
      },
      {
        q: "How can my client pay?",
        a: "Through a Razorpay payment link, using the methods your Razorpay account accepts, such as UPI and cards. The money goes to your account.",
      },
      {
        q: "Can I send the invoice on WhatsApp?",
        a: "Yes. Send the PDF and the payment link on WhatsApp or by email from the invoice itself.",
      },
    ],
  },
  {
    slug: "crm-automation",
    title: "Automations on your CRM",
    description:
      "Automations that start on CRM events, such as a new lead, a stage change, a won deal or a booking, are built in ERIX Flow. Here is how they meet your pipeline.",
    type: "capability",
    lead: "Automations that react to your pipeline live in ERIX Flow. They start when something happens in your CRM and act on the same contact.",
    sections: [
      {
        heading: "Events from your CRM",
        body: [
          "An automation can start when a lead is created, enters or leaves a stage, is won or lost, or is tagged; when a form is submitted; or when a meeting is booked, rescheduled or cancelled. The Welcome Journey template starts when a new lead comes in, and Appointment Reminders starts on a booked meeting.",
        ],
      },
      {
        heading: "Steps that act on the contact",
        body: [
          "Steps can send a message on WhatsApp, wait, wait for a reply, ask for approval, write an AI reply or update the contact. Each run is saved on the contact's history.",
        ],
      },
    ],
    notice:
      "This page covers the same ground as the ERIX Flow guides. See What starts an ERIX automation and Automation steps in ERIX Flow for the detail.",
  },
  {
    slug: "real-estate",
    title: "ERIX for real estate agents and builders",
    description:
      "For property consultants: portal and ad leads in one pipeline, site visits in IST, WhatsApp follow-ups and an agent that knows your listings.",
    type: "use-case",
    lead: "Built for how property is sold in India: enquiries at night, site visits at the weekend, follow-ups on WhatsApp and a token amount at the end.",
    screen: "pipeline",
    sections: [
      {
        heading: "A pipeline that matches the sale",
        body: [
          "Pick Real estate at sign-up and you start with Inquiry → Site Visit Scheduled → Site Visit Done → Shortlisted → Token Paid → Agreement Signed → Closed or Lost. Every contact gets property type, budget range, location preference, possession date and property ID or project. Each column shows the deal value in it, so you see what's waiting at Token Paid.",
        ],
      },
      {
        heading: "Site visits without phone tag",
        body: [
          "Set your booking hours and add an appointment type such as Site visit, 30 minutes, in person. A consultant in Indore open 10:00 am to 1:00 pm, with 30-minute visits and a 15-minute gap, offers 10:00 am, 10:45 am, 11:30 am and 12:15 pm. If two buyers pick the same slot, one gets it and the other is asked to pick another time. Switch on the Appointment Reminders template and buyers get WhatsApp reminders 1 hour and 15 minutes before the visit.",
        ],
      },
      {
        heading: "Follow-ups that actually happen",
        body: [
          "A consultant in Nashik gets about 40 WhatsApp enquiries a week. Each new enquiry gets “Hi, shall we book your site visit?”, and the automation waits for a reply. If the buyer answers, the chat is waiting in the inbox for the team; if there's no reply in two days, a gentle follow-up goes out on its own. Nobody has to remember who to chase.",
        ],
      },
      {
        heading: "Every enquiry in one place",
        body: [
          "Put your form link or WhatsApp number on property portals and ads. Form answers, WhatsApp chats and phone calls all land on the right contact, matched by phone and then email, so a buyer who writes twice doesn't become two leads.",
        ],
      },
      {
        heading: "An agent that sticks to your listings",
        body: [
          "Add your project details and price list to AI knowledge, and the agent answers buyers from that information. It sends an answer on its own only when the answer is grounded and it's sure; anything else becomes a draft for your team. Money questions such as discounts always go to a person, so nobody gets a promise you didn't make.",
        ],
      },
      {
        heading: "Token amount and paperwork",
        body: [
          "When the buyer is ready, move the deal to Token Paid by hand. Invoices and payment links are coming soon. A sale deed still needs registration through the official route.",
        ],
      },
    ],
    faqs: [
      {
        q: "Will the AI promise prices or possession dates?",
        a: "No. It answers only from the details you add to its knowledge, and money questions such as discounts go to your team.",
      },
      {
        q: "Can buyers book a site visit themselves?",
        a: "Yes, from your booking page, in Indian time. They can't cancel or move a booking themselves yet; you reschedule from Appointments.",
      },
      {
        q: "Can I keep buyer and seller enquiries apart?",
        a: "Yes. Add a second pipeline and point each form at the pipeline it should fill.",
      },
    ],
  },
  {
    slug: "healthcare",
    title: "ERIX for clinics and healthcare practices",
    description:
      "For clinics: enquiry forms with consent, appointments in IST with no double bookings, WhatsApp reminders, and medical questions always routed to your own team.",
    type: "use-case",
    lead: "Patients ask on WhatsApp, book from a link and expect a reminder. ERIX handles the routine and leaves anything medical to your team.",
    screen: "booking",
    sections: [
      {
        heading: "Enquiries with consent recorded",
        body: [
          "Every lead form has a consent box patients must tick, with a link to your privacy policy. A second, optional box, Send me offers and updates, is never ticked for them. Wrong phone numbers are stopped at the form, so your front desk isn't chasing junk.",
        ],
      },
      {
        heading: "Appointments the front desk doesn't juggle",
        body: [
          "Set your hours, appointment length and the gap between patients. Each appointment type has its own length and place: in person, a phone call or Google Meet. A patient booking from Dubai sees your times clearly labelled in India Standard Time. Two people can never take the same slot, and you can confirm each booking yourself or let them confirm automatically.",
        ],
      },
      {
        heading: "Reminders that go out on time",
        body: [
          "Switch on the Appointment Reminders template and patients get WhatsApp reminders 1 hour and 15 minutes before the appointment. If someone books inside a reminder's window, the early reminder is skipped and the later one still goes on time. Add a WhatsApp step at the start for a confirmation right after booking.",
        ],
      },
      {
        heading: "Medical questions go to a person",
        body: [
          "If you turn on AI replies, it answers everyday questions such as timings, fees and location from the information you give it. Medical questions and symptoms are on the list of topics that always go to a person, switched on from the start, along with refunds and complaints. The chat moves to Needs you with the conversation attached, and the patient is told someone will reply.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can patients book a teleconsultation?",
        a: "Yes. Set the appointment type's place to Google Meet. With Google connected, each booking gets a Meet link; without it, bookings still come in, just without a link.",
      },
      {
        q: "Will the AI give medical advice?",
        a: "No. Medical questions and symptoms always go to your team, and that switch starts turned on.",
      },
      {
        q: "Can patients cancel or move a booking themselves?",
        a: "Not yet. Your team confirms, reschedules or cancels from Appointments, and cancelling frees the slot for someone else.",
      },
    ],
  },
  {
    slug: "agencies",
    soon: true,
    title: "ERIX for marketing agencies",
    description:
      "For agencies: a pipeline for new business, proposals clients accept on a phone, projects with tasks and e-sign, a client portal and GST invoices with links.",
    type: "use-case",
    lead: "Win the client, run the work and get paid from one workspace, with clients following progress without a status call.",
    screen: "documents",
    notice: "White-label, running ERIX under your own brand, isn't available today.",
    sections: [
      {
        heading: "New business in a pipeline",
        body: [
          "Pick Marketing agency at sign-up and your pipeline starts with stages for agency sales. Form answers land in the first stage, and chats from WhatsApp, Instagram and your website land on the same contact.",
        ],
      },
      {
        heading: "Proposals and advance invoices",
        body: [
          "Send a proposal; the client opens it on a phone and accepts it without logging in. The accepted proposal becomes an advance GST invoice, linked to the contact, with CGST and SGST or IGST worked out from the place of supply and a Razorpay payment link.",
        ],
      },
      {
        heading: "Projects your clients can follow",
        body: [
          "Each retainer or campaign becomes a project with tasks across To do, In progress, Review and Done. Upload the scope document or work order, ask the client to sign, and sign after them. Clients message you from their portal, and those chats land in your inbox, marked Portal.",
        ],
      },
      {
        heading: "Follow-ups and approvals",
        body: [
          "Use the Welcome Journey for new enquiries, Wait for a reply to nudge anyone who goes quiet, and an approval step before any offer goes out, so a junior can't send a discount you didn't agree to.",
        ],
      },
      {
        heading: "Roles for your team",
        body: [
          "Agents work leads, the inbox and broadcasts. Admins handle settings and invite agents. Only owners and admins invite clients to a portal or sign documents for the agency.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can I run ERIX under my agency's brand?",
        a: "Not today. White-label isn't part of ERIX yet.",
      },
      {
        q: "Can clients see my internal notes?",
        a: "No. A client sees only the project you invite them to: its progress, tasks, your documents and their messages with you.",
      },
    ],
  },
  {
    slug: "education",
    title: "ERIX for coaching institutes",
    description:
      "For coaching institutes: admission forms, counselling bookings, AI answers on batch timings and fees, and WhatsApp follow-ups.",
    type: "use-case",
    lead: "Parents enquire at night and decide over a week. ERIX answers the routine questions, books the counselling session and keeps the follow-up going.",
    screen: "inbox",
    sections: [
      {
        heading: "A week from enquiry to admission",
        body: ["Here is a normal week for a coaching institute in Indore:"],
        points: [
          "At 9:40 pm on 11 Oct, a parent fills in your admission form from the link you shared on WhatsApp and lands in the first stage of your pipeline.",
          "The Welcome Journey sends them a WhatsApp message straight away and another the next day.",
          "They book a counselling session for Sat, 17 Oct, 10:00 am on your booking page, and nobody else can take that time.",
          "They ask about batch timings on WhatsApp. Your counsellor answers from the inbox and drags their card forward.",
          "You move the card to Admission confirmed and a WhatsApp confirmation goes out.",
        ],
      },
      {
        heading: "Answers at 10:30 pm",
        body: [
          "A coaching institute in Vijayawada adds its batch timings, its fee chart (₹18,000 for the JEE foundation course) and its address to AI knowledge. When a parent asks at 10:30 pm, “What time is the Sunday batch?”, the AI answers from the timings in seconds. When another parent writes, “I want a refund for the crash course,” the AI doesn't answer: the chat goes to the team with the reason Refunds, and the counsellor calls back.",
        ],
      },
      {
        heading: "Your institute's tone",
        body: [
          "Give the agent a persona, such as a friendly counsellor who always asks which class the student is in. It replies in the language the parent writes in, whether that's Telugu, Hindi or English. Start with replies as drafts your counsellors send, and check its answers in Answer review before you let it reply on its own.",
        ],
      },
      {
        heading: "Follow-ups that don't depend on memory",
        body: [
          "Send a WhatsApp message, then wait for a reply. If the parent answers, the chat is in your counsellors' inbox; if nobody replies in three days, a gentle follow-up goes out on its own.",
        ],
      },
      {
        heading: "New-batch announcements",
        body: [
          "Announce a new batch with a WhatsApp broadcast, using a template WhatsApp has approved, and pick who gets it, such as parents tagged jee-2027. Because ERIX uses your own WhatsApp account, Meta bills you directly and ERIX adds no markup.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can the AI reply in Telugu or Hindi?",
        a: "Yes. The agent replies in the language the parent writes in, including Telugu or Hindi mixed with English. Refunds, complaints and medical questions still go to a person.",
      },
      {
        q: "Can parents pay the course fee online?",
        a: "Not yet. GST invoices and Razorpay payment links are coming soon.",
      },
      {
        q: "Is GST added to course fees?",
        a: "Not yet. Invoices, with GST worked out, are coming soon.",
      },
    ],
  },
  {
    slug: "d2c-ecommerce",
    title: "ERIX for D2C and local brands",
    description:
      "For D2C and local brands: one inbox for order questions, WhatsApp broadcasts with approved templates, and AI answers from your price list.",
    type: "use-case",
    lead: "Answer order questions from one inbox, send offers on WhatsApp with templates WhatsApp has approved, and follow up with every enquiry.",
    screen: "inbox",
    notice:
      "ERIX doesn't connect to Shopify or a store catalogue today, and storefront checkout is planned for later. Orders come in as chats.",
    sections: [
      {
        heading: "Every DM in one list",
        body: [
          "A boutique in Jaipur posts its new kurta sets. Questions arrive on WhatsApp and as phone calls, and they all land in one inbox, each on the right customer, matched by phone. Unread counts and a Needs you list show what's waiting.",
        ],
      },
      {
        heading: "Answers from your price list",
        body: [
          "Add your price list, sizes and delivery areas to AI knowledge. When someone asks “Kurta sets kitne ke hain?”, the agent answers from your price list in the customer's language. Anything it isn't sure of becomes a draft, and refunds and complaints always go to your team.",
        ],
      },
      {
        heading: "Festive offers on WhatsApp",
        body: [
          "A saree shop in Coimbatore sends its Diwali offer to customers tagged diwali, using a template WhatsApp has approved. Because ERIX uses your own WhatsApp account, Meta bills you directly for the messages and ERIX adds no markup. Broadcasts wait out quiet hours in Indian time.",
        ],
      },
      {
        heading: "Follow-ups after the first chat",
        body: [
          "Switch on the Welcome Journey for new customers, and use Wait for a reply to nudge anyone who asked about a product and then went quiet.",
        ],
      },
    ],
    faqs: [
      {
        q: "Who pays for WhatsApp broadcast messages?",
        a: "Your business pays Meta directly, because you connect your own WhatsApp Business account. ERIX adds no markup to Meta's charges.",
      },
      {
        q: "Can the AI reply in Hinglish?",
        a: "Yes. The agent replies in the language the customer writes in, including Hindi mixed with English.",
      },
      {
        q: "Does ERIX connect to Shopify?",
        a: "Not today. Orders come in through chats. Invoices, payment links and storefront checkout are coming later.",
      },
    ],
  },
  {
    slug: "professional-services",
    soon: true,
    title: "ERIX for CAs, lawyers and consultants",
    description:
      "For CAs, lawyers and consultants: a portal for every engagement, click-to-sign engagement letters, deadline broadcasts on WhatsApp and GST invoices with links.",
    type: "use-case",
    lead: "Share documents without digging through WhatsApp, get engagement letters signed, and remind every client about a deadline in one go.",
    screen: "documents",
    sections: [
      {
        heading: "A portal for every engagement",
        body: [
          "Create a project for each engagement, such as an annual audit or a company incorporation, and add its tasks. Your client sees only their own project: its progress, each task, the documents you share and a place to message you. Their messages land in your inbox, marked Portal, next to their WhatsApp chats.",
        ],
      },
      {
        heading: "Engagement letters signed online",
        body: [
          "Upload the engagement letter or fee quotation and choose Ask for signature. Your client signs first, by drawing or typing their name, then you sign. Both signatures go on the PDF with the date and an audit seal. It's click-to-sign, not Aadhaar eSign, so use the official route for anything that must be stamped or registered.",
        ],
      },
      {
        heading: "Deadline reminders to everyone at once",
        body: [
          "Tag clients by the work you do for them, such as gst-monthly or itr, and send a template WhatsApp has approved to everyone with that tag. Meta bills you directly for the messages, with no ERIX markup.",
        ],
      },
      {
        heading: "Questions a bot shouldn't answer",
        body: [
          "If you use the AI agent for office hours and document checklists, keep it in Suggest mode: it drafts and your team sends. Refunds and complaints always go to a person, and anything the agent isn't sure of becomes a draft instead of an answer.",
        ],
      },
      {
        heading: "Invoices for your fees",
        body: [
          "Send GST invoices with CGST and SGST or IGST worked out from the place of supply, numbered per financial year, with a Razorpay payment link.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is the online signature enough for an engagement letter?",
        a: "It's a click-to-sign signature with the signer's name, date and an audit seal, which suits quotations, work orders and service agreements. For documents that must be Aadhaar-signed, stamped or registered, use the official route.",
      },
      {
        q: "Will the AI answer legal or tax questions?",
        a: "Only from what you add to its knowledge, and only when it is sure. In Suggest mode, the default, every reply is a draft your team checks before it goes.",
      },
    ],
  },
  {
    slug: "google-meet-guide",
    title: "Google Calendar and Meet bookings",
    description:
      "Connect Google to ERIX so bookings land on your calendar with a Meet link: sign in, create appointment types, set your hours, then share your booking page.",
    type: "guide",
    lead: "Customers pick a free slot, and the meeting appears on your Google Calendar with a Meet link. You set it up once.",
    screen: "booking",
    steps: [
      "Go to Connect → Apps → Google (Meet / Calendar) and click Connect. An owner or admin signs in with Google and allows access.",
      "Open Appointment types → New appointment type. Add a title and the length, and keep Google Meet as the location.",
      "Open Availability → Edit hours to set your weekly hours, the gap between meetings and your time zone (India by default).",
      "Copy your booking link from Availability and share it on WhatsApp or on your website.",
    ],
    sections: [
      {
        heading: "What ERIX can see",
        body: [
          "ERIX asks Google for two things: to create and update the events it books, and to see when you're busy. It doesn't read what your other events are about. Busy times on your main calendar are left out of your booking page, so nobody books over them.",
        ],
      },
      {
        heading: "What happens when someone books",
        body: [
          "A booking with Google Meet as the location goes on your main Google Calendar with a Meet link, and the customer is added as a guest. They see a Join on Google Meet button straight away. Cancelling removes the event and rescheduling moves it. Phone and in-person bookings are saved in ERIX without a calendar event.",
        ],
      },
      {
        heading: "Send your own confirmation",
        body: [
          "ERIX doesn't send a confirmation message on its own yet. Build one in ERIX Flow: start an automation on Meeting booked and send a WhatsApp template.",
        ],
      },
      {
        heading: "Booking on your website",
        body: [
          "The Share tab of an appointment type gives you code to add booking to your site as a popup, a full page or a slide-in panel.",
        ],
      },
      {
        heading: "If Google can't be reached",
        body: [
          "The booking is still saved, just without a Meet link, so you never lose one. Check connection on the Google page's Settings tells you if something needs fixing.",
        ],
      },
    ],
    faqs: [
      {
        q: "Which time zone do bookings use?",
        a: "The time zone in your booking hours: India Standard Time unless you change it.",
      },
      {
        q: "How do I disconnect Google?",
        a: "Open the Google page → Settings → Remove connection. ERIX removes its access from your Google account.",
      },
    ],
  },
  {
    slug: "razorpay-guide",
    soon: true,
    title: "Collect payments with Razorpay links",
    description:
      "Connect your own Razorpay account to ERIX, send a payment link with each GST invoice on WhatsApp or email, and see the invoice turn paid when the customer pays.",
    type: "guide",
    lead: "Customers pay from a link on the invoice, the money goes to your Razorpay account, and ERIX marks the invoice paid.",
    screen: "invoice",
    steps: [
      "In your Razorpay dashboard, open Account & Settings → API Keys and generate a key. Keep the Key ID and Key Secret handy.",
      "In ERIX, go to Connect → Apps → Payments, choose Razorpay, paste the Key ID and Key Secret, add a Webhook Secret of your choice, and click Connect.",
      "Open Settings → Check connection to test the keys.",
      "Under Payment confirmations, copy the webhook URL. In Razorpay, open Account & Settings → Webhooks, add it, tick payment_link.paid and payment.captured, and use the same Webhook Secret.",
      "Open a saved invoice, click Create payment link, then Send on WhatsApp or Send email.",
    ],
    sections: [
      {
        heading: "Your account, your money",
        body: [
          "Payments go straight to your own Razorpay account; ERIX never holds the money. Razorpay's own fees and settlement times apply.",
        ],
      },
      {
        heading: "Why the webhook matters",
        body: [
          "Razorpay tells ERIX about each payment through the webhook. Without the Webhook Secret, ERIX can't trust that message, so the invoice stays unpaid until you record the payment yourself.",
        ],
      },
      {
        heading: "When the customer pays",
        body: [
          "The invoice turns Paid, or Partly paid for a smaller amount, and you get a notification with a link to it. An automation in ERIX Flow that starts on Invoice paid can send a thank-you on its own.",
        ],
      },
      {
        heading: "Good to know",
        body: ["A few details save confusion later:"],
        points: [
          "The link asks for the balance due, in the invoice's currency",
          "Creating the link again reuses the same one",
          "Editing the total, recording a manual payment or voiding the invoice cancels the old link",
          "Send on WhatsApp works while the customer's 24-hour window is open; otherwise send the invoice by email",
          "Try it with Razorpay test keys first, then replace them with your live keys",
          "Refunds are made in Razorpay and don't change the invoice in ERIX",
        ],
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════════
 * ERIX Flow
 * ═════════════════════════════════════════════════════════════════════ */

export const FLOW_PAGES: SubPage[] = [
  {
    slug: "node-types",
    title: "Automation steps in ERIX Flow",
    description:
      "The steps you can add to an ERIX automation today: send a message, wait, Wait for a reply, approval, AI reply and update the contact, and what's coming soon.",
    type: "capability",
    lead: "An automation is one starting event and a few steps. These are the steps in ERIX Flow today, and the ones coming in version 1.2.",
    screen: "flow",
    sections: [
      {
        heading: "Send a message",
        body: [
          "Send a WhatsApp message to the contact the run is about. Inside WhatsApp's 24-hour window you can send a normal message; outside it, use a template WhatsApp has approved. The message can use the contact's details, such as their first name.",
        ],
      },
      {
        heading: "Wait",
        body: [
          "Pause the run for some minutes, hours or days, such as two days before a follow-up, so messages arrive when they make sense instead of all at once.",
        ],
      },
      {
        heading: "Wait for a reply",
        body: [
          "Pause until the contact answers or a time limit ends. The run then carries on down one of two paths: Replied, when they answered, or No reply, when the time ran out. It's the step behind every “nudge them if they go quiet” follow-up.",
        ],
      },
      {
        heading: "Ask for approval",
        body: [
          "Hold the run until someone on your team decides. Use it before money or a customer message goes out, so nothing leaves without a person's OK. Requests collect on the Approvals page, live.",
        ],
      },
      {
        heading: "AI reply",
        body: [
          "Let the AI agent write the reply from your knowledge: documents, price lists, FAQs and website pages. Like the agent in the inbox, it drafts for a person by default, and refunds, complaints and medical questions always go to your team.",
        ],
      },
      {
        heading: "Update the contact",
        body: [
          "Save what the run learned on the contact, such as a tag or a field, so your team sees it on the timeline and the pipeline.",
        ],
      },
      {
        heading: "Coming soon in version 1.2",
        body: ["These steps aren't in ERIX Flow today. They arrive in version 1.2:"],
        points: [
          "Webhooks, to send data to other software and take data in",
          "Schedules beyond once a day, such as every few hours or on chosen weekdays",
          "Branches with more than two paths, and AND/OR conditions",
          "Loops over a list",
          "Connected apps",
        ],
      },
    ],
    faqs: [
      {
        q: "Can I message someone who hasn't written to me today?",
        a: "Yes, with a template WhatsApp has approved. Normal messages only go within 24 hours of the customer's last message.",
      },
      {
        q: "Can an automation split into more than two paths?",
        a: "Not yet. Today, Wait for a reply splits into Replied and No reply. Branches and conditions arrive in version 1.2.",
      },
    ],
  },
  {
    slug: "triggers",
    title: "What starts an ERIX automation",
    description:
      "ERIX automations start when something happens: a new lead, a stage change, a won or lost deal, a tag, a form, an inbound message or a booking.",
    type: "capability",
    lead: "Every automation begins with one event. Pick it when you build the automation, and ERIX starts a run each time it happens.",
    screen: "flow",
    sections: [
      {
        heading: "Leads and the pipeline",
        body: ["Most follow-ups start from something that happens to a lead:"],
        points: [
          "A lead is created",
          "A lead enters or leaves a stage",
          "A deal is won or lost",
          "A contact is tagged",
        ],
      },
      {
        heading: "Forms and messages",
        body: ["Others start from something a customer does:"],
        points: ["A form is submitted", "A message comes in on WhatsApp"],
      },
      {
        heading: "Bookings",
        body: [
          "An automation can start when a meeting is booked, rescheduled or cancelled. Appointment Reminders starts on a booked meeting and sends WhatsApp reminders 1 hour and 15 minutes before the appointment.",
        ],
      },
      {
        heading: "Examples by business",
        body: ["The same events cover very different follow-ups:"],
        points: [
          "A clinic: a meeting is booked, and WhatsApp reminders go out before the appointment",
          "A property consultant: a lead enters Site Visit Done, a message asks how the visit went, and No reply sends a nudge two days later",
          "A coaching institute: an admission form is submitted, and a welcome message goes out at once",
          "Any business: a booking is made, a thank-you message goes out and the contact is updated",
        ],
      },
      {
        heading: "Templates that come ready",
        body: [
          "Templates are made for each industry. Welcome Journey starts when a new lead comes in, and Appointment Reminders starts on a booked meeting. Each one installs as a draft until you switch it on.",
        ],
      },
      {
        heading: "Every run on the contact",
        body: [
          "Each run is saved on the contact it's about, with every step and what it did, and it updates live while the run is going.",
        ],
      },
      {
        heading: "Coming soon",
        body: [
          "Today an automation starts on an event inside ERIX, once a day at a set hour, or when you run it for a segment. Webhooks, and schedules beyond once a day, arrive in version 1.2.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can my own software start an automation?",
        a: "Not yet. Starting an automation from a webhook arrives in version 1.2.",
      },
      {
        q: "Can an automation start at a set time every week?",
        a: "Once a day at a set hour, yes. Weekly and other schedules arrive in version 1.2.",
      },
    ],
  },
  {
    slug: "custom-nodes",
    title: "Custom steps in ERIX Flow",
    description:
      "Custom automation steps and a step marketplace aren't part of ERIX Flow today. Here is what you can build with the built-in steps, and where to start instead.",
    type: "capability",
    lead: "Building your own steps, and sharing them in a marketplace, isn't available in ERIX Flow today.",
    sections: [
      {
        heading: "What you can do now",
        body: [
          "The built-in steps cover sending on WhatsApp, waiting, waiting for a reply, a yes-or-no condition, approvals, AI replies and updating the contact. Webhooks, multi-path branches, loops and connected apps are coming soon, in version 1.2.",
        ],
      },
    ],
    notice: "Custom steps aren't available yet. See Automation steps in ERIX Flow for what's built in.",
  },
  {
    slug: "zapier-alternative",
    title: "ERIX Flow vs Zapier for Indian SMBs",
    description:
      "ERIX Flow vs Zapier: Zapier links thousands of apps; ERIX Flow works natively on your contacts, inbox and WhatsApp, with approvals and AI replies built in.",
    type: "comparison",
    lead: "Both run automations, but they're built for different jobs. Here is an honest split of where each one fits.",
    screen: "flow",
    sections: [
      {
        heading: "The short answer",
        body: [
          "Pick Zapier when your work hops between many different apps. Pick ERIX Flow when the work lives in your customer conversations: WhatsApp, phone calls and your pipeline, all on one contact record.",
        ],
      },
      {
        heading: "Where Zapier is stronger",
        body: [
          "Zapier connects to thousands of third-party apps. ERIX Flow works inside ERIX; webhooks and connected apps are coming soon, in version 1.2. If you need to pass data between a dozen tools, Zapier is the better fit.",
        ],
      },
      {
        heading: "Where ERIX Flow is stronger",
        body: ["ERIX Flow already knows your customers and WhatsApp's rules, so you don't rebuild them:"],
        points: [
          "Starts on what happens in ERIX: new leads, stage changes, forms, messages and bookings",
          "WhatsApp's 24-hour window and approved templates handled for you",
          "Wait for a reply, with a Replied path and a No reply path",
          "AI replies from your own knowledge, as drafts by default",
          "Approval steps before money or a customer message goes out",
          "Templates made for your industry",
          "A run history on every contact, updated live",
        ],
      },
      {
        heading: "How the pricing differs",
        body: [
          "Zapier bills by the number of tasks your automations run. ERIX Flow isn't a separate subscription: it comes with ERIX, on the same contacts and inbox. During the pilot, our team sets up your workspace and agrees pricing with you.",
        ],
      },
      {
        heading: "Using both",
        body: [
          "You don't have to choose. Keep Zapier for the hops between your other apps, and let ERIX Flow handle the follow-ups that live in your customer chats. Webhooks to link the two are coming soon, in version 1.2.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can ERIX Flow connect to Google Sheets or other apps?",
        a: "Not today. Connected apps and webhooks are coming soon, in version 1.2.",
      },
      {
        q: "Is ERIX Flow a separate subscription?",
        a: "No. ERIX Flow comes with ERIX. During the pilot, our team agrees pricing with each business.",
      },
    ],
  },
  {
    slug: "email-automation-guide",
    soon: true,
    title: "Automate emails from your business address",
    description:
      "Send emails automatically from your own domain with ERIX Flow: pick a trigger like a new contact or a paid invoice, write the email, and add an approval step.",
    type: "guide",
    lead: "Welcome emails, booking follow-ups and thank-yous for paid invoices can go out on their own, from your own address.",
    screen: "flowCanvas",
    steps: [
      "Connect your domain first (Connect → Apps → Email), so emails come from you@yourcompany.com.",
      "Open ERIX Flow → Automations and start a new automation. Under What starts this automation?, choose When something happens and pick the event.",
      "Add an Email step. Write the subject and the message, and insert details such as {{firstName}} from Data you can use.",
      "Add an Approval step before the email if a person should check it first, then try it with Test run and turn it on.",
    ],
    sections: [
      {
        heading: "Events that can start an email",
        body: ["Pick the moment the email should go out:"],
        points: [
          "New contact added",
          "Contact moves into a stage of your pipeline",
          "Meeting booked, completed or cancelled",
          "Invoice paid, or a payment received",
          "An email or WhatsApp message received",
          "Deal won or lost",
        ],
      },
      {
        heading: "Writing the message",
        body: [
          "Leave a blank line for a new paragraph, wrap words in two stars for bold, and paste links as they are; they become clickable. Details about the contact, such as first name, company or city, and details from the event that started the automation can be dropped in from Data you can use.",
        ],
      },
      {
        heading: "Who receives it",
        body: [
          "ERIX emails only people who have contacted you, for example through a form, a booking or a message. Turn on Marketing email for offers: those go only to contacts who ticked Send me offers and updates on your form or booking page, carry an Unsubscribe link, and need your business address in Invoice settings first. Anyone who unsubscribes is skipped from then on.",
        ],
      },
      {
        heading: "Emailing a whole segment",
        body: [
          "To email a group, such as everyone with a tag, start the automation On a schedule and choose Each contact in a segment.",
        ],
      },
      {
        heading: "The approval step",
        body: [
          "An Approval step pauses the automation and emails your owners and admins, or the people you name, one-click Approve and Reject links. You choose what happens if nobody decides in time: a reminder, a rejection or a separate path.",
        ],
      },
    ],
    faqs: [
      {
        q: "Which address do automation emails come from?",
        a: "The sender you set when you connected your domain. Replies go to your reply-to address, or to the From address if you didn't set one.",
      },
      {
        q: "Can I send a newsletter?",
        a: "Yes, as a Marketing email to a segment. It goes only to contacts who agreed to offers, with an Unsubscribe link in every email.",
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════════
 * ERIX Connect
 * ═════════════════════════════════════════════════════════════════════ */

export const CONNECT_PAGES: SubPage[] = [
  {
    slug: "channels",
    title: "Channels in ERIX Connect: what's live today",
    description:
      "WhatsApp Business API, phone calls and Google Calendar and Meet: what ERIX Connect supports today, and what's coming soon.",
    type: "capability",
    lead: "Every channel lands in the same inbox and on the same contact, so your team answers from one place.",
    screen: "inbox",
    sections: [
      {
        heading: "WhatsApp",
        body: [
          "Connect your own WhatsApp Business account with Meta's Embedded Signup. Meta bills you directly, and ERIX adds no markup. Incoming messages arrive in the inbox live and are linked to the contact by phone number, creating one if needed. Each message shows its ticks: sent, delivered, read.",
        ],
      },
      {
        heading: "One inbox for all of it",
        body: [
          "Every channel lands in one list, with unread counts. Chats the AI handed over sit under Needs you, and AI drafts show where the answer came from, such as “From: Baner listing”, with Send or Edit. When the tab is in the background, a chime and a count in the tab title tell you a customer wrote; you can switch that off.",
        ],
      },
      {
        heading: "Google Calendar and Meet",
        body: [
          "Connect Google once and bookings get Meet links. Bookings still work without Google, just without a meeting link.",
        ],
      },
      {
        heading: "Coming soon",
        body: [
          "Instagram DMs, email and website chat are coming soon. Facebook Messenger and Telegram inboxes arrive in version 1.2.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can one reply go back on the customer's channel?",
        a: "Yes. Your reply from the inbox always goes back on the channel the customer used.",
      },
      {
        q: "Do I need to refresh to see new messages?",
        a: "No. New messages, ticks and typing appear live, on your computer and your phone.",
      },
    ],
  },
  {
    slug: "unified-send-api",
    title: "Send API for developers",
    description:
      "Developers can send WhatsApp messages from their own software through ERIX Connect's send endpoint, with scoped keys and the same rules as the app.",
    type: "capability",
    lead: "Your own software can send a message on a connected channel through one endpoint per channel.",
    sections: [
      {
        heading: "One endpoint per channel",
        body: [
          "Send to /v1/api/infra/connect/send/{channel} with a scoped key created in your dashboard. WhatsApp's rules still apply: outside the 24-hour window you need an approved template. The API docs at api.ecodrix.com list the fields, and the public SDK, @ecodrix/erix-api, wraps the same API.",
        ],
      },
    ],
    notice: "This is a short developer note. The full reference lives in the API docs at api.ecodrix.com.",
  },
  {
    slug: "whatsapp-api-guide",
    title: "Connect the WhatsApp Business API to ERIX",
    description:
      "Step by step: connect your own WhatsApp Business account to ERIX with Meta's Embedded Signup, get templates approved, and reply within WhatsApp's rules.",
    type: "guide",
    lead: "Connecting takes a few minutes. Here is the order that works, and the rules WhatsApp sets once you're live.",
    screen: "inbox",
    steps: [
      "Go to Connect → Apps → WhatsApp. Keep Meta Embedded Signup selected, click Connect with Meta, log in with Facebook and pick your business number.",
      "Open Templates → New template, write the message, choose its category and language, and send it to WhatsApp for approval.",
      "Reply to customers from the inbox while their 24-hour window is open.",
      "Use approved templates for broadcasts and for messages outside the 24-hour window.",
    ],
    sections: [
      {
        heading: "Your account, your Meta bill",
        body: [
          "ERIX connects to your own WhatsApp Business account, not a shared one. Meta bills your business directly for messages, and ERIX adds no markup to Meta's charges. Check Meta's current rate card for India before you plan a big broadcast.",
        ],
      },
      {
        heading: "The 24-hour rule, in plain words",
        body: [
          "When a customer messages you, a 24-hour window opens. In that time you can reply with anything, such as free text or photos. Every new message from them opens a fresh 24 hours. After 24 hours of silence, WhatsApp lets businesses send only templates it has approved, and ERIX keeps track of the window for you.",
        ],
      },
      {
        heading: "Templates and broadcasts",
        body: [
          "Templates need WhatsApp's approval before you use them. Once approved, send one to a single contact or as a broadcast to a group, such as everyone with a tag. Broadcasts wait out quiet hours, 9 pm to 9 am IST.",
        ],
      },
      {
        heading: "Replies with AI, checked by you",
        body: [
          "Turn on AI replies under AI → Assistant and the agent drafts answers from your knowledge, showing the source of each. Until you switch on Auto-reply, every draft waits for a person to send it; even then, only answers it is confident about go out on their own. Refunds, complaints, medical and legal questions are set to go to your team by default.",
        ],
      },
      {
        heading: "Every chat on the right contact",
        body: [
          "Messages are matched to contacts by phone number, so a customer's WhatsApp chat sits next to their calls and bookings, and ticks update live: sent, delivered, read.",
        ],
      },
    ],
    faqs: [
      {
        q: "Does ERIX add a markup on WhatsApp charges?",
        a: "No. You connect your own WhatsApp Business account, so Meta bills you directly.",
      },
      {
        q: "Can I send a broadcast to anyone?",
        a: "Broadcasts use templates WhatsApp has approved, and WhatsApp's own rules on who you may message still apply. Read Meta's policy before you import a list.",
      },
    ],
  },
  {
    slug: "green-tick",
    title: "WhatsApp verified badge",
    description:
      "What WhatsApp's verified badge for businesses is, why ERIX can't grant it, and where to apply for it in Meta's tools. Meta sets the rules, so check them first.",
    type: "guide",
    lead: "The verified badge on WhatsApp is granted by Meta, not by ERIX or any other provider.",
    sections: [
      {
        heading: "Where to apply",
        body: [
          "Requests are made in Meta's own tools for your WhatsApp Business Account. Meta decides who qualifies and changes its criteria from time to time, so read Meta's current help pages before you apply. Connecting your number to ERIX doesn't change your eligibility either way.",
        ],
      },
    ],
    notice: "Meta's badge rules change. Check Meta's help pages for the current criteria.",
  },
  {
    slug: "whatsapp-broadcast-limits",
    title: "WhatsApp broadcast limits, explained",
    description:
      "How many WhatsApp messages you can broadcast: Meta's daily limit on new conversations, what moves it, and how broadcasts work in ERIX with approved templates.",
    type: "guide",
    lead: "Meta sets the limits on WhatsApp broadcasts. Here is how they work, and what ERIX does around them.",
    sections: [
      {
        heading: "Meta's daily limit",
        body: [
          "Meta limits how many different customers a business can start conversations with in a rolling 24 hours. New numbers start lower, and the limit rises as you send messages people want and keep a good quality rating. Meta changes the tiers from time to time, so check your current limit in WhatsApp Manager rather than relying on a number on a blog.",
        ],
      },
      {
        heading: "What moves the limit",
        body: [
          "Meta looks at your quality rating, which drops when people block or report your messages. Send offers to people who expect them and keep templates short and useful, and the limit tends to rise; a poor rating can hold it back. Your rating is shown in WhatsApp Manager.",
        ],
      },
      {
        heading: "Marketing, utility and authentication",
        body: [
          "WhatsApp files every template as Marketing, Utility or Authentication, and Meta charges each category differently. Meta's rates for India change, so check its current rate card before you plan a big send.",
        ],
      },
      {
        heading: "Before a big send",
        body: ["A few checks keep a festive broadcast from hurting your number:"],
        points: [
          "Check your current limit and quality rating in WhatsApp Manager",
          "Send to people who know you and expect the offer, not a bought list",
          "Keep the template short, useful and clearly from your business",
          "On a new number, start with smaller sends and grow as the limit rises",
          "Check Meta's current rate card so the cost isn't a surprise",
        ],
      },
      {
        heading: "Broadcasts in ERIX",
        body: [
          "In ERIX, a broadcast uses a template WhatsApp has approved and goes to the contacts you pick, such as everyone with a tag. Because you connect your own WhatsApp account, Meta bills you directly and ERIX adds no markup. Broadcasts wait out quiet hours in Indian time.",
        ],
      },
    ],
    faqs: [
      {
        q: "How many people can I broadcast to in a day?",
        a: "Meta decides, based on your number's current limit and quality rating. Check it in WhatsApp Manager.",
      },
      {
        q: "Who pays for broadcast messages?",
        a: "Meta bills your business directly, with no ERIX markup.",
      },
    ],
  },
  {
    slug: "website-chat-guide",
    soon: true,
    title: "Add ERIX chat to your website",
    description:
      "Put the ERIX chat on your website with one line of code: register your domain, paste the code before </body>, check it, and answer visitors from your inbox.",
    type: "guide",
    lead: "Visitors ask, and the message lands in the same inbox as WhatsApp and email. Setup is one line of code.",
    screen: "inbox",
    steps: [
      "Go to Connect → Apps → Website Chat Widget and click Connect.",
      "Enter your website's domain and click Connect. ERIX shows you one line of code.",
      "Paste that line just before </body> on every page of your site, then publish the site.",
      "Click Check my website. Once ERIX finds the chat on your site, the channel turns on.",
    ],
    sections: [
      {
        heading: "Make it look like your business",
        body: [
          "Set the business name, the greeting visitors see first, the colour (pick one or type a hex code), the corner the chat button sits in, and your logo. A preview shows each change, and visitors see it the next time a page loads. The code never changes, so you don't paste it again.",
        ],
      },
      {
        heading: "Decide when to ask for details",
        body: [
          "Ask visitors for their name and a phone number or email before the chat, only when needed, or never. When they share a phone or email, ERIX matches it to an existing contact or creates a new one, so the chat sits on the right record.",
        ],
      },
      {
        heading: "The websites it runs on",
        body: [
          "The chat runs only on the websites you add under Your websites, with or without www; until you add one, it stays off everywhere. *.yourdomain.com covers your subdomains. Your plan sets how many websites you can add.",
        ],
      },
      {
        heading: "On WordPress, Shopify or Wix",
        body: ["The line goes wherever your site lets you add code to every page:"],
        points: [
          "WordPress: a header-and-footer code plugin, or your theme's footer",
          "Shopify: Online Store → Themes → Edit code → theme.liquid, just before </body>",
          "Wix: Settings → Custom code, in the body on all pages (needs a paid Wix plan with your own domain)",
          "Paste it into the site itself: Check my website reads your page's HTML, so code added only through a tag manager may not be found",
        ],
      },
      {
        heading: "Replies, by people or AI",
        body: [
          "Messages arrive in the inbox marked Website chat. Reply there yourself, or turn on AI replies under AI → Assistant: every AI draft waits for a person to send it until you switch on auto-reply, and visitors always see AI replies labelled as AI.",
        ],
      },
    ],
    faqs: [
      {
        q: "Does the chat work on phones?",
        a: "Yes. On small screens it opens full screen.",
      },
      {
        q: "Is the code a secret?",
        a: "No. It carries your workspace's public ID, and the chat runs only on the websites you've added.",
      },
    ],
  },
  {
    slug: "email-domain-guide",
    soon: true,
    title: "Send email from your own domain",
    description:
      "Set up ERIX to send email as you@yourcompany.com: add your domain, copy four DNS records, verify, and choose the sender name and address customers see.",
    type: "guide",
    lead: "Customers trust email from your own address. Setup is four DNS records and a few minutes; DNS can take longer to catch up.",
    steps: [
      "Go to Connect → Apps → Email and click Connect. Choose the Domain option, not Gmail.",
      "Type your domain without https:// or www, for example sharmadental.in, and click Verify domain.",
      "Copy the four records ERIX shows into your domain's DNS: three CNAME records for DKIM and one TXT record for DMARC.",
      "Click Check now. DNS changes can take anywhere from 5 minutes to 72 hours, so check again later if it isn't verified yet.",
      "Add your sender name, a From address that ends with your domain and an optional reply-to address, then click Finish setup.",
    ],
    sections: [
      {
        heading: "Where to add the records",
        body: [
          "Add them wherever your domain's DNS is managed: usually your domain registrar, such as GoDaddy, Hostinger, BigRock or Namecheap, or Cloudflare if you use it. Copy each Name and Value exactly. Some DNS panels add your domain to the name for you, so if the name already ends with your domain, don't type it twice.",
        ],
      },
      {
        heading: "Your mailbox keeps working",
        body: [
          "ERIX doesn't touch your MX records, so Gmail, Google Workspace, Zoho or whichever mailbox you use today keeps receiving mail as before. The records only show inboxes that ERIX may send on your domain's behalf.",
        ],
      },
      {
        heading: "Already have a DMARC record?",
        body: [
          "A domain should have only one DMARC record. If yours already has one, keep it and skip the DMARC record ERIX shows; two DMARC records make both invalid.",
        ],
      },
      {
        heading: "Changing the sender later",
        body: [
          "To change the sender name or address, remove the domain on the Email page and set it up again with the new details.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do I need to change my MX records?",
        a: "No. ERIX only adds DKIM and DMARC records, so your current mailbox keeps receiving mail.",
      },
      {
        q: "How long does verification take?",
        a: "Often minutes, but DNS can take up to 72 hours. Click Check now again later; nothing breaks while you wait.",
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════════
 * ERIX Storage: technical notes, kept short
 * ═════════════════════════════════════════════════════════════════════ */

export const STORAGE_PAGES: SubPage[] = [
  {
    slug: "presigned-uploads",
    title: "Direct uploads to ERIX Storage",
    description:
      "Files uploaded to ERIX go straight to storage through short-lived signed links, kept in each workspace's own folder, with its storage checked first.",
    type: "capability",
    lead: "Uploads go directly from the browser to storage, not through ERIX's servers.",
    screen: "documents",
    sections: [
      {
        heading: "Signed, short-lived links",
        body: [
          "ERIX hands the browser a time-limited upload link, and the file goes straight to storage. Every file sits under its workspace's own folder, and the workspace's storage is checked before the upload starts.",
        ],
      },
    ],
  },
  {
    slug: "ai-image-processing",
    title: "Images and photos in ERIX Storage",
    description:
      "Photos and images in ERIX Storage live inside the project they belong to, next to the client's documents. Image tools and a Storage page are coming soon.",
    type: "capability",
    lead: "Site photos, floor plans and design images sit in the project they belong to.",
    sections: [
      {
        heading: "Kept with the project",
        body: [
          "Upload PNG and JPG files up to 100 MB each to a project, and your client sees them in their portal next to the documents. Send any file as a share link instead of another WhatsApp attachment. There are no AI image tools in ERIX today.",
        ],
      },
    ],
    notice: "The standalone Storage page is coming soon. Today, files live inside projects.",
  },
  {
    slug: "quota-metering",
    title: "Storage quotas in ERIX",
    description:
      "Each ERIX workspace has a storage allowance. Every upload checks it first, and when it's full ERIX says so plainly and suggests what to do next.",
    type: "capability",
    lead: "Each workspace has a storage allowance, and ERIX keeps the count honest.",
    sections: [
      {
        heading: "Checked before every upload",
        body: [
          "Uploads check the workspace's storage first. When it's full, the upload says so and suggests deleting files you no longer need. Talk to us if your workspace needs more.",
        ],
      },
    ],
  },
];

/** Sub-pages that are live in v1: what lists, the sitemap and related links show. */
export function getLivePages(product: string): SubPage[] {
  return getProductPages(product).filter((p) => !p.soon);
}

/** All sub-pages for a module slug (Upcoming ones included, so their URLs still answer). */
export function getProductPages(product: string): SubPage[] {
  switch (product) {
    case "erix-crm":
      return CRM_PAGES;
    case "erix-flow":
      return FLOW_PAGES;
    case "erix-connect":
      return CONNECT_PAGES;
    case "erix-storage":
      return STORAGE_PAGES;
    default:
      return [];
  }
}
