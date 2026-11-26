import { createContext, type RefObject, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";

/** False under prefers-reduced-motion: counters jump and rows do not glide. */
export const MotionCtx = createContext(true);

/** Counts up/down to `to` over 600 ms (ease-out), from wherever it currently is. */
export function useTween(to: number): number {
  const animate = useContext(MotionCtx);
  const [v, setV] = useState(to);
  const cur = useRef(to);
  useEffect(() => {
    if (!animate || cur.current === to) {
      cur.current = to;
      setV(to);
      return;
    }
    const from = cur.current;
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / 600);
      cur.current = Math.round(from + (to - from) * (1 - (1 - p) ** 3));
      setV(cur.current);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, animate]);
  return animate ? v : to;
}

const EASE = "cubic-bezier(.2,.7,.2,1)";

/**
 * FLIP for keyed children (`data-key`): after each commit, rows that moved fade in at their new
 * spot and new rows fade in. offsetLeft/Top (not client rects) so view transforms do not skew it.
 */
export function useFlip(ref: RefObject<HTMLElement | null>, selector: string) {
  const animate = useContext(MotionCtx);
  const prev = useRef(new Map<string, [number, number]>());
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const next = new Map<string, [number, number]>();
    for (const el of root.querySelectorAll<HTMLElement>(selector)) {
      const key = el.dataset.key ?? "";
      next.set(key, [el.offsetLeft, el.offsetTop]);
      if (!animate || prev.current.size === 0) continue;
      const a = prev.current.get(key);
      if (!a) {
        el.animate(
          [
            { opacity: 0, transform: "translateY(-8px)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 450, easing: EASE },
        );
      } else if (a[0] !== el.offsetLeft || a[1] !== el.offsetTop) {
        el.animate(
          // A moved row fades in at its new spot instead of travelling from the old one: travelling rows
          // drew their text over their neighbours for half a second on a narrow list.
          [
            { opacity: 0.25, transform: "translateY(-6px)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 450, easing: EASE },
        );
      }
    }
    prev.current = next;
  });
}
