"use client";

import { voiceDomId } from "./voice-clips";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const scrollToId = (id: string, block: ScrollLogicalPosition = "start") =>
  document.getElementById(id)?.scrollIntoView({ block, behavior: reduced() ? "auto" : "smooth" });

/** Scroll to a voice's tile, focus it (no playback) and outline it briefly. Returns false when this page has no library. */
export function showVoice(code: string) {
  const t = document.getElementById(voiceDomId(code));
  if (!t) return false;
  t.scrollIntoView({ block: "center", behavior: reduced() ? "auto" : "smooth" });
  t.focus({ preventScroll: true });
  t.dataset.mark = "";
  setTimeout(() => delete t.dataset.mark, 1600);
  return true;
}
