"use client";

import { useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { analyticsConsented } from "@/lib/legal/consent";
import { API_URL, getLanding, getVisitorId, trackEvent } from "@/lib/track";
import { cn } from "@/lib/utils";

/** Stored with the subscription as proof of consent (server `consent_text`): change both together. */
export const SUBSCRIBE_CONSENT = "Send me new posts from the ERIX blog. Unsubscribe anytime.";

type State = { kind: "idle" | "sending" | "sent" } | { kind: "error"; message: string };

/**
 * Blog email subscription (double opt-in): the server answers the same for every valid email
 * and sends a confirmation link, so nothing is sent until the reader clicks it.
 * `inline`: input and button in one row (listing hero). `card`: stacked (article sidebar, end).
 */
export function SubscribeForm({
  source,
  variant = "inline",
  className,
}: {
  source: "blog" | "blog_post";
  variant?: "inline" | "card";
  className?: string;
}) {
  const [state, setState] = useState<State>({ kind: "idle" });
  const id = `subscribe-${variant}`;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState({ kind: "sending" });
    try {
      const res = await fetch(`${API_URL}/v1/api/platform/public/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(form.get("email") ?? "").trim(),
          source,
          path: window.location.pathname,
          website: String(form.get("website") ?? ""),
          // First-touch attribution, only with analytics consent (same as the early-access form).
          attribution: analyticsConsented() ? { ...getLanding(), visitorId: getVisitorId() } : undefined,
        }),
      });
      if (res.status === 202 || res.ok) {
        setState({ kind: "sent" });
        trackEvent("newsletter_subscribe", "form_submit", { form: source });
        return;
      }
      const body = await res.json().catch(() => null);
      setState({
        kind: "error",
        message:
          res.status === 429
            ? "Too many tries from this network. Wait a minute and try again."
            : (body?.message ?? "That didn't work. Check the email and try again."),
      });
    } catch {
      setState({ kind: "error", message: "We couldn't reach the server. Check your connection and try again." });
    }
  };

  if (state.kind === "sent") {
    return (
      <p role="status" className={cn("flex items-start gap-2.5 text-[15px] text-foreground", className)}>
        <Icon name="mail-check" size={18} variant="duo" className="mt-0.5 shrink-0 text-accent" />
        <span>
          <b className="font-semibold">Check your inbox.</b> We sent a link to confirm. Nothing arrives until you click
          it.
        </span>
      </p>
    );
  }

  const sending = state.kind === "sending";
  return (
    <form onSubmit={onSubmit} className={className}>
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <div className={cn("flex gap-2", variant === "card" ? "flex-col" : "flex-col sm:flex-row")}>
        <Input
          id={id}
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          placeholder="you@yourbusiness.in"
          aria-invalid={state.kind === "error" || undefined}
          aria-describedby={`${id}-note`}
          className={cn("h-11 min-w-0 bg-surface", variant === "inline" && "sm:flex-1")}
        />
        {/* Honeypot: people never see or fill it. */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <button type="submit" disabled={sending} className={cn(buttonVariants(), "h-11 shrink-0")}>
          {sending ? <Icon name="loader-circle" size={16} variant="line" className="animate-spin" /> : null}
          {sending ? "Subscribing" : "Subscribe"}
        </button>
      </div>
      <p id={`${id}-note`} className="mt-2 text-[13px] text-muted-foreground">
        {state.kind === "error" ? (
          <span role="alert" className="text-error">
            {state.message}
          </span>
        ) : (
          SUBSCRIBE_CONSENT
        )}
      </p>
    </form>
  );
}

const noSubscription = () => () => {};

/**
 * The blog listing's subscribe card. The confirmation link lands on `/blog?subscribed=1` (done)
 * or `=expired` (link too old); it's read in the browser so the listing itself stays cached.
 */
export function SubscribeCard() {
  // null on the server and while hydrating, then the query value.
  const result = useSyncExternalStore(
    noSubscription,
    () => new URLSearchParams(window.location.search).get("subscribed"),
    () => null,
  );

  if (result === "1") {
    return (
      <p role="status" className="flex items-start gap-2.5 text-[15px] text-foreground">
        <Icon name="circle-check" size={20} variant="duo" className="mt-0.5 shrink-0 text-success" />
        <span>
          <b className="font-semibold">You&apos;re subscribed.</b> New posts will reach your inbox. Every email has a
          link to unsubscribe.
        </span>
      </p>
    );
  }
  return (
    <>
      <h2 className="font-sans text-[17px] font-semibold tracking-normal">Get new posts by email</h2>
      <p className="mt-1 text-[14px] text-muted-foreground">
        {result === "expired"
          ? "That confirmation link has expired. Subscribe again and we'll send a fresh one."
          : "About twice a month. Nothing else, and no sharing your email."}
      </p>
      <SubscribeForm source="blog" className="mt-4" />
    </>
  );
}
