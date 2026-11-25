"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { INDIC_FONT, LangTabs } from "./LangTabs";
import { ClipError, FOCUS, PlayerRow } from "./PlayerRow";
import { useVoiceLang } from "./use-voice-lang";
import {
  AUDIO,
  type Audio,
  CALLS,
  type Call,
  callVoices,
  type Lang,
  speakerLabel,
  type TagKind,
  type Who,
} from "./voice-calls";
import { callClip, pickLang, voiceDomId } from "./voice-clips";
import { showVoice } from "./voice-nav";
import { play, usePlayer } from "./voice-player";

const GRID_ID = "voice-grid";

const TAG_ICON: Record<TagKind, "check" | "phone-incoming" | "phone-forwarded"> = {
  book: "check",
  back: "phone-incoming",
  hand: "phone-forwarded",
};

/** Index of the line being spoken at time t: the last seg that has started, so gaps keep the previous line. */
export const lineAt = (segs: Audio["segs"], t: number) =>
  Math.max(
    0,
    segs.findLastIndex((s) => t >= s[1]),
  );

/** The voices of a call as links to their tiles in the library: on this page they focus the tile, elsewhere they open it. */
export function VoiceLinks({ c, lang }: { c: Call; lang: Lang }) {
  return (
    <ul className="flex list-none flex-wrap gap-x-4">
      {callVoices(c, lang).map(({ role, code, name }) => {
        const label = `${role} ${name}, go to this voice in the library`;
        const cls = cn(
          "inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center px-0.5 text-[14px] font-bold text-accent underline underline-offset-[3px]",
          FOCUS,
        );
        return (
          <li key={role} className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <span>{role}</span>
            <Link
              href={`/platform/erix-voice/voices#${voiceDomId(code)}`}
              aria-label={label}
              onClick={(e) => {
                if (showVoice(code)) e.preventDefault();
              }}
              className={cls}
            >
              {name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function CallMeta({ c, playing }: { c: Call; playing: boolean }) {
  return (
    <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
      {playing && (
        <span aria-hidden="true" className="inline-flex h-3.5 items-end gap-0.5">
          {[0, 1, 2].map((i) => (
            <i
              key={i}
              style={{ animationDelay: `${-i * 0.3}s` }}
              className="h-full w-[3px] origin-bottom rounded-[1px] bg-accent motion-safe:animate-pulse"
            />
          ))}
        </span>
      )}
      <span className="text-[15px] font-bold text-foreground">{c.ind}</span>
      <span aria-hidden="true">·</span>
      <span>{c.dir}</span>
      <span
        className={cn(
          "ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 font-semibold whitespace-nowrap",
          c.tag[0] === "book" ? "bg-accent-muted text-accent" : "bg-background text-foreground",
        )}
      >
        <Icon name={TAG_ICON[c.tag[0]]} size={14} variant="line" />
        {c.tag[1]}
      </span>
    </div>
  );
}

function CallCard({ c, lang, audio }: { c: Call; lang: Lang; audio: Audio }) {
  const clip = callClip(c.id, lang);
  const st = usePlayer(clip.id);
  const [open, setOpen] = useState(false);
  const playing = !!st?.playing;
  // The transcript opens the moment the call starts, from this card or from the hero.
  useEffect(() => {
    if (playing) setOpen(true);
  }, [playing]);
  const cur = st && !st.error ? lineAt(audio.segs, st.t) : -1;

  return (
    <article
      id={clip.domId}
      className={cn(
        "min-w-0 scroll-mt-24 rounded-2xl border bg-surface p-4 min-[900px]:p-5",
        playing ? "border-accent outline outline-1 -outline-offset-2 outline-accent" : "border-border",
      )}
    >
      <CallMeta c={c} playing={playing} />
      <h3 className="mt-2 mb-1 font-display text-[20px] leading-tight font-bold tracking-[-0.01em]">{c.title}</h3>
      <div className="mb-3">
        <VoiceLinks c={c} lang={lang} />
      </div>
      <PlayerRow clip={clip} peaks={audio.peaks} idPrefix={`play-${c.id}`} />
      <ClipError id={clip.id} />
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`tr-${c.id}`}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "mt-2 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-1 text-[15px] font-semibold text-accent",
          FOCUS,
        )}
      >
        {open ? "Hide transcript" : "Show transcript"}
        <Icon name="chevron-down" size={14} variant="line" className={cn(open && "rotate-180")} />
      </button>
      <ol
        id={`tr-${c.id}`}
        lang={lang}
        hidden={!open}
        className="mt-2 grid list-none gap-0.5"
        style={lang === "en" ? undefined : INDIC_FONT}
      >
        <li lang="en" className="px-3 text-[13px] text-muted-foreground">
          Press a line to jump to it.
        </li>
        {c.lines[lang].map(([who, text], i) => (
          <TranscriptLine
            key={`${who}-${text}`}
            who={who}
            text={text}
            now={cur === i}
            onJump={() => play(clip, audio.segs[i]?.[1] ?? 0)}
          />
        ))}
      </ol>
    </article>
  );
}

function TranscriptLine({ who, text, now, onJump }: { who: Who; text: string; now: boolean; onJump: () => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={onJump}
        aria-current={now ? "true" : undefined}
        className={cn(
          "w-full cursor-pointer rounded-md border-l-[3px] px-3 py-2 text-left text-[17px] leading-[1.7] [overflow-wrap:anywhere] max-[420px]:block min-[421px]:grid min-[421px]:grid-cols-[80px_minmax(0,1fr)] min-[421px]:gap-2 min-h-11",
          who === "r"
            ? "border-l-ai"
            : who === "e"
              ? "border-l-accent/40 text-[15px] leading-normal text-muted-foreground"
              : "border-l-transparent",
          now && "bg-accent-muted",
          FOCUS,
        )}
      >
        {who !== "e" && (
          <span
            lang="en"
            className={cn(
              "block pt-1.5 font-sans text-[13px] font-bold max-[420px]:pt-0",
              who === "r" ? "text-ai" : "text-muted-foreground",
            )}
          >
            {speakerLabel(who)}
          </span>
        )}
        <span>{text}</span>
      </button>
    </li>
  );
}

/** The call cards (`limit` for a teaser) on the page's one player; `tabs` adds its own language tabs for pages without the switch bar. */
export function VoiceGallery({ limit = CALLS.length, tabs = true }: { limit?: number; tabs?: boolean }) {
  const lang = useVoiceLang();
  return (
    <>
      {tabs && <LangTabs lang={lang} onPick={pickLang} label="Call language" prefix="tab" controls={GRID_ID} />}
      <div
        id={GRID_ID}
        {...(tabs ? { role: "tabpanel", "aria-labelledby": `tab-${lang}` } : {})}
        className={cn("grid grid-cols-1 items-start gap-3 min-[900px]:grid-cols-2", tabs && "mt-6")}
      >
        {CALLS.slice(0, limit).map((c) => (
          <CallCard key={`${lang}-${c.id}`} c={c} lang={lang} audio={AUDIO[c.id][lang]} />
        ))}
      </div>
    </>
  );
}
