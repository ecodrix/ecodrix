"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/icons";

export interface SearchEntry {
  /** Where the hit goes, e.g. `/api/crm-leads#leads`. */
  href: string;
  title: string;
  /** Section name, or the method of an endpoint. */
  kind: string;
  hint: string;
}

/** True when a key press belongs to a field the reader is typing in. */
const typing = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

/**
 * Find a help article, API section or release from any docs page: every word
 * has to match. "/" or ⌘K / Ctrl+K focuses it (never while typing elsewhere);
 * Escape clears it.
 */
export function DocsSearch({ entries, onPick }: { entries: SearchEntry[]; onPick?: () => void }) {
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const listId = useId();
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const hits = words.length
    ? entries
        .filter((e) => {
          const hay = `${e.title} ${e.kind} ${e.hint}`.toLowerCase();
          return words.every((w) => hay.includes(w));
        })
        .slice(0, 8)
    : [];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!input.current?.offsetParent) return;
      const slash = e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey && !typing(e.target);
      if (slash || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        input.current.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <search className="relative block">
      <label htmlFor={`${listId}-q`} className="sr-only">
        Search the docs
      </label>
      <Icon
        name="search"
        size={16}
        variant="line"
        className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-subtle"
      />
      <input
        ref={input}
        id={`${listId}-q`}
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && setQ("")}
        placeholder="Search the docs"
        aria-controls={listId}
        autoComplete="off"
        aria-keyshortcuts="/"
        className="peer h-10 w-full rounded-full bg-background pr-10 pl-10 text-[14px] border border-border-soft outline-none placeholder:text-subtle focus:border-accent focus:bg-surface focus-visible:ring-2 focus-visible:ring-accent/30"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded-[4px] border border-border-soft bg-surface px-1.5 font-sans text-[11px] text-subtle sm:block peer-focus:hidden"
      >
        /
      </span>
      <div id={listId} aria-live="polite" className={words.length ? "" : "sr-only"}>
        {words.length > 0 && (
          <div className="absolute inset-x-0 top-[calc(100%+6px)] z-50 rounded-[12px] border border-border-soft bg-surface p-1.5 sm:min-w-[min(420px,90vw)]">
            {hits.length ? (
              <ul>
                {hits.map((h) => (
                  <li key={h.href}>
                    <a
                      href={h.href}
                      onClick={() => {
                        setQ("");
                        onPick?.();
                      }}
                      className="flex flex-col gap-0.5 rounded-[8px] px-3 py-2 hover:bg-sunken focus-visible:bg-sunken focus-visible:outline-none"
                    >
                      <span className="text-[14px] font-semibold">
                        <span className="mr-1.5 font-mono text-[12px] text-accent">{h.kind}</span>
                        {h.title}
                      </span>
                      <span className="line-clamp-1 text-[12.5px] text-muted-foreground">{h.hint}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-3 py-2 text-[13.5px] text-muted-foreground">Nothing matches “{q}”.</p>
            )}
          </div>
        )}
      </div>
    </search>
  );
}
