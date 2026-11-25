"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Menu } from "@/components/icons";
import { ARROW_NUDGE, buttonVariants } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { CONTACT_CTA } from "@/lib/site";
import { cn } from "@/lib/utils";
import { LogoMark } from "./LogoMark";
import { NAV_SECTIONS, type NavSection, sectionOf } from "./nav-data";

// Both menus load on demand, so neither costs a phone anything on first
// load: the side panel (Radix Dialog) on the first touch of its button,
// the desktop NavigationMenu once a wide screen is idle.
const MobileNav = dynamic(() => import("./MobileNav"), { ssr: false });
const DesktopNav = dynamic(() => import("./DesktopNav"), { ssr: false });

/* ── Header ──────────────────────────────────────────────────────────── */

/**
 * Site header on the shadcn NavigationMenu (Radix): four sections, each a
 * panel that enters with framer-motion. A pill glides to the open section
 * and the logo's red dot marks the current one (both `layoutId`). A floating
 * rounded bar, fixed, one height always (a spacer holds it), with a soft shadow that deepens on scroll (the one
 * shadow on the otherwise flat site, founder 24 Nov). Below 1024px a side panel lists
 * every section. Without JavaScript the menus become plain links and the menu
 * button jumps to the footer's site map (globals.css, `scripting`).
 */
