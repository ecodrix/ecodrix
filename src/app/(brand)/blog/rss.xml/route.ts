import { blogs } from "@/lib/api";
import { buildRss } from "@/lib/resources/blog-seo";
import { SEO_CONSTANTS } from "@/lib/seo/jsonld";

// Same cache window as the blog list.
export const revalidate = 60;

/** RSS 2.0 feed at /blog/rss.xml: the 30 newest live posts, noindex ones left out. */
export async function GET() {
  const posts = (await blogs.fetchPublishedPosts()).filter((p) => !p.noindex).slice(0, 30);
  return new Response(buildRss(SEO_CONSTANTS.BASE_URL, posts), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
