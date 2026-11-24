"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DocsSearch, type SearchEntry } from "@/components/docs/DocsSearch";
import { Icon } from "@/components/icons";
import { LogoMark } from "@/components/layout/LogoMark";
import { buttonVariants } from "@/components/ui/button";
import { CONSOLE_URL, DEV_NAV } from "@/lib/docs/docs";
import { cn } from "@/lib/utils";

/**
 * The developer area's one-row header (docs, changelog, status): the brand,
 * its three pages, search and the console. Phones and tablets (below lg) fold
 * the pages and search into a menu: the search box only fits the bar from lg.
 */
export function DocsHeader({ search }: { search: SearchEntry[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Close the phone menu when a link changes the page.
  const [seen, setSeen] = useState(pathname);
  if (pathname !== seen) {
    setSeen(pathname);
    setOpen(false);
  }
  const current = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-border-soft bg-surface/90 backdrop-blur-md backdrop-saturate-150">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center gap-3 px-gutter lg:gap-6">
        <Link href="/docs" className="flex shrink-0 items-center gap-2">
          <LogoMark priority className="size-7" />
          <span className="font-display text-[18px] font-bold tracking-[-0.02em] text-foreground">ERIX</span>
          <span className="rounded-full bg-accent-muted px-1.5 py-0.5 text-[12px] font-semibold text-accent">
            Developers
          </span>
          <span className="sr-only">, docs home</span>
        </Link>

        <nav aria-label="Developers" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {DEV_NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={current(n.href) ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3 py-2 text-[14.5px] font-medium transition-colors",
                    current(n.href)
                      ? "bg-sunken text-foreground"
                      : "text-muted-foreground hover:bg-sunken hover:text-foreground",
                  )}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden w-64 lg:block xl:w-72">
            <DocsSearch entries={search} />
          </div>
          <Link
            href="/"
            className="hidden items-center gap-1 rounded-full px-2.5 py-2 text-[14px] font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            ecodrix.com
          </Link>
          <a href={CONSOLE_URL} className={cn(buttonVariants({ size: "sm" }), "hidden sm:inline-flex")}>
            Open console
            <Icon name="arrow-up-right" size={14} variant="line" />
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="docs-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
            className="grid size-10 place-items-center rounded-full text-foreground hover:bg-sunken lg:hidden"
          >
            <Icon name={open ? "x" : "menu"} size={20} variant="line" />
          </button>
        </div>
      </div>

      {open && (
        <div id="docs-menu" className="border-t border-border-soft bg-surface px-gutter pt-3 pb-5 lg:hidden">
          <DocsSearch entries={search} onPick={() => setOpen(false)} />
          <nav aria-label="Developers" className="mt-3">
            <ul className="flex flex-col">
              {DEV_NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={current(n.href) ? "page" : undefined}
                    className={cn(
                      "block rounded-[8px] px-3 py-3 text-[16px] font-medium",
                      current(n.href) ? "bg-sunken text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/" className="block rounded-[8px] px-3 py-3 text-[16px] font-medium text-muted-foreground">
                  ecodrix.com
                </Link>
              </li>
            </ul>
          </nav>
          <a href={CONSOLE_URL} className={cn(buttonVariants(), "mt-3 w-full")}>
            Open console
          </a>
        </div>
      )}
    </header>
  );
}