export function Navbar() {
  const path = usePathname();
  const [desktop, setDesktop] = useState<boolean | NavSection>(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuWanted, setMenuWanted] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closedByNav = useRef(false);
  const isMobile = useIsMobile(1024);
  const current = sectionOf(path);

  // Scrolled = the spacer under the header is no longer fully on screen.
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setScrolled(e.intersectionRatio < 1), { threshold: [1] });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Wide screens: fetch the desktop menu when the browser is idle.
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    let idle = 0;
    const load = () => {
      if (!wide.matches) return;
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
      idle = ric(() => setDesktop((d) => d || true));
    };
    load();
    wide.addEventListener("change", load);
    return () => {
      wide.removeEventListener("change", load);
      (window.cancelIdleCallback ?? clearTimeout)(idle);
    };
  }, []);

  // Navigating closes the phone menu.
  const [lastPath, setLastPath] = useState(path);
  if (lastPath !== path) {
    setLastPath(path);
    setMenuOpen(false);
  }
  // Widening past 1024px unmounts the panel. Close it too, or it comes back open when the window narrows.
  if (menuOpen && !isMobile) setMenuOpen(false);

  // The sheet is opened by our own button (not a Radix Trigger), so say
  // where focus goes when it closes: back to the button, or, after a link
  // in it was followed, to the link's #target or the new page's heading.
  const onMenuClosed = (e: Event) => {
    e.preventDefault();
    const hash = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    const target = closedByNav.current && (hash || document.querySelector<HTMLElement>("#main-content h1"));
    closedByNav.current = false;
    if (target) {
      if (!target.matches("a, button, input, select, textarea, [tabindex]")) target.tabIndex = -1;
      target.focus({ preventScroll: true });
    } else menuButton.current?.focus();
  };

  return (
    <>
      {/* Spacer = pill (52px, h-13) + its 14px top gap: --header-h in globals.css. */}
      <div ref={sentinel} aria-hidden="true" className="h-(--header-h)" />
      <header data-scrolled={scrolled || undefined} className="group fixed inset-x-0 top-0 z-50 px-gutter pt-3.5">
        <div
          className={cn(
            "relative mx-auto flex h-13 w-full max-w-[1180px] items-center gap-3 rounded-[32px] border border-border bg-surface pr-2.5 pl-5 lg:gap-6 lg:pl-6",
            // Open: flat card, the bar's bottom border is the only separator (no shadow falls on the panel).
            // Keyed on the panel being in the DOM, not on the trigger: the corners stay square until it has closed fully.
            "has-[[data-slot=navigation-menu-viewport]]:rounded-[28px_28px_0_0] has-[[data-slot=navigation-menu-viewport]]:shadow-none has-[[data-slot=navigation-menu-viewport]]:duration-100",
            // Deep navy tint reads on both light pages and the navy hero band.
            "shadow-[0_6px_18px_-10px_rgba(4,13,66,0.16),0_1px_3px_-1px_rgba(4,13,66,0.06)]",
            "group-data-[scrolled]:shadow-[0_8px_22px_-12px_rgba(4,13,66,0.22),0_1px_4px_-1px_rgba(4,13,66,0.08)]",
            "transition-[border-radius,box-shadow] duration-200 ease-out motion-reduce:transition-none",
          )}
        >
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <LogoMark priority className="size-8" />
            <span className="font-display text-[19px] font-bold tracking-[-0.02em] text-foreground">ERIX</span>
            <span className="sr-only">by ECODrIx, home</span>
          </Link>
          <div className="js-only hidden lg:block">
            {desktop ? (
              <DesktopNav path={path} current={current} focusKey={desktop === true ? undefined : desktop} />
            ) : (
              <ul className="flex items-center gap-0.5" aria-label="Main">
                {NAV_SECTIONS.map((s) => (
                  <li key={s.key}>
                    <button
                      type="button"
                      aria-expanded={false}
                      onPointerEnter={() => setDesktop(true)}
                      onFocus={() => setDesktop(s.key)}
                      className={cn(
                        "relative inline-flex h-9 items-center gap-1 rounded-full px-3 text-[14.5px] font-semibold text-muted-foreground hover:text-foreground",
                        current === s.key && "text-foreground",
                      )}
                    >
                      {s.label}
                      <ChevronDown aria-hidden="true" className="size-3.5" />
                      {current === s.key && (
                        <span
                          aria-hidden="true"
                          className="absolute bottom-0 left-[calc(50%-2.5px)] size-[5px] rounded-full bg-[var(--hero-dot)]"
                        />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Without JavaScript the menus can't open: plain links instead. */}
          <nav aria-label="Main" className="nojs-lg hidden items-center gap-1">
            {[
              { label: "Platform", href: "/platform" },
              { label: "Industries", href: "/#verticals" },
              { label: "Blog", href: "/blog" },
              { label: "About", href: "/about" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full px-3 py-2 text-[14.5px] font-semibold text-muted-foreground hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <Link
              href={CONTACT_CTA.href}
              // Touch: a 2px transparent border (kept out of the fill by bg-clip-padding) lifts the hit area to 44px without growing the 40px pill.
              className={cn(
                buttonVariants({ size: "sm" }),
                "group max-sm:px-3.5 pointer-coarse:border-y-2 pointer-coarse:border-transparent pointer-coarse:bg-clip-padding pointer-coarse:min-h-11",
              )}
            >
              {CONTACT_CTA.label}
              <ArrowRight aria-hidden="true" className={cn("hidden sm:block", ARROW_NUDGE)} />
            </Link>
            <button
              ref={menuButton}
              type="button"
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              onPointerEnter={() => setMenuWanted(true)}
              onTouchStart={() => setMenuWanted(true)}
              onFocus={() => setMenuWanted(true)}
              onClick={() => {
                setMenuWanted(true);
                setMenuOpen(true);
              }}
              className={cn(
                buttonVariants({ variant: "plain", size: "icon" }),
                "js-only flex text-foreground lg:hidden",
              )}
            >
              <Menu aria-hidden="true" />
            </button>
            <Link
              href="#site-map"
              className={cn(buttonVariants({ variant: "plain", size: "icon" }), "nojs-sm hidden text-foreground")}
            >
              <Menu aria-hidden="true" className="size-5" />
              <span className="sr-only">Site map</span>
            </Link>
          </div>
        </div>
      </header>
      {menuWanted && isMobile && (
        <MobileNav
          open={menuOpen}
          onOpenChange={setMenuOpen}
          onNavigate={() => (closedByNav.current = true)}
          onCloseAutoFocus={onMenuClosed}
          path={path}
        />
      )}
    </>
  );
}
