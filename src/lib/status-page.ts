/**
 * Data for status.ecodrix.com: the API's public status route (one JSON feed:
 * systems with daily ticks, incidents, maintenance), its subscribe call, and
 * the page's IST date and number formats.
 * Public and read-only; the page lives here, off the API, so it can still say
 * "can't reach the status service" when the API is down.
 */

import { API_URL } from "@/lib/track";

export type Tick = "operational" | "degraded" | "down" | "maintenance" | "nodata";
export type Overall = "operational" | "degraded" | "outage" | "maintenance";
export type Impact = "minor" | "major" | "outage";

/** One day's bar. `uptimePct` is missing from servers older than 18 Nov 2026. */
export interface StatusDay {
  date: string;
  state: Tick;
  uptimePct?: number | null;
}
/** A detected outage of one component (the API keeps the latest 20). */
export interface StatusOutage {
  component: string;
  status: "degraded" | "down";
  startedAt: string;
  endedAt: string | null;
  durationMin: number;
}

export interface StatusSystem {
  id: string;
  name: string;
  status: Tick;
  uptimePct: number | null;
  components: {
    id: string;
    name: string;
    status: Tick;
    uptimePct: number | null;
    /** Missing from servers older than 14 Nov 2026: render it as no history, never crash. */
    days?: StatusDay[];
    /** Last 24 h; null for outcome-only components, missing before 18 Nov 2026. */
    latencyMs?: { last: number | null; p50: number | null; p95: number | null } | null;
  }[];
  days: StatusDay[];
  /** Missing from servers older than 18 Nov 2026. */
  outages?: StatusOutage[];
}
export interface StatusIncident {
  id: string;
  title: string;
  impact: Impact;
  status: "investigating" | "identified" | "monitoring" | "resolved";
  systems: string[];
  startedAt: string;
  resolvedAt: string | null;
  updates: { status: StatusIncident["status"]; message: string; at: string }[];
}
export interface StatusMaintenance {
  id: string;
  title: string;
  message: string;
  systems: string[];
  startsAt: string;
  endsAt: string;
  state: "scheduled" | "in_progress";
}
export interface StatusPayload {
  generatedAt: string;
  windowDays: number;
  overall: Overall;
  systems: StatusSystem[];
  incidents: StatusIncident[];
  maintenance: StatusMaintenance[];
}

const BASE = `${API_URL}/v1/api/platform/public/status`;

/** The feed, or null when the API couldn't be read. Server and browser use the same call. */
export async function readStatusPage(init?: RequestInit): Promise<StatusPayload | null> {
  try {
    const res = await fetch(BASE, {
      ...init,
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return ((await res.json()) as { data?: StatusPayload }).data ?? null;
  } catch {
    return null;
  }
}

/** "ok" for any 202; "limited" for 429; "invalid" for 400; "failed" for the rest. */
export async function subscribeToStatus(
  email: string,
  website: string,
): Promise<"ok" | "limited" | "invalid" | "failed"> {
  try {
    const res = await fetch(`${BASE}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, website }),
    });
    if (res.ok) return "ok";
    return res.status === 429 ? "limited" : res.status === 400 ? "invalid" : "failed";
  } catch {
    return "failed";
  }
}

const IST = "Asia/Kolkata";
const dayFmt = new Intl.DateTimeFormat("en-IN", { timeZone: IST, day: "numeric", month: "short", year: "numeric" });
const timeFmt = new Intl.DateTimeFormat("en-IN", { timeZone: IST, hour: "numeric", minute: "2-digit", hour12: true });

/** "28 Oct 2026" on the IST calendar. */
export const fmtDay = (d: Date) => dayFmt.format(d);
/** "10:30 am" IST. */
export const fmtTime = (d: Date) => timeFmt.format(d);
/** `2026-10-28` → "28 Oct 2026". */
export const fmtIsoDay = (iso: string) => fmtDay(new Date(`${iso}T12:00:00+05:30`));
export const fmtPct = (v: number | null) => (v == null ? null : `${Math.round(v * 100) / 100}%`);
/** 412 → "412 ms", 2843 → "2.8 s". */
export const fmtMs = (ms: number) => (ms < 1000 ? `${Math.round(ms)} ms` : `${Math.round(ms / 100) / 10} s`);

/** "45 min", "2 h 5 min", "1 d 3 h". */
export function fmtDuration(min: number) {
  const m = Math.max(0, Math.round(min));
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h${m % 60 ? ` ${m % 60} min` : ""}`;
  return `${Math.floor(h / 24)} d${h % 24 ? ` ${h % 24} h` : ""}`;
}
