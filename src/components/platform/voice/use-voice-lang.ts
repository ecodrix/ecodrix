"use client";

import { useSyncExternalStore } from "react";
import type { Lang } from "./voice-calls";

const KEY = "erix-voice-lang";
const subs = new Set<() => void>();
let lang: Lang = "en";

// Client only: server render and hydration use "en" (getServerSnapshot), then this value takes over.
if (typeof window !== "undefined") {
  try {
    const saved = window.localStorage.getItem(KEY);
    if (saved === "en" || saved === "hi" || saved === "te") lang = saved;
  } catch {
    // Storage blocked: the choice just lasts until reload.
  }
}

export function setVoiceLang(next: Lang) {
  if (next === lang) return;
  lang = next;
  try {
    window.localStorage.setItem(KEY, next);
  } catch {
    // Storage blocked: keep the in-memory choice.
  }
  for (const f of subs) f();
}

/** One language for every voice gallery on the page; remembered in localStorage. */
export function useVoiceLang(): Lang {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => lang,
    () => "en",
  );
}
