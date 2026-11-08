import type { Metadata } from "next";
import { HELP_ORIGIN } from "@/lib/help";

/** Help pages are canonical on doc.ecodrix.com, not on the brand site's base URL. */
export function helpMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = `${HELP_ORIGIN}${path === "/" ? "" : path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ERIX Help`,
      description,
      url,
      type: "article",
      images: ["https://ecodrix.com/opengraph-image"],
    },
  };
}
