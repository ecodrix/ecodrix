import { useEffect, useRef } from "react";
import { type Act, SCRIPT } from "./script";

/**
 * One rAF clock drives the whole script, so pausing it stops every scripted change (WCAG 2.2.2).
 * The clock keeps its position while `playing` is false and loops when the last entry has fired.
 */
export function useDemoClock(playing: boolean, fire: (a: Act, at: number) => void, tick: (clock: number) => void) {
  const pos = useRef({ clock: 0, idx: 0 });
  const cb = useRef({ fire, tick });
  cb.current = { fire, tick };

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const p = pos.current;
      p.clock += Math.min(100, now - last); // a long gap (throttled tab) must not skip the script
      last = now;
      while (p.idx < SCRIPT.length && SCRIPT[p.idx][0] <= p.clock) {
        const [at, acts] = SCRIPT[p.idx++];
        for (const a of acts) cb.current.fire(a, at);
        if (p.idx >= SCRIPT.length) {
          p.clock = 0;
          p.idx = 0;
          break;
        }
      }
      cb.current.tick(p.clock);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing]);
}
