import type { MetadataRoute } from "next";
import { blogs } from "@/lib/api";
import { COMPARISONS } from "@/lib/comparisons";
import { SEO_CONSTANTS } from "@/lib/jsonld";
import { LEGAL_DOCS, legalHref } from "@/lib/legal/documents";
import { PLATFORM_MODULES } from "@/lib/platform-modules";
import { getProductPages } from "@/lib/product-pages";

/**
 * Generates /sitemap.xml via Next.js App Router convention.
 *
 * Single source of truth: static routes are listed below, and platform
 * module pages are auto-derived from `lib/platform-modules.ts` so adding
 * a new backend module instantly registers its SEO landing page.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { BASE_URL } = SEO_CONSTANTS;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/founder`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/platform`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/compare`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/guides`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/legal`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    { url: `${BASE_URL}/docs`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/changelog`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/whats-new`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE_URL}/status`, lastModified: now, changeFrequency: "daily", priority: 0.4 },
  ];

  // All legal/policy documents (terms, privacy, cookie, AUP, DPA, etc.)
  const legalRoutes: MetadataRoute.Sitemap = LEGAL_DOCS.map((d) => ({
    url: `${BASE_URL}${legalHref(d.slug)}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.4,
  }));

  const moduleRoutes: MetadataRoute.Sitemap = PLATFORM_MODULES.map((m) => ({
    url: `${BASE_URL}/platform/${m.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Product sub-pages (capabilities, use-cases, guides) — auto-derived.
  const subPageRoutes: MetadataRoute.Sitemap = PLATFORM_MODULES.flatMap((m) =>
    getProductPages(m.slug).map((p) => ({
      url: `${BASE_URL}/platform/${m.slug}/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  );

  const compareRoutes: MetadataRoute.Sitemap = COMPARISONS.map((c) => ({
    url: `${BASE_URL}/compare/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Blog posts — fetched dynamically from the server's public API.
  const posts = await blogs.fetchPublishedPosts();
  const blogRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  return [...staticRoutes, ...moduleRoutes, ...subPageRoutes, ...compareRoutes, ...blogRoutes, ...legalRoutes];
}
