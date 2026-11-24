"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { INDIC_FONT, LangTabs } from "./LangTabs";
import { type PlayerView, useGalleryPlayer } from "./use-gallery-player";
import {
  AUDIO,
  type Audio,
  assistantVoice,
  CALLS,
  type Call,
  type Lang,
  type TagKind,
  voiceNumber,
  type Who,
} from "./voice-calls";

const GRID_ID = "voice-grid";

const TAG_ICON: Record<TagKind, "check" | "phone-incoming" | "phone-forwarded"> = {
  book: "check",
  back: "phone-incoming",
  hand: "phone-forwarded",
};

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;

/** Index of the line being spoken at time t: the last seg that has started, so gaps keep the previous line. */
const lineAt = (segs: readonly (readonly [Who, number, number])[], t: number) =>
  Math.max(
    0,
    segs.findLastIndex((s) => t >= s[1]),
  );

/** Each bar takes its speaker from the seg at the bar's centre time (assistant = purple, anyone else neutral). */
const barIsAssistant = (segs: readonly (readonly [Who, number, number])[], dur: number, k: number, n: number) => {
  const at = ((k + 0.5) / n) * dur;
  return segs.find((s) => at >= s[1] && at <= s[2])?.[0] === "r";
};

function Caption({ c, who, text }: { c: Call; who: Who; text: string }) {
  if (who === "e") return <>{text}</>;
  const name = who === "r" ? "Assistant" : who === "c" ? c.caller : c.human;
  return (
    <>
      <b className={cn("font-semibold", who === "r" ? "text-ai" : "text-foreground")}>{name}</b> {text}
    </>
  );
}

