import { type RefObject, useEffect } from "react";

const MAX = 4; // degrees of tilt following the pointer
const REST = 7; // resting X tilt

/**
 * Pointer-follow tilt for the console plus `--flat`: while the pointer is on the card (outside the
 * text block) the card flattens and the text fades. Writes CSS vars straight to the DOM, no re-render.
 */
export function useTilt(tilt: RefObject<HTMLElement | null>, stage: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const t = tilt.current;
    const st = stage.current;
    const hero = st?.closest<HTMLElement>("[data-hx-hero]");
    const con = hero?.querySelector<HTMLElement>(".hx-console");
    const typeIn = hero?.querySelector<HTMLElement>(".hx-type-in");
    if (!t || !st || !hero || !con || !typeIn) return;
    if (!enabled) {
      t.style.setProperty("--rx", "0deg");
      return;
    }
    t.style.setProperty("--rx", `${REST}deg`);
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0,
      flat = 0,
      tflat = 0,
      raf = 0;
    const frame = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      flat += (tflat - flat) * 0.1;
      const k = 1 - flat;
      t.style.setProperty("--ry", `${(cx * MAX * k).toFixed(2)}deg`);
      t.style.setProperty("--rx", `${((REST - cy * MAX) * k).toFixed(2)}deg`);
      hero.style.setProperty("--flat", flat.toFixed(3));
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) + Math.abs(tflat - flat) > 0.002 ? requestAnimationFrame(frame) : 0;
    };
    const go = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const move = (e: PointerEvent) => {
      const r = st.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
      ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
      const c = con.getBoundingClientRect();
      con.style.setProperty("--mx", `${e.clientX - c.left}px`);
      con.style.setProperty("--my", `${e.clientY - c.top}px`);
      const b = typeIn.getBoundingClientRect();
      const pad = 16;
      const onText =
        e.clientX > b.left - pad && e.clientX < b.right + pad && e.clientY > b.top - pad && e.clientY < b.bottom + pad;
      const onCard = e.clientY > r.top && e.clientY < r.bottom && e.clientX > r.left && e.clientX < r.right;
      tflat = !onText && onCard ? 1 : 0;
      go();
    };
    const leave = () => {
      tx = ty = tflat = 0;
      go();
    };
    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", leave);
    return () => {
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, [tilt, stage, enabled]);
}
