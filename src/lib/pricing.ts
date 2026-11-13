/**
 * Pricing helpers for the public landing page.
 *
 * Fetches live plans + add-ons from the platform backend
 * (`GET /v1/api/platform/billing/plans/public`), with a static fallback for when the
 * API is unreachable. Includes a feature humaniser that turns the unified
 * `plan.features` jsonb into a curated bullet list for marketing display.
 *
 * The shape mirrors the server response:
 *   ECOD/server/src/routes/platform/plans.routes.ts
 */

import { PRIMARY_CTA } from "@/lib/site";

// ─── Types ─────────────────────────────────────────────────────────────────

/** A `Quota` value as stored in the unified features object. */
export type Quota = number | "unlimited";

export interface PlanFeatures {
  erix?: {
    contacts?: Quota;
    agents?: Quota;
    whatsappMessages?: Quota;
    pipelines?: Quota;
    broadcasts?: boolean;
    customFields?: boolean;
    aiAgent?: boolean;
    esignsPerMonth?: Quota;
    /** Invoice PDF exports per month (rehomed from the retired editor). */
    pdfExport?: Quota;
    /** In-product AI assists per month (rehomed from the retired editor). */
    aiAssists?: Quota;
  };
  laie?: {
    auditsPerMonth?: Quota;
    accessibilityChecks?: boolean;
    seoChecks?: boolean;
    customReports?: boolean;
  };
  connect?: {
    channels?: Quota;
    whatsapp?: boolean;
    email?: boolean;
    instagram?: boolean;
    telegram?: boolean;
  };
  cloud_storage?: {
    storageGB?: Quota;
    bandwidthGB?: Quota;
    transformsPerMonth?: Quota;
    customDomain?: boolean;
    signedUrls?: boolean;
  };
  workflows?: {
    activeWorkflows?: Quota;
    runsPerMonth?: Quota;
    conditionalNodes?: boolean;
    customNodes?: boolean;
  };
  ai?: {
    callsPerMonth?: Quota;
    modelsAccessible?: string[];
    embeddings?: boolean;
  };
  erix_store?: {
    jobsPerMonth?: Quota;
    semanticCacheGB?: Quota;
    queueRetentionDays?: Quota;
  };
  customDomain?: boolean;
  customBranding?: boolean;
  whiteLabel?: boolean;
  webhooks?: boolean;
  prioritySupport?: boolean;
  sla?: "none" | "99" | "99.9" | "99.99";
}

export type PlanSlug = "free" | "starter" | "growth" | "scale" | "enterprise";

export interface PublicPlan {
  slug: PlanSlug | string;
  name: string;
  tier: number;
  /** `null` = custom / contact-sales pricing (Enterprise). */
  priceMonthlyUsd: number | null;
  /** `null` = custom / contact-sales pricing (Enterprise). */
  priceYearlyUsd: number | null;
  currency: string;
  features: PlanFeatures;
  isDefault: boolean;
}

export interface PublicAddon {
  slug: string;
  name: string;
  description: string | null;
  service: "erix" | "laie" | "connect" | "cloud_storage" | "ai" | "platform" | string;
  feature: string;
  priceMonthlyUsd: number;
  priceUnit: "month" | "per_call" | "per_gb" | string | null;
}

export interface PublicPlansResponse {
  plans: PublicPlan[];
  addons: PublicAddon[];
  /**
   * True while prices aren't public (staff haven't released them): every
   * price is `null`, so a `null` price means "not shown", not "custom".
   * Absent on older API versions (prices always present).
   */
  pricesHidden?: boolean;
}

// ─── Fetch ─────────────────────────────────────────────────────────────────

function getApiUrl(): string {
  // Same env convention used by Contact.tsx; fall back to production.
  // Read via `globalThis` so this file type-checks even when the IDE's
  // TS service hasn't picked up `@types/node`.
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
  const env = proc?.env ?? {};
  return env.NEXT_PUBLIC_ERIX_SOCKET_URL || "https://api.ecodrix.com";
}

/**
 * Server-side fetch with ISR. Returns the response on success or `null`
 * on failure (network error, non-2xx, malformed body) so the caller can
 * fall back to the static snapshot.
 */
export async function fetchPublicPlans(): Promise<PublicPlansResponse | null> {
  try {
    const url = `${getApiUrl().replace(/\/$/, "")}/v1/api/platform/billing/plans/public`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      next: { revalidate: 300 },
      signal: controller.signal,
    } as unknown as RequestInit);

    clearTimeout(timeout);

    if (!res.ok) return null;
    const data = (await res.json()) as PublicPlansResponse;
    if (!data || !Array.isArray(data.plans)) return null;
    return data;
  } catch {
    return null;
  }
}

