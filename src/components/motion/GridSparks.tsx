"use client";

import { useEffect, useRef, useState } from "react";
import { crossings, inRects, makeBag, type Pt, pad, type Rect } from "./grid-bag";

/**
 * Invisible grid across a navy band, with "relay" light beams (founder pick, 24 Nov 2026, variant U3).
 * At a random "+" four beams of light leave the point already moving along the grid lines: a
 * white-hot core, a tapering lilac tail, a purple halo and a faint afterglow. Each runs one cell;
 * where it ends it flares softly and hands off to two weaker beams at right angles, then all fade.
 * A shuffled bag of crossings guarantees no place repeats until all have had a turn. Crossings under `[data-sparks-avoid]` elements (+1 cell)
 * are left out so text stays readable. One canvas, behind content; rAF runs only while the band is
 * on screen and the tab visible, and sleeps (setTimeout) when no spark is alive.
 * Mount as the FIRST child of a `.band-navy` (relative, overflow hidden) section.
 */

const DEBUG = process.env.NODE_ENV !== "production";
const RUN = 1100; // a beam's run, ms (scaled per beam by its speed)
const RELAY_RUN = 940; // the hand-off beams
const LIFE = RUN * 1.25 + 300 + RELAY_RUN + 260;
const TAIL = 46; // px of tapering tail behind the head
const AFTERGLOW = 120; // px of faint route left behind
type RGB = readonly [number, number, number];
// Fixed colours (not tokens) because the canvas needs channel values for alpha gradients:
// the hero swoosh purple, the AI lilac on navy, and a white-hot core.
const PURPLE: RGB = [178, 81, 211];
const LILAC: RGB = [231, 182, 247];
const CORE: RGB = [248, 238, 255];
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const launch = (q: number) => 1 - (1 - q) ** 1.7;
const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${clamp(a).toFixed(3)})`;

type Arm = { dir: number; speed: number; end: Pt | null; relayed: boolean };
type Relay = { p: Pt; t0: number; dirs: number[] };
type Spark = { p: Pt; t0: number; arms: Arm[]; relays: Relay[] };
const DIRS: Pt[] = [
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
];

export function GridSparks() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setOn(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const cv = ref.current;
    const band = cv?.parentElement;
    const ctx = cv?.getContext("2d");
    if (!on || !cv || !band || !ctx) return;

    const small = matchMedia("(max-width: 680px), (pointer: coarse)").matches;
    const maxAlive = small ? 2 : 4;
    const slow = small ? 1.8 : 1;

    let cell = 64;
    let w = 0;
    let h = 0;
    let bag = makeBag<Pt>([]);
    let avoid: Rect[] = [];
    let sparks: Spark[] = [];
    let nextAt = 0;
    let raf = 0;
    let timer = 0;
    let inView = false;
    const dbg = {
      spawns: [] as { x: number; y: number; round: number }[],
      avoid,
      frames: 0,
      ms: 0,
      bagSize: 0,
      strip: 0,
    };
    let round = 0;
    if (DEBUG) (cv as unknown as { __sparks: typeof dbg }).__sparks = dbg;

    const build = () => {
      w = band.clientWidth;
      h = band.clientHeight;
      cell = w < 640 ? 56 : 64;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const b = band.getBoundingClientRect();
      avoid = Array.from(band.querySelectorAll("[data-sparks-avoid]")).map((el) => {
        const r = el.getBoundingClientRect();
        return pad({ l: r.left - b.left, t: r.top - b.top, r: r.right - b.left, b: r.bottom - b.top }, cell);
      });
      // Bands that run up behind the floating header: keep the longest arm (2 cells) clear of it.
      const hb = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
      dbg.strip = hb > b.top ? hb - b.top + 2 * cell : 0;
      if (dbg.strip) avoid.push({ l: -1e4, t: -1e4, r: 1e4, b: dbg.strip });
      const pts = crossings(w, h, cell).filter((p) => !inRects(p, avoid));
      bag = makeBag(pts);
      round = 0;
      dbg.avoid = avoid;
      dbg.bagSize = pts.length;
      dbg.spawns.length = 0;
    };

    const spawn = (now: number) => {
      const p = bag.next();
      if (!p) return;
      if (DEBUG) dbg.spawns.push({ x: p.x, y: p.y, round });
      if (DEBUG && bag.left === 0) round++;
      const arms = DIRS.map((d, dir) => ({ dir, speed: 0.82 + Math.random() * 0.33, end: free(p, d), relayed: false }));
      sparks.push({ p, t0: now, arms, relays: [] });
    };

    // One cell along `d` from `p`, or null when that point is off the band or in an avoided area.
    function free(p: Pt, d: Pt): Pt | null {
      const q = { x: p.x + d.x * cell, y: p.y + d.y * cell };
      return q.x < 0 || q.y < 0 || q.x > w || q.y > h || inRects(q, avoid) ? null : q;
    }

    const line = (x0: number, y0: number, x1: number, y1: number, width: number, c: RGB, a0: number, a1: number) => {
      if (Math.hypot(x1 - x0, y1 - y0) < 0.5) return;
      const g = ctx.createLinearGradient(x0, y0, x1, y1);
      g.addColorStop(0, rgba(c, a0));
      g.addColorStop(1, rgba(c, a1));
      ctx.strokeStyle = g;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    };
    const glow = (x: number, y: number, r: number, c: RGB, a: number) => {
      if (r <= 0 || a <= 0) return;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, rgba(c, a));
      g.addColorStop(1, rgba(c, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 6.2832);
      ctx.fill();
    };
    // A beam from `o` toward `to`, its head at distance `d`; `a` is the overall alpha, `k` scales it down.
    const beam = (o: Pt, to: Pt, d: number, a: number, k = 1) => {
      const L = Math.hypot(to.x - o.x, to.y - o.y);
      const ux = (to.x - o.x) / L;
      const uy = (to.y - o.y) / L;
      const at = (dist: number) => [o.x + ux * dist, o.y + uy * dist] as const;
      const [hx, hy] = at(d);
      const tail = TAIL * k;
      if (k === 1) {
        const [gx, gy] = at(Math.max(0, d - AFTERGLOW));
        line(gx, gy, hx, hy, 1, PURPLE, 0, 0.16 * a); // the route lingers faintly
        const [bx, by] = at(Math.max(0, d - tail * 1.6));
        line(bx, by, hx, hy, 8, PURPLE, 0, 0.2 * a); // halo
      }
      for (let i = 0; i < 4; i++) {
        // tapering lilac tail, thin at the back
        const [x0, y0] = at(Math.max(0, d - tail * (1 - i / 4)));
        const [x1, y1] = at(Math.max(0, d - tail * (1 - (i + 1) / 4)));
        line(x0, y0, x1, y1, (0.4 + 0.45 * (i + 1)) * k, LILAC, (a * i) / 4, (a * (i + 1)) / 4);
      }
      const [cx, cy] = at(Math.max(0, d - 10 * k));
      line(cx, cy, hx, hy, 1.4 * k, CORE, 0, a); // white-hot core
      glow(hx, hy, 9 * k, LILAC, 0.4 * a);
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      ctx.globalCompositeOperation = "lighter";
      for (const s of sparks) {
        const t = now - s.t0;
        for (const arm of s.arms) {
          if (!arm.end) continue;
          const run = RUN / arm.speed;
          const q = prog(t, 0, run);
          const d = launch(q) * cell;
          // the beam brightens only as it leaves the point, so nothing marks where it started
          const a = clamp(d / (TAIL * 0.9)) * (1 - prog(t, run * 0.55, run + 250));
          if (a > 0) beam(s.p, arm.end, d, a);
          if (q >= 1 && !arm.relayed) {
            arm.relayed = true;
            const d0 = DIRS[arm.dir];
            const end = arm.end;
            const across = d0.x === 0 ? [2, 3] : [0, 1]; // the two directions at right angles to this beam
            s.relays.push({ p: end, t0: t, dirs: across.filter((k) => free(end, DIRS[k])) });
          }
        }
        // the hand-off: a soft flare where a beam ended, then two weaker beams at right angles
        for (const r of s.relays) {
          const tt = t - r.t0;
          const flare = prog(tt, 0, 90) * (1 - prog(tt, 90, 500));
          glow(r.p.x, r.p.y, 14 * flare + 3, LILAC, 0.5 * flare);
          for (const k of r.dirs) {
            const to = free(r.p, DIRS[k]);
            if (!to) continue;
            const d = launch(prog(tt, 60, RELAY_RUN)) * cell;
            const a = 0.7 * clamp(d / 30) * (1 - prog(tt, 500, RELAY_RUN + 210));
            if (a > 0) beam(r.p, to, d, a, 0.65);
          }
        }
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      raf = 0;
      timer = 0;
    };

    const frame = (now: number) => {
      raf = 0;
      const t0 = DEBUG ? performance.now() : 0;
      sparks = sparks.filter((s) => now - s.t0 < LIFE);
      if (now >= nextAt && sparks.length < maxAlive) {
        spawn(now);
        nextAt = now + (600 + Math.random() * 800) * slow;
      }
      draw(now);
      if (DEBUG) {
        dbg.frames++;
        dbg.ms += performance.now() - t0;
      }
      if (sparks.length) raf = requestAnimationFrame(frame);
      else {
        ctx.clearRect(0, 0, w, h);
        timer = window.setTimeout(
          () => {
            timer = 0;
            raf = requestAnimationFrame(frame);
          },
          Math.max(0, nextAt - performance.now()),
        );
      }
    };

    const run = () => {
      stop();
      if (!inView || document.hidden) {
        sparks = [];
        ctx.clearRect(0, 0, w, h);
        return;
      }
      nextAt = performance.now() + 300;
      raf = requestAnimationFrame(frame);
    };

    build();
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      run();
    });
    io.observe(band);
    const ro = new ResizeObserver(() => {
      build();
      sparks = [];
    });
    ro.observe(band);
    const late = window.setTimeout(build, 1200); // fonts and entrance animations settle
    const vis = () => run();
    document.addEventListener("visibilitychange", vis);
    return () => {
      stop();
      clearTimeout(late);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", vis);
    };
  }, [on]);

  if (!on) return null;
  // biome-ignore lint/a11y/noAriaHiddenOnFocusable: a canvas is not focusable; this one is decoration only.
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />;
}