function CallCard({
  c,
  lang,
  audio,
  view,
  onPlay,
}: {
  c: Call;
  lang: Lang;
  audio: Audio;
  view: PlayerView | null;
  onPlay: () => void;
}) {
  const [open, setOpen] = useState(false);
  const lines = c.lines[lang];
  const t = view?.t ?? 0;
  const playing = !!view?.playing;
  const started = !!view;
  const lit = started ? Math.round((t / audio.dur) * audio.peaks.length) : 0;
  const cur = started ? lineAt(audio.segs, t) : 0;
  const voice = assistantVoice(c, lang);
  const [capWho, capText] = lines[cur];
  const label = `${playing ? "Pause" : "Play"}: ${c.title}`;

  return (
    <article
      className={cn(
        "flex flex-col gap-3.5 rounded-xl border bg-surface px-5 pt-5 pb-4 transition-[border-color] duration-300 motion-reduce:transition-none",
        playing ? "border-ai/45" : "border-border",
      )}
    >
      <div className="flex justify-between gap-3 text-[13px] font-semibold text-subtle">
        <span>{c.ind}</span>
        <span className="font-medium tabular-nums">{fmt(started ? Math.max(0, audio.dur - t) : audio.dur)}</span>
      </div>
      <h3 className="-mt-1.5 min-h-[2.6em] font-display text-[18px] leading-[1.3] font-semibold tracking-[-0.01em] text-balance">
        {c.title}
      </h3>
      <div className="flex min-w-0 items-center gap-2.5 text-[14px]">
        <span
          aria-hidden="true"
          className="grid size-7 flex-none place-items-center rounded-full bg-ai-subtle font-display text-[12px] leading-none font-semibold text-ai"
        >
          {voiceNumber(voice)}
        </span>
        <span className="min-w-0 leading-tight">
          <b className="font-semibold">Assistant</b> <span className="text-subtle">· {voice}</span>
          <span className="block truncate text-[13px] text-subtle">{c.dir}</span>
        </span>
      </div>
      <div className="flex items-center gap-3.5">
        <button
          type="button"
          aria-label={label}
          onClick={onPlay}
          className="grid size-[46px] flex-none cursor-pointer place-items-center rounded-full bg-accent text-accent-foreground transition-transform duration-150 hover:scale-105 hover:bg-accent-hover active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100"
        >
          <Icon name={playing ? "pause" : "play"} size={16} variant="solid" />
        </button>
        <div aria-hidden="true" className="flex h-10 min-w-0 flex-1 items-center justify-between gap-px">
          {audio.peaks.map((h, i) => (
            <i
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length decorative bars
              key={i}
              style={{ height: `${Math.round(h * 100)}%` }}
              className={cn(
                "min-w-px max-w-1 flex-1 rounded-sm transition-colors duration-150 motion-reduce:transition-none",
                barIsAssistant(audio.segs, audio.dur, i, audio.peaks.length)
                  ? i < lit
                    ? "bg-ai"
                    : "bg-ai/35"
                  : i < lit
                    ? "bg-muted-foreground"
                    : "bg-foreground/20",
              )}
            />
          ))}
        </div>
      </div>
      <p
        lang={lang}
        style={lang === "en" ? undefined : INDIC_FONT}
        className={cn("min-h-[2.9em] text-[14px] leading-[1.45]", started ? "text-muted-foreground" : "text-subtle")}
      >
        <Caption c={c} who={capWho} text={capText} />
      </p>
      <div className="flex items-center justify-between gap-3 border-t border-border pt-3 text-[13px]">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`tr-${c.id}`}
          onClick={() => setOpen((o) => !o)}
          className="inline-flex cursor-pointer items-center gap-1.5 py-1 font-semibold text-muted-foreground"
        >
          Transcript
          <Icon
            name="chevron-down"
            size={14}
            variant="line"
            className={cn("transition-transform duration-200 motion-reduce:transition-none", open && "rotate-180")}
          />
        </button>
        <span
          className={cn(
            "inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-[12.5px] font-semibold whitespace-nowrap",
            c.tag[0] === "book"
              ? "border-transparent bg-accent-muted text-accent on-dark:text-on-navy-link"
              : "border-border text-muted-foreground",
          )}
        >
          <Icon name={TAG_ICON[c.tag[0]]} size={14} variant="line" />
          {c.tag[1]}
        </span>
      </div>
      <ol
        id={`tr-${c.id}`}
        lang={lang}
        hidden={!open}
        style={lang === "en" ? undefined : INDIC_FONT}
        className="grid gap-2 text-[14px] leading-[1.45] text-muted-foreground"
      >
        {lines.map(([who, text], i) => (
          <li
            // biome-ignore lint/suspicious/noArrayIndexKey: static transcript, order never changes
            key={i}
            className={cn(who === "e" && "text-[12.5px] text-subtle", started && cur === i && "text-foreground")}
          >
            <Caption c={c} who={who} text={text} />
          </li>
        ))}
      </ol>
    </article>
  );
}

/** Language tabs plus the call cards (`limit` for a teaser), on the page's shared player. */
export function VoiceGallery({ limit = CALLS.length }: { limit?: number }) {
  const [lang, setLang] = useState<Lang>("en");
  const { view, play, stop } = useGalleryPlayer();
  const pick = (l: Lang) => {
    stop();
    setLang(l);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <LangTabs lang={lang} onPick={pick} label="Call language" prefix="tab" controls={GRID_ID} />
        <p className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-[15px] text-subtle" style={INDIC_FONT}>
          <b className="text-[13px] font-semibold">Coming soon</b>
          <span lang="ta">தமிழ்</span>
          <span lang="kn">ಕನ್ನಡ</span>
          <span lang="ml">മലയാളം</span>
          <span>and 5 more</span>
        </p>
      </div>
      <div
        id={GRID_ID}
        role="tabpanel"
        aria-labelledby={`tab-${lang}`}
        className="mt-6 grid grid-cols-1 gap-4 min-[640px]:grid-cols-2 min-[1200px]:grid-cols-4"
      >
        {CALLS.slice(0, limit).map((c) => {
          const a = AUDIO[c.id][lang];
          return (
            <CallCard
              key={`${lang}-${c.id}`}
              c={c}
              lang={lang}
              audio={a}
              view={view?.id === c.id ? view : null}
              onPlay={() => play(c.id, a.src, a.dur)}
            />
          );
        })}
      </div>
    </>
  );
}
