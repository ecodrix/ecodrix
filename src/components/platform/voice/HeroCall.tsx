"use client";

import { cn } from "@/lib/utils";
import { INDIC_FONT } from "./LangTabs";
import { ClipError, FOCUS, PlayerRow } from "./PlayerRow";
import { useVoiceLang } from "./use-voice-lang";
import { CallMeta, lineAt, VoiceLinks } from "./VoiceGallery";
import { AUDIO, CALLS, LANGS, speakerLabel } from "./voice-calls";
import { callClip } from "./voice-clips";
import { play, usePlayer } from "./voice-player";

/** The first call (the dental clinic) shown inside the hero frame: same clip id as its card below, so both views move together. */
export function HeroCall() {
  const lang = useVoiceLang();
  const c = CALLS[0];
  const audio = AUDIO[c.id][lang];
  const clip = callClip(c.id, lang);
  const st = usePlayer(clip.id);
  const cur = st && !st.error ? lineAt(audio.segs, st.t) : -1;
  return (
    <div className="p-4 text-foreground">
      <CallMeta c={c} playing={!!st?.playing} />
      <p className="mt-2 mb-1 font-display text-[20px] leading-tight font-bold text-foreground">{c.title}</p>
      <div className="mb-3">
        <VoiceLinks c={c} lang={lang} />
      </div>
      <PlayerRow clip={clip} peaks={audio.peaks} idPrefix="hero" />
      <ClipError id={clip.id} />
      {/* All three languages share one grid cell, so the frame is as tall as the longest and a language switch moves nothing. */}
      <div className="mt-3 grid">
        {LANGS.map(({ id }) => (
          <div
            key={id}
            lang={id}
            inert={id !== lang}
            style={id === "en" ? undefined : INDIC_FONT}
            className={cn(
              "col-start-1 row-start-1 grid content-start justify-items-start gap-1.5",
              id !== lang && "invisible",
            )}
          >
            {c.lines[id].map(([who, text], i) => (
              <button
                key={`${who}-${text}`}
                type="button"
                onClick={() => play(clip, audio.segs[i]?.[1] ?? 0)}
                aria-current={id === lang && cur === i ? "true" : undefined}
                className={cn(
                  "flex min-h-11 w-fit max-w-[92%] cursor-pointer flex-col items-start rounded-xl px-3 py-1.5 text-left text-[15px] leading-normal [overflow-wrap:anywhere]",
                  who === "r"
                    ? "justify-self-end bg-surface-white shadow-[inset_0_0_0_1px_var(--border)]"
                    : "bg-sunken",
                  id === lang && cur === i && "bg-accent-muted shadow-[inset_0_0_0_2px_var(--accent)]",
                  FOCUS,
                )}
              >
                {who !== "e" && (
                  <span
                    lang="en"
                    className={cn(
                      "flex items-center gap-1.5 text-[12px] font-bold",
                      who === "r" ? "text-ai" : "text-muted-foreground",
                    )}
                  >
                    {who === "r" && <span aria-hidden="true" className="size-2.5 rounded-full bg-ai" />}
                    {speakerLabel(who)}
                  </span>
                )}
                {text}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
