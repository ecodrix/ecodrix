import { BlogContent, prepareArticle } from "@/components/blog/BlogContent";
import type { CatalogMarketing } from "@/lib/catalog";

/**
 * An item's admin-managed page copy (admin › Catalog), shown like a blog post:
 * the body goes through the blog's own guard (`prepareArticle` sanitizes again
 * and drops inline styles, scripts and unknown attributes), the image only
 * when it is https.
 */
export function MarketingBody({ marketing }: { marketing: CatalogMarketing }) {
  const image = marketing.image && /^https:\/\//i.test(marketing.image.url) ? marketing.image : null;
  const html = marketing.body ? prepareArticle(marketing.body).html : "";
  return (
    <div className="max-w-[68ch]">
      {image && (
        // biome-ignore lint/performance/noImgElement: admin-chosen host, not in next/image remotePatterns
        <img src={image.url} alt={image.alt} loading="lazy" className="mb-8 h-auto w-full rounded-[16px]" />
      )}
      {html && <BlogContent html={html} />}
    </div>
  );
}
