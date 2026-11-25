import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { VOICE_NAMES, voiceName } from "./voice-names";

test("the public name map is the private id file, capitalised", () => {
  const ids = JSON.parse(readFileSync("scripts/voice-ids.json", "utf8")).ids as Record<string, string>;
  const want = Object.fromEntries(Object.entries(ids).map(([k, v]) => [k, v[0].toUpperCase() + v.slice(1)]));
  assert.equal(Object.keys(VOICE_NAMES).length, 37);
  assert.deepEqual(VOICE_NAMES, want);
  assert.equal(voiceName("Voice 18"), "Priya");
});
