"use client";

import Link from "next/link";
import { Icon } from "@/components/icons";
import { LogoMark } from "@/components/layout/LogoMark";
import { buttonVariants } from "@/components/ui/button";
import type { NavGroup, NavItem } from "@/lib/docs/nav";
import { CONSOLE_URL } from "@/lib/help";
import { SUPPORT_EMAIL } from "@/lib/site";
import { cn } from "@/lib/utils";

const row = "flex min-h-10 items-center gap-2.5 rounded-[8px] px-2 py-1.5 text-[14.5px] transition-colors lg:min-h-9";
const rowOn = "bg-accent-muted font-semibold text-accent";
const rowOff = "text-muted-foreground hover:bg-sunken hover:text-foreground";

const inside = (path: string, href: string) => href !== "/" && (path === href || path.startsWith(`${href}/`));

function Item({ item, path, num, onNavigate }: { item: NavItem; path: string; num?: number; onNavigate: () => void }) {
  const on = path === item.href;
  const open = !!item.children && inside(path, item.href);
  return (
    <li>
      <Link
        href={item.href}
        onClick={onNavigate}
        aria-current={on ? "page" : undefined}
        className={cn(row, on ? rowOn : rowOff, open && !on && "text-foreground")}
      >
        {num ? (
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-[12px] font-bold text-white tabular-nums">
            {num}
          </span>
        ) : item.icon ? (
          <span
            className={cn(
              "grid size-7 shrink-0 place-items-center rounded-[6px]",
              on ? "bg-surface text-accent" : "bg-sunken text-muted-foreground",
            )}
          >
            <Icon name={item.icon} size={16} variant="line" />
          </span>
        ) : null}
        <span className="min-w-0 leading-snug">{item.label}</span>
      </Link>
      {open && item.children && (
        <ul className="my-1 ml-[22px] flex flex-col border-l border-border-soft pl-2">
          {item.children.map((c) => (
            <li key={c.href}>
              <Link
                href={c.href}
                onClick={onNavigate}
                aria-current={path === c.href ? "page" : undefined}
                className={cn(
                  "block rounded-[6px] px-2 py-1.5 text-[13.5px] leading-snug",
                  path === c.href ? "font-semibold text-accent" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

/**
 * The docs sidebar: brand and a "Docs" chip, grouped sections (each with a small
 * uppercase label), and "API reference" plus "Still stuck?" pinned at the bottom.
 * Shown fixed on lg and above, and inside the slide-in sheet below that.
 */
export function DocsSidebar({
  groups,
  path,
  onNavigate,
}: {
  groups: NavGroup[];
  path: string;
  onNavigate: () => void;
}) {
  const api = path === "/api" || path.startsWith("/api/");
  return (
    <div className="flex h-full min-h-0 flex-col">
      <Link
        href="/"
        onClick={onNavigate}
        className="flex h-14 shrink-0 items-center gap-2 border-b border-border-soft px-4"
      >
        <LogoMark priority className="size-7" />
        <span className="font-display text-[18px] font-bold tracking-[-0.02em] text-foreground">ERIX</span>
        <span className="rounded-full bg-accent-muted px-2 py-0.5 text-[12px] font-semibold text-accent">Docs</span>
        <span className="sr-only">, docs home</span>
      </Link>

      <nav aria-label="Docs" className="min-h-0 flex-1 overflow-y-auto px-2 py-4">
        {groups.map((g) => (
          <div key={g.label} className="mb-5">
            <p className="mb-1.5 px-2 text-[11.5px] font-semibold tracking-[0.08em] text-subtle uppercase">{g.label}</p>
            <ul className="flex flex-col gap-0.5">
              {g.items.map((it, i) => (
                <Item
                  key={it.href}
                  item={it}
                  path={path}
                  num={g.numbered ? i + 1 : undefined}
                  onNavigate={onNavigate}
                />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="flex shrink-0 flex-col gap-0.5 border-t border-border-soft p-2">
        <Link
          href="/api"
          onClick={onNavigate}
          aria-current={path === "/api" ? "page" : undefined}
          className={cn(row, api ? rowOn : rowOff)}
        >
          <Icon name="code" size={16} variant="line" className="mx-1 shrink-0" />
          API reference
        </Link>
        <a href={`mailto:${SUPPORT_EMAIL}`} className={cn(row, rowOff)}>
          <Icon name="mail" size={16} variant="line" className="mx-1 shrink-0" />
          Still stuck? Contact us
        </a>
        <a href={CONSOLE_URL} className={cn(buttonVariants(), "mt-1 sm:hidden")}>
          Open console
          <Icon name="arrow-up-right" size={14} variant="line" />
        </a>
      </div>
    </div>
  );
}
