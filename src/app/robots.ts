import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { DOCS_URL } from "@/lib/site";

/**
 * Generates /robots.txt via Next.js App Router convention.
 *
 * - Allow all standard crawlers across the marketing surface.
 * - Block /api only. Never block /_next/: Google must fetch the JS, CSS and
 *   optimised images to render a page (blocking it showed up in Search Console
 *   as "Blocked by robots.txt" and pages left unindexed, Oct 2026).
 * - Explicitly invite known AI crawlers and answer engines so they can
 *   index llms.txt / llms-full.txt / ai.txt for AEO + GEO.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  // doc.ecodrix.com is its own site: everything public, its own sitemap.
  if ((await headers()).get("host")?.startsWith("doc.")) {
    return { rules: [{ userAgent: "*", allow: "/" }], sitemap: `${DOCS_URL}/sitemap.xml`, host: DOCS_URL };
  }
  const aiAgents = [
    "GPTBot",
    "ClaudeBot",
    "anthropic-ai",
    "Claude-Web",
    "PerplexityBot",
    "Google-Extended",
    "Applebot-Extended",
    "CCBot",
    "Bytespider",
    "FacebookBot",
    "Amazonbot",
    "DuckAssistBot",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      // Generous explicit allow for known AI crawlers — they often respect
      // dedicated rules over the wildcard fallback.
      ...aiAgents.map((agent) => ({
        userAgent: agent,
        allow: ["/", "/llms.txt", "/llms-full.txt", "/llms-small.txt", "/ai.txt"],
        disallow: ["/api/"],
      })),
    ],
    sitemap: "https://ecodrix.com/sitemap.xml",
    host: "https://ecodrix.com",
  };
}