// ─── Display helpers ───────────────────────────────────────────────────────

/**
 * Format an integer amount in the plan's currency (₹ for INR, $ for USD, …).
 * Whole numbers only — plans are billed in whole major units.
 */
export function formatMoney(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format a quota value: number, "unlimited", or "0" → "—". */
function fmtQuota(q: Quota | undefined): string {
  if (q === undefined) return "—";
  if (q === "unlimited") return "Unlimited";
  if (typeof q === "number") {
    if (q >= 1_000_000) return `${(q / 1_000_000).toLocaleString()}M`;
    if (q >= 1_000) return `${q.toLocaleString()}`;
    return q.toString();
  }
  return String(q);
}

/**
 * Yearly discount % vs paying monthly for 12 months.
 * Returns 0 for free plans or when there's no discount.
 */
export function yearlyDiscountPct(monthly: number | null, yearly: number | null): number {
  if (!monthly || !yearly || monthly <= 0 || yearly <= 0) return 0;
  return Math.round(((monthly * 12 - yearly) / (monthly * 12)) * 100);
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
    erix.aiAgent ? "AI agent" : null,
    `${fmtQuota(f.ai?.callsPerMonth)} AI requests / month`,
    n(erix.agents, "team member"),
    `Up to ${fmtQuota(erix.contacts)} contacts`,
    n(f.workflows?.activeWorkflows, "active automation"),
    connect.instagram ? "All channels, Instagram included" : connect.whatsapp ? "WhatsApp inbox" : null,
    erix.broadcasts ? "WhatsApp broadcasts" : null,
  ];
  // Tier extras, as in saas: Scale and up show white-label and priority
  // support; Growth shows the branding removal.
  if (f.whiteLabel) bullets.push("White-label branding");
  else if (f.customBranding) bullets.push("No ERIX branding");
  if (f.prioritySupport) bullets.push("Priority support");
  return bullets.filter((b): b is string => b !== null);
}

// ─── Visual style per plan ─────────────────────────────────────────────────

/** Per-plan tagline — short, marketing-friendly. */
export function planDescription(slug: string): string {
  switch (slug) {
    case "free":
      return "The AI agent, inbox and CRM, free for one person.";
    case "starter":
      return "For small teams on every channel.";
    case "growth":
      return "For growing businesses that need more power.";
    case "scale":
      return "For established teams with serious volume.";
    case "enterprise":
      return "Unlimited use, with contracts and invoicing made for you.";
    default:
      return "";
  }
}

// ─── CTA helpers ───────────────────────────────────────────────────────────

// Self-serve plans use the site's one main call to action (the early-access form
// until signups open; see PRIMARY_CTA). Enterprise talks to us directly.
export function planCtaLabel(slug: string): string {
  return slug === "enterprise" ? "Talk to sales" : PRIMARY_CTA.label;
}

export function planCtaHref(slug: string): string {
  if (slug === "enterprise") {
    return "mailto:contact@ecodrix.com?subject=Enterprise%20plan%20enquiry";
  }
  return PRIMARY_CTA.href;
}

// ─── Add-on grouping ───────────────────────────────────────────────────────

export const ADDON_SERVICE_LABEL: Record<string, string> = {
  cloud_storage: "Cloud Storage",
  ai: "AI",
  platform: "Platform",
  erix: "ERIX",
  laie: "LAIE",
  connect: "Connect",
};

export function formatAddonPrice(addon: PublicAddon): string {
  const unit =
    addon.priceUnit === "per_call"
      ? "per call"
      : addon.priceUnit === "per_gb"
        ? "per GB"
        : (addon.priceUnit ?? "month");

  // Pay-as-you-go entries store 0/month — display the unit price only.
  if (addon.priceMonthlyUsd === 0 && addon.priceUnit !== "month") {
    return `Pay-as-you-go · $0.05 / ${unit}`;
  }
  return `${formatMoney(addon.priceMonthlyUsd, "USD")} / ${unit}`;
}

export function groupAddonsByService(
  addons: PublicAddon[],
): Array<{ service: string; label: string; items: PublicAddon[] }> {
  const groups = new Map<string, PublicAddon[]>();
  for (const a of addons) {
    const key = a.service ?? "platform";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(a);
  }
  // Stable order: cloud_storage, ai, platform, then anything else.
  const order = ["cloud_storage", "ai", "platform"];
  const sortedKeys = [...order.filter((k) => groups.has(k)), ...[...groups.keys()].filter((k) => !order.includes(k))];
  return sortedKeys.map((key) => ({
    service: key,
    label: ADDON_SERVICE_LABEL[key] ?? key,
    items: groups.get(key) ?? [],
  }));
}

