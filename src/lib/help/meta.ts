import type { Metadata } from "next";
import { HELP_ORIGIN } from "@/lib/help";

/** Every doc.ecodrix.com page (help, API, changelog) is canonical on doc.ecodrix.com, not on the brand site's base URL. */
export function helpMetadata({
  title,
  description,
  path,
  site = "ERIX Help",
}: {
  title: string;
  description: string;
  path: string;
  /** Suffix of the social title: "ERIX Help", "ERIX API docs" ... */
  site?: string;
}): Metadata {
  const url = `${HELP_ORIGIN}${path === "/" ? "" : path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${site}`,
      description,
      url,
      type: "article",
      images: ["https://ecodrix.com/opengraph-image"],
    },
  };
}
