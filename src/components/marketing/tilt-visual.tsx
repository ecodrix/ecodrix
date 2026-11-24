"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { useTilt } from "@/components/motion/use-tilt";

/**
 * The navy page heroes' product frame, tilted like the home hero console: a resting angle, a few degrees of
 * pointer follow over the whole band, flat while the pointer is on the frame so its demo stays clickable.
 * Off for reduced motion, touch/coarse pointers and phones (<= 900px).
 */
export function TiltVisual({ children }: { children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 901px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const sync = () => setOn(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useTilt(tilt, stage, on, { root: () => stage.current?.closest("section") });

  return (
    <div ref={stage} className="[perspective:1800px]">
      <div
        ref={tilt}
        className="[transform-style:preserve-3d] [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))]"
      >
        {children}
      </div>
    </div>
  );
}
