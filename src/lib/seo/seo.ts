import type { Metadata } from "next";

/**
 * Page metadata with the page's own canonical and Open Graph URL. A page's
 * `openGraph` replaces the root one entirely, so the image is named here.
 * Never put a canonical or og:url in a layout: every page inherits it.
 * `title` gets " | ECODrIx" from the root template; keep it ≤ 50 characters.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article" | "profile";
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | ECODrIx`, description, url: path, type, images: ["/opengraph-image"] },
  };
}
