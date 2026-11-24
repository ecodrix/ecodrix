// Responsive sweep: routes x widths x hosts. Usage:
// PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu22.04-x64 NODE_PATH=/home/dhanesh/ecodrix/ECOD/saas/node_modules \
//   node scripts/responsive-sweep.cjs <outDir> [--shots] [--only substr] [--widths 360,1440] [--conc 3]
const { chromium } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const out = args[0];
const opt = (n, d) => { const i = args.indexOf(n); return i < 0 ? d : args[i + 1]; };
const SHOTS = args.includes("--shots");
const ONLY = opt("--only", "");
const CONC = +opt("--conc", 3);
const SIZES = [[360,740],[375,812],[414,896],[768,1024],[820,1180],[1024,768],[1280,720],[1366,768],[1440,900],[1920,1080],[2560,1440]];
const WIDTHS = opt("--widths", "") ? opt("--widths", "").split(",").map(Number) : SIZES.map((s) => s[0]);
const SHOT_PAGES = ["brand:/", "brand:/platform/erix-crm", "brand:/platform/erix-voice/voices", "brand:/platform/ai-employee", "brand:/pricing", "brand:/blog/why-most-websites-never-rank-the-7-seo-mistakes-that-quietly-kill-traffic", "doc:/", "doc:/api/auth"];
const routes = fs.readFileSync(path.join(__dirname, "sweep-routes.txt"), "utf8").split("\n").filter(Boolean);
const BASE = { brand: "http://localhost:3100", doc: "http://doc.localhost:3100", status: "http://status.localhost:3100" };

function measure() {
  const W = window.innerWidth, H = window.innerHeight;
  const r = {};
  const de = document.documentElement;
  r.scrollW = de.scrollWidth; r.innerW = W; r.hscroll = de.scrollWidth > W || document.body.scrollWidth > W;
  const vis = (el) => { const s = getComputedStyle(el); if (s.display === "none" || s.visibility === "hidden" || +s.opacity === 0) return false; const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0; };
  const desc = (el) => el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + (typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".") : "") + ((el.textContent || "").trim().slice(0, 25) ? ` "${el.textContent.trim().slice(0, 25)}"` : "");
  const clipped = (el) => { for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) { const s = getComputedStyle(p); if (s.overflowX !== "visible") { const b = p.getBoundingClientRect(); if (b.right <= W + 1 && b.left >= -1) return true; } if (s.position === "fixed") return false; } return false; };
  // widest offender
  let worst = null;
  if (r.hscroll) {
    for (const el of document.body.querySelectorAll("*")) {
      const b = el.getBoundingClientRect();
      if (b.width === 0 || getComputedStyle(el).position === "fixed") continue;
      if (b.right > W + 1 && !clipped(el) && (!worst || b.right > worst.right)) worst = { right: Math.round(b.right), d: desc(el) };
    }
  }
  r.worst = worst;
  // overflow hidden text clipping
  r.clip = [];
  for (const el of document.body.querySelectorAll("*")) {
    const s = getComputedStyle(el);
    if (s.overflowX === "visible" && s.overflowY === "visible") continue;
    if (s.textOverflow === "ellipsis" || s.webkitLineClamp !== "none" && s.webkitLineClamp) continue;
    if (!vis(el) || /sr-only|marquee/.test(el.className?.toString() || "")) continue;
    const xs = el.scrollWidth - el.clientWidth, ys = el.scrollHeight - el.clientHeight;
    const hiddenX = (s.overflowX === "hidden" || s.overflowX === "clip") && xs > 2;
    const hiddenY = (s.overflowY === "hidden" || s.overflowY === "clip") && ys > 2;
    if (!hiddenX && !hiddenY) continue;
    if (el.tagName === "BODY" || el.tagName === "HTML") continue;
    // only care if direct text/children text is present
    if (!(el.innerText || "").trim()) continue;
    r.clip.push({ d: desc(el), xs: hiddenX ? xs : 0, ys: hiddenY ? ys : 0 });
  }
  r.clip = r.clip.slice(0, 15);
  // overlaps between leaf text blocks / buttons / images within same section
  const leaves = [];
  for (const el of document.body.querySelectorAll("h1,h2,h3,h4,p,button,a,img,li,label,input")) {
    if (!vis(el) || el.closest("[aria-hidden=true]") || el.closest("canvas")) continue;
    const s = getComputedStyle(el);
    if (s.position === "absolute" && el.tagName === "IMG") continue;
    if (el.tagName === "A" && el.querySelector("h1,h2,h3,h4,p,img")) continue;
    if (el.tagName === "LI" && el.querySelector("p,a,button,h3")) continue;
    if (el.tagName === "P" && el.querySelector("a,button")) { /* ok */ }
    if (!(el.innerText || "").trim() && el.tagName !== "IMG" && el.tagName !== "INPUT") continue;
    const b = el.getBoundingClientRect();
    leaves.push({ el, b, sec: el.closest("section,header,footer,nav,aside,main,[role=dialog]") || document.body, fixed: !!el.closest("header,[data-cookie-banner]") });
  }
  r.overlap = [];
  for (let i = 0; i < leaves.length && r.overlap.length < 12; i++) for (let j = i + 1; j < leaves.length; j++) {
    const a = leaves[i], c = leaves[j];
    if (a.sec !== c.sec || a.el.contains(c.el) || c.el.contains(a.el)) continue;
    const ix = Math.min(a.b.right, c.b.right) - Math.max(a.b.left, c.b.left);
    const iy = Math.min(a.b.bottom, c.b.bottom) - Math.max(a.b.top, c.b.top);
    if (ix > 3 && iy > 3 && ix * iy > 40) { r.overlap.push({ a: desc(a.el), b: desc(c.el), ix: Math.round(ix), iy: Math.round(iy) }); if (r.overlap.length >= 12) break; }
  }
  // small text
  const small = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const t = n.textContent.trim(); if (!t) continue;
    const el = n.parentElement; if (!el || !vis(el) || el.closest("[aria-hidden=true]")) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < 11) { const k = Math.round(fs * 10) / 10 + "|" + (el.closest("[class]")?.className?.toString().slice(0, 40) || ""); if (!small.has(k)) small.set(k, { fs, t: t.slice(0, 30) }); }
  }
  r.small = [...small.values()].slice(0, 8);
  // hero
  const hero = [...document.querySelectorAll(".band-navy")].find((e) => e.getBoundingClientRect().top + scrollY < 200);
  if (hero) {
    const hb = hero.getBoundingClientRect();
    let maxBottom = 0;
    for (const el of hero.querySelectorAll("h1,h2,p,a,button,img,svg,li")) { if (!vis(el) || el.closest("[aria-hidden=true]")) continue; const b = el.getBoundingClientRect(); if (b.bottom > maxBottom) maxBottom = b.bottom; }
    const h1 = hero.querySelector("h1");
    let lines = 0;
    if (h1) { const lh = parseFloat(getComputedStyle(h1).lineHeight) || parseFloat(getComputedStyle(h1).fontSize) * 1.1; lines = Math.round(h1.getBoundingClientRect().height / lh); }
    r.hero = { top: Math.round(hb.top + scrollY), h: Math.round(hb.height), H, contentBottom: Math.round(maxBottom - hb.top), lines, tag: desc(hero).slice(0, 40) };
  }
  // tap targets (phones)
  if (W < 768) {
    const t = [];
    for (const el of document.querySelectorAll("main a, main button, header a, header button")) {
      if (!vis(el) || el.closest("[aria-hidden=true]")) continue;
      if (!/rounded-full|btn|button/.test(el.className?.toString() || "") && el.tagName !== "BUTTON") continue;
      const b = el.getBoundingClientRect();
      if (b.height < 40 && b.width > 20 && (el.innerText || "").trim().length > 2) t.push({ d: desc(el), h: Math.round(b.height), w: Math.round(b.width) });
    }
    r.tap = t.slice(0, 10);
  }
  // header
  const hd = document.querySelector("header");
  if (hd) { const b = hd.getBoundingClientRect(); r.header = { left: Math.round(b.left), right: Math.round(b.right), h: Math.round(b.height) }; }
  return r;
}

