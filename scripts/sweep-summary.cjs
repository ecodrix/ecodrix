// node scripts/sweep-summary.cjs <results.json> [--detail]
const r = require(require("path").resolve(process.argv[2]));
const detail = process.argv.includes("--detail");
const bad = [];
let tot = { hscroll: 0, clip: 0, overlap: 0, hero: 0, small: 0, tap: 0, err: 0, fail: 0 };
for (const x of r) {
  const f = [];
  if (x.fail) { f.push("FAIL " + x.fail); tot.fail++; }
  if (x.status && x.status >= 400) f.push("HTTP" + x.status);
  if (x.hscroll) { f.push(`HSCROLL ${x.scrollW}>${x.innerW} ${x.worst ? x.worst.d.slice(0, 60) + "@" + x.worst.right : ""}`); tot.hscroll++; }
  if (x.clip?.length) { f.push("CLIP " + x.clip.map((c) => `${c.d.slice(0, 50)}[${c.xs},${c.ys}]`).join(" | ")); tot.clip++; }
  if (x.overlap?.length) { f.push("OVERLAP " + x.overlap.slice(0, 3).map((c) => `${c.a.slice(0, 40)} X ${c.b.slice(0, 40)} ${c.ix}x${c.iy}`).join(" | ")); tot.overlap++; }
  if (x.hero && x.w >= 900 && !(x.host === "brand" && x.route === "/")) {
    const h = x.hero; const okH = Math.abs(h.h - (x.h - 0)) <= 2 || Math.abs(h.h + 0 - x.h) <= 2;
    // band is 100svh incl. header spacer? compare h.h to viewport h (hero may sit under header)
    const issues = [];
    if (Math.abs(h.h - h.H) > 2 && Math.abs(h.top + h.h - h.H) > 2) issues.push(`h=${h.h} vs vp=${h.H} top=${h.top}`);
    if (h.contentBottom > h.h + 1) issues.push(`content ${h.contentBottom}>${h.h}`);
    if (h.lines > 3) issues.push(`h1 ${h.lines} lines`);
    if (issues.length) { f.push("HERO " + issues.join(", ")); tot.hero++; }
  }
  if (x.hero && x.w < 900 && x.hero.contentBottom > x.hero.h + 1) { f.push(`HERO(phone) content ${x.hero.contentBottom}>${x.hero.h}`); tot.hero++; }
  if (x.small?.length) { f.push("SMALL " + x.small.map((s) => `${s.fs}px"${s.t}"`).slice(0, 3).join(" ")); tot.small++; }
  if (x.tap?.length) { f.push("TAP " + x.tap.slice(0, 3).map((s) => `${s.d.slice(0, 40)} ${s.h}px`).join(" | ")); tot.tap++; }
  if (x.errors?.length) { f.push("ERR " + x.errors[0]); tot.err++; }
  if (f.length) bad.push({ k: `${x.host}${x.route} @${x.w}`, f });
}
console.log("pages", r.length, JSON.stringify(tot));
if (detail) for (const b of bad) console.log(b.k + "\n   " + b.f.join("\n   "));
else { const by = {}; for (const b of bad) for (const f of b.f) { const t = f.split(" ")[0]; (by[t] ||= new Set()).add(b.k); } for (const t in by) console.log(t, by[t].size); }
