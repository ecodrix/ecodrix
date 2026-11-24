/**
 * Server-side API client for fetching data from the ECODrIx backend.
 * Used by Server Components and generateStaticParams/generateMetadata.
 */

import { ECODrIxAPI } from "@ecodrix/erix-api";

const API_BASE = process.env.API_URL || "https://api.ecodrix.com";

/**
 * GET a public endpoint's `data`, or null when it fails. ISR with 60s
 * revalidation unless told otherwise (Next dedupes the same URL within a
 * render); the 5s timeout keeps builds and dev from hanging when the API is
 * unreachable.
 */
async function getData<T>(path: string, revalidate = 60): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      next: { revalidate },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    return ((await res.json()) as { data?: T }).data ?? null;
  } catch {
    return null;
  }
}

/**
 * The blog is read-only here: posts are written in admin and the server decides
 * what's live (published and past its date, so scheduled posts appear on their own).
 */
export const blogs = {
  /** Live posts, newest first, without bodies. */
  async fetchPublishedPosts(): Promise<BlogSummary[]> {
    return (await getData<BlogSummary[]>("/v1/api/platform/public/blogs")) ?? [];
  },

  /** One live post with its body; null when it's not live or doesn't exist. */
  async fetchPostBySlug(slug: string): Promise<BlogPost | null> {
    const post = await getData<BlogPost>(`/v1/api/platform/public/blogs/${encodeURIComponent(slug)}`);
    if (post) return post;
    // ponytail: an API without the detail route (before the 28 Oct server deploy) lists full
    // posts; a newer API lists no bodies, so this finds nothing there — drop once it's deployed.
    const listed = (await this.fetchPublishedPosts()).find((p) => p.slug === slug);
    return listed && "body" in listed ? (listed as BlogPost) : null;
  },
};

/** What ERIX offers, as staff set it for the website (admin › Catalog). Null when the API fails. */
export async function fetchCatalog(): Promise<import("@/lib/platform/catalog").CatalogItem[] | null> {
  return getData("/v1/api/platform/public/catalog", 300);
}

/**
 * The pricing catalogue through the SDK (`plans.listPublic()`, anonymous): plans
 * staff Show on the website, prices in paise, GST rate and trial from settings.
 * Null when the API fails, so the page never shows a stale copy.
 */
export async function fetchPublicCatalogue(): Promise<import("@/lib/pricing").PublicCatalogue | null> {
  try {
    // The route is anonymous; proxy mode is the SDK's no-key mode, pointed at the API itself.
    const ecod = new ECODrIxAPI({ proxy: { url: API_BASE }, timeout: 5000 });
    const data = await ecod.platform.billing.plans.listPublic<import("@/lib/pricing").PublicCatalogue>();
    return Array.isArray(data?.plans) ? data : null;
  } catch {
    return null;
  }
}
