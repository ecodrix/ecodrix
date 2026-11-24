/**
 * Shared legal/compliance facts for ECODrIx public policy pages.
 *
 * Every value here is a real fact about the business, as on its GST registration (founder,
 * 28 Oct 2026); never put a placeholder back. The documents in ./docs must only state what the
 * product and the business actually do. ECODrIx is the trade name of a sole proprietorship
 * (registered 8 Jun 2026), so there is no CIN; the GSTIN's PAN is the proprietor's.
 */

import type { IconComponent } from "@/components/icons";
import { CONTACT_EMAIL, SUPPORT_EMAIL } from "@/lib/site";

export const LEGAL = {
  brand: "ECODrIx",
  /** The sole proprietor: the GST "Legal Name of Business", exactly as registered. */
  proprietor: "Mekalthuru Dhanesh",
  /** How the business is named in agreements: legal name plus GST trade name. */
  entity: "Mekalthuru Dhanesh, sole proprietor, trading as ECODrIx",
  domain: "https://ecodrix.com",
  appUrl: "https://console.ecodrix.com",
  /** Principal place of business. */
  address: "Yerpadu, Tirupati district, Andhra Pradesh 517619, India",
  gstin: "37GHCPM6574C1Z5",
  /** Courts with exclusive jurisdiction. */
  jurisdiction: "Sri Kalahasthi, Andhra Pradesh, India",
  governingLaw: "the laws of India",
  grievanceOfficer: "Mekalthuru Dhanesh",
  /** What support actually commits to (founder, 28 Oct 2026). */
  supportHours: "Monday to Saturday, 10:00 to 19:00 IST",
  supportReply: "within one business day",
  // Two mailboxes only (see site.ts): users' requests go to support, general and legal enquiries to contact.
  emails: {
    support: SUPPORT_EMAIL,
    privacy: SUPPORT_EMAIL,
    grievance: SUPPORT_EMAIL,
    legal: CONTACT_EMAIL,
    billing: SUPPORT_EMAIL,
    security: SUPPORT_EMAIL,
    abuse: SUPPORT_EMAIL,
  },
} as const;

/** Content blocks a legal section can render. Strings are treated as paragraphs. */
export type LegalBlock =
  | string
  | { p: string }
  | { subheading: string }
  | { list: string[] }
  | { ol: string[] }
  | { note: string }
  | { table: { headers: string[]; rows: string[][] } };

export interface LegalSection {
  id: string;
  title: string;
  icon: IconComponent;
  body: LegalBlock[];
}

export interface LegalDoc {
  slug: string;
  title: string;
  pill: string;
  description: string;
  intro?: string;
  /** Fixed effective date shown as "Last updated", e.g. "28 October 2026". Required: a page never shows its build date. */
  effectiveDate: string;
  sections: LegalSection[];
}

/** Registry entry for the /legal index and cross-linking. */
export interface LegalDocMeta {
  slug: string;
  title: string;
  summary: string;
}
