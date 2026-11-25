"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { INDIC_FONT } from "./LangTabs";
import { useVoiceLang } from "./use-voice-lang";
import type { Lang } from "./voice-calls";

/** The 11 languages in their own scripts; spellings are final. */
const WORDS = [
  ["en", "English"],
  ["hi", "हिन्दी"],
  ["te", "తెలుగు"],
  ["ta", "தமிழ்"],
  ["kn", "ಕನ್ನಡ"],
  ["ml", "മലയാളം"],
  ["mr", "मराठी"],
  ["gu", "ગુજરાતી"],
  ["bn", "বাংলা"],
  ["pa", "ਪੰਜਾਬੀ"],
  ["or", "ଓଡ଼ିଆ"],
] as const;
const ROWS = WORDS.length + 1; // a copy of the first word at the end lets the last roll land seamlessly
const START: Record<Lang, number> = { en: 0, hi: 1, te: 2 };
const FONT = {
  fontFamily:
    'var(--font-display), "Noto Sans Devanagari", "Noto Sans Telugu", "Noto Sans Tamil", "Noto Sans Kannada", "Noto Sans Malayalam", "Noto Sans Gujarati", "Noto Sans Bengali", "Noto Sans Gurmukhi", "Noto Sans Oriya", system-ui, sans-serif',
} as const;

/** Eyebrow, pause control and the h1 whose last word rolls through the languages. The slot has a fixed size, so nothing around it moves. */
export function VoiceHeroHead() {
  const lang = useVoiceLang();
  const track = useRef<HTMLSpanElement>(null);
  const idx = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const paused = useRef(false);
  const [pausedUi, setPausedUi] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const roll = (i: number, anim: boolean) => {
      const t = track.current;
      if (!t) return;
      t.style.transition = anim ? "transform .6s cubic-bezier(.7,0,.25,1)" : "none";
      t.style.transform = `translate3d(0,${(-i * 100) / ROWS}%,0)`;
    };
    const schedule = (ms: number) => {
      clearTimeout(timer.current);
      if (paused.current || mq.matches) return;
      timer.current = setTimeout(() => {
        const i = idx.current + 1;
        roll(i, true);
        if (i === WORDS.length) {
          timer.current = setTimeout(() => {
            roll(0, false);
            idx.current = 0;
            schedule(1800);
          }, 650);
        } else {
          idx.current = i;
          schedule(3000);
        }
      }, ms);
    };
    // The language switch sets the word; the roll carries on from there.
    idx.current = START[lang];
    roll(idx.current, false);
    schedule(1200);
    const toggleHook = () => schedule(600);
    window.addEventListener("voice-roller-resume", toggleHook);
    mq.addEventListener("change", toggleHook);
    return () => {
      clearTimeout(timer.current);
      window.removeEventListener("voice-roller-resume", toggleHook);
      mq.removeEventListener("change", toggleHook);
    };
  }, [lang]);

  const onPause = () => {
    paused.current = !paused.current;
    setPausedUi(paused.current);
    if (paused.current) clearTimeout(timer.current);
    else window.dispatchEvent(new Event("voice-roller-resume"));
  };

  return (
    <>
      <div className="mb-1 flex min-h-11 items-center justify-between gap-2.5 min-[1000px]:mb-3 min-[1000px]:justify-start min-[1000px]:gap-4">
        <p className="flex items-center gap-2.5 text-[16px] font-semibold text-on-navy-link">
          <span aria-hidden="true" className="size-2 flex-none rounded-full bg-hero-dot" />
          ERIX Voice
        </p>
        <button
          type="button"
          aria-pressed={pausedUi}
          aria-label="Pause the rolling words"
          onClick={onPause}
          className="grid size-11 cursor-pointer place-items-center rounded-full border border-white/30 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:hidden"
        >
          <Icon name={pausedUi ? "play" : "pause"} size={16} variant="solid" />
        </button>
      </div>
      <h1 className="font-display text-[length:clamp(30px,8.4vw,40px)] leading-[1.04] font-bold tracking-[-0.035em] text-balance text-white min-[1000px]:text-[length:clamp(36px,min(4vw,8.5vh),60px)]">
        <span className="block">Every call answered in</span>
        <span aria-hidden="true" className="block w-fit max-w-full">
          <span
            className="relative block h-[1.4em] w-fit max-w-full overflow-hidden text-[1.18em] font-semibold tracking-normal text-on-navy-link [mask-image:linear-gradient(#0000,#000_9%,#000_91%,#0000)] motion-reduce:hidden"
            style={FONT}
          >
            <span ref={track} className="grid auto-rows-[1.4em] justify-items-start will-change-transform">
              {[...WORDS, WORDS[0]].map(([l, w], i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: the last row repeats the first word
                <span key={i} lang={l} className="pr-[0.15em] leading-[1.4] whitespace-nowrap">
                  {w}
                </span>
              ))}
            </span>
          </span>
          <span className="mt-0.5 block h-[3px] w-full rounded-sm bg-on-navy-link opacity-60 motion-reduce:hidden" />
          <span className="hidden text-[1.18em] leading-[1.4] font-semibold tracking-normal text-on-navy-link motion-reduce:block">
            11 Indian languages
          </span>
        </span>
        <span className="sr-only"> 11 Indian languages</span>
      </h1>
      <ul aria-hidden="true" className="mt-3 hidden list-none flex-wrap gap-2 motion-reduce:flex" style={INDIC_FONT}>
        {WORDS.map(([l, w]) => (
          <li
            key={l}
            lang={l}
            className="rounded-full border border-white/30 px-3 py-1.5 text-[16px] font-semibold text-on-navy-link"
          >
            {w}
          </li>
        ))}
      </ul>
    </>
  );
}
