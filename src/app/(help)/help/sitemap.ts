import type { MetadataRoute } from "next";
import { HELP_ARTICLES, HELP_COLLECTIONS, HELP_ORIGIN } from "@/lib/help";

/** doc.ecodrix.com/help/sitemap.xml: the help center's pages on their own host. */
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
  ];
}
