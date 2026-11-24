/** Blog helpers shared by the index, the post page and the cards. No React in here. */

export const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export const categoryLabel = (c: string) => c.charAt(0).toUpperCase() + c.slice(1);

/** Distinct categories in first-seen order. */
export const categoriesOf = (posts: BlogSummary[]) => [
  ...new Set(posts.map((p) => p.category).filter((c): c is string => !!c)),
];

/** The pinned post leads; otherwise the newest (the API sends newest first). */
export const pickFeatured = (posts: BlogSummary[]) => posts.find((p) => p.featured) ?? posts[0];

/** Up to `n` other posts: same category first, then the newest. */
export function relatedPosts(posts: BlogSummary[], current: BlogSummary, n = 3) {
  const others = posts.filter((p) => p.slug !== current.slug);
  const same = others.filter((p) => p.category && p.category === current.category);
  return [...same, ...others.filter((p) => !same.includes(p))].slice(0, n);
}

/** Share intents. No phone numbers: these are generic share links. */
export function shareLinks(title: string, url: string) {
  return {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    x: `https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  };
}
