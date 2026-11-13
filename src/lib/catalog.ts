/**
 * The website's view of the catalog (admin › Catalog): staff mark each item
 * Listed, Coming soon or Hidden, and the lists below follow. Anything missing
 * from the answer is Hidden. If the API fails or answers nothing, the static
 * list stays exactly as written, so the site never breaks.
 */

import { fetchCatalog } from "@/lib/api";
import type { ModuleStatus } from "@/lib/site";
import { PLATFORM_NAV } from "@/lib/site";

export interface CatalogItem {
  id: string;
  kind: "product" | "app" | "feature";
  label: string;
  description: string;
  /** Staff's website listing (admin › Versions): the marketing switch, set item by item. */
  status: "listed" | "soon";
  /** Released (its version is live). Older APIs omit it: then `status` alone decides. */
  live?: boolean;
  version?: string | null;
  /** ISO time its version went live; drives the "New" badge. Older APIs omit it. */
  liveSince?: string | null;
  /** Admin-managed website copy (like blogs); null or missing: the static copy stays. */
  marketing?: CatalogMarketing | null;
}

export interface CatalogMarketing {
  summary?: string;
  /** Sanitized HTML (the server cleans it; the site renders it through the blog's own guard too). */
  body?: string;
  image?: { url: string; alt: string } | null;
}

/** An available item wears a "New" badge this many days after it went live, then none. */
export const NEW_BADGE_DAYS = 14;

export function isNewBadge(liveSince: string | null | undefined, now = Date.now()): boolean {
  const t = liveSince ? Date.parse(liveSince) : Number.NaN;
  return Number.isFinite(t) && now >= t && now - t < NEW_BADGE_DAYS * 86_400_000;
}

/** What a page needs to know about one item; `available` follows decision 1.33. */
function view(hit: CatalogItem, now: number) {
  const available = hit.status === "listed" && hit.live !== false;
  return {
    status: (available ? "live" : "soon") as ModuleStatus,
    isNew: available && isNewBadge(hit.liveSince, now),
    marketing: hit.marketing ?? null,
  };
}

/** Platform menu key → catalog item id (Connect's card is the Inbox item). */
const ITEM_OF: Record<string, string> = {
  crm: "crm",
  connect: "inbox",
  agents: "agents",
  flow: "flow",
  storage: "storage",
};

/**
 * Apply the catalog to a list of modules: Hidden ones drop out; an item shows as
 * available only when staff Listed it AND its version is live. Everything else
 * shows Coming soon, so going live never announces a module by itself: staff
 * introduce each one on the website when ready (founder, 13 Nov 2026).
 * `items` null or empty (failed read) returns the list untouched.
 */
export function applyCatalog<T extends { key: string; status: ModuleStatus; summary: string }>(
  nav: readonly T[],
  items: readonly CatalogItem[] | null,
  now = Date.now(),
): (Omit<T, "status" | "summary"> & { status: ModuleStatus; summary: string; isNew?: boolean })[] {
  if (!items?.length) return [...nav];
  return nav.flatMap((m) => {
    const hit = items.find((i) => i.id === ITEM_OF[m.key]);
    if (!ITEM_OF[m.key]) return [m];
    if (!hit) return [];
    const v = view(hit, now);
    return [{ ...m, status: v.status, isNew: v.isNew, summary: v.marketing?.summary?.trim() || m.summary }];
  });
}

/** One module page's catalog state (`/platform/erix-crm` → item "crm"); the static status when the API has nothing. */
export async function getModuleView(slug: string, staticStatus: ModuleStatus, now = Date.now()) {
  const items = await fetchCatalog();
  const hit = items?.length ? items.find((i) => i.id === ITEM_OF[slug.replace(/^erix-/, "")]) : undefined;
  if (!hit) return { status: staticStatus, isNew: false, marketing: null };
  return view(hit, now);
}

/** The Platform menu list for server components, from the catalog (ISR 300 s) with the static fallback. */
export async function getPlatformNav() {
  return applyCatalog(PLATFORM_NAV, await fetchCatalog());
}
