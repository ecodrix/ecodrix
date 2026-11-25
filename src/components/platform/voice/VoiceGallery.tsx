"use client";

import Link from "next/link";
import { Fragment, type RefObject, useEffect, useRef, useState } from "react";
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

/** Top of a card: trade, call kind and outcome. The equalizer keeps its space while idle so playing moves nothing. */
function CardMeta({ c, playing }: { c: Call; playing: boolean }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <p className="text-[15px] leading-tight font-bold text-foreground">{c.ind}</p>
        <p className="mt-1 flex h-4 items-center gap-2 text-[13px] text-muted-foreground">
          {c.dir}
          <span aria-hidden="true" className={cn("inline-flex h-3.5 items-end gap-0.5", !playing && "invisible")}>
            {[0, 1, 2].map((i) => (
              <i
                key={i}
                style={{ animationDelay: `${-i * 0.3}s` }}
                className="h-full w-[3px] origin-bottom rounded-[1px] bg-accent motion-safe:animate-pulse"
              />
            ))}
          </span>
        </p>
      </div>
      <span
        className={cn(
          "inline-flex flex-none items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[13px] font-semibold whitespace-nowrap",
          c.tag[0] === "book" ? "bg-accent-muted text-accent" : "bg-background text-foreground",
        )}
      >
        <Icon name={TAG_ICON[c.tag[0]]} size={14} variant="line" />
        {c.tag[1]}
      </span>
    </div>
  );
}

/** A compact card: the title takes the spare height, so players line up along a row whatever the title or voices need. */
function CallCard({
  c,
  lang,
  audio,
  open,
  onToggle,
}: {
  c: Call;
  lang: Lang;
  audio: Audio;
  open: boolean;
  onToggle: () => void;
}) {
  const clip = callClip(c.id, lang);
  const st = usePlayer(clip.id);
  const playing = !!st?.playing;

  return (
    <article
      id={clip.domId}
      className={cn(
        "flex min-w-0 scroll-mt-24 flex-col rounded-2xl border bg-surface p-4",
        playing ? "border-accent outline outline-1 -outline-offset-2 outline-accent" : "border-border",
      )}
    >
      <CardMeta c={c} playing={playing} />
      <h3 className="mt-3 mb-3 font-display text-[18px] leading-snug font-bold tracking-[-0.01em] text-balance">
        {c.title}
      </h3>
      <div className="mt-auto">
        <div className="mb-2">
          <VoiceLinks c={c} lang={lang} />
        </div>
        <PlayerRow clip={clip} peaks={audio.peaks} idPrefix={`play-${c.id}`} compact />
        <ClipError id={clip.id} />
        <button
          type="button"
          aria-expanded={open}
          aria-controls={open ? `tr-${c.id}` : undefined}
          onClick={onToggle}
          className={cn(
            "mt-1 -mb-1 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-1 text-[15px] font-semibold text-accent",
            FOCUS,
          )}
        >
          {open ? "Hide transcript" : "Show transcript"}
          <Icon name="chevron-down" size={14} variant="line" className={cn(open && "rotate-180")} />
        </button>
      </div>
    </article>
  );
}

/** The opened transcript: a full-width panel under the card's row, so its lines never get squeezed into a narrow card or stretch the cards beside it. */
function Transcript({ c, lang, audio, onClose }: { c: Call; lang: Lang; audio: Audio; onClose: () => void }) {
  const clip = callClip(c.id, lang);
  const st = usePlayer(clip.id);
  const cur = st && !st.error ? lineAt(audio.segs, st.t) : -1;
  return (
    <section
      id={`tr-${c.id}`}
      aria-labelledby={`tr-${c.id}-h`}
      lang={lang}
      className="col-span-full rounded-2xl border border-border bg-surface p-4 min-[900px]:p-5"
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4">
        <h3 id={`tr-${c.id}-h`} lang="en" className="text-[15px] font-bold">
          {c.ind}: {c.title}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className={cn(
            "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-1 text-[15px] font-semibold text-accent",
            FOCUS,
          )}
        >
          Hide transcript
          <Icon name="chevron-down" size={14} variant="line" className="rotate-180" />
        </button>
      </div>
      <ol className="grid max-w-3xl list-none gap-0.5" style={lang === "en" ? undefined : INDIC_FONT}>
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
    </section>
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

/** Columns the grid shows right now, read from CSS so the breakpoints live in one place (the class below). */
function useColumns(ref: RefObject<HTMLElement | null>) {
  const [cols, setCols] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => setCols(getComputedStyle(el).gridTemplateColumns.split(" ").length || 1);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return cols;
}

/** The call cards (`limit` for a teaser) on the page's one player; `tabs` adds its own language tabs for pages without the switch bar. */
export function VoiceGallery({ limit = CALLS.length, tabs = true }: { limit?: number; tabs?: boolean }) {
  const lang = useVoiceLang();
  const grid = useRef<HTMLDivElement>(null);
  const cols = useColumns(grid);
  // Open transcripts, kept here (not per card) so a panel can sit under the end of its card's row.
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const flip = (id: string) => setOpen((o) => ({ ...o, [id]: !o[id] }));
  const calls = CALLS.slice(0, limit);
  return (
    <>
      {tabs && <LangTabs lang={lang} onPick={pickLang} label="Call language" prefix="tab" controls={GRID_ID} />}
      <div
        ref={grid}
        id={GRID_ID}
        {...(tabs ? { role: "tabpanel", "aria-labelledby": `tab-${lang}` } : {})}
        className={cn(
          "grid grid-cols-1 gap-3 min-[600px]:grid-cols-2 min-[1200px]:grid-cols-4",
          // A teaser of four stays 2 + 2 in between, so no card sits alone on a row.
          limit > 4 && "min-[900px]:grid-cols-3",
          tabs && "mt-6",
        )}
      >
        {calls.map((c, i) => {
          const endOfRow = (i + 1) % cols === 0 || i === calls.length - 1;
          return (
            <Fragment key={c.id}>
              <CallCard c={c} lang={lang} audio={AUDIO[c.id][lang]} open={!!open[c.id]} onToggle={() => flip(c.id)} />
              {endOfRow &&
                calls
                  .slice(i - (i % cols), i + 1)
                  .filter((r) => open[r.id])
                  .map((r) => (
                    <Transcript
                      key={`tr-${r.id}`}
                      c={r}
                      lang={lang}
                      audio={AUDIO[r.id][lang]}
                      onClose={() => flip(r.id)}
                    />
                  ))}
            </Fragment>
          );
        })}
      </div>
    </>
  );
}
