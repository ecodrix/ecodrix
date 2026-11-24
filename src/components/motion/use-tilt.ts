import { type RefObject, useEffect, useRef } from "react";

export interface TiltOptions {
  /** Degrees of tilt following the pointer (default 4). */
  max?: number;
  /** Resting X tilt in degrees (default 7). */
  rest?: number;
  /** Element whose pointer events drive the tilt (default: the stage). */
  root?: () => HTMLElement | null | undefined;
  /** True while the card should flatten (default: the pointer is on the stage). */
  flatOn?: (e: PointerEvent, stage: DOMRect) => boolean;
  /** Called on every pointer move over the root, for extras such as a spotlight. */
  onPointer?: (e: PointerEvent) => void;
  /** Called with the flatten amount 0..1 each frame. */
  onFlat?: (flat: number) => void;
}

/**
 * Pointer-follow tilt plus a flatten amount: while `flatOn` is true (default: pointer on the card) the card
 * flattens so what is inside stays usable. Writes `--rx`/`--ry` on `tilt` straight to the DOM, no re-render.
 * Shared by the home hero console and the navy page heroes (MkHero).
 */
export function useTilt(
  tilt: RefObject<HTMLElement | null>,
  stage: RefObject<HTMLElement | null>,
  enabled: boolean,
  opts: TiltOptions = {},
) {
  const o = useRef(opts);
  o.current = opts;
  useEffect(() => {
    const t = tilt.current;
    const st = stage.current;
    const root = o.current.root?.() ?? st;
    if (!t || !st || !root) return;
    if (!enabled) {
      t.style.setProperty("--rx", "0deg");
      return;
    }
    const MAX = o.current.max ?? 4;
    const REST = o.current.rest ?? 7;
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
      o.current.onFlat?.(flat);
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) + Math.abs(tflat - flat) > 0.002 ? requestAnimationFrame(frame) : 0;
    };
    const go = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const move = (e: PointerEvent) => {
      const r = st.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
      ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
      o.current.onPointer?.(e);
      const onCard = e.clientY > r.top && e.clientY < r.bottom && e.clientX > r.left && e.clientX < r.right;
      tflat = (o.current.flatOn ? o.current.flatOn(e, r) : onCard) ? 1 : 0;
      go();
    };
    const leave = () => {
      tx = ty = tflat = 0;
      go();
    };
    root.addEventListener("pointermove", move);
    root.addEventListener("pointerleave", leave);
    return () => {
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, [tilt, stage, enabled]);
}
