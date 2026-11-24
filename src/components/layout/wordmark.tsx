"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * The big "ECODrIx" closing the footer. v2 (founder, 27 Oct 2026).
 *
 * At rest: real letters in the display font (Bricolage 800), solid grey.
 * Pointer: the letters near it break into small retro pixels lit in a bright
 * brand gradient (blue left, purple middle, red right) with a glow. A fast swipe leaves a comet trail instead of gaps. When the light moves
 * on, pixels melt back into the solid letter in a dithered pattern, not a flat
 * fade. Tap / click: a ring of light ripples out from the point. First time the
 * word scrolls into view: one slanted sweep of light across it.
 *
 * Why it stays cheap:
 * - Letters are drawn once per size/theme into a cached layer; the pixel grid
 *   is sampled from them (5 taps per pixel), so pixels follow the letterforms.
 * - Only lit pixels are touched per frame (active list + grid index); the
 *   pointer only looks at pixels within reach.
 * - Glow is one buffer drawn small and scaled up, not a shadowBlur per pixel.
 * - Melt is time-based, so 60Hz and 120Hz screens look the same.
 * - The loop runs only while something changes. Idle or resting pointer = 0 cost.
 *
 * Gaps between lit pixels are cut out of the canvas, not painted in a guessed
 * background colour, so it works on any background (gradient, image, glass).
 * Colour tokens resolve through the browser, so hex, rgb, hsl and oklch all work.
 * Follows theme switches, reduced motion and screen-density changes live.
 * Decorative (the company name is in the footer text), so hidden from assistive
 * tech. A fixed aspect ratio reserves the space, so nothing shifts while the
 * font loads.
 */

const WORD = "ECODrIx";
/** Width : height of the box the word is fitted into. */
const RATIO = 4.6;
/** Pixel size relative to the box width (about 7px at 1,100px). */
const CELL_FRAC = 1 / 160;
/** How far the pointer's light reaches, in grid pixels. */
const REACH = 9;
/** Brightness of the swipe trail relative to the pointer itself. */
const TRAIL = 0.85;
/** Half-life of a lit pixel once the light leaves it, in ms. */
const MELT_MS = 160;
/** A resting pointer stops the loop after this long (trail has melted by then). */
const SETTLE_MS = 1000;
/** Tap ring: speed (grid px per ms), thickness, and the radius it dies at. */
const RING_SPEED = 0.06;
const RING_BAND = 2.2;
const RING_LIFE = 34;
/** Intro sweep: duration, band half-width and slant (grid px). */
const SWEEP_MS = 1100;
const SWEEP_BAND = 5;
const SWEEP_SLANT = 0.4;
/** Glow strength and size (one glow pixel = this many grid pixels). */
const GLOW_ALPHA = 0.95;
const GLOW_SCALE = 1.5;
/** Colour tables: gradient steps across the word, grey→colour steps per tone. */
const TONES = 48;
const MIX = 8;
/** 5 sample points per pixel; 3 inside the letter makes it a letter pixel. */
const TAPS: ReadonlyArray<readonly [number, number]> = [
  [0.25, 0.25],
  [0.75, 0.25],
  [0.5, 0.5],
  [0.25, 0.75],
  [0.75, 0.75],
];
/** 4×4 Bayer matrix: the order pixels drop out while melting (retro dither). */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

type RGB = [number, number, number];

/** Colour at `t` (0..1) along evenly spaced gradient stops. */
function along(stops: RGB[], t: number): RGB {
  const p = Math.min(0.9999, Math.max(0, t)) * (stops.length - 1);
  const i = Math.floor(p);
  const f = p - i;
  const a = stops[i]!;
  const b = stops[i + 1]!;
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
}

const rgb = (c: RGB) => `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`;

