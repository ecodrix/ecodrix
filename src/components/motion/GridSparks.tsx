"use client";

import { useEffect, useRef, useState } from "react";
import { crossings, inRects, makeBag, type Pt, pad, type Rect } from "./grid-bag";

/**
 * Invisible grid across a navy band. At a random "+" a purple spark pops, splits into four arms
 * along the grid lines (1-2 cells each), then fades. A shuffled bag of crossings guarantees no
 * place repeats until all have had a turn. Crossings under `[data-sparks-avoid]` elements (+1 cell)
 * are left out so text stays readable. One canvas, behind content; rAF runs only while the band is
 * on screen and the tab visible, and sleeps (setTimeout) when no spark is alive.
 * Mount as the FIRST child of a `.band-navy` (relative, overflow hidden) section.
 */

const DEBUG = process.env.NODE_ENV !== "production";
const LIFE = 3000;
const POP = 150;
const GROW = 900;
const FADE_AT = 1500;
const ease = (t: number) => 1 - (1 - t) ** 3;

type Spark = { p: Pt; t0: number; reach: number[] }; // reach per arm in cells: up, down, left, right
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
    const cs = getComputedStyle(cv);
    const core = cs.getPropertyValue("--ai").trim() || "#e7b6f7";
    const body = cs.getPropertyValue("--hero-swoosh").trim() || "#b251d3";

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
    const dbg = { spawns: [] as { x: number; y: number; round: number }[], avoid, frames: 0, ms: 0, bagSize: 0 };
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
      sparks.push({ p, t0: now, reach: DIRS.map(() => (Math.random() < 0.5 ? 1 : 2)) });
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      for (const s of sparks) {
        const age = now - s.t0;
        const alpha = age < FADE_AT ? 1 : Math.max(0, 1 - (age - FADE_AT) / (LIFE - FADE_AT));
        const pop = ease(Math.min(1, age / POP));
        const grow = ease(Math.min(1, Math.max(0, age - POP) / GROW));
        ctx.globalAlpha = alpha;
        // Soft glow: the same core drawn larger and faint.
        ctx.fillStyle = body;
        ctx.globalAlpha = alpha * 0.18;
        ctx.beginPath();
        ctx.arc(s.p.x, s.p.y, 11 * pop, 0, 6.2832);
        ctx.fill();
        ctx.globalAlpha = alpha;
        DIRS.forEach((d, i) => {
          const len = s.reach[i] * cell * grow;
          if (len < 1) return;
          const hx = s.p.x + d.x * len;
          const hy = s.p.y + d.y * len;
          const g = ctx.createLinearGradient(s.p.x, s.p.y, hx, hy);
          g.addColorStop(0, "rgba(178,81,211,0)");
          g.addColorStop(1, body);
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(s.p.x, s.p.y);
          ctx.lineTo(hx, hy);
          ctx.stroke();
          ctx.fillStyle = core;
          ctx.beginPath();
          ctx.arc(hx, hy, 2, 0, 6.2832);
          ctx.fill();
        });
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(s.p.x, s.p.y, 3 * pop, 0, 6.2832);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
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