// ─── Fallback snapshot ─────────────────────────────────────────────────────

/**
 * Static snapshot used when the API is unreachable: names, tiers and features
 * only (mirrors ECOD/server/scripts/seed-plans.ts: the AI agent on every plan,
 * AI requests, team members, contacts, active automations, channels and the
 * branding/support extras; no SLA figures). It carries NO prices on purpose
 * (founder, 2 Nov 2026: no price is shown anywhere until official), so an
 * outage can't publish them; the page shows the "pricing is agreed with you"
 * state with it, exactly as for `pricesHidden`.
 */
export const FALLBACK_PLANS: PublicPlan[] = [
  {
    slug: "free",
    name: "Free",
    tier: 0,
    priceMonthlyUsd: null,
    priceYearlyUsd: null,
    currency: "INR",
    isDefault: true,
    features: {
      erix: {
        aiAgent: true,
        contacts: 100,
        agents: 1,
        pipelines: 1,
        esignsPerMonth: 3,
        broadcasts: false,
      },
      ai: { callsPerMonth: 50 },
      workflows: { activeWorkflows: 1 },
      connect: { channels: 1, whatsapp: true, email: false, instagram: false },
      cloud_storage: { storageGB: 1 },
      customBranding: false,
      whiteLabel: false,
      prioritySupport: false,
      sla: "none",
    },
  },
  {
    slug: "starter",
    name: "Starter",
    tier: 10,
    priceMonthlyUsd: null,
    priceYearlyUsd: null,
    currency: "INR",
    isDefault: false,
    features: {
      erix: {
        aiAgent: true,
        contacts: 2000,
        agents: 3,
        pipelines: 5,
        esignsPerMonth: 25,
        broadcasts: true,
      },
      ai: { callsPerMonth: 500 },
      workflows: { activeWorkflows: 5 },
      connect: { channels: 4, whatsapp: true, email: true, instagram: true },
      cloud_storage: { storageGB: 10 },
      customBranding: false,
      whiteLabel: false,
      prioritySupport: false,
      sla: "none",
    },
  },
  {
    slug: "growth",
    name: "Growth",
    tier: 20,
    priceMonthlyUsd: null,
    priceYearlyUsd: null,
    currency: "INR",
    isDefault: false,
    features: {
      erix: {
        aiAgent: true,
        contacts: 10000,
        agents: 10,
        pipelines: "unlimited",
        esignsPerMonth: 200,
        broadcasts: true,
      },
      ai: { callsPerMonth: 2500 },
      workflows: { activeWorkflows: 20 },
      connect: { channels: 4, whatsapp: true, email: true, instagram: true },
      cloud_storage: { storageGB: 50 },
      customBranding: true,
      whiteLabel: false,
      prioritySupport: false,
      sla: "none",
    },
  },
  {
    slug: "scale",
    name: "Scale",
    tier: 30,
    priceMonthlyUsd: null,
    priceYearlyUsd: null,
    currency: "INR",
    isDefault: false,
    features: {
      erix: {
        aiAgent: true,
        contacts: 25000,
        agents: 25,
        pipelines: "unlimited",
        esignsPerMonth: "unlimited",
        broadcasts: true,
      },
      ai: { callsPerMonth: 10000 },
      workflows: { activeWorkflows: 100 },
      connect: { channels: 8, whatsapp: true, email: true, instagram: true },
      cloud_storage: { storageGB: 200 },
      customBranding: true,
      whiteLabel: true,
      prioritySupport: true,
      sla: "none",
    },
  },
  {
    slug: "enterprise",
    name: "Enterprise",
    tier: 40,
    priceMonthlyUsd: null,
    priceYearlyUsd: null,
    currency: "INR",
    isDefault: false,
    features: {
      erix: {
        aiAgent: true,
        contacts: "unlimited",
        agents: "unlimited",
        pipelines: "unlimited",
        esignsPerMonth: "unlimited",
        broadcasts: true,
      },
      ai: { callsPerMonth: "unlimited" },
      workflows: { activeWorkflows: "unlimited" },
      connect: { channels: "unlimited", whatsapp: true, email: true, instagram: true },
      cloud_storage: { storageGB: "unlimited" },
      customBranding: true,
      whiteLabel: true,
      prioritySupport: true,
      sla: "none",
    },
  },
];

/** Empty fallback addon list — UI hides the section if empty. */
export const FALLBACK_ADDONS: PublicAddon[] = [];
