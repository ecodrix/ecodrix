"use client";

import { useSyncExternalStore } from "react";

/** One clip the page can play: `id` is the page-wide key, `domId` the element "Go to it" scrolls to. */
export type Clip = { id: string; domId: string; label: string; src: string; dur: number };
export type PlayerState = (Clip & { t: number; playing: boolean; loading: boolean; error: boolean }) | null;

/** One audio element and one state for the whole page: every view of a clip (hero, card, tile, strip) reads the same state. */
let audio: HTMLAudioElement | null = null;
let state: PlayerState = null;
let raf = 0;
let gen = 0; // a later play() or stop() cancels a pending seek-then-start
let loadTimer: ReturnType<typeof setTimeout> | undefined;
const subs = new Set<() => void>();

const emit = () => {
  for (const f of subs) f();
};
const patch = (p: Partial<NonNullable<PlayerState>>) => {
  if (!state) return;
  state = { ...state, ...p };
  emit();
};
const tick = () => {
  raf = 0;
  if (!state || !audio || audio.paused) return;
  patch({ t: audio.currentTime });
  raf = requestAnimationFrame(tick);
};
const startTick = () => {
  if (!raf) raf = requestAnimationFrame(tick);
};
const unload = () => {
  clearTimeout(loadTimer);
  if (!audio) return;
  audio.pause();
  audio.removeAttribute("src");
  try {
    audio.load();
  } catch {
    // Nothing to unload.
  }
};
const fail = () => {
  gen++;
  unload();
  patch({ playing: false, loading: false, error: true });
};

function el() {
  if (audio) return audio;
  const a = new Audio();
  a.preload = "none";
  a.addEventListener("playing", () => {
    clearTimeout(loadTimer);
    patch({ loading: false });
  });
  a.addEventListener("waiting", () => {
    if (!a.paused) patch({ loading: true });
  });
  a.addEventListener("pause", () => {
    if (state && !a.ended) patch({ playing: false });
  });
  a.addEventListener("play", () => {
    if (state) patch({ playing: true });
    startTick();
  });
  a.addEventListener("seeked", () => patch({ t: a.currentTime }));
  a.addEventListener("ended", () => {
    clearTimeout(loadTimer);
    state = null;
    emit();
  });
  a.addEventListener("error", () => {
    if (state && a.getAttribute("src")) fail();
  });
  audio = a;
  return a;
}

export function play(clip: Clip, at?: number) {
  const a = el();
  const my = ++gen;
  const same = state?.id === clip.id && state.src === clip.src && !state.error && !!a.getAttribute("src");
  if (!same) {
    a.pause();
    state = { ...clip, t: at ?? 0, playing: true, loading: true, error: false };
    emit();
    a.setAttribute("src", clip.src);
    clearTimeout(loadTimer);
    // A clip that never starts is reported, not left spinning.
    loadTimer = setTimeout(() => state?.id === clip.id && state.loading && fail(), 15000);
  } else patch({ playing: true });
  const start = () => {
    if (at != null) {
      try {
        a.currentTime = at;
      } catch {
        // Seek failed: play from where it is.
      }
    }
    // AbortError means a pause or a newer play() cut this one off: not a load failure.
    a.play().catch((e) => {
      if (e?.name !== "AbortError" && my === gen) fail();
    });
  };
  if (!same && at != null) {
    a.addEventListener(
      "loadedmetadata",
      () => {
        if (my === gen) start();
      },
      { once: true },
    );
    a.load();
  } else start();
  startTick();
}

export function toggle(clip: Clip) {
  if (state?.id === clip.id && !state.error && audio) {
    if (state.playing) audio.pause();
    else play(clip);
  } else play(clip);
}

export function seek(t: number) {
  if (!state || !audio) return;
  audio.currentTime = t;
  patch({ t });
}

export function stop() {
  gen++;
  unload();
  if (state) {
    state = null;
    emit();
  }
}

export const getPlayer = () => state;

const subscribe = (f: () => void) => {
  subs.add(f);
  return () => subs.delete(f);
};

/** The player state, or `null` when `id` is not the active clip (so idle views never re-render). */
export function usePlayer(id?: string): PlayerState {
  return useSyncExternalStore(
    subscribe,
    () => (id == null || state?.id === id ? state : null),
    () => null,
  );
}
