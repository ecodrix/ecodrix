/**
 * BlogContent: renders a post body the way ERIX's editor (admin) saved it. The body goes
 * through `@ecodrix/erix-editor/render` first, the same package as the editor: it detects the
 * format (editor JSON, HTML, Markdown or text), converts it and removes active content, on the
 * server with no editor code sent to the browser. The site then applies its own type styles.
 */
import { renderContent } from "@ecodrix/erix-editor/render";

/** Tag-to-class mapping — every element gets controlled Tailwind styles */
const TAG_STYLES: Record<string, string> = {
  h1: "text-[28px] font-display font-bold text-foreground mt-12 mb-4 tracking-[-0.02em] leading-tight",
  h2: "text-[26px] font-display font-bold text-foreground mt-12 mb-3 tracking-[-0.02em] leading-tight",
  h3: "text-[20px] font-sans font-semibold text-foreground mt-8 mb-2",
  h4: "text-[17px] font-sans font-semibold text-foreground mt-6 mb-2",
  p: "text-[17px] leading-[1.75] text-foreground/85 mb-5",
  a: "text-accent border-b border-accent/30 hover:border-accent transition-colors",
  strong: "font-semibold text-foreground",
  em: "italic",
  ul: "list-disc pl-5 mb-5 space-y-2 text-[17px] text-foreground/85 marker:text-accent",
  ol: "list-decimal pl-5 mb-5 space-y-2 text-[17px] text-foreground/85 marker:text-accent",
  li: "leading-[1.7]",
  blockquote: "rounded-[12px] bg-background px-6 py-4 my-8 text-[19px] text-foreground",
  pre: "rounded-[12px] bg-background p-5 overflow-x-auto my-6 text-[13px] leading-relaxed",
  code: "text-[0.875em] rounded-[4px] bg-background px-1.5 py-0.5",
  img: "w-full h-auto my-8 rounded-[16px]",
  hr: "border-none h-px bg-border my-10",
  table: "w-full border-collapse my-6 text-[15px]",
  th: "text-left bg-background text-foreground font-semibold p-3 border-b border-border",
  td: "p-3 border-b border-border-soft text-muted-foreground",
  figure: "my-8",
  figcaption: "text-xs text-muted-foreground mt-2 text-center",
};

/**
 * Processes raw HTML string:
 * 1. Strips all inline `style="..."` attributes
 * 2. Strips existing `class="..."` attributes (editor bloat)
 * 3. Injects controlled Tailwind classes per tag
 */
// Inline styles the editor sets on purpose (alignment, indent, text colour, highlight, callout
// fill) stay; anything else (fonts, sizes, positioning) is the site's job. Values can't load URLs.
const KEEP_STYLE = new Set(["text-align", "margin-left", "color", "background", "background-color"]);
const keepStyle = (css: string) =>
  css
    .split(";")
    .map((d) => d.split(":").map((x) => x.trim()))
    .filter(
      ([k, v]) =>
        k && v && KEEP_STYLE.has(k.toLowerCase()) && /^[#(),.%\w\s-]+$/.test(v) && !/url\(|expression/i.test(v),
    )
    .map(([k, v]) => `${k.toLowerCase()}:${v}`)
    .join(";");

// The editor stores a video as a placeholder; show YouTube / Vimeo as a player.
function videoEmbeds(html: string): string {
  return html.replace(/<div data-erix-type="video" data-src="([^"]*)"><\/div>/g, (_m, src: string) => {
    const yt = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/);
    const vimeo = src.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    const player = yt
      ? `https://www.youtube.com/embed/${yt[1]}`
      : vimeo
        ? `https://player.vimeo.com/video/${vimeo[1]}`
        : null;
    return player ? `<iframe src="${player}" title="Video" loading="lazy" allowfullscreen></iframe>` : "";
  });
}

