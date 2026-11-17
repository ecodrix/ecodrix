/** Run: npx tsx --test src/lib/pricing.test.ts (no test runner is installed in this repo). */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatInr, type PublicCatalogue, trialLine, yearlyDiscountPct } from "./pricing";

const cat = (trial?: PublicCatalogue["trial"]): PublicCatalogue =>
  ({ plans: [{ slug: "starter", name: "Starter" }], pricesHidden: false, trial }) as unknown as PublicCatalogue;

describe("formatInr", () => {
  it("groups Indian style and drops .00 on whole rupees", () => {
    assert.equal(formatInr(299900), "₹2,999");
    assert.equal(formatInr(12345600), "₹1,23,456");
  });
  it("keeps two digits when paise are not whole rupees", () => {
    assert.equal(formatInr(299950), "₹2,999.50");
  });
});

describe("yearlyDiscountPct", () => {
  it("is 0 on missing prices and rounds otherwise", () => {
    assert.equal(yearlyDiscountPct(null, 100), 0);
    assert.equal(yearlyDiscountPct(1000, 9600), 20);
  });
});

describe("trialLine", () => {
  it("says invited for invite-only, using the plan name", () => {
    assert.equal(
      trialLine(cat({ planSlug: "starter", days: 14, inviteOnly: true })),
      "Invited workspaces get 14 days of Starter free.",
    );
  });
  it("says every new workspace when open", () => {
    assert.equal(
      trialLine(cat({ planSlug: "starter", days: 7, inviteOnly: false })),
      "Every new workspace starts with 7 days of Starter free.",
    );
  });
  it("is null when the API sent no trial or the catalogue failed", () => {
    assert.equal(trialLine(cat()), null);
    assert.equal(trialLine(null), null);
  });
});
