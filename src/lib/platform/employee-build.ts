import type { GlyphName } from "@/components/icons";

/** Data and rules for the "What should your AI employee do?" box on the AI Employee hub. */

export const BUILD_MIN_LENGTH = 8;
export const BUILD_MAX_LENGTH = 500;
/** Show the remaining-letters note once the text is longer than this. */
export const BUILD_NOTE_FROM = 400;

/** The six languages the product's builder offers. */
export const BUILD_LANGUAGES = [
  { value: "en-IN", label: "English" },
  { value: "hi-IN", label: "Hindi" },
  { value: "te-IN", label: "Telugu" },
  { value: "ta-IN", label: "Tamil" },
  { value: "kn-IN", label: "Kannada" },
  { value: "ml-IN", label: "Malayalam" },
] as const;

export const BUILD_PLACEHOLDERS = [
  "e.g. Answer patients on WhatsApp from our timings and fees, and book their appointment.",
  "e.g. Ask every new property enquiry their budget and area, then book a site visit.",
  "e.g. Tell customers our services and prices, and book their salon slot.",
  "e.g. Explain our courses and fees, and book a free demo class.",
];

export type BuildChipKey = "clinic" | "site_visit" | "salon" | "demo_class" | "prices";

export const BUILD_CHIPS: { key: BuildChipKey; label: string; icon?: GlyphName; sentence: string }[] = [
  {
    key: "clinic",
    label: "Book clinic appointments",
    icon: "stethoscope",
    sentence:
      "Answer patients on WhatsApp from our timings, doctors and fees. Book or move their appointment. Pass anything medical to our staff.",
  },
  {
    key: "site_visit",
    label: "Book site visits",
    icon: "building-2",
    sentence:
      "Reply to new property enquiries on WhatsApp. Ask their budget and area, share matching projects from our list and book a site visit.",
  },
  {
    key: "salon",
    label: "Book salon slots",
    icon: "calendar",
    sentence: "Tell customers our services, prices and timings on WhatsApp. Book, move or cancel their slot.",
  },
  {
    key: "demo_class",
    label: "Book demo classes",
    icon: "graduation-cap",
    sentence: "Explain our courses, batches and fees on WhatsApp and book a free demo class.",
  },
  {
    key: "prices",
    label: "Answer price questions",
    icon: "tag",
    sentence:
      "Answer price and timing questions on WhatsApp from our price list. If the answer is not there, hand the chat to our team.",
  },
];

/** Early-access interest code (the column is 50 wide): the chip key while its sentence is untouched, else custom. */
export function interestFor(text: string): string {
  const chip = BUILD_CHIPS.find((c) => c.sentence === text);
  return `ai_employee:${chip ? chip.key : "custom"}`;
}
