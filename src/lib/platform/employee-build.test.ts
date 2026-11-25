/** Run: npx tsx --test src/lib/platform/employee-build.test.ts */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BUILD_CHIPS,
  BUILD_LANGUAGES,
  BUILD_MAX_LENGTH,
  BUILD_PLACEHOLDERS,
  interestFor,
} from "@/lib/platform/employee-build";

// Things the product cannot back today (truth.json banned claims).
const BANNED =
  /payment|pay link|\bEMI\b|\bloan|invoice|refund|instagram|e-?mail|website chat|messenger|telegram|broadcast|campaign|call my list|\bcold\b|remind/i;
const texts = [...BUILD_PLACEHOLDERS, ...BUILD_CHIPS.map((c) => c.sentence), ...BUILD_CHIPS.map((c) => c.label)];

describe("employee-build copy", () => {
  it("fits the 500 letter limit", () => {
    for (const t of texts) assert.ok(t.length <= BUILD_MAX_LENGTH, t);
  });
  it("makes no claim the product cannot back", () => {
    for (const t of texts) assert.doesNotMatch(t, BANNED, t);
  });
  it("offers six languages, English first", () => {
    assert.equal(BUILD_LANGUAGES.length, 6);
    assert.equal(BUILD_LANGUAGES[0].value, "en-IN");
  });
});

describe("interestFor", () => {
  it("returns the chip key for an untouched chip", () => {
    for (const c of BUILD_CHIPS) assert.equal(interestFor(c.sentence), `ai_employee:${c.key}`);
  });
  it("returns custom for an edited chip and for free text", () => {
    assert.equal(interestFor(`${BUILD_CHIPS[0].sentence} Also Sundays.`), "ai_employee:custom");
    assert.equal(interestFor("Answer my customers"), "ai_employee:custom");
    assert.equal(interestFor(""), "ai_employee:custom");
  });
  it("stays under 50 characters", () => {
    for (const t of [...texts, "x".repeat(500)]) assert.ok(interestFor(t).length < 50);
  });
});
