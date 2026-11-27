/** One JSON-LD block, server-rendered into the page's HTML. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: controlled JSON-LD data
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
