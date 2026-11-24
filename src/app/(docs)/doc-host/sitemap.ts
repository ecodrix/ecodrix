import type { MetadataRoute } from "next";
import { DOC_SECTIONS } from "@/lib/docs/docs";
import { HELP_ARTICLES, HELP_COLLECTIONS, HELP_ORIGIN } from "@/lib/help";

/** doc.ecodrix.com/sitemap.xml: Help, the API reference and the changelog (rewritten from the host's root). */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: HELP_ORIGIN, changeFrequency: "weekly", priority: 1 },
    ...HELP_COLLECTIONS.map((c) => ({
      url: `${HELP_ORIGIN}/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...HELP_ARTICLES.map((a) => ({
      url: `${HELP_ORIGIN}/${a.collection}/${a.slug}`,
      lastModified: new Date(a.updated),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { url: `${HELP_ORIGIN}/api`, changeFrequency: "weekly", priority: 0.8 },
    ...DOC_SECTIONS.map((s) => ({
      url: `${HELP_ORIGIN}/api/${s.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    { url: `${HELP_ORIGIN}/changelog`, changeFrequency: "monthly", priority: 0.6 },
  ];
}
