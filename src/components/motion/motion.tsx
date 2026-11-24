"use client";

/**
 * Site motion helpers (CSS lives in globals.css → "Motion"). Entrances and
 * scroll-linked motion use framer-motion (`m.*` under the LazyMotion in
 * motion-provider.tsx); product scenes, count-ups and the hero headline stay
 * on CSS, IntersectionObserver and requestAnimationFrame. Every helper renders
 * its final state on the server and does nothing under
 * `prefers-reduced-motion: reduce`.
 *
 *   <MotionRoot />                once, in the root layout (route fade, focus)
 *   <Reveal>…</Reveal>            a product visual that rises in once, in view
 *   <Scene steps label>…</Scene>  a looping product scene (scene.tsx; parts use `at()`)
 *   <CountUp value="₹29,500" />   counts up when it comes into view
 *   <BlurText> (blur-text.tsx)    server-safe hero headline that sharpens in
 */

import { m, type Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

/** True when the visitor asked for reduced motion (or there is no DOM). */
export function motionOff(): boolean {
  return typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ponytail: soft route changes get an entry fade, not a view transition — switch to React <ViewTransition> once Next's experimental.viewTransition is stable.
/**
 * Root effect: a short entry fade on client-side route changes, and focus
 * moves to the new page's h1 (like the SaaS shell).
 *
 * Why not View Transitions for route changes: Next 16 only wires them to
 * React's experimental `<ViewTransition>` (`experimental.viewTransition`),
 * and a view transition freezes the old page while the next one loads,
 * which is worst on slow phone networks. Hard loads still crossfade
 * through the CSS `@view-transition` rule.
 */
export function MotionRoot() {
  const pathname = usePathname();
  const lastPath = useRef(pathname);

  useEffect(() => {
    // A client-side route change (not the first load).
    if (lastPath.current !== pathname) {
      lastPath.current = pathname;
      if (!motionOff()) {
        // Opacity only: a translate here would shift where a #hash
        // navigation measures its target (it landed 8px off under the header).
        document.getElementById("main-content")?.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 320,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        });
      }
      const h1 = location.hash ? null : document.querySelector<HTMLElement>("#main-content h1");
      if (h1) {
        h1.tabIndex = -1;
        h1.focus({ preventScroll: true });
      }
    }
  }, [pathname]);

  return null;
}

const noop = () => () => {};
/** False on the server and during hydration, true after: lets a component
 *  bind scroll-linked styles only once the server HTML has hydrated. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

const reveal: Variants = {
  wait: { opacity: 0, y: 24, transition: { duration: 0 } },
  in: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

/**
 * Reveal (design system v13, marketing only): a product visual that starts
 * below the fold waits hidden and rises in once when it scrolls into view.
 * Body text never animates. Nothing is hidden on the server, without JS,
 * before the motion features load, or under reduced motion, and visuals
 * already on screen (or scrolled past, e.g. after a jump to #contact) are
 * never touched. Opacity and transform only, so the layout never moves.
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"in" | "wait">("in");

  useEffect(() => {
    const el = ref.current;
    if (!el || motionOff() || !("IntersectionObserver" in window)) return;
    let first = true;
    const io = new IntersectionObserver(
      ([e]) => {
        if (first) {
          first = false;
          // On screen, or above it: leave it alone.
          if (e.isIntersecting || e.boundingClientRect.top < 0) return io.disconnect();
          return setPhase("wait");
        }
        // In view, or flung past it in one step: show it.
        if (e.isIntersecting || e.boundingClientRect.top < 0) {
          setPhase("in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <m.div ref={ref} className={className} variants={reveal} initial={false} animate={phase}>
      {children}
    </m.div>
  );
}

/**
 * Drives a product scene: sets `--step` 0 → `steps`, holds the finished
 * frame, then loops. Runs only while at least a third of it is on screen,
 * so off-screen and hidden-tab scenes cost nothing. The server HTML (and
 * reduced motion) is the finished frame. No visible control (same as the home hero):
 * it holds while the pointer is over it or focus is inside it, and a keyboard-only
 * "Pause demo" button (WCAG 2.2.2) shows on focus.
 */
