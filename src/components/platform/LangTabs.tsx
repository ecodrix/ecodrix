"use client";

import { type KeyboardEvent, useRef } from "react";
import { segClass, segItemClass } from "@/components/ui/tabs";
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
      className={cn(segClass, "flex w-full min-[600px]:inline-flex min-[600px]:w-auto on-dark:bg-white/10")}
    >
      {LANGS.map((l, i) => (
        <button
          key={l.id}
          ref={(el) => {
            tabs.current[i] = el;
          }}
          type="button"
          role="tab"
          id={`${prefix}-${l.id}`}
          aria-controls={controls}
          aria-selected={l.id === lang}
          tabIndex={l.id === lang ? 0 : -1}
          lang={l.id}
          style={l.id === "en" ? undefined : INDIC_FONT}
          onClick={() => onPick(l.id)}
          // The shared segmented look, flat: no selected-pill shadow, white pill on navy bands.
          className={cn(
            segItemClass,
            "flex-1 min-[600px]:flex-none aria-selected:shadow-none on-dark:aria-selected:bg-white on-dark:aria-selected:text-blue-800",
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

/** The not-yet-live languages, as one quiet line that wraps below the tabs as a unit. */
export function ComingSoon() {
  return (
    <p className="text-[13px] whitespace-nowrap text-subtle" style={INDIC_FONT}>
      More samples soon: <span lang="ta">தமிழ்</span> · <span lang="kn">ಕನ್ನಡ</span> · <span lang="ml">മലയാളം</span> + 5
      more
    </p>
  );
}
