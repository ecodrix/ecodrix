"use client";

import { type KeyboardEvent, useRef } from "react";
import { cn } from "@/lib/utils";
import { LANGS, type Lang } from "./voice-calls";

/** The site self-hosts Latin subsets only: Indic text falls back to system fonts, no downloads. */
export const INDIC_FONT = {
  fontFamily:
    'var(--font-manrope), "Noto Sans Devanagari", "Noto Sans Telugu", "Noto Sans Tamil", "Noto Sans Kannada", "Noto Sans Malayalam", "Nirmala UI", system-ui, sans-serif',
} as const;

/** Language tablist (arrow keys, roving tabindex). `prefix` keeps tab ids unique per gallery; `controls` is the panel id. */
export function LangTabs({
  lang,
  onPick,
  label,
  prefix,
  controls,
}: {
  lang: Lang;
  onPick: (l: Lang) => void;
  label: string;
  prefix: string;
  controls: string;
}) {
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const i = (LANGS.findIndex((x) => x.id === lang) + step + LANGS.length) % LANGS.length;
    onPick(LANGS[i].id);
    tabs.current[i]?.focus();
  };
  return (
    <div
      role="tablist"
      aria-label={label}
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
            id={`${prefix}-${l.id}`}
            aria-controls={controls}
            aria-selected={on}
            tabIndex={on ? 0 : -1}
            lang={l.id}
            style={l.id === "en" ? undefined : INDIC_FONT}
            onClick={() => onPick(l.id)}
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
  );
}
