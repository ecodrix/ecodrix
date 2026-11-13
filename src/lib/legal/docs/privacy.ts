import {
  Baby,
  Bot,
  Building2,
  Clock,
  Eye,
  Globe,
  Info,
  Lock,
  Mail,
  RefreshCw,
  Share2,
  ShieldCheck,
  UserCheck,
} from "@/components/icons";
import { LEGAL, type LegalDoc } from "@/lib/legal/config";

export const privacyDoc: LegalDoc = {
  slug: "privacy",
  title: "Privacy Policy",
  pill: "Privacy & Data Protection",
  description:
    "What personal data ECODrIx collects for ERIX and LAIE, why, where it is stored, how long we keep it, and how to use your rights under India's DPDP Act.",
  intro: `This Privacy Policy explains how ${LEGAL.entity} ("${LEGAL.brand}", "we", "us") handles personal data on ecodrix.com, in the ERIX console (${LEGAL.appUrl}) and in our products: ERIX (CRM, Connect messaging, Flow automations and AI agents) and LAIE (invite-only lead discovery). It follows India's Digital Personal Data Protection Act, 2023 (DPDP Act) and the Information Technology Act, 2000.`,
  effectiveDate: "31 October 2026",
  sections: [
    {
      id: "roles",
      title: "Who Is Responsible for Your Data",
      icon: Info,
      body: [
        {
          list: [
            "For people who deal with us directly (account holders, website visitors, early-access and newsletter subscribers), we are the data fiduciary: we decide why and how that data is used.",
            "For data a business keeps in its ERIX workspace (its contacts, leads, conversations and files), that business is the data fiduciary and we are its data processor. We use that data only to run the service for that business, under our Terms of Service and Data Processing Agreement.",
          ],
        },
        "If you are a customer of a business that uses ERIX, ask that business about your data. If you write to us instead, we pass your request to the business.",
      ],
    },
    {
      id: "collection",
      title: "What We Collect",
      icon: Info,
      body: [
        { subheading: "Your account" },
        {
          list: [
            "Your name, email address and workspace name when you sign up.",
            "Your password, stored only as a scrypt hash, never in readable form. If you sign in with Google, GitHub or LinkedIn instead, that service gives us your name, email address and profile picture.",
            "Your phone number, only if you add it.",
            "Business details you choose to add during setup, such as industry and country.",
          ],
        },
        { subheading: "Payments" },
        {
          list: [
            "Your plan, the amount, the payment status and Razorpay's payment references. Razorpay collects your card, UPI or bank details; we never see or store them.",
          ],
        },
        { subheading: "Workspace data" },
        {
          list: [
            "Contacts, leads, conversations, messages, files, automations, invoices and anything else a team puts into ERIX or receives through the channels it connects. We hold this for the business that owns the workspace (see “Who Is Responsible for Your Data”).",
          ],
        },
        { subheading: "Collected automatically" },
        {
          list: [
            "Signed-in devices: IP address, browser, device and approximate country, so you can see your devices and sign them out.",
            "Server logs, used to keep the service secure and to fix faults.",
            "On ecodrix.com, only if you allow analytics: pages viewed, the site that sent you, campaign tags, screen size, browser, approximate country and a one-way hash of your IP address (not the address itself). See our Cookie Policy.",
          ],
        },
        { subheading: "Forms and messages to us" },
        {
          list: [
            "Early access: name, email address, business name, what you are interested in and, if you add it, your WhatsApp number. Newsletter: your email address.",
            "Support: whatever you send us by email, phone or WhatsApp.",
          ],
        },
        { subheading: "LAIE (invite-only)" },
        {
          list: [
            "LAIE finds businesses from public sources: search engines, business directories and Google Places. What it collects are public business listings, such as business name, category, address, phone number and website.",
          ],
        },
      ],
    },
    {
      id: "usage",
      title: "How We Use It",
      icon: Eye,
      body: [
        {
          list: [
            "Create and run your account and workspace, and keep you signed in.",
            "Do what you set up: send and receive messages on your connected channels, run your automations and run your AI agents.",
            "Bill you, issue GST invoices and keep tax records.",
            "Send service emails: sign-in and verification codes, security alerts, billing notices and replies to your requests.",
            "Keep the service secure: detect abuse, investigate incidents and fix faults.",
            "With your consent only: website analytics and our newsletter.",
          ],
        },
        "We do not sell personal data.",
      ],
    },
    {
      id: "ai",
      title: "AI Features",
      icon: Bot,
      body: [
        "ERIX AI agents and other AI features send the text they need, such as a customer's message, the recent conversation and the business's own information and instructions, to one of our AI providers: Anthropic, OpenAI or Google (the paid Gemini API). These providers process it in the United States. None of them trains its models on the data we send.",
        "Each AI agent answers only for the business that set it up, from that business's own information. It is not a general-purpose assistant. The business's team can read every AI conversation in the ERIX inbox and reply themselves.",
      ],
    },
    {
      id: "legal-basis",
      title: "Why We Are Allowed to Use It",
      icon: UserCheck,
      body: [
        {
          list: [
            "Consent: when you sign up, request early access, or join the newsletter, or allow analytics. You can withdraw it at any time (see “Your Rights and How to Use Them”).",
            "Legitimate uses the DPDP Act allows without separate consent: data you give us yourself for a stated purpose (for example, your email address to run your account) and data the law requires us to keep, such as tax records.",
          ],
        },
      ],
    },
    {
      id: "sharing",
      title: "Who We Share It With",
      icon: Share2,
      body: [
        {
          list: [
            "Service providers that run parts of ERIX for us: hosting, file storage, email, payments, AI and sign-in. Each gets only what its job needs. Our Sub-processors page lists every one, with what it handles and where.",
            "Channels and apps a workspace connects, such as WhatsApp, Instagram or Google Calendar. Data goes to them because the workspace asked for it.",
            "Authorities, when Indian law or a court order requires it.",
            "A new owner, if the business is ever transferred, who must keep the promises in this Policy.",
          ],
        },
      ],
    },
    {
      id: "location",
      title: "Where Your Data Is Stored and Processed",
      icon: Globe,
      body: [
        {
          list: [
            "Database, API servers and background jobs: Google Cloud in Mumbai, India.",
            "ecodrix.com and the ERIX console: Vercel, in the United States.",
            "Files: Cloudflare R2.",
            "Email sending: Amazon SES in Mumbai, India.",
            "AI processing: Anthropic, OpenAI and Google, in the United States.",
            "Payments: Razorpay, in India.",
          ],
        },
        "So some personal data is processed outside India.",
      ],
    },
    {
      id: "retention",
      title: "How Long We Keep It",
      icon: Clock,
      body: [
        {
          table: {
            headers: ["Data", "How long we keep it"],
            rows: [
              [
                "Account and workspace data, messages and AI conversation history",
                "Until the workspace deletes it, or until the workspace is deleted",
              ],
              [
                "A deleted workspace",
                "30 days, during which it can be restored on request; then it is erased. If the owner chooses “Delete permanently”, it is erased at once. Database backups that still hold it expire within 7 days after it is erased.",
              ],
              ["Website analytics events", "180 days"],
              ["Server logs", "180 days"],
              ["Early-access and newsletter entries", "Until you ask us to remove them, or you unsubscribe"],
              ["Invoices and payment records", "As long as tax law requires"],
            ],
          },
        },
      ],
    },
    {
      id: "rights",
      title: "Your Rights and How to Use Them",
      icon: UserCheck,
      body: [
        {
          table: {
            headers: ["Right", "How to use it"],
            rows: [
              [
                "Get a summary of your data",
                `Email ${LEGAL.emails.privacy} for a summary of the personal data we hold about you, what we do with it, and who we have shared it with. Our Sub-processors page lists the companies that process it for us.`,
              ],
              [
                "See and correct your account data",
                `In the console, open Settings → Account → Profile. Or email ${LEGAL.emails.privacy}.`,
              ],
              [
                "Get a copy of workspace data",
                `A workspace owner or admin can download a JSON file from Settings → Workspace → Danger zone → Export all data. One export holds up to 10,000 contacts and 5,000 conversations; the file says when a list was cut short. For the rest, write to ${LEGAL.emails.support}.`,
              ],
              [
                "Erase data",
                `A workspace owner can delete the workspace in Settings → Workspace → Danger zone. A business can erase one person's data from that contact's page in ERIX (invoices are kept for GST records). For anything else, email ${LEGAL.emails.privacy}.`,
              ],
              [
                "Withdraw consent",
                `Analytics: “Cookie preferences” in the footer of any ecodrix.com page. Newsletter: the unsubscribe link in any newsletter email. Anything else: email ${LEGAL.emails.privacy}. Withdrawing does not undo what was done before.`,
              ],
              [
                "Nominate someone",
                `Name a person to use your rights if you die or cannot act yourself, as the DPDP Act allows. Email ${LEGAL.emails.privacy}.`,
              ],
              [
                "Complain",
                "Write to our Grievance Officer first (see “Contact & Grievance Officer” below); the DPDP Act asks you to do this before going to the Board. If you are not satisfied with the answer, you can complain to the Data Protection Board of India.",
              ],
            ],
          },
        },
        "When you write to us, send it from the email address on your account, or tell us that address and your workspace name, so we can find your data and confirm the request is yours.",
        {
          note: "If your data sits in a business's ERIX workspace because you are that business's customer, the business handles your request. If you write to us, we forward it to them.",
        },
      ],
    },
    {
      id: "staff-access",
      title: "When Our Staff See Your Data",
      icon: ShieldCheck,
      body: [
        "Our staff can open a workspace to help you, for example when you contact support. Staff accounts are on an approved list, each with a role, and read-only staff cannot change anything. Signing in as a workspace is limited to our most senior admin role, lasts at most one hour, and every use is logged.",
      ],
    },
    {
      id: "google-limited-use",
      title: "Google API Services & Limited Use",
      icon: Lock,
      body: [
        "When a workspace connects Google Calendar, ECODrIx creates and updates calendar events (with Google Meet links) for the appointments booked through ERIX, and deletes an appointment's event when that appointment is cancelled. On the Google page in the ERIX console, the workspace can see the connected calendar's events from the last 30 days to the next 6 months, and create or edit events there. For the booking page, ERIX reads only free/busy times, never event titles or details, to avoid double bookings. When a workspace connects Google Sheets, ECODrIx reads and adds rows in the spreadsheets its automations name. When you sign in with Google, we receive your name, email address and profile picture. We ask only for the access these features need.",
        {
          note: "ECODrIx's use and transfer of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements. The use of raw or derived user data received from Google Workspace APIs will adhere to the Google User Data Policy, including the Limited Use requirements.",
        },
        {
          list: [
            "We do not use Google Workspace data, raw, aggregated or derived, to develop, train or improve foundational or generalised AI/ML models.",
            "We do not transfer or sell Google user data, except as needed to provide the connected feature, to comply with law, or as part of a merger or acquisition with notice to users.",
            "People do not read your Google data except with your explicit consent, for security or abuse investigations, to comply with law, or where the data has been aggregated and anonymised.",
          ],
        },
      ],
    },
    {
      id: "security",
      title: "Security and Breaches",
      icon: Lock,
      body: [
        "Data travels encrypted (TLS), our cloud providers encrypt it at rest, and the credentials a workspace uses to connect its channels are encrypted with AES-256-GCM before we store them. Our Security page has the details.",
        "If a breach affects data we hold for you or your business, we tell you without undue delay and within 48 hours of confirming it. We report incidents to CERT-In within 6 hours of noticing them, as Indian law requires.",
        "For data we are responsible for ourselves (see “Who Is Responsible for Your Data”), we follow the DPDP Rules: we tell the Data Protection Board without delay and send it a full report within 72 hours, and we tell each person affected without delay, through their account or the email address or phone number they gave us, what happened, how it may affect them, what we are doing about it, what they can do to protect themselves, and whom to contact.",
      ],
    },
    {
      id: "children",
      title: "Under-18s",
      icon: Baby,
      body: [
        `ERIX is for businesses. You must be 18 or older to create an account. If you think someone under 18 has given us their own data, email ${LEGAL.emails.privacy} and we will delete it.`,
        "A business that keeps children's data in its workspace, such as a clinic or a school, must get verifiable consent from a parent or guardian where the DPDP Act requires it.",
      ],
    },
    {
      id: "businesses",
      title: "If Your Business Uses ERIX",
      icon: Building2,
      body: [
        "You are the data fiduciary for your own customers' data. Under the DPDP Act it is your job to give them your own privacy notice, get their consent where needed, answer their requests (ERIX lets you export data and erase a contact) and tell them about breaches. Our Data Processing Agreement sets out what we do for you.",
      ],
    },
    {
      id: "changes",
      title: "Changes to This Policy",
      icon: RefreshCw,
      body: [
        "When what we do changes, we update this page and the date at the top. For important changes, we email account holders or show a notice in the console before the change applies.",
      ],
    },
    {
      id: "contact",
      title: "Contact & Grievance Officer",
      icon: Mail,
      body: [
        `Privacy questions and requests: ${LEGAL.emails.privacy}.`,
        `Grievance Officer (under the IT Act, 2000 and the DPDP Act, 2023): ${LEGAL.grievanceOfficer}, proprietor. Email ${LEGAL.emails.grievance} or call ${LEGAL.phone}. We acknowledge a grievance within 48 hours and resolve it within one month.`,
        `${LEGAL.entity}, ${LEGAL.address}.`,
      ],
    },
  ],
};
