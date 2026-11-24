"use client";

import { type KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";
import {
  AUDIO,
  type Audio,
  assistantName,
  CALLS,
  type Call,
  LANGS,
  type Lang,
  type TagKind,
  type Who,
} from "./voice-calls";

const GRID_ID = "voice-grid";

/** The site self-hosts Latin subsets only: Indic text falls back to system fonts, no downloads. */
const INDIC_FONT = {
  fontFamily:
    'var(--font-manrope), "Noto Sans Devanagari", "Noto Sans Telugu", "Noto Sans Tamil", "Noto Sans Kannada", "Noto Sans Malayalam", "Nirmala UI", system-ui, sans-serif',
} as const;

const TAG_ICON: Record<TagKind, "check" | "phone-incoming" | "phone-forwarded"> = {
  book: "check",
  back: "phone-incoming",
  hand: "phone-forwarded",
};

type View = { id: string; t: number; playing: boolean };

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

function Caption({ c, lang, who, text }: { c: Call; lang: Lang; who: Who; text: string }) {
  if (who === "e") return <>{text}</>;
  const name = who === "r" ? assistantName(c, lang) : who === "c" ? c.caller : c.human;
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
  view: View | null;
  onPlay: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const lines = c.lines[lang];
  const t = view?.t ?? 0;
  const playing = !!view?.playing;
  const started = !!view;
  const lit = started ? Math.round((t / audio.dur) * audio.peaks.length) : 0;
  const cur = started ? lineAt(audio.segs, t) : 0;
  const name = assistantName(c, lang);
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
          className="grid size-7 flex-none place-items-center rounded-full bg-ai-subtle font-display text-[13px] leading-none font-semibold text-ai"
        >
          {name.charAt(0)}
        </span>
        <span className="min-w-0 leading-tight">
          <b className="font-semibold">{name}</b>
          <span className="block truncate text-[13px] text-subtle">{c.dir}</span>
        </span>
      </div>
      <div className="flex items-center gap-3.5">
        <button
          type="button"
          aria-label={label}
          onClick={() => onPlay(c.id)}
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
        <Caption c={c} lang={lang} who={capWho} text={capText} />
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
              ? "border-transparent bg-accent-muted text-accent"
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
            <Caption c={c} lang={lang} who={who} text={text} />
          </li>
        ))}
      </ol>
    </article>
  );
}

/** Language tabs plus six call cards. One audio element and one timer serve the whole gallery. */
export function VoiceGallery() {
  const [lang, setLang] = useState<Lang>("en");
  const [view, setView] = useState<View | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const run = useRef<{ id: string; raf: number; paused: boolean } | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const stop = useCallback((done?: boolean) => {
    const r = run.current;
    if (!r) return;
    cancelAnimationFrame(r.raf);
    audio.current?.pause();
    run.current = null;
    setView((v) => (done && v ? { ...v, playing: false } : null));
  }, []);

  const loop = useCallback(() => {
    const r = run.current;
    const el = audio.current;
    if (!r || !el || r.paused) return;
    setView({ id: r.id, t: el.currentTime, playing: true });
    r.raf = requestAnimationFrame(loop);
  }, []);

  const play = useCallback(
    (id: string) => {
      const r = run.current;
      const el = audio.current;
      if (r && el && r.id === id) {
        // Same card: pause or resume.
        r.paused = !r.paused;
        setView((v) => v && { ...v, playing: !r.paused });
        if (r.paused) el.pause();
        else {
          el.play().catch(() => stop());
          r.raf = requestAnimationFrame(loop);
        }
        return;
      }
      stop();
      const a = AUDIO[id][lang];
      const next = { id, raf: 0, paused: false };
      run.current = next;
      setView({ id, t: 0, playing: true });
      const e = el ?? new Audio();
      audio.current = e;
      e.preload = "none";
      e.onended = () => {
        // Land on the last line with the full wave and 0:00 left.
        setView({ id, t: a.dur, playing: false });
        run.current = null;
        cancelAnimationFrame(next.raf);
      };
      e.src = a.src;
      e.currentTime = 0;
      e.play().catch(() => stop());
      next.raf = requestAnimationFrame(loop);
    },
    [lang, loop, stop],
  );

  useEffect(() => () => stop(), [stop]);

  const pick = (l: Lang, focus?: boolean) => {
    stop();
    setLang(l);
    if (focus) tabs.current[LANGS.findIndex((x) => x.id === l)]?.focus();
  };
  const onKey = (e: KeyboardEvent) => {
    const i = LANGS.findIndex((x) => x.id === lang);
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    pick(LANGS[(i + step + LANGS.length) % LANGS.length].id, true);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <div
          role="tablist"
          aria-label="Call language"
          onKeyDown={onKey}
          className="inline-flex gap-1 rounded-2xl border border-border bg-surface p-[5px]"
        >
          {LANGS.map((l, i) => {
            const on = l.id === lang;
            return (
              <button
                key={l.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${l.id}`}
                aria-controls={GRID_ID}
                aria-selected={on}
                tabIndex={on ? 0 : -1}
                lang={l.id}
                style={l.id === "en" ? undefined : INDIC_FONT}
                onClick={() => pick(l.id)}
                className={cn(
                  "h-11 cursor-pointer rounded-full px-[18px] text-[17px] font-semibold transition-colors duration-200 motion-reduce:transition-none",
                  on ? "bg-foreground text-background" : "text-muted-foreground hover:bg-sunken hover:text-foreground",
                )}
              >
                {l.label}
              </button>
            );
          })}
        </div>
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
        {CALLS.map((c) => (
          <CallCard
            key={`${lang}-${c.id}`}
            c={c}
            lang={lang}
            audio={AUDIO[c.id][lang]}
            view={view?.id === c.id ? view : null}
            onPlay={play}
          />
        ))}
      </div>
    </>
  );
}
