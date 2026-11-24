"use client";

import { useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/icons";
import type { CodeSample as Sample } from "@/lib/docs/docs";
import { cn } from "@/lib/utils";

/* The reader's language (TypeScript SDK or cURL), shared by every sample on the
   page and remembered in this browser. */
const KEY = "erix-docs-lang";
const listeners = new Set<() => void>();
function readLang() {
  try {
    return localStorage.getItem(KEY) ?? "ts";
  } catch {
    return "ts";
  }
}
function setLang(lang: string) {
  try {
    localStorage.setItem(KEY, lang);
  } catch {
    // Storage off: the choice lasts until the page reloads.
  }
  current = lang;
  for (const l of listeners) l();
}
let current: string | null = null;
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const snapshot = () => (current ??= readLang());

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label={label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          // Clipboard blocked: the text stays selectable.
        }
      }}
      className="inline-flex h-7 items-center gap-1 rounded-full px-2 text-[12.5px] font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
    >
      <Icon name={done ? "check" : "copy"} size={13} variant="line" />
      <span aria-live="polite">{done ? "Copied" : "Copy"}</span>
    </button>
  );
}

/** A code block; with `ts` + `curl` tabs it follows the page's language choice. */
export function CodeSample({ sample }: { sample: Sample }) {
  const lang = useSyncExternalStore(subscribe, snapshot, () => "ts");
  const tabbed = sample.tabs.length > 1;
  const active = sample.tabs.find((t) => t.lang === lang) ?? sample.tabs[0];
  return (
    <figure className="overflow-hidden rounded-[12px] bg-[#0e1424] text-white shadow-[var(--shadow-card)]">
      <figcaption className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-1.5">
        {tabbed ? (
          <div role="tablist" aria-label={`${sample.label}: code language`} className="flex gap-1">
            {sample.tabs.map((t) => (
              <button
                key={t.lang}
                type="button"
                role="tab"
                aria-selected={t === active}
                onClick={() => setLang(t.lang)}
                className={cn(
                  "h-7 rounded-full px-2.5 text-[12.5px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-white",
                  t === active ? "bg-white/12 text-white" : "text-white/60 hover:text-white",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        ) : (
          <span className="px-1 text-[12.5px] font-semibold text-white/70">{sample.label}</span>
        )}
        <CopyButton text={active.code} label={`Copy ${sample.label}`} />
      </figcaption>
      {/* biome-ignore lint/a11y/noNoninteractiveTabindex: scrollable code must be reachable by keyboard */}
      <pre
        tabIndex={0}
        role={tabbed ? "tabpanel" : undefined}
        className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed"
      >
        <code>{active.code}</code>
      </pre>
    </figure>
  );
}
