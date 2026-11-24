import { Building2, Clock, Mail, UserCheck } from "@/components/icons";
import { LEGAL, type LegalDoc } from "@/lib/legal/config";

export const contactDoc: LegalDoc = {
  slug: "contact",
  title: "Contact Us",
  pill: "Contact",
  description:
    "How to reach ECODrIx: business details and GSTIN, address, phone and WhatsApp, which email to use for what, support hours and our Grievance Officer.",
  intro: `${LEGAL.brand} is run by ${LEGAL.entity}. Here is how to reach us.`,
  effectiveDate: "28 October 2026",
  sections: [
    {
      id: "business",
      title: "Business Details",
      icon: Building2,
      body: [
        {
          list: [
            `Legal name: ${LEGAL.proprietor} (sole proprietorship)`,
            `Trade name: ${LEGAL.brand}`,
            `GSTIN: ${LEGAL.gstin}`,
            `Place of business: ${LEGAL.address}`,
          ],
        },
      ],
    },
    {
      id: "email",
      title: "Which Email to Use",
      icon: Mail,
      body: [
        {
          table: {
            headers: ["For", "Email"],
            rows: [
              ["Help with ERIX or your account", LEGAL.emails.support],
              ["Payments, invoices and refunds", LEGAL.emails.billing],
              ["Privacy questions and data requests", LEGAL.emails.privacy],
              ["Complaints (Grievance Officer)", LEGAL.emails.grievance],
              ["Contracts and legal notices", LEGAL.emails.legal],
              ["Security issues and vulnerabilities", LEGAL.emails.security],
              ["Spam or abuse by an ERIX user", LEGAL.emails.abuse],
            ],
          },
        },
        {
          note: "Email from us always comes from an @ecodrix.com address.",
        },
      ],
    },
    {
      id: "hours",
      title: "Support Hours",
      icon: Clock,
      body: [
        `${LEGAL.supportHours}. We reply ${LEGAL.supportReply}.`,
        `Service status and incidents: ${LEGAL.domain}/status.`,
      ],
    },
    {
      id: "grievance",
      title: "Grievance Officer",
      icon: UserCheck,
      body: [
        "Under the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023:",
        {
          list: [
            `Name: ${LEGAL.grievanceOfficer} (proprietor)`,
            `Email: ${LEGAL.emails.grievance}`,
            `Address: ${LEGAL.address}`,
          ],
        },
        "We acknowledge a grievance within 48 hours and resolve it within one month.",
      ],
    },
  ],
};
