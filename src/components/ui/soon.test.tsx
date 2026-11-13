/** Run: npx tsx --test src/components/ui/soon.test.tsx */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { PrimaryCta, WhatsAppCta } from "@/components/marketing/kit";
import { StatusBadge } from "./status-badge";

describe("disabled CTA for a not-available item", () => {
  it("renders aria-disabled, no href, a Coming soon hint", () => {
    const html = renderToStaticMarkup(<PrimaryCta disabled />);
    assert.match(html, /aria-disabled="true"/);
    assert.doesNotMatch(html, /href=/);
    assert.match(html, /Coming soon/);
  });
  it("stays a normal link when available", () => {
    const html = renderToStaticMarkup(<PrimaryCta />);
    assert.match(html, /href=/);
    assert.doesNotMatch(html, /aria-disabled/);
  });
});

describe("StatusBadge", () => {
  it("shows New, Coming soon, or nothing", () => {
    assert.match(renderToStaticMarkup(<StatusBadge status="live" isNew />), /New/);
    assert.match(renderToStaticMarkup(<StatusBadge status="soon" />), /Coming soon/);
    assert.equal(renderToStaticMarkup(<StatusBadge status="live" />), "");
  });
});

// Mirrors ModulePage/ClosingCta on a not-available module (they import the editor, which tsx cannot load).
describe("Coming-soon module page CTAs", () => {
  const html = renderToStaticMarkup(
    <>
      <PrimaryCta lg />
      <WhatsAppCta lg disabled />
    </>,
  );
  it("keeps Request early access enabled, a link to the form", () => {
    assert.match(html, /<a [^>]*href="\/#contact"[^>]*>Request early access/);
  });
  it("keeps the other CTA disabled", () => {
    assert.match(html, /aria-disabled="true"[^>]*>.*Chat on WhatsApp/);
    assert.equal((html.match(/aria-disabled/g) ?? []).length, 1);
  });
});

describe("no visible waitlist wording", () => {
  it("labels, privacy policy and comparison copy say early access", async () => {
    const { PRIMARY_CTA } = await import("@/lib/site");
    const { privacyDoc } = await import("@/lib/legal/docs/privacy");
    const { COMPARISONS } = await import("@/lib/comparisons");
    assert.equal(PRIMARY_CTA.label, "Request early access");
    assert.doesNotMatch(JSON.stringify(privacyDoc) + JSON.stringify(COMPARISONS), /wait ?list/i);
  });
});
