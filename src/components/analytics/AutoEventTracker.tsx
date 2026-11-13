"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/track";

/**
 * Auto-captures user actions site-wide with zero per-component wiring:
 *
 * 1. Clicks on any element with `data-track="event_name"` (delegated listener)
 * 2. Clicks on outbound links (different origin) as "outbound" events
 * 3. Clicks on any button/link containing "waitlist" text as a "cta" event
 * 4. Scroll depth milestones (25/50/75/100%) per page
 *
 * Mount once in the root layout. Fail-open.
 */
export function AutoEventTracker() {
  const pathname = usePathname();
  const scrollMarks = useRef<Set<number>>(new Set());

  // Reset scroll milestones on navigation
  useEffect(() => {
    scrollMarks.current = new Set();
  }, [pathname]);

  useEffect(() => {
    // ── Delegated click tracking ──────────────────────────────────────────
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const el = target.closest<HTMLElement>("[data-track], a, button, [role='button']");
      if (!el) return;

      // 1. Explicit data-track
      const explicit = el.getAttribute("data-track");
      if (explicit) {
        trackEvent(explicit, "click", {
          text: el.textContent?.trim().slice(0, 80),
        });
        return;
      }

      // 2. Outbound link
      if (el.tagName === "A") {
        const href = (el as HTMLAnchorElement).href;
        try {
          const url = new URL(href, window.location.href);
          if (url.origin !== window.location.origin && url.protocol.startsWith("http")) {
            trackEvent("outbound_click", "outbound", { href: url.href });
            return;
          }
        } catch {
          /* ignore */
        }
      }

      // 3. Waitlist CTA (implicit)
      const label = el.textContent?.toLowerCase() || "";
      if (
        label.includes("waitlist") ||
        label.includes("early access") ||
        label.includes("get started") ||
        label.includes("join")
      ) {
        trackEvent("cta_click", "cta", {
          label: el.textContent?.trim().slice(0, 80),
        });
      }
    };

    // ── Scroll depth ──────────────────────────────────────────────────────
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      if (scrollTimer) return;
      scrollTimer = setTimeout(() => {
        scrollTimer = null;
        const doc = document.documentElement;
        const scrolled = doc.scrollTop + window.innerHeight;
        const pct = Math.round((scrolled / doc.scrollHeight) * 100);
        for (const mark of [25, 50, 75, 100]) {
          if (pct >= mark && !scrollMarks.current.has(mark)) {
            scrollMarks.current.add(mark);
            trackEvent(`scroll_${mark}`, "scroll", { depth: mark });
          }
        }
      }, 300);
    };

    document.addEventListener("click", onClick, { capture: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("scroll", onScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, [pathname]);

  return null;
}
