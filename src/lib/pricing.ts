/**
 * Pricing helpers for the public pricing page.
 *
 * The catalogue comes from `plans.listPublic()` in `@ecodrix/erix-api` (see
 * `fetchPublicCatalogue` in `@/lib/api`): only plans staff Show on the website,
 * prices in paise, and the GST rate and trial from staff billing settings.
 * Nothing here holds a price, a GST rate or a trial length (founder, 16 Nov
 * 2026: every price, count and limit is an admin-editable value). This file
 * stays free of runtime SDK imports because the client plan cards use it.
 */

import type { BillingCatalogue, CataloguePlan } from "@ecodrix/erix-api";

// ─── Types ─────────────────────────────────────────────────────────────────

/** A `Quota` value as stored in the unified features object. */
export type Quota = number | "unlimited";

export interface PlanFeatures {
  erix?: {
    contacts?: Quota;
    agents?: Quota;
    whatsappMessages?: Quota;
    broadcasts?: boolean;
    aiAgent?: boolean;
  };
  connect?: { whatsapp?: boolean };
  workflows?: { activeWorkflows?: Quota };
  ai?: { callsPerMonth?: Quota };
  customBranding?: boolean;
  whiteLabel?: boolean;
  prioritySupport?: boolean;
}

/** A plan as the website reads it: the SDK item with its features typed. */
export type PublicPlan = Omit<CataloguePlan, "features"> & { features: PlanFeatures | null };

/** `gstPercent` and `trial` are typed here until the next erix-api release (Unreleased) types them. */
export type PublicCatalogue = Omit<BillingCatalogue, "plans" | "gstPercent" | "trial"> & {
  plans: PublicPlan[];
  gstPercent?: number;
  trial?: { planSlug: string; days: number; inviteOnly: boolean };
};

// ─── Display helpers ───────────────────────────────────────────────────────

/** Rupees from whole paise, Indian grouping; paise digits only when there are some. */
export function formatInr(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: paise % 100 === 0 ? 0 : 2,
    maximumFractionDigits: paise % 100 === 0 ? 0 : 2,
  }).format(paise / 100);
}

/** Format a quota value: number, "unlimited", or missing → "—". */
function fmtQuota(q: Quota | undefined): string {
  if (q === undefined) return "—";
  if (q === "unlimited") return "Unlimited";
  if (q >= 1_000_000) return `${(q / 1_000_000).toLocaleString("en-IN")}M`;
  return q.toLocaleString("en-IN");
}

/**
 * Yearly discount % vs paying monthly for 12 months.
 * Returns 0 when a price is missing or there's no discount.
 */
export function yearlyDiscountPct(monthly: number | null, yearly: number | null): number {
  if (!monthly || !yearly || monthly <= 0 || yearly <= 0) return 0;
  return Math.round(((monthly * 12 - yearly) / (monthly * 12)) * 100);
}

/** The trial sentence from staff settings, e.g. "Invited workspaces get 14 days of Starter free." Null when the API sent none. */
export function trialLine(catalogue: PublicCatalogue | null): string | null {
  const trial = catalogue?.trial;
  if (!trial || trial.days <= 0) return null;
  const name =
    catalogue.plans.find((p) => p.slug === trial.planSlug)?.name ??
    trial.planSlug.charAt(0).toUpperCase() + trial.planSlug.slice(1);
  return trial.inviteOnly
    ? `Invited workspaces get ${trial.days} days of ${name} free.`
    : `Every new workspace starts with ${trial.days} days of ${name} free.`;
}

/**
 * Plan bullets, built from the plan's own features so the cards follow the
 * live catalogue. Founder pricing (26 Oct 2026): the AI agent is on every
 * plan, and AI requests and team members drive the upgrade. Labels match
 * saas (components/platform/PlanCard.tsx). Never shown here: uptime SLA
 * figures (none are offered) and `erix.whatsappMessages`, which is only an
 * abuse cap because Meta bills the business directly.
 */
export function humaniseFeatures(plan: PublicPlan): string[] {
  const f = plan.features ?? {};
  const erix = f.erix ?? {};
  const connect = f.connect ?? {};
  const n = (q: Quota | undefined, one: string, many = `${one}s`) => `${fmtQuota(q)} ${q === 1 ? one : many}`;
  const bullets = [
    erix.aiAgent ? "AI employee" : null,
    `${fmtQuota(f.ai?.callsPerMonth)} AI requests / month`,
    n(erix.agents, "team member"),
    `Up to ${fmtQuota(erix.contacts)} contacts`,
    n(f.workflows?.activeWorkflows, "active automation"),
    connect.whatsapp ? "WhatsApp inbox and phone calls" : null,
    erix.broadcasts ? "WhatsApp broadcasts" : null,
  ];
  // Tier extras, as in saas: Scale and up show white-label and priority
  // support; Growth shows the branding removal.
  if (f.whiteLabel) bullets.push("White-label branding");
  else if (f.customBranding) bullets.push("No ERIX branding");
  if (f.prioritySupport) bullets.push("Priority support");
  return bullets.filter((b): b is string => b !== null);
}

/** Per-plan tagline — short, marketing-friendly. */
export function planDescription(slug: string): string {
  switch (slug) {
    case "starter":
      return "For small teams.";
    case "growth":
      return "For growing businesses that need more power.";
    case "scale":
      return "For established teams with serious volume.";
    default:
      return "";
  }
}
