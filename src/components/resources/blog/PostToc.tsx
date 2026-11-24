"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import type { OutlineItem } from "@/components/resources/blog/BlogContent";
import { cn } from "@/lib/utils";

/**
 * "On this page": a collapsible list on phones, a sticky rail from 1200px up. The rail
 * highlights the section being read (IntersectionObserver on the h2/h3 the article carries).
 */
export function PostToc({ outline, variant }: { outline: OutlineItem[]; variant: "inline" | "rail" }) {
  const [active, setActive] = useState(outline[0]?.id ?? "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const els = outline.map((h) => document.getElementById(h.id)).filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const seen = new Set<string>();
    // A heading counts as "current" once it crosses the top band, until the next one does.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.isIntersecting ? seen.add(e.target.id) : seen.delete(e.target.id);
        const first = outline.find((h) => seen.has(h.id));
        if (first) setActive(first.id);
      },
      { rootMargin: "-96px 0px -65% 0px" },
    );
    for (const el of els) io.observe(el);
    // Above the first heading nothing is intersecting, and past the last one it leaves the band: pick by position.
    const onScroll = () => {
      let cur = "";
      for (const el of els) if (el.getBoundingClientRect().top <= 120) cur = el.id;
      if (cur) setActive(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [outline]);

  if (outline.length < 2) return null;

  const list = (
    <ol className="flex flex-col border-l border-border-soft">
      {outline.map((h) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            onClick={() => {
              setActive(h.id);
              setOpen(false);
            }}
            aria-current={active === h.id ? "location" : undefined}
            className={cn(
              "-ml-px block border-l-2 py-1.5 pr-1 text-[14px] leading-snug focus-visible:rounded-xs focus-visible:outline-2 focus-visible:outline-accent",
              h.level === 3 ? "pl-6" : "pl-3",
              active === h.id
                ? "border-accent font-semibold text-accent"
                : "border-transparent text-muted-foreground hover:border-border-strong hover:text-foreground",
            )}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  );

  if (variant === "rail")
    return (
      <nav aria-label="On this page" className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto">
        <h2 className="mb-3 font-sans text-[13px] font-semibold tracking-normal text-muted-foreground">On this page</h2>
        {list}
      </nav>
    );

  return (
    <details open={open} onToggle={(e) => setOpen(e.currentTarget.open)} className="group rounded-[12px] bg-background">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 text-[15px] font-semibold text-foreground [&::-webkit-details-marker]:hidden">
        On this page
        <Icon
          name="chevron-down"
          size={16}
          variant="line"
          className="motion-safe:transition-transform group-open:rotate-180"
        />
      </summary>
      <nav aria-label="On this page" className="px-4 pb-3">
        {list}
      </nav>
    </details>
  );
}