async function runOne(browser, host, route, [w, h], errs) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: w < 900, isMobile: false });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message.slice(0, 150)));
  page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource|favicon|hydrat.*dev/i.test(m.text())) errors.push("console: " + m.text().slice(0, 150)); });
  await ctx.addInitScript(() => { try { localStorage.setItem("__x", "1"); } catch {} });
  let res = null;
  try {
    const resp = await page.goto(BASE[host] + route, { waitUntil: "load", timeout: 60000 });
    const status = resp ? resp.status() : 0;
    // dismiss cookie banner
    const rej = page.locator("[data-cookie-banner] button").first();
    if (await rej.count()) { await rej.click({ timeout: 2000 }).catch(() => {}); }
    await page.mouse.move(2, 2);
    // scroll through to trigger lazy parts
    await page.evaluate(async () => { const H = document.documentElement.scrollHeight; for (let y = 0; y < H; y += innerHeight * 0.8) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } scrollTo(0, 0); });
    await page.waitForTimeout(900);
    await page.mouse.move(2, 2);
    res = await page.evaluate(measure);
    res.status = status;
    if (SHOTS && SHOT_PAGES.includes(host + ":" + route)) {
      const f = path.join(out, "shots", `${host}${route.replace(/\//g, "_") || "_home"}__${w}.png`);
      fs.mkdirSync(path.dirname(f), { recursive: true });
      await page.screenshot({ path: f, fullPage: true, timeout: 60000 }).catch((e) => errors.push("shot: " + e.message.slice(0, 80)));
    }
  } catch (e) { res = { fail: e.message.slice(0, 150) }; }
  res.errors = errors.slice(0, 5);
  await ctx.close();
  return res;
}

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ args: ["--host-resolver-rules=MAP doc.localhost 127.0.0.1, MAP status.localhost 127.0.0.1"] });
  const jobs = [];
  for (const line of routes) { const [host, route] = line.split(" "); if (ONLY && !(host + route).includes(ONLY)) continue; for (const s of SIZES) if (WIDTHS.includes(s[0])) jobs.push({ host, route, s }); }
  const results = [];
  let idx = 0, done = 0;
  const worker = async () => {
    while (idx < jobs.length) {
      const j = jobs[idx++];
      const r = await runOne(browser, j.host, j.route, j.s);
      results.push({ host: j.host, route: j.route, w: j.s[0], h: j.s[1], ...r });
      if (++done % 25 === 0) console.log(`${done}/${jobs.length}`);
    }
  };
  await Promise.all(Array.from({ length: CONC }, worker));
  fs.writeFileSync(path.join(out, "results.json"), JSON.stringify(results, null, 1));
  await browser.close();
  console.log("done", results.length);
})();
