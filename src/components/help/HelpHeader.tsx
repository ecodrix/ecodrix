"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DocsSearch } from "@/components/docs/DocsSearch";
import { Icon } from "@/components/icons";
import { LogoMark } from "@/components/layout/LogoMark";
import { buttonVariants } from "@/components/ui/button";
import { CONSOLE_URL, HELP_SEARCH, helpHref } from "@/lib/help";
import { cn } from "@/lib/utils";

/** Pages that live on ecodrix.com: absolute, because doc.ecodrix.com serves only help. */
const OUT = [
  { href: "https://ecodrix.com/docs", label: "Developers" },
  { href: "https://status.ecodrix.com", label: "Status" },
];

/**
 * ERIX Help's one-row header: the brand, search, links out and the console.
 * Below lg the search and links fold into a menu.
 */
export function HelpHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(pathname);
  if (pathname !== seen) {
    setSeen(pathname);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border-soft bg-surface/90 backdrop-blur-md backdrop-saturate-150">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center gap-3 px-gutter lg:gap-6">
        <Link href={helpHref("/")} className="flex shrink-0 items-center gap-2">
          <LogoMark priority className="size-7" />
          <span className="font-display text-[18px] font-bold tracking-[-0.02em] text-foreground">ERIX</span>
          <span className="rounded-[6px] bg-accent-muted px-1.5 py-0.5 text-[12px] font-semibold text-accent">
            Help
          </span>
          <span className="sr-only">, help center home</span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden w-72 lg:block xl:w-80">
            <DocsSearch entries={HELP_SEARCH} />
          </div>
          <nav aria-label="More from ECODrIx" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {OUT.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    className="rounded-[8px] px-3 py-2 text-[14.5px] font-medium text-muted-foreground transition-colors hover:bg-sunken hover:text-foreground"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a href={CONSOLE_URL} className={cn(buttonVariants({ size: "sm" }), "hidden sm:inline-flex")}>
            Open ERIX
            <Icon name="arrow-up-right" size={14} variant="line" />
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="help-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
            className="grid size-10 place-items-center rounded-[8px] text-foreground hover:bg-sunken lg:hidden"
          >
            <Icon name={open ? "x" : "menu"} size={20} variant="line" />
          </button>
        </div>
      </div>

      {open && (
        <div id="help-menu" className="border-t border-border-soft bg-surface px-gutter pt-3 pb-5 lg:hidden">
          <DocsSearch entries={HELP_SEARCH} onPick={() => setOpen(false)} />
          <nav aria-label="More from ECODrIx" className="mt-3">
            <ul className="flex flex-col">
              {OUT.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    className="block rounded-[8px] px-3 py-3 text-[16px] font-medium text-muted-foreground"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a href={CONSOLE_URL} className={cn(buttonVariants(), "mt-3 w-full")}>
            Open ERIX
          </a>
        </div>
      )}
    </header>
  );
}
