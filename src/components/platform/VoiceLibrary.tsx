"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { LangTabs } from "./LangTabs";
import { useGalleryPlayer } from "./use-gallery-player";
import type { Lang } from "./voice-calls";
import audioJson from "./voice-library.audio.json";
import libraryJson from "./voice-library.json";

type Clip = { src: string; dur: number; peaks: readonly number[] };
const VOICES = libraryJson.voices as string[];
const CLIPS = audioJson as unknown as Record<string, Record<Lang, Clip>>;
const GRID_ID = "voice-library-grid";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;

/** Every selectable voice in one language, each playable on the page's shared player. */
export function VoiceLibrary() {
  const [lang, setLang] = useState<Lang>("en");
  const { view, play, stop } = useGalleryPlayer();
  const pick = (l: Lang) => {
    stop();
    setLang(l);
  };

  return (
    <>
      <LangTabs lang={lang} onPick={pick} label="Sample language" prefix="vtab" controls={GRID_ID} />
      <ul
        id={GRID_ID}
        role="tabpanel"
        aria-labelledby={`vtab-${lang}`}
        className="mt-6 grid grid-cols-2 gap-3 min-[640px]:grid-cols-3 min-[1024px]:grid-cols-4 min-[1280px]:grid-cols-6"
      >
        {VOICES.map((v) => {
          const clip = CLIPS[v][lang];
          const own = view?.id === v ? view : null;
          const playing = !!own?.playing;
          const lit = own ? Math.round((own.t / clip.dur) * clip.peaks.length) : 0;
          return (
            <li
              key={`${lang}-${v}`}
              className={cn(
                "flex flex-col gap-3 rounded-xl border bg-surface p-3.5 transition-[border-color] duration-300 motion-reduce:transition-none",
                playing ? "border-ai/45" : "border-border",
              )}
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-display text-[16px] leading-tight font-semibold">{v}</h3>
                <span className="text-[13px] font-medium text-subtle tabular-nums">
                  {fmt(own ? Math.max(0, clip.dur - own.t) : clip.dur)}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  aria-label={`${playing ? "Pause" : "Play"} ${v}`}
                  onClick={() => play(v, clip.src, clip.dur)}
                  className="grid size-9 flex-none cursor-pointer place-items-center rounded-full bg-accent text-accent-foreground transition-transform duration-150 hover:scale-105 hover:bg-accent-hover active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100"
                >
                  <Icon name={playing ? "pause" : "play"} size={14} variant="solid" />
                </button>
                <div aria-hidden="true" className="flex h-8 min-w-0 flex-1 items-center justify-between gap-px">
                  {clip.peaks.map((h, i) => (
                    <i
                      // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length decorative bars
                      key={i}
                      style={{ height: `${Math.round(h * 100)}%` }}
                      className={cn(
                        "min-w-px max-w-1 flex-1 rounded-sm transition-colors duration-150 motion-reduce:transition-none",
                        i < lit ? "bg-ai" : "bg-ai/35",
                      )}
                    />
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
