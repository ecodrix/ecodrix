/**
 * Data for status.ecodrix.com: the API's public status route (one JSON feed:
 * systems with daily ticks, incidents, maintenance) and its subscribe call.
 * Public and read-only; the page lives here, off the API, so it can still say
 * "can't reach the status service" when the API is down.
 */

import { API_URL } from "@/lib/track";

export type Tick = "operational" | "degraded" | "down" | "maintenance" | "nodata";
export type Overall = "operational" | "degraded" | "outage" | "maintenance";
export type Impact = "minor" | "major" | "outage";

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
    days: { date: string; state: Tick }[];
  }[];
  days: { date: string; state: Tick }[];
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