export function SceneDriver({
  steps,
  timing = 1100,
  hold = 3200,
  label,
  className,
  children,
}: {
  /** Index of the last step. */
  steps: number;
  /** ms each step stays before the next: one number, or one per step
   *  (index = step; step 0, the cleared frame, always lasts 450 ms). */
  timing?: number | number[];
  /** ms the finished frame holds before the loop restarts. */
  hold?: number;
  /** What the scene shows, for screen readers (the parts are hidden). */
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [userPaused, setUserPaused] = useState(false);
  const [hold_, setHold] = useState(false);
  // Hover or focus inside holds the scene, like the hero console.
  const paused = userPaused || hold_;

  useEffect(() => {
    const el = ref.current;
    if (!el || paused || motionOff()) return;
    el.dataset.playing = "";
    let step = Number(el.style.getPropertyValue("--step") || steps);
    let timer = 0;
    const wait = (s: number) => (s >= steps ? hold : ((typeof timing === "number" ? timing : timing[s]) ?? 1100));
    const next = () => {
      step = step >= steps ? 0 : step + 1;
      el.style.setProperty("--step", String(step));
      timer = window.setTimeout(next, step === 0 ? 450 : wait(step));
    };
    const io = new IntersectionObserver(
      ([e]) => {
        clearTimeout(timer);
        if (e.isIntersecting) timer = window.setTimeout(next, step >= steps ? 1200 : wait(step));
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [paused, steps, timing, hold]);

  return (
    <div
      ref={ref}
      className={cn("scene relative flex flex-col", className)}
      data-paused={paused || undefined}
      onPointerEnter={() => setHold(true)}
      onPointerLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
    >
      <div role="img" aria-label={label}>
        {children}
      </div>
      <button
        type="button"
        onClick={() => setUserPaused(!userPaused)}
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-3 focus-visible:left-3 focus-visible:z-20 focus-visible:rounded-full focus-visible:bg-surface focus-visible:px-3 focus-visible:py-1.5 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-foreground"
      >
        {userPaused ? "Play demo" : "Pause demo"}
      </button>
    </div>
  );
}

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));

/**
 * A number that counts up once, when it scrolls into view. The real value
 * is always in the HTML (crawlers, screen readers, no-JS); the counting
 * digits are an aria-hidden overlay, and the real text keeps its width, so
 * nothing shifts. Already on screen at load → no count (never flashes 0).
 * Keeps ₹, suffixes (+, %), decimals and Indian grouping.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const real = useRef<HTMLSpanElement>(null);
  const live = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = real.current;
    const overlay = live.current;
    const m = value.match(/^(\D*)(\d[\d,]*(?:\.\d+)?)(.*)$/);
    if (!el || !overlay || !m || motionOff()) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    const [, pre, num, post] = m;
    const target = Number(num.replace(/,/g, ""));
    const dp = num.split(".")[1]?.length ?? 0;
    const fmt = (n: number) =>
      pre + n.toLocaleString("en-IN", { minimumFractionDigits: dp, maximumFractionDigits: dp }) + post;
    const show = (text: string | null) => {
      overlay.textContent = text;
      el.style.opacity = text === null ? "" : "0";
    };

    let raf = 0;
    show(fmt(0));
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        let t0: number | undefined;
        const tick = (now: number) => {
          t0 ??= now;
          const p = Math.min(1, (now - t0) / 1200);
          show(p < 1 ? fmt(target * easeOutExpo(p)) : null);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      show(null);
    };
  }, [value]);

  return (
    <span className={cn("relative inline-block tabular-nums", className)}>
      <span ref={real}>{value}</span>
      <span ref={live} aria-hidden="true" className="absolute inset-0 whitespace-nowrap" />
    </span>
  );
}
