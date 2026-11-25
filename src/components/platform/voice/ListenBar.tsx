"use client";

import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { INDIC_FONT } from "./LangTabs";
import { FOCUS, fmt } from "./PlayerRow";
import { useVoiceLang } from "./use-voice-lang";
import { LANGS } from "./voice-calls";
import { pickLang } from "./voice-clips";
import { scrollToId } from "./voice-nav";
import { toggle, usePlayer } from "./voice-player";

/** Now-playing strip: pinned to the bottom on phones, under the switch bar from 720px. */
function NowBar() {
  const st = usePlayer();
  if (!st || st.error) return null;
  return (
    <div className="fixed inset-x-2 bottom-2 z-40 flex min-h-14 items-center gap-2 rounded-2xl border border-white/25 bg-blue-800 py-1.5 pr-1.5 pl-4 text-white min-[720px]:absolute min-[720px]:inset-x-0 min-[720px]:top-[calc(100%+8px)] min-[720px]:bottom-auto">
      <span className="min-w-0 flex-1 truncate text-[15px] font-bold">{st.label}</span>
      <span className="text-[13px] whitespace-nowrap text-on-navy-link tabular-nums max-[419px]:hidden">
        {fmt(st.t)} / {fmt(st.dur)}
      </span>
      <button
        type="button"
        onClick={() => scrollToId(st.domId, "center")}
        className="min-h-11 cursor-pointer px-2 text-[14px] font-semibold underline underline-offset-[3px] focus-visible:outline-2 focus-visible:outline-white"
      >
        Go to it
      </button>
      <button
        type="button"
        aria-label={`${st.playing ? "Pause" : "Play"} ${st.label}`}
        onClick={() => toggle(st)}
        className="grid size-11 flex-none cursor-pointer place-items-center rounded-full bg-white text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <Icon name={st.playing ? "pause" : "play"} size={18} variant="solid" />
      </button>
    </div>
  );
}

/** Keeps the last card clear of the phone strip while a clip is active. */
export function NowSpacer() {
  const st = usePlayer();
  return st && !st.error ? <div aria-hidden="true" className="h-[72px] min-[720px]:hidden" /> : null;
}

/** "Hear it in" language switch, sticky under the site header, with the now-playing strip. */
export function ListenBar() {
  const lang = useVoiceLang();
  return (
    <div className="sticky top-[var(--header-h)] z-40 border-b border-border bg-background px-gutter">
      <div className="relative mx-auto flex min-h-14 w-full max-w-wrap items-center gap-3">
        <span id="hear-in" className="text-[15px] font-semibold text-muted-foreground max-[399px]:hidden">
          Hear it in
        </span>
        {/* biome-ignore lint/a11y/useSemanticElements: a fieldset adds a legend box the pill switch cannot style away */}
        <div
          role="group"
          aria-labelledby="hear-in"
          className="grid w-fit max-w-full grid-cols-3 gap-1 rounded-full border border-border-strong bg-surface p-1"
        >
          {LANGS.map((l) => (
            <button
              key={l.id}
              type="button"
              lang={l.id}
              aria-pressed={l.id === lang}
              onClick={() => pickLang(l.id)}
              style={l.id === "en" ? undefined : INDIC_FONT}
              className={cn(
                "min-h-11 min-w-11 cursor-pointer rounded-full px-4 py-1.5 text-[16px] font-semibold whitespace-nowrap",
                l.id === lang ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-sunken",
                FOCUS,
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
        <NowBar />
      </div>
    </div>
  );
}
