"use client";

import Link from "next/link";
import { type ReactNode, useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  CONSENT_CHANGED_EVENT as CHANGED,
  CONSENT_VERSION,
  CONSENT_STORAGE_KEY as STORAGE_KEY,
} from "@/lib/legal/consent";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────────────
   CookieConsent — GDPR/DPDP-friendly consent banner wired to Google
   Consent Mode v2. Analytics + marketing default to "denied" (set in
   layout head); this component updates consent based on the user's choice
   and remembers it. Essential cookies are always on.

   The banner is in the server HTML. Until hydration, CSS shows it only
   when the head boot script found no stored choice (<html
   data-consent="ask">), so it paints with the page rather than seconds
   later; after hydration React owns visibility.

   Reopen from anywhere with:
     window.dispatchEvent(new Event("ecodrix:open-cookie-preferences"))
─────────────────────────────────────────────────────────────────────── */

interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  version: number;
  ts: number;
}

function readConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function applyConsent(c: { analytics: boolean; marketing: boolean }) {
  if (typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    analytics_storage: c.analytics ? "granted" : "denied",
    ad_storage: c.marketing ? "granted" : "denied",
    ad_user_data: c.marketing ? "granted" : "denied",
    ad_personalization: c.marketing ? "granted" : "denied",
  });
}

function persist(c: { analytics: boolean; marketing: boolean }) {
  const state: ConsentState = {
    ...c,
    version: CONSENT_VERSION,
    ts: Date.now(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable — consent applies for the session only */
  }
  applyConsent(c);
  window.dispatchEvent(new Event(CHANGED));
}

// The stored choice as an external store: the server (and hydration) sees
// `undefined`, so the banner's HTML and the CSS decide until React takes over.
function subscribe(onChange: () => void) {
  window.addEventListener(CHANGED, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGED, onChange);
    window.removeEventListener("storage", onChange);
  };
}
const storedChoice = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

/** Icons come from the server (layout.tsx), so no icon data ships with the banner. */
export function CookieConsent({
  icons,
}: {
  icons: { cookie: ReactNode; close: ReactNode; check: ReactNode; shield: ReactNode };
}) {
  // undefined on the server and while hydrating; then the stored JSON or null.
  const stored = useSyncExternalStore(subscribe, storedChoice, () => undefined);
  const decided = stored === undefined ? undefined : readConsent() !== null;
  // Opened again from "Cookie preferences"; closed for this page even when
  // the choice couldn't be stored (private browsing).
  const [reopened, setReopened] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  // Off until the visitor turns it on: consent must be an active choice (DPDP Act).
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const visible = decided === undefined ? null : reopened || (!decided && !dismissed);

  // Re-apply the stored choice once per load (Consent Mode v2).
  useEffect(() => {
    const existing = readConsent();
    if (existing) applyConsent(existing);
  }, []);

  useEffect(() => {
    const open = () => {
      const cur = readConsent();
      if (cur) {
        setAnalytics(cur.analytics);
        setMarketing(cur.marketing);
      }
      setShowPrefs(true);
      setReopened(true);
    };
    window.addEventListener("ecodrix:open-cookie-preferences", open);
    return () => window.removeEventListener("ecodrix:open-cookie-preferences", open);
  }, []);

  const close = useCallback(() => {
    delete document.documentElement.dataset.consent;
    setDismissed(true);
    setReopened(false);
    setShowPrefs(false);
  }, []);

  const acceptAll = useCallback(() => {
    persist({ analytics: true, marketing: true });
    close();
  }, [close]);

  const rejectNonEssential = useCallback(() => {
    persist({ analytics: false, marketing: false });
    close();
  }, [close]);

  const savePreferences = useCallback(() => {
    persist({ analytics, marketing });
    close();
  }, [analytics, marketing, close]);

  if (visible === false) return null;

  return (
    <div
      data-cookie-banner=""
      data-lenis-prevent
      data-open={visible ? "" : undefined}
      className="fixed inset-x-0 bottom-0 z-300 p-3 sm:p-6"
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
    >
      <div className="mx-auto max-w-3xl rounded-lg border border-border bg-surface p-4 shadow-[var(--shadow-lg)] sm:p-5">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 hidden sm:flex items-center justify-center rounded-md bg-accent-muted border border-accent-border">
            {icons.cookie}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between gap-4 mb-2">
              <h2 className="text-foreground font-bold text-base">We value your privacy</h2>
              <button
                type="button"
                onClick={rejectNonEssential}
                aria-label="Reject non-essential cookies and close"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {icons.close}
              </button>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed">
              We use essential cookies to run ECODrIx, and — with your consent — analytics and marketing cookies to
              improve it. Read our{" "}
              <Link href="/legal/cookie-policy" className="text-accent underline hover:text-accent-hover">
                Cookie Policy
              </Link>{" "}
              and{" "}
              <Link href="/legal/privacy" className="text-accent underline hover:text-accent-hover">
                Privacy Policy
              </Link>
              .
            </p>

            {/* Preferences */}
            {showPrefs && (
              <div className="mt-5 space-y-3">
                <ConsentRow
                  title="Strictly necessary"
                  desc="Required for authentication, security, and core features. Always on."
                  checked
                  disabled
                />
                <ConsentRow
                  title="Analytics"
                  desc="Helps us understand usage so we can improve the platform."
                  checked={analytics}
                  onChange={setAnalytics}
                />
                <ConsentRow
                  title="Marketing"
                  desc="Used to measure campaigns and show relevant content."
                  checked={marketing}
                  onChange={setMarketing}
                />
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <button type="button" onClick={acceptAll} className={buttonVariants({ size: "sm" })}>
                {icons.check} Accept all
              </button>
              <button
                type="button"
                onClick={rejectNonEssential}
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Reject non-essential
              </button>
              {showPrefs ? (
                <button
                  type="button"
                  onClick={savePreferences}
                  className={cn(
                    buttonVariants({ variant: "plain", size: "sm" }),
                    "text-accent hover:text-accent-hover",
                  )}
                >
                  {icons.shield} Save preferences
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowPrefs(true)}
                  className={buttonVariants({ variant: "plain", size: "sm" })}
                >
                  Manage preferences
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConsentRow({
  title,
  desc,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <label
      className={`flex items-start justify-between gap-4 p-3 rounded-md border border-foreground/8 bg-foreground/2 ${
        disabled ? "opacity-70" : "cursor-pointer hover:border-foreground/15"
      } transition-colors`}
    >
      <span>
        <span className="block text-foreground text-sm font-semibold">{title}</span>
        <span className="block text-muted-foreground text-xs mt-0.5">{desc}</span>
      </span>
      <Switch className="mt-1" checked={checked} disabled={disabled} onCheckedChange={onChange} />
    </label>
  );
}
