"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { analyticsConsented, CONSENT_CHANGED_EVENT } from "@/lib/legal/consent";
import { captureLanding, getLanding, getVisitorId } from "@/lib/track";

const API_URL = process.env.NEXT_PUBLIC_ERIX_SOCKET_URL || "https://api.ecodrix.com";

/**
 * Sends a lightweight pageview beacon to the ECODrIx server on every
 * navigation. The server records it for the admin live-visitor dashboard.
 *
 * - Uses navigator.sendBeacon (non-blocking, survives page unload)
 * - Generates a per-session visitor ID stored in sessionStorage
 * - Captures the landing referrer, path and UTM params into sessionStorage on
 *   the first load (no network), and sends them with the first beacon after
 *   analytics consent — also when consent comes later on another page
 * - Fail-open: any error is swallowed; tracking never breaks the page
 */

/**
 * Only the live site reports visits. Local dev, test runs and Vercel previews
 * used to beacon the production API from their own origin, which CORS
 * rejected (~1,600 "CORS blocked" warnings in the system logs on 26 Oct).
 */
const TRACKED_HOSTS = new Set(["ecodrix.com", "www.ecodrix.com", "doc.ecodrix.com"]);

export function VisitorTracker() {
  const pathname = usePathname();
  const firstHit = useRef(true);
  const lastSent = useRef<string | null>(null);
  // Bumped when the visitor answers the cookie banner, so the page they are
  // on is counted the moment they consent.
  const [consentTick, setConsentTick] = useState(0);

  useEffect(() => {
    const onChange = () => setConsentTick((t) => t + 1);
    window.addEventListener(CONSENT_CHANGED_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, onChange);
  }, []);

  useEffect(() => {
    captureLanding();
    if (!TRACKED_HOSTS.has(window.location.hostname)) return;
    // The cookie banner promises analytics only with consent; this counts too.
    if (!analyticsConsented()) return;
    // A consent change on the same page must not count it twice.
    if (lastSent.current === pathname) return;
    try {
      const url = `${API_URL}/v1/api/platform/public/track`;
      const landing = firstHit.current ? getLanding() : null;
      const payload = JSON.stringify({
        visitorId: getVisitorId(),
        path: pathname,
        title: document.title,
        referrer: landing?.referrer ?? null,
        utm: landing
          ? {
              source: landing.utmSource,
              medium: landing.utmMedium,
              campaign: landing.utmCampaign,
            }
          : null,
        // Columns exist for source/medium/campaign only; the rest rides here.
        eventData: landing
          ? {
              landingPath: landing.landingPath,
              utmTerm: landing.utmTerm,
              utmContent: landing.utmContent,
            }
          : null,
        screen: firstHit.current ? { w: window.screen.width, h: window.screen.height } : null,
        ts: Date.now(),
      });

      firstHit.current = false;
      lastSent.current = pathname;

      // sendBeacon is fire-and-forget and survives navigation
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon(url, blob);
      } else {
        // Fallback: keepalive fetch
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // fail-open — tracking must never break the page
    }
  }, [pathname, consentTick]);

  return null;
}