export function Wordmark({ className, intro = true }: { className?: string; intro?: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = wrap.current;
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!el || !cv || !ctx) return;

    // Offscreen layers: cached grey letters, small glow buffer, 1x sampler, colour probe.
    const letters = document.createElement("canvas");
    const glow = document.createElement("canvas");
    const sampler = document.createElement("canvas");
    const probe = document.createElement("canvas");
    probe.width = probe.height = 1;
    const lctx = letters.getContext("2d")!;
    const gctx = glow.getContext("2d")!;
    const sctx = sampler.getContext("2d", { willReadFrequently: true })!;
    const pctx = probe.getContext("2d", { willReadFrequently: true })!;

    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const schemeMq = window.matchMedia("(prefers-color-scheme: dark)");
    let still = motionMq.matches;
    const family = getComputedStyle(el).getPropertyValue("--font-bricolage").trim() || "system-ui";

    /** Any CSS colour (hex, rgb, hsl, oklch…) → sRGB, via the browser itself. */
    const resolve = (value: string, fallback: RGB): RGB => {
      const v = value.trim();
      if (!v) return fallback;
      pctx.clearRect(0, 0, 1, 1);
      pctx.fillStyle = rgb(fallback); // an invalid value leaves this in place
      pctx.fillStyle = v;
      pctx.fillRect(0, 0, 1, 1);
      const d = pctx.getImageData(0, 0, 1, 1).data;
      return [d[0]!, d[1]!, d[2]!];
    };

    // Theme
    let greyCss = "";
    let toneCss: string[] = [];
    let paint: string[] = [];

    // Geometry
    let w = 0;
    let h = 0;
    let cell = 0;
    let gap = 0;
    let gs = 0;
    let cols = 0;
    let rows = 0;
    let font = "";
    let textX = 0;
    let baseline = 0;

    // Letter pixels, as parallel arrays.
    let count = 0;
    let grid = new Int32Array(0); // grid slot → pixel index, -1 outside the letters
    let px = new Uint16Array(0);
    let py = new Uint16Array(0);
    let tone = new Uint8Array(0);
    let floor = new Float32Array(0); // energy below which a pixel melts back (dithered)
    let energy = new Float32Array(0);
    let isLit = new Uint8Array(0);
    let lit: number[] = [];

    // Light sources
    let pointer: { x: number; y: number } | null = null;
    let movedAt = 0;
    const rings: { x: number; y: number; t: number }[] = [];
    let sweepAt = 0;
    let watching = false;

    let raf = 0;
    let last = 0;

    const readTheme = () => {
      const css = getComputedStyle(el);
      // Light grey at rest (founder, 27 Oct 2026): the hairline colour, a
      // third of the way to the input-border grey, so it reads on the footer.
      const hair = resolve(css.getPropertyValue("--border"), [221, 226, 240]);
      const firm = resolve(css.getPropertyValue("--border-strong"), [135, 142, 157]);
      const grey: RGB = [0, 1, 2].map((k) => Math.round(hair[k]! + (firm[k]! - hair[k]!) * 0.3)) as RGB;
      // Bright brand trio, blue → purple → red (founder, 27 Oct 2026: "make
      // use bright colors"). A deliberate exception to the design system's
      // same-hue gradient rule, for this footer wordmark only.
      const stops: RGB[] = [
        resolve(css.getPropertyValue("--blue-500"), [79, 121, 243]),
        resolve(css.getPropertyValue("--purple-500"), [178, 81, 211]),
        resolve(css.getPropertyValue("--red-500"), [204, 90, 87]),
      ];
      greyCss = rgb(grey);
      toneCss = [];
      paint = [];
      for (let t = 0; t < TONES; t++) {
        const c = along(stops, t / (TONES - 1));
        toneCss.push(rgb(c));
        for (let k = 0; k <= MIX; k++) {
          const f = k / MIX;
          paint.push(
            rgb([grey[0] + (c[0] - grey[0]) * f, grey[1] + (c[1] - grey[1]) * f, grey[2] + (c[2] - grey[2]) * f]),
          );
        }
      }
    };

    /** Fit the word, cache the grey letters, sample which grid pixels sit inside them. */
    const layout = () => {
      w = el.clientWidth;
      h = el.clientHeight;
      if (!w || !h) return;
      readTheme();

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = letters.width = Math.round(w * dpr);
      cv.height = letters.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.font = `800 100px ${family}`;
      const m = ctx.measureText(WORD);
      const glyphH = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
      const size = Math.min((w * 0.99) / m.width, (h * 0.92) / glyphH) * 100;
      font = `800 ${size}px ${family}`;
      ctx.font = font;
      const fm = ctx.measureText(WORD);
      textX = (w - fm.width) / 2;
      baseline = (h + fm.actualBoundingBoxAscent - fm.actualBoundingBoxDescent) / 2;

      // Cached solid letters.
      lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lctx.font = font;
      lctx.fillStyle = greyCss;
      lctx.fillText(WORD, textX, baseline);

      // Whole-pixel cells: no hairline seams between neighbours.
      cell = Math.max(4, Math.round(w * CELL_FRAC));
      gap = Math.max(1, Math.round(cell * 0.18));
      cols = Math.ceil(w / cell);
      rows = Math.ceil(h / cell);

      const sw = (sampler.width = Math.ceil(w));
      const sh = (sampler.height = Math.ceil(h));
      sctx.font = font;
      sctx.fillText(WORD, textX, baseline);
      const alpha = sctx.getImageData(0, 0, sw, sh).data;
      const inside = (x: number, y: number) =>
        alpha[(Math.min(sh - 1, y | 0) * sw + Math.min(sw - 1, x | 0)) * 4 + 3]! >= 128;

      grid = new Int32Array(cols * rows).fill(-1);
      const xs: number[] = [];
      const ys: number[] = [];
      const ts: number[] = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let hits = 0;
          for (const [u, v] of TAPS) if (inside((x + u) * cell, (y + v) * cell)) hits++;
          if (hits < 3) continue;
          grid[y * cols + x] = xs.length;
          xs.push(x);
          ys.push(y);
          const t = ((x + 0.5) * cell - textX) / fm.width;
          ts.push(Math.round(Math.min(1, Math.max(0, t)) * (TONES - 1)));
        }
      }
      count = xs.length;
      px = Uint16Array.from(xs);
      py = Uint16Array.from(ys);
      tone = Uint8Array.from(ts);
      floor = Float32Array.from(xs, (x, i) => 0.03 + 0.3 * BAYER[(ys[i]! & 3) * 4 + (x & 3)]!);
      energy = new Float32Array(count);
      isLit = new Uint8Array(count);
      lit = [];

      // Glow buffer: drawn small, scaled up — the scaling is the blur.
      gs = cell * GLOW_SCALE;
      glow.width = Math.ceil(w / gs) + 2;
      glow.height = Math.ceil(h / gs) + 2;
      gctx.setTransform(1 / gs, 0, 0, 1 / gs, 0, 0);

      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
      draw(performance.now());

      if (intro && !still && !watching) {
        watching = true;
        io.observe(el);
      }
    };

    const charge = (i: number, v: number) => {
      if (v <= energy[i]!) return;
      energy[i] = v;
      if (!isLit[i]) {
        isLit[i] = 1;
        lit.push(i);
      }
    };

    /** Light every letter pixel within reach of a grid point. */
    const stamp = (cx: number, cy: number, strength = 1) => {
      const r2 = REACH * REACH;
      const x0 = Math.max(0, Math.floor(cx - REACH));
      const x1 = Math.min(cols - 1, Math.ceil(cx + REACH));
      const y0 = Math.max(0, Math.floor(cy - REACH));
      const y1 = Math.min(rows - 1, Math.ceil(cy + REACH));
      for (let y = y0; y <= y1; y++) {
        const dy = y + 0.5 - cy;
        for (let x = x0; x <= x1; x++) {
          const i = grid[y * cols + x]!;
          if (i < 0) continue;
          const dx = x + 0.5 - cx;
          const d2 = dx * dx + dy * dy;
          if (d2 < r2) charge(i, (1 - d2 / r2) * strength);
        }
      }
    };

    const pulse = (now: number) => {
      for (let r = rings.length - 1; r >= 0; r--) {
        const ring = rings[r]!;
        const radius = (now - ring.t) * RING_SPEED;
        if (radius > RING_LIFE) {
          rings.splice(r, 1);
          continue;
        }
        const fade = 1 - radius / RING_LIFE;
        const lo = Math.max(0, radius - RING_BAND);
        const hi = radius + RING_BAND;
        const lo2 = lo * lo;
        const hi2 = hi * hi;
        for (let i = 0; i < count; i++) {
          const dx = px[i]! + 0.5 - ring.x;
          const dy = py[i]! + 0.5 - ring.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < lo2 || d2 > hi2) continue;
          charge(i, (1 - Math.abs(Math.sqrt(d2) - radius) / RING_BAND) * fade);
        }
      }
    };

    const sweep = (now: number) => {
      if (!sweepAt) return;
      const p = (now - sweepAt) / SWEEP_MS;
      if (p >= 1) {
        sweepAt = 0;
        return;
      }
      const ease = p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2;
      const span = cols + rows * SWEEP_SLANT + SWEEP_BAND * 2;
      const bx = -SWEEP_BAND + span * ease;
      for (let i = 0; i < count; i++) {
        const dx = Math.abs(px[i]! + 0.5 + (rows - py[i]!) * SWEEP_SLANT - bx);
        if (dx < SWEEP_BAND) charge(i, (1 - dx / SWEEP_BAND) * 0.9);
      }
    };

    const draw = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(64, now - last) : 16;
      last = now;

      if (pointer) stamp(pointer.x, pointer.y);
      if (!still) {
        pulse(now);
        sweep(now);
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(letters, 0, 0, w, h);

      // Drop pixels that have melted below their dither threshold.
      let n = 0;
      for (let j = 0; j < lit.length; j++) {
        const i = lit[j]!;
        if (energy[i]! < floor[i]!) {
          energy[i] = 0;
          isLit[i] = 0;
          continue;
        }
        lit[n++] = i;
      }
      lit.length = n;

      if (n) {
        // 1. Cut the lit cells out of the solid letter (real background shows in the gaps).
        ctx.globalCompositeOperation = "destination-out";
        for (const i of lit) {
          ctx.globalAlpha = Math.min(1, energy[i]! * 1.6);
          ctx.fillRect(px[i]! * cell, py[i]! * cell, cell, cell);
        }

        // 2. Glow: small buffer, scaled up with smoothing.
        gctx.clearRect(0, 0, glow.width * gs, glow.height * gs);
        for (const i of lit) {
          gctx.globalAlpha = energy[i]!;
          gctx.fillStyle = toneCss[tone[i]!]!;
          gctx.fillRect(px[i]! * cell, py[i]! * cell, cell, cell);
        }
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = GLOW_ALPHA;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(glow, 0, 0, glow.width * gs, glow.height * gs);

        // 3. The pixels, grey → gradient colour by energy.
        ctx.globalAlpha = 1;
        const s = cell - gap;
        const o = gap / 2;
        for (const i of lit) {
          // Reach full colour early, so lit pixels read bright, not greyish.
          const k = Math.min(MIX, Math.round(Math.min(1, energy[i]! * 2.2) * MIX));
          ctx.fillStyle = paint[tone[i]! * (MIX + 1) + k]!;
          ctx.fillRect(px[i]! * cell + o, py[i]! * cell + o, s, s);
        }

        // 4. Melt (time-based; instant under reduced motion).
        const keep = still ? 0 : 0.5 ** (dt / MELT_MS);
        for (const i of lit) energy[i] = energy[i]! * keep;
      }

      const settled = pointer !== null && now - movedAt > SETTLE_MS;
      const go = rings.length > 0 || sweepAt > 0 || (pointer ? !settled : n > 0);
      if (go) raf = requestAnimationFrame(draw);
      else last = 0;
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const move = (e: PointerEvent) => {
      if (!cell) return;
      const p = { x: e.offsetX / cell, y: e.offsetY / cell };
      // Fill the path between events so fast swipes leave a trail, not dots.
      if (pointer && !still) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const steps = Math.min(48, Math.floor(Math.hypot(dx, dy) / (REACH * 0.4)));
        for (let s = 1; s <= steps; s++) {
          const f = s / (steps + 1);
          stamp(pointer.x + dx * f, pointer.y + dy * f, TRAIL);
        }
      }
      pointer = p;
      movedAt = performance.now();
      kick();
    };
    const down = (e: PointerEvent) => {
      move(e);
      if (!pointer || still) return;
      rings.push({ x: pointer.x, y: pointer.y, t: performance.now() });
      if (rings.length > 3) rings.shift();
    };
    const leave = () => {
      pointer = null;
      kick();
    };

    // One sweep the first time the word is properly in view.
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        if (still) return;
        sweepAt = performance.now();
        kick();
      },
      { threshold: 0.6 },
    );

    const onMotion = () => {
      still = motionMq.matches;
      if (still) {
        rings.length = 0;
        sweepAt = 0;
      }
      kick();
    };

    // Re-layout when the screen density changes (window dragged to another display).
    let dprMq: MediaQueryList | null = null;
    const onDpr = () => {
      layout();
      watchDpr();
    };
    const watchDpr = () => {
      dprMq?.removeEventListener("change", onDpr);
      dprMq = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      dprMq.addEventListener("change", onDpr);
    };

    const ro = new ResizeObserver(() => layout());
    // Theme toggles (class / data-theme on <html>) change the token values.
    const mo = new MutationObserver(() => layout());

    let alive = true;
    // Draw with the real font, not a fallback: wait for Bricolage, but start
    // either way. The family list also names next/font's local() fallback
    // faces, and one missing on the device rejects the load ("NetworkError");
    // `.finally` would pass that on as an unhandled error, so catch it first.
    document.fonts
      .load(`800 100px ${family}`, WORD)
      .catch(() => [])
      .then(() => {
        if (!alive) return;
        ro.observe(el); // fires once immediately → first layout
        mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
        schemeMq.addEventListener("change", layout);
        watchDpr();
      });
    motionMq.addEventListener("change", onMotion);
    cv.addEventListener("pointermove", move);
    cv.addEventListener("pointerdown", down);
    cv.addEventListener("pointerleave", leave);
    cv.addEventListener("pointercancel", leave);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      io.disconnect();
      schemeMq.removeEventListener("change", layout);
      motionMq.removeEventListener("change", onMotion);
      dprMq?.removeEventListener("change", onDpr);
      cv.removeEventListener("pointermove", move);
      cv.removeEventListener("pointerdown", down);
      cv.removeEventListener("pointerleave", leave);
      cv.removeEventListener("pointercancel", leave);
    };
  }, [intro]);

  return (
    <div
      ref={wrap}
      aria-hidden="true"
      className={cn("w-full select-none", className)}
      style={{ aspectRatio: `${RATIO} / 1` }}
    >
      <canvas ref={canvas} className="block h-full w-full touch-pan-y" />
    </div>
  );
}
