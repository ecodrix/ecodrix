/** Run: npx tsx --test src/lib/resources/blog-seo.test.ts */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { absUrl, buildRss, isUpdatedLater, safeHref, splitForCta } from "./blog-seo";

describe("safeHref", () => {
  it("keeps https and site paths, drops the rest", () => {
    assert.equal(safeHref("/pricing"), "/pricing");
    assert.equal(safeHref("https://a.com/x"), "https://a.com/x");
    for (const bad of [
      "javascript:alert(1)",
      "http://a.com",
      "//evil.com",
      "/\\evil.com",
      "data:text/html,x",
      "",
      null,
      5,
    ])
      assert.equal(safeHref(bad), null, String(bad));
  });
});

const p = (n: number) => Array.from({ length: n }, (_, i) => `<p>p${i}</p>`).join("");

describe("splitForCta", () => {
  it("splits at a top-level boundary near 40%", () => {
    const html = p(10);
    const [a, b] = splitForCta(html) as [string, string];
    assert.equal(a + b, html);
    assert.equal(a, p(4));
  });
  it("never splits inside a list or table and not before the first H2 block + 1", () => {
    const html = `<p>a</p><h2>H</h2><ul><li>1</li><li>2</li></ul><table><tr><td>x</td></tr></table><p>b</p><p>c</p><p>d</p>`;
    const [a] = splitForCta(html) as [string, string];
    assert.ok(a.length > html.indexOf("</ul>"), "after the block following the H2");
    assert.ok(a.endsWith("</ul>") || a.endsWith("</table>") || a.endsWith("</p>"));
    assert.equal((a.match(/<ul>/g) || []).length, (a.match(/<\/ul>/g) || []).length);
  });
  it("skips a boundary right after a heading", () => {
    const html = `<p>1</p><p>2</p><h3>x</h3><p>3</p><p>4</p><p>5</p>`;
    const [a] = splitForCta(html) as [string, string];
    assert.ok(!a.endsWith("</h3>"));
  });
  it("returns null for a short article", () => assert.equal(splitForCta(p(3)), null));
});

describe("dates and urls", () => {
  it("flags only a later calendar day", () => {
    assert.equal(isUpdatedLater("2026-11-01T01:00:00Z", "2026-11-01T20:00:00Z"), false);
    assert.equal(isUpdatedLater("2026-11-01T01:00:00Z", "2026-11-02T00:00:00Z"), true);
    assert.equal(isUpdatedLater("x", "2026-11-02"), false);
  });
  it("absUrl resolves paths", () => assert.equal(absUrl("https://ecodrix.com", "/a.png"), "https://ecodrix.com/a.png"));
});

describe("buildRss", () => {
  it("escapes XML and drops control chars", () => {
    const xml = buildRss("https://ecodrix.com", [
      {
        title: `A <b>&"x"</b>\u0001`,
        slug: "a-b",
        metaDescription: "]]></description><x/>",
        searchDescription: null,
        publishDate: "2026-11-01T00:00:00Z",
        category: "tips",
      },
    ]);
    assert.ok(!xml.includes("<b>") && !xml.includes("<x/>") && !xml.includes("\u0001"));
    assert.ok(xml.includes("&lt;b&gt;&amp;&quot;x&quot;"));
    assert.ok(xml.includes("<pubDate>Sun, 01 Nov 2026 00:00:00 GMT</pubDate>"));
    assert.ok(xml.includes("<link>https://ecodrix.com/blog/a-b</link>"));
  });
});
