/** Run: npx tsx --test src/lib/demo-numbers.test.ts (no test runner is installed in this repo). */
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { it } from "node:test";

// Indian mobile numbers start with 6 to 9, so any such number in a demo could be a real person's.
const REAL_LOOKING = /\+91[ -]?[6-9]\d{4}[ -]?\d{5}/;

it("demos never show a phone number that could belong to a real person", () => {
  const hits = (readdirSync("src", { recursive: true }) as string[])
    .filter((f) => /\.(tsx?|css|mdx?|json)$/.test(f) && !f.endsWith(".test.ts"))
    .filter((f) => REAL_LOOKING.test(readFileSync(join("src", f), "utf8")));
  assert.deepEqual(hits, []);
});
