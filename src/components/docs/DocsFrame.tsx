"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog } from "radix-ui";
import { type ReactNode, useRef, useState } from "react";
import { DocsSearch, type SearchEntry } from "@/components/docs/DocsSearch";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { DocToc, DocTocInline } from "@/components/docs/DocToc";
import { Icon } from "@/components/icons";
import { LogoMark } from "@/components/layout/LogoMark";
import { buttonVariants } from "@/components/ui/button";
import type { DocsNav } from "@/lib/docs/nav";
import { CONSOLE_URL } from "@/lib/help";
import { cn } from "@/lib/utils";

/**
 * The one frame for Help, the API reference and the changelog: sidebar (a slide-in
 * sheet below lg), top bar with search and the console button, the page, and the
 * "On this page" column (a closed disclosure below xl). Sections are data: the
 * sidebar groups come from `nav`, the pages are server components in `children`.
 */
export function DocsFrame({
  nav,
  search,
  children,
  footer,
}: {
  nav: DocsNav;
  search: SearchEntry[];
  children: ReactNode;
  footer: ReactNode;
}) {
  const raw = usePathname();
  // `/doc-host/...` is the internal path behind the doc host's rewrite; readers see it without.
  const path = raw.replace(/^\/doc-host(?=\/|$)/, "") || "/";
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(path);
  if (path !== seen) {
    setSeen(path);
    setOpen(false);
  }
  const groups = path === "/api" || path.startsWith("/api/") ? nav.api : nav.help;
  const close = () => setOpen(false);
  const menuBtn = useRef<HTMLButtonElement>(null);

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[1440px] lg:grid lg:grid-cols-[272px_minmax(0,1fr)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-[14px] focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <aside className="sticky top-0 hidden h-dvh border-r border-border-soft bg-surface lg:block">
        <DocsSidebar groups={groups} path={path} onNavigate={close} />
      </aside>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-[rgb(18_21_29/0.48)] lg:hidden" />
          <Dialog.Content
            onCloseAutoFocus={(e) => {
              // No Dialog.Trigger (the button is in the top bar): hand focus back by hand.
              e.preventDefault();
              menuBtn.current?.focus();
            }}
            className="docs-sheet fixed inset-y-0 left-0 z-50 flex w-[min(320px,88vw)] flex-col border-r border-border-soft bg-surface outline-none lg:hidden"
          >
            <Dialog.Title className="sr-only">Docs menu</Dialog.Title>
            <Dialog.Description className="sr-only">Help topics, API sections and the changelog.</Dialog.Description>
            <DocsSidebar groups={groups} path={path} onNavigate={close} />
            <Dialog.Close className="absolute top-1.5 right-2 grid size-11 place-items-center rounded-full text-muted-foreground hover:bg-sunken hover:text-foreground">
              <Icon name="x" size={20} variant="line" />
              <span className="sr-only">Close menu</span>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-40 border-b border-border-soft bg-surface/90 backdrop-blur-md backdrop-saturate-150">
          <div className="flex h-14 items-center gap-2 px-gutter sm:gap-3">
            <button
              ref={menuBtn}
              type="button"
              aria-label="Open menu"
              aria-haspopup="dialog"
              onClick={() => setOpen(true)}
              className="-ml-2 grid size-11 shrink-0 place-items-center rounded-full text-foreground hover:bg-sunken lg:hidden"
            >
              <Icon name="menu" size={20} variant="line" />
            </button>
            <Link href="/" className="flex shrink-0 items-center gap-2 lg:hidden">
              <LogoMark priority className="size-7" />
              <span className="sr-only">ERIX Docs home</span>
            </Link>
            <div className="min-w-0 max-w-[520px] flex-1">
              <DocsSearch entries={search} />
            </div>
            <a
              href={CONSOLE_URL}
              className={cn(buttonVariants({ size: "sm" }), "ml-auto hidden shrink-0 sm:inline-flex")}
            >
              Open console
              <Icon name="arrow-up-right" size={14} variant="line" />
            </a>
          </div>
        </header>

        <DocTocInline />
        <div className="flex-1 xl:grid xl:grid-cols-[minmax(0,1fr)_232px]">
          <main id="main-content" tabIndex={-1} className="min-w-0 outline-none [&_:is(h2,h3)]:scroll-mt-20">
            {children}
          </main>
          <DocToc />
        </div>
        {footer}
      </div>
    </div>
  );
}
