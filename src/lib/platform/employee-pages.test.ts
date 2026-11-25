import assert from "node:assert/strict";
import { test } from "node:test";
import { EMPLOYEE_PAGES, HANDOFF_COMMON, HUB } from "@/lib/platform/employee-pages";

// Words the product cannot back today (header of employee-pages.ts, spec claims table).
const BANNED = [
  /payment link/i,
  /\bEMI\b/,
  /\bloans?\b/i,
  /refund processed/i,
  /reminds your customers/i,
  /calls your list/i,
  /broadcast/i,
  /any language/i,
  /instantly/i,
  /in seconds/i,
];

const sentences = (p: (typeof EMPLOYEE_PAGES)[number]): string[] => [
  p.title,
  p.description,
  p.hero.title,
  p.hero.lead,
  p.blurb,
  ...p.heroFacts.map((f) => f.label),
  p.example.title,
  p.example.bar,
  p.example.customer,
  p.example.lead,
  ...p.example.messages.flatMap((m) => [m.text, m.action ?? "", m.source ?? "", m.label ?? ""]),
  ...p.example.notes.flatMap((n) => [n.title, n.text]),
  p.pathLead,
  ...p.path.flatMap((x) => [x.title, x.text]),
  ...p.setup.flatMap((x) => [x.title, x.text]),
  ...p.handoff.flatMap((x) => [x.title, x.text]),
  ...[...p.jobs, ...p.doesNot, ...p.controls, ...p.rules].flatMap((x) => [
    x.title,
    x.text,
    (x as { example?: string }).example ?? "",
  ]),
  ...p.needs.map((x) => x.text),
  p.needsLead ?? "",
  p.handoffNote,
  ...p.faqs.flatMap((f) => [f.q, f.a]),
];

for (const p of EMPLOYEE_PAGES) {
  test(`${p.slug}: every section is filled`, () => {
    assert.ok(p.heroFacts.length === 3);
    assert.ok(p.example.messages.length >= 6 && p.example.messages.length <= 9);
    assert.ok(p.example.notes.length >= 3);
    for (const n of p.example.notes) assert.ok(n.at >= 1 && n.at <= p.example.messages.length);
    assert.ok(p.path.length >= 4 && p.path.length <= 6);
    for (const k of ["doesNot", "needs", "controls", "rules", "handoff"] as const) {
      assert.ok(p[k].length >= 4, `${k} too short`);
    }
    assert.ok(p.jobs.length >= 3, "jobs too short");
    assert.equal(p.setup.length, 3);
    for (const h of p.heroTurns) assert.ok(h >= 0 && h <= p.example.messages.length);
    assert.ok(p.heroTurns[0] < p.heroTurns[1]);
    assert.ok(p.handoffNote.length > 40);
    assert.ok(p.faqs.length >= 6 && p.faqs.length <= 8);
  });

  test(`${p.slug}: no duplicated FAQ`, () => {
    const qs = p.faqs.map((f) => f.q.toLowerCase());
    const as = p.faqs.map((f) => f.a.toLowerCase());
    assert.equal(new Set(qs).size, qs.length);
    assert.equal(new Set(as).size, as.length);
    const titles = new Set([...p.jobs, ...p.doesNot, ...p.controls, ...p.rules].map((x) => x.title.toLowerCase()));
    for (const q of qs) assert.ok(!titles.has(q), `FAQ repeats a title: ${q}`);
  });

  test(`${p.slug}: no word the product cannot back`, () => {
    for (const t of sentences(p)) for (const re of BANNED) assert.ok(!re.test(t), `${re} in: ${t}`);
    for (const t of sentences(p)) assert.ok(!t.includes("!"), `exclamation mark in: ${t}`);
  });

  test(`${p.slug}: demo numbers and SEO lengths`, () => {
    for (const t of sentences(p)) {
      // Any run of 10 or more digits, with or without +91, must be a 55501 00xxx demo number.
      for (const m of t.match(/\+?\d[\d ]{8,}\d/g) ?? [])
        assert.match(m.trim(), /^\+91 55501 00\d{3}$/, `real-looking number: ${m}`);
    }
    assert.ok(p.title.length <= 60, `title ${p.title.length}`);
    assert.ok(p.description.length <= 155, `description ${p.description.length}`);
  });
}

test("hub: copy is true whatever the catalog says", () => {
  assert.ok(HUB.description.length <= 155, `hub description ${HUB.description.length}`);
  assert.ok(HUB.title.length <= 60);
  const texts = [HUB.title, HUB.description, HUB.hero.title, HUB.hero.lead, ...HUB.faqs.flatMap((f) => [f.q, f.a])];
  // The hub FAQ may name what it does not do (payment links), so only the promises are word-checked.
  for (const t of texts.slice(0, 4)) for (const re of BANNED) assert.ok(!re.test(t), `${re} in: ${t}`);
  for (const t of texts) assert.ok(!t.includes("!"), `exclamation mark in: ${t}`);
  // Which desks are open is the catalog's to say, never hard-coded in static copy.
  for (const t of [HUB.description, HUB.faqs.find((f) => /channels/i.test(f.q))?.a ?? ""])
    assert.ok(!/\b(today|coming soon|work today|live)\b/i.test(t), `hard-coded status: ${t}`);
  for (const h of HANDOFF_COMMON) for (const re of BANNED) assert.ok(!re.test(h.text) && !re.test(h.title));
});
