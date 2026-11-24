"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
  sub: boolean;
}

/** Headings of the page body (h2, and h3 for API endpoints) and the one in view. */
function useToc() {
  const pathname = usePathname();
  const [items, setItems] = useState<TocItem[]>([]);
  const [active, setActive] = useState("");

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-scan when the page changes
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>("#main-content :is(h2,h3)[id]")];
    setItems(
      els.map((e) => ({ id: e.id, text: e.dataset.toc ?? e.textContent?.trim() ?? "", sub: e.tagName === "H3" })),
    );
    setActive(els[0]?.id ?? "");
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) seen.add(en.target.id);
          else seen.delete(en.target.id);
        }
        const first = els.find((e) => seen.has(e.id));
        if (first) setActive(first.id);
      },
      // The band just under the sticky top bar: the first heading in it is "current".
      { rootMargin: "-72px 0px -65% 0px" },
    );
    for (const e of els) io.observe(e);
    return () => io.disconnect();
  }, [pathname]);

  return { items, active, setActive };
}

function List({ items, active, onPick }: { items: TocItem[]; active: string; onPick: (id: string) => void }) {
  return (
    <ul className="flex flex-col border-l border-border-soft">
      {items.map((t) => (
        <li key={t.id}>
          <a
            href={`#${t.id}`}
            onClick={() => onPick(t.id)}
            aria-current={active === t.id ? "location" : undefined}
            className={cn(
              "-ml-px block border-l-2 py-1.5 pr-2 text-[13.5px] leading-snug [overflow-wrap:anywhere] transition-colors",
              t.sub ? "pl-6" : "pl-3",
              active === t.id
                ? "border-accent font-semibold text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t.text}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Right column (xl and up): a sticky "On this page" list that follows the scroll. */
export function DocToc() {
  const { items, active, setActive } = useToc();
  if (items.length < 2) return <div className="hidden xl:block" />;
  return (
    <aside className="hidden xl:block">
      <nav aria-label="On this page" className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto pr-4 pb-6">
        <p className="mb-2 text-[11.5px] font-semibold tracking-[0.08em] text-subtle uppercase">On this page</p>
        <List items={items} active={active} onPick={setActive} />
      </nav>
    </aside>
  );
}

/** Below xl the same list folds into one closed disclosure above the page. */
export function DocTocInline() {
  const { items, active, setActive } = useToc();
  if (items.length < 2) return null;
  return (
    <details className="group mx-gutter mt-4 rounded-[12px] border border-border-soft bg-surface px-4 xl:hidden">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-[14px] font-semibold text-foreground">
        On this page
        <Icon
          name="chevron-down"
          size={16}
          variant="line"
          className="text-subtle transition-transform group-open:rotate-180"
        />
      </summary>
      <nav aria-label="On this page" className="pb-3">
        <List items={items} active={active} onPick={setActive} />
      </nav>
    </details>
  );
}
