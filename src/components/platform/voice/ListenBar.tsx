"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { INDIC_FONT } from "./LangTabs";
import { FOCUS, fmt } from "./PlayerRow";
import { useVoiceLang } from "./use-voice-lang";
import { LANGS } from "./voice-calls";
import { pickLang } from "./voice-clips";
import { scrollToId } from "./voice-nav";
import { toggle, usePlayer } from "./voice-player";

const INLINE_ID = "listen-inline";

/** The three language buttons: one switch for every clip on the page, the hero call included. */
function LangButtons({ className }: { className?: string }) {
  const lang = useVoiceLang();
  return (
    <div className={cn("grid grid-cols-3 gap-0.5", className)}>
      {LANGS.map((l) => (
        <button
          key={l.id}
          type="button"
          lang={l.id}
          aria-pressed={l.id === lang}
          onClick={() => pickLang(l.id)}
          style={l.id === "en" ? undefined : INDIC_FONT}
          className={cn(
            "min-h-11 min-w-11 cursor-pointer rounded-full px-3.5 py-1.5 text-[16px] font-semibold whitespace-nowrap min-[420px]:px-4",
            l.id === lang ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-sunken",
            FOCUS,
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

/** Now-playing row of the dock: what plays, its time, a way back to it and pause. */
function NowRow() {
  const st = usePlayer();
  if (!st || st.error) return null;
  return (
    <div className="flex min-h-12 min-w-0 items-center gap-2 border-t border-border pl-4 min-[720px]:max-w-[420px] min-[720px]:border-t-0 min-[720px]:border-l">
      <span className="min-w-0 flex-1 truncate text-[15px] font-bold">{st.label}</span>
      <span className="text-[13px] whitespace-nowrap text-muted-foreground tabular-nums max-[419px]:hidden">
        {fmt(st.t)} / {fmt(st.dur)}
      </span>
      <button
        type="button"
        onClick={() => scrollToId(st.domId, "center")}
        className={cn(
          "min-h-11 cursor-pointer rounded-full px-2 text-[14px] font-semibold text-accent underline underline-offset-[3px]",
          FOCUS,
        )}
      >
        Go to it
      </button>
      <button
        type="button"
        aria-label={`${st.playing ? "Pause" : "Play"} ${st.label}`}
        onClick={() => toggle(st)}
        className={cn(
          "grid size-11 flex-none cursor-pointer place-items-center rounded-full bg-accent text-accent-foreground hover:bg-accent-hover",
          FOCUS,
        )}
      >
        <Icon name={st.playing ? "pause" : "play"} size={18} variant="solid" />
      </button>
    </div>
  );
}

/** The switch at rest: a pill straddling the edge where the navy hero meets the content, so the hero runs into the page with no band between. */
export function ListenBar() {
  return (
    <div
      id={INLINE_ID}
      // Transparent over the hero half, page colour under it, so the content colour starts at the hero's edge.
      className="relative z-10 -mt-[26px] bg-[linear-gradient(to_bottom,transparent_26px,var(--background)_26px)] px-gutter"
    >
      <div className="mx-auto w-full max-w-wrap">
        {/* biome-ignore lint/a11y/useSemanticElements: a fieldset adds a legend box the pill switch cannot style away */}
        <div
          role="group"
          aria-label="Hear it in"
          className="flex w-full items-center rounded-full border border-border-strong bg-surface p-1 min-[420px]:w-fit min-[420px]:pl-5"
        >
          <span aria-hidden="true" className="mr-3 text-[15px] font-semibold text-muted-foreground max-[419px]:hidden">
            Hear it in
          </span>
          <LangButtons className="max-[419px]:w-full" />
        </div>
      </div>
    </div>
  );
}

/** Floating pill at the bottom edge: the switch once the hero has scrolled away, and the now-playing row while a clip is active. Clear of the top header. */
export function ListenDock() {
  const st = usePlayer();
  const [away, setAway] = useState(false);
  const [end, setEnd] = useState(false);
  useEffect(() => {
    const watch = (id: string, on: (e: IntersectionObserverEntry) => void, margin = "0px") => {
      const el = document.getElementById(id);
      if (!el) return undefined;
      const io = new IntersectionObserver(([e]) => on(e), { rootMargin: margin });
      io.observe(el);
      return io;
    };
    // The resting switch counts as gone once it slides under the 66px header. Past the voice library nothing plays by language, so the switch leaves.
    const a = watch(INLINE_ID, (e) => setAway(!e.isIntersecting && e.boundingClientRect.top < 72), "-72px 0px 0px 0px");
    const b = watch("options", (e) => setEnd(e.isIntersecting || e.boundingClientRect.top < 0));
    return () => {
      a?.disconnect();
      b?.disconnect();
    };
  }, []);
  const now = !!st && !st.error;
  const showLang = away && !end;
  if (!now && !showLang) return null;
  return (
    <>
      <div className="pointer-events-none fixed inset-x-2 bottom-2 z-40 flex justify-center">
        <div
          className={cn(
            "pointer-events-auto flex max-w-full flex-col items-stretch rounded-[28px] border border-border bg-surface p-1 min-[720px]:flex-row min-[720px]:items-center",
            "shadow-[0_6px_18px_-10px_rgba(4,13,66,0.16),0_1px_3px_-1px_rgba(4,13,66,0.06)]",
            now && "w-full min-[720px]:w-auto",
          )}
        >
          {showLang && (
            // biome-ignore lint/a11y/useSemanticElements: same pill switch as the one at rest
            <div role="group" aria-label="Hear it in">
              <LangButtons />
            </div>
          )}
          <NowRow />
        </div>
      </div>
      {/* Keeps the end of the page clear of the now-playing row. */}
      {now && <div aria-hidden="true" className="h-[72px] max-[719px]:h-[132px]" />}
    </>
  );
}
