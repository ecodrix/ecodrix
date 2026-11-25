"use client";

import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { INDIC_FONT, LangTabs } from "./LangTabs";
import { FOCUS, fmt } from "./PlayerRow";
import { useVoiceLang } from "./use-voice-lang";
import { type LANG_NAME, pickLang, voiceClip, voiceDomId } from "./voice-clips";
import libraryJson from "./voice-library.json";
import { voiceName } from "./voice-names";
import { toggle, usePlayer } from "./voice-player";

const GRID_ID = "voice-library-grid";
/** Tiles are ordered by the name people see, not by code. */
const VOICES = [...(libraryJson.voices as string[])].sort((a, b) => voiceName(a).localeCompare(voiceName(b)));

function Tile({ code, lang }: { code: string; lang: keyof typeof LANG_NAME }) {
  const clip = voiceClip(code, lang);
  const st = usePlayer(clip.id);
  const playing = !!st?.playing;
  const err = !!st?.error;
  return (
    <li>
      <button
        type="button"
        id={voiceDomId(code)}
        aria-label={
          err
            ? `Play ${clip.label}. It could not load, press to try again`
            : `${playing ? "Pause" : "Play"} ${clip.label}`
        }
        onClick={() => toggle(clip)}
        className={cn(
          "relative flex min-h-16 w-full scroll-mt-32 cursor-pointer items-center gap-2.5 overflow-hidden rounded-xl border bg-surface px-2.5 py-2 text-left text-foreground",
          "data-[mark]:outline-2 data-[mark]:outline-offset-2 data-[mark]:outline-accent",
          playing ? "border-accent bg-accent-muted" : err ? "border-error" : "border-border",
          FOCUS,
        )}
      >
        <span
          aria-hidden="true"
          className="grid size-11 flex-none place-items-center rounded-full bg-accent text-accent-foreground"
        >
          {st?.loading ? (
            <span className="size-[18px] animate-spin rounded-full border-[3px] border-current border-t-transparent" />
          ) : (
            <Icon name={playing ? "pause" : "play"} size={18} variant="solid" />
          )}
        </span>
        <span className="min-w-0">
          <span className="block text-[15px] leading-tight font-semibold">{voiceName(code)}</span>
          <span
            className={cn(
              "block text-[13px] leading-tight",
              err ? "font-semibold text-error" : "text-muted-foreground tabular-nums",
            )}
          >
            {err ? "Could not load" : fmt(st ? clip.dur - st.t : clip.dur)}
          </span>
        </span>
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-[3px] bg-accent"
          style={{ width: `${st ? Math.min(100, (st.t / clip.dur) * 100) : 0}%` }}
        />
      </button>
    </li>
  );
}

/** The sentence every voice says, and one tile per voice: the page's shared player plays them. `tabs` adds language tabs for pages without the switch bar. */
export function VoiceLibrary({ tabs }: { tabs?: boolean }) {
  const lang = useVoiceLang();
  return (
    <>
      {tabs && <LangTabs lang={lang} onPick={pickLang} label="Sample language" prefix="vtab" controls={GRID_ID} />}
      <p
        lang={lang}
        style={lang === "en" ? undefined : INDIC_FONT}
        className="mb-4 rounded-xl border border-l-[3px] border-border border-l-ai bg-surface px-4 py-3 text-[17px] leading-[1.7] [overflow-wrap:anywhere]"
      >
        {libraryJson.lines[lang]}
      </p>
      <ul
        id={GRID_ID}
        className="grid list-none grid-cols-2 gap-2 min-[600px]:grid-cols-3 min-[900px]:grid-cols-4 min-[1200px]:grid-cols-6"
      >
        {VOICES.map((v) => (
          <Tile key={`${lang}-${v}`} code={v} lang={lang} />
        ))}
      </ul>
    </>
  );
}