function processHtml(raw: string): string {
  let processed = videoEmbeds(renderContent(raw));

  // Per tag: keep the editor's own erix-* classes and its safe inline styles, add the site's
  // type styles. Everything else from older editors or pasted HTML is dropped.
  processed = processed.replace(
    /<([a-z][a-z0-9]*)(\s[^<>]*?)?(\/?)>/gi,
    (_m, tag: string, attrs: string | undefined, slash: string) => {
      attrs ??= "";
      const name = tag.toLowerCase();
      const own = (attrs.match(/\sclass="([^"]*)"/i)?.[1] ?? "")
        .split(/\s+/)
        .filter((c: string) => /^erix-|^done$/.test(c));
      const style = keepStyle(attrs.match(/\sstyle="([^"]*)"/i)?.[1] ?? "");
      const rest = attrs.replace(/\s(class|style)="[^"]*"/gi, "");
      const classes = [TAG_STYLES[name], ...own].filter(Boolean).join(" ");
      return `<${tag}${rest}${classes ? ` class="${classes}"` : ""}${style ? ` style="${style}"` : ""}${slash ? " /" : ""}>`;
    },
  );

  // Remove empty paragraphs (common CMS artifact)
  processed = processed.replace(/<p[^>]*>\s*(<br\s*\/?>)?\s*<\/p>/gi, "");

  return fixHeadingLevels(processed);
}

/**
 * Keeps the outline valid for screen readers: content headings start at h2
 * (the page carries the h1) and never skip a level (h2 → h4 becomes h2 → h3).
 * Runs after the classes are added, so each heading keeps its look.
 */
function fixHeadingLevels(html: string): string {
  let last = 1;
  const open: number[] = [];
  return html.replace(/<(\/?)h([1-6])(\s[^>]*)?>/gi, (_m, close: string, n: string, rest = "") => {
    if (close) return `</h${open.pop() ?? n}>`;
    const level = Math.max(2, Math.min(Number(n), last + 1));
    open.push(level);
    last = level;
    return `<h${level}${rest}>`;
  });
}

const plain = (html: string) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&rsquo;/g, "’")
    .replace(/&quot;/g, '"')
    .trim();

/**
 * The article ready to render, plus its outline: every h2 gets a stable id (from its text) so
 * the "On this page" list can link to it. Ids are unique within the article.
 */
export function prepareArticle(raw: string): { html: string; outline: { id: string; text: string }[] } {
  const outline: { id: string; text: string }[] = [];
  const used = new Set<string>();
  const html = processHtml(raw).replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/gi, (_m, attrs = "", inner: string) => {
    const text = plain(inner);
    const base =
      text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 60) || "section";
    let id = base;
    for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
    used.add(id);
    outline.push({ id, text });
    return `<h2${attrs.replace(/\sid="[^"]*"/i, "")} id="${id}">${inner}</h2>`;
  });
  return { html, outline };
}

/** Renders HTML from `prepareArticle`. Headings clear the sticky header when jumped to. */
export function BlogContent({ html }: { html: string }) {
  return (
    <div
      className={[
        "max-w-none text-[1.0625rem]/[1.8] text-muted-foreground *:first:mt-0 *:last:mb-0 [&_h2]:scroll-mt-24",
        // Editor blocks: callout, task list, table, toggle, columns, video.
        "[&_.erix-callout]:my-6 [&_.erix-callout]:flex [&_.erix-callout]:gap-3 [&_.erix-callout]:rounded-[12px] [&_.erix-callout]:bg-background [&_.erix-callout]:p-4 [&_.erix-callout_p]:mb-0",
        "[&_.erix-task-list]:list-none [&_.erix-task-list]:pl-0 [&_.erix-task-item]:flex [&_.erix-task-item]:gap-2 [&_.erix-task-item.done]:text-subtle [&_.erix-task-item.done]:line-through",
        "[&_.erix-table-wrapper]:overflow-x-auto",
        "[&_.erix-toggle]:my-4 [&_.erix-toggle]:rounded-[12px] [&_.erix-toggle]:bg-background [&_.erix-toggle]:p-4 [&_.erix-toggle_summary]:cursor-pointer [&_.erix-toggle_summary]:font-semibold [&_.erix-toggle_summary]:text-foreground",
        "[&_.erix-columns]:my-6 [&_.erix-columns]:grid [&_.erix-columns]:gap-6 sm:[&_.erix-columns]:grid-cols-2",
        "[&_iframe]:my-8 [&_iframe]:aspect-video [&_iframe]:w-full [&_iframe]:rounded-[16px]",
      ].join(" ")}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
