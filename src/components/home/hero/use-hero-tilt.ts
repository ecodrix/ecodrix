import type { RefObject } from "react";
import { useTilt } from "@/components/motion/use-tilt";

/**
 * The hero's use of the shared tilt: pointer events on the whole hero, a spotlight (`--mx`/`--my`) on the
 * console, and `--flat` on the hero. The card flattens only when the pointer is on it, not on the text block.
 */
export function useHeroTilt(
  tilt: RefObject<HTMLElement | null>,
  stage: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const hero = () => stage.current?.closest<HTMLElement>("[data-hx-hero]");
  const q = (sel: string) => hero()?.querySelector<HTMLElement>(sel);
  useTilt(tilt, stage, enabled, {
    root: hero,
    onPointer: (e) => {
      const con = q(".hx-console");
      if (!con) return;
      const c = con.getBoundingClientRect();
      con.style.setProperty("--mx", `${e.clientX - c.left}px`);
      con.style.setProperty("--my", `${e.clientY - c.top}px`);
    },
    flatOn: (e, r) => {
      const typeIn = q(".hx-type-in");
      if (!typeIn) return false;
      const b = typeIn.getBoundingClientRect();
      const pad = 16;
      const onText =
        e.clientX > b.left - pad && e.clientX < b.right + pad && e.clientY > b.top - pad && e.clientY < b.bottom + pad;
      const onCard = e.clientY > r.top && e.clientY < r.bottom && e.clientX > r.left && e.clientX < r.right;
      return !onText && onCard;
    },
    onFlat: (flat) => hero()?.style.setProperty("--flat", flat.toFixed(3)),
  });
}
