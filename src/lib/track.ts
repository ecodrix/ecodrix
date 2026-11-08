/**
 * First-party event tracking — sends action beacons to the ECODrIx server.
 * Complements pageview tracking (VisitorTracker) with explicit user actions:
 * CTA clicks, form submits, outbound links, scroll depth, etc.
 *
 * Fail-open, non-blocking (sendBeacon). Safe to call anywhere client-side.
 */

import { analyticsConsented } from "@/lib/legal/consent";

/** The public API the site posts to (track beacons, waitlist, newsletter). */
export const API_URL = process.env.NEXT_PUBLIC_ERIX_SOCKET_URL || "https://api.ecodrix.com";

// Same guards as VisitorTracker: only the live site beacons the production
// API (other origins are CORS-blocked), and only after analytics consent.
const TRACKED_HOSTS = new Set(["ecodrix.com", "www.ecodrix.com", "doc.ecodrix.com"]);

/** Per-session anonymous visitor id. Call only behind analytics consent. */
export function getVisitorId(): string {
  try {
    let id = sessionStorage.getItem("ecdx_vid");
    if (!id) {
      id = `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem("ecdx_vid", id);
    }
    return id;
  } catch {
    return "v_anon";
  }
}

const LANDING_KEY = "ecdx_landing";

/** Where this session first landed: UTM tags, referrer origin, landing path. */
export interface Landing {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  /** Origin only (no path or query, which can carry personal data). */
  referrer?: string;
  landingPath?: string;
}

/**
 * Remembers the session's first landing in sessionStorage so attribution
 * survives until the visitor answers the cookie banner. Storage only: nothing
 * leaves the browser here, and the first call per session wins.
 */
export function captureLanding(): void {
  try {
    if (sessionStorage.getItem(LANDING_KEY)) return;
    const q = new URLSearchParams(window.location.search);
    const utm = (k: string) => q.get(`utm_${k}`)?.trim().slice(0, 120) || undefined;
    let referrer: string | undefined;
    try {
      const r = new URL(document.referrer);
      if (r.host !== window.location.host) referrer = r.origin.slice(0, 255);
    } catch {
      /* no referrer */
    }
    const landing: Landing = {
      utmSource: utm("source"),
      utmMedium: utm("medium"),
      utmCampaign: utm("campaign"),
      utmTerm: utm("term"),
      utmContent: utm("content"),
      referrer,
      landingPath: window.location.pathname.slice(0, 512),
    };
    sessionStorage.setItem(LANDING_KEY, JSON.stringify(landing));
  } catch {
    // storage unavailable — no attribution this session
  }
}

/** The session's landing (see captureLanding), or null. */
export function getLanding(): Landing | null {
  try {
    return JSON.parse(sessionStorage.getItem(LANDING_KEY) ?? "null") as Landing | null;
  } catch {
    return null;
  }
}

export type EventType = "click" | "form_submit" | "scroll" | "outbound" | "cta" | "custom";

/**
 * Track a custom action event.
 * @param eventName  e.g. "join_waitlist_click", "pricing_view_all"
 * @param eventType  category — defaults to "click"
 * @param data       arbitrary structured payload
 */
export function trackEvent(eventName: string, eventType: EventType = "click", data?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  if (!TRACKED_HOSTS.has(window.location.hostname) || !analyticsConsented()) return;
  try {
    const payload = JSON.stringify({
      visitorId: getVisitorId(),
      eventType,
      eventName,
      eventData: data ?? null,
      path: window.location.pathname,
      title: document.title,
      ts: Date.now(),
    });

    const url = `${API_URL}/v1/api/platform/public/track`;
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([payload], { type: "application/json" }));
    } else {
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }

    // Mirror to GA4 if present
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, { event_category: eventType, ...data });
    }
  } catch {
    // fail-open
  }
}
