/** Pure helpers for blog SEO: link sanitizer, mid-post CTA split, dates, RSS. No React. */

/** Only https URLs or site paths survive; anything else (javascript:, http:, //host) is dropped. */
export function safeHref(href: unknown): string | null {
  if (typeof href !== "string") return null;
  const h = href.trim();
  if (/^\/(?![/\\])/.test(h) && !/[\u0000-\u001f]/.test(h)) return h;
  try {
    const u = new URL(h);
    return u.protocol === "https:" ? u.href : null;
  } catch {
    return null;
  }
}

const VOID = new Set(["img", "br", "hr", "input", "source", "wbr", "col", "meta", "link", "embed"]);

/** End offsets of each top-level block in an HTML string, with its tag name. */
function topLevelBlocks(html: string): { end: number; tag: string }[] {
  const out: { end: number; tag: string }[] = [];
  const re = /<!--[\s\S]*?-->|<(\/?)([a-z][a-z0-9]*)\b[^>]*?(\/?)>/gi;
  let depth = 0;
  let tag = "";
  for (let m = re.exec(html); m; m = re.exec(html)) {
    if (m[0].startsWith("<!--")) continue;
    const name = m[2].toLowerCase();
    if (m[1]) {
      if (depth > 0 && --depth === 0) out.push({ end: m.index + m[0].length, tag });
    } else if (VOID.has(name) || m[3]) {
      if (depth === 0) out.push({ end: m.index + m[0].length, tag: name });
    } else {
      if (depth === 0) tag = name;
      depth++;
    }
  }
  return out;
}

/**
 * Splits the article at a block boundary after ~40% of its top-level blocks. Never inside an
 * element, never right after a heading, and at least one block after the first H2.
 * Null when the article is too short for a mid-post block.
 */
export function splitForCta(html: string, at = 0.4): [string, string] | null {
  const blocks = topLevelBlocks(html);
  const n = blocks.length;
  if (n < 4) return null;
  const firstH2 = blocks.findIndex((b) => b.tag === "h2");
  for (let k = Math.max(Math.round(n * at), firstH2 + 2); k < n; k++) {
    if (/^h[1-6]$/.test(blocks[k - 1].tag)) continue;
    return [html.slice(0, blocks[k - 1].end), html.slice(blocks[k - 1].end)];
  }
  return null;
}

const day = (d: string) => new Date(d).toISOString().slice(0, 10);

/** True when `modified` falls on a later calendar day than `published` (both valid dates). */
export function isUpdatedLater(published?: string | null, modified?: string | null): boolean {
  if (!published || !modified) return false;
  if (Number.isNaN(Date.parse(published)) || Number.isNaN(Date.parse(modified))) return false;
  return day(modified) > day(published);
}

/** ISO 8601 with timezone (UTC "Z"), or undefined for a missing or invalid date. */
export function isoDate(d?: string | null): string | undefined {
  if (!d || Number.isNaN(Date.parse(d))) return undefined;
  return new Date(d).toISOString();
}

/** Absolute URL for a site path or an absolute URL; undefined for anything else. */
export function absUrl(base: string, u?: string | null): string | undefined {
  if (!u) return undefined;
  try {
    return new URL(u, base).href;
  } catch {
    return undefined;
  }
}

/** True for ecodrix.com and www.ecodrix.com. */
export const isOwnSite = (href: string) => {
  try {
    return /^(www\.)?ecodrix\.com$/.test(new URL(href, "https://ecodrix.com").host);
  } catch {
    return false;
  }
};

export const escapeXml = (s: string) =>
  s.replace(/[<>&"']/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[c] as string);

// Drops characters XML 1.0 forbids so one bad post cannot make the feed unparseable.
const xmlText = (s: string) => escapeXml(s.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f￾￿]/g, ""));

/** RSS 2.0 feed of the given posts (caller removes noindex ones). */
export function buildRss(
  base: string,
  posts: Pick<BlogSummary, "title" | "slug" | "metaDescription" | "searchDescription" | "publishDate" | "category">[],
  now = new Date(),
): string {
  const items = posts
    .filter((p) => p.slug && p.title)
    .map((p) => {
      const link = `${base}/blog/${encodeURIComponent(p.slug as string)}`;
      const desc = p.searchDescription || p.metaDescription;
      return [
        "<item>",
        `<title>${xmlText(p.title as string)}</title>`,
        `<link>${xmlText(link)}</link>`,
        `<guid isPermaLink="true">${xmlText(link)}</guid>`,
        p.publishDate && !Number.isNaN(Date.parse(p.publishDate))
          ? `<pubDate>${new Date(p.publishDate).toUTCString()}</pubDate>`
          : "",
        desc ? `<description>${xmlText(desc)}</description>` : "",
        p.category ? `<category>${xmlText(p.category)}</category>` : "",
        "</item>",
      ].join("");
    })
    .join("");
  return (
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>` +
    `<title>ECODrIx blog</title><link>${base}/blog</link>` +
    `<description>Practical notes on WhatsApp, CRM, GST invoicing and automation for Indian SMBs.</description>` +
    `<language>en-IN</language><lastBuildDate>${now.toUTCString()}</lastBuildDate>` +
    `<atom:link href="${base}/blog/rss.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`
  );
}
