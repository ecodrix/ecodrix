"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type PlayerView = { id: string; t: number; playing: boolean };

/** One audio element for the whole page: starting a clip in any gallery stops the one playing in another. */
let el: HTMLAudioElement | null = null;
let stopOwner: (() => void) | null = null;

/** Play/pause/stop for one gallery; `view` is the active clip's id and `audio.currentTime`, updated every frame. */
export function useGalleryPlayer() {
  const [view, setView] = useState<PlayerView | null>(null);
  const run = useRef<{ id: string; raf: number; paused: boolean } | null>(null);

  const stop = useCallback(() => {
    const r = run.current;
    if (!r) return;
    cancelAnimationFrame(r.raf);
    el?.pause();
    run.current = null;
    if (stopOwner === stop) stopOwner = null;
    setView(null);
  }, []);

  const loop = useCallback(() => {
    const r = run.current;
    if (!r || !el || r.paused) return;
    setView({ id: r.id, t: el.currentTime, playing: true });
    r.raf = requestAnimationFrame(loop);
  }, []);

  const play = useCallback(
    (id: string, src: string, dur: number) => {
      const r = run.current;
      if (r && el && r.id === id) {
        // Same clip: pause or resume.
        r.paused = !r.paused;
        setView((v) => v && { ...v, playing: !r.paused });
        if (r.paused) el.pause();
        else {
          el.play().catch(stop);
          r.raf = requestAnimationFrame(loop);
        }
        return;
      }
      stopOwner?.();
      const next = { id, raf: 0, paused: false };
      run.current = next;
      stopOwner = stop;
      setView({ id, t: 0, playing: true });
      const e = el ?? new Audio();
      el = e;
      e.preload = "none";
      e.onended = () => {
        // Land on the last line with the full wave and 0:00 left.
        setView({ id, t: dur, playing: false });
        run.current = null;
        stopOwner = null;
        cancelAnimationFrame(next.raf);
      };
      e.src = src;
      e.currentTime = 0;
      e.play().catch(stop);
      next.raf = requestAnimationFrame(loop);
    },
    [loop, stop],
  );

  useEffect(() => () => stop(), [stop]);

  return { view, play, stop };
}
