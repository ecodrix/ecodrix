"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToStatus } from "@/lib/status-page";
import { cn } from "@/lib/utils";

/** Stored with the subscription as proof of consent (server `STATUS_CONSENT_TEXT`): change both together. */
const CONSENT = "Email me when ERIX has an incident or planned maintenance. Unsubscribe anytime.";

type State = "idle" | "sending" | "sent" | "invalid" | "limited" | "failed";
const ERROR: Record<string, string> = {
  invalid: "Enter a valid email address.",
  limited: "Too many tries from this network. Wait a minute and try again.",
  failed: "We couldn't reach the server. Check your connection and try again.",
};

/** "Subscribe to updates": a button and a native modal dialog (focus trap, Esc, backdrop) with the double opt-in form. */
export function SubscribeButton({ className }: { className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<State>("idle");

  const open = () => {
    setState("idle");
    ref.current?.showModal();
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState("sending");
    const result = await subscribeToStatus(String(form.get("email") ?? "").trim(), String(form.get("website") ?? ""));
    setState(result === "ok" ? "sent" : result);
  };

  return (
    <>
      <button type="button" onClick={open} className={cn(buttonVariants({ size: "sm" }), className)}>
        <Icon name="bell" size={16} variant="line" />
        Subscribe to updates
      </button>
      <dialog
        ref={ref}
        aria-labelledby="subscribe-title"
        onClick={(e) => e.target === ref.current && ref.current?.close()}
        // Escape closes it too (the backdrop click above is the mouse way).
        onKeyDown={(e) => e.key === "Escape" && ref.current?.close()}
        className="m-auto w-[min(92vw,26rem)] rounded-[16px] bg-surface p-0 text-foreground shadow-xl backdrop:bg-black/40"
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <h2 id="subscribe-title" className="text-[18px] font-semibold tracking-[-0.01em]">
              Subscribe to updates
            </h2>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="-m-2 inline-flex size-10 items-center justify-center rounded-[8px] text-muted-foreground hover:bg-sunken hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
            >
              <Icon name="x" size={18} variant="line" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          {state === "sent" ? (
            <div role="status" className="mt-4 flex items-start gap-2.5 text-[15px]">
              <Icon name="mail-check" size={20} variant="duo" className="mt-0.5 shrink-0 text-accent" />
              <p>
                <b className="font-semibold">Check your inbox.</b> We sent a link to confirm. You get no emails until
                you click it.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-3">
              <p className="mb-3 text-[14.5px] text-muted-foreground">
                We email you when there is an incident or planned maintenance. Nothing else.
              </p>
              <label htmlFor="status-email" className="mb-1.5 block text-[14px] font-medium">
                Email address
              </label>
              <Input
                id="status-email"
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                placeholder="you@yourbusiness.in"
                aria-invalid={ERROR[state] ? true : undefined}
                aria-describedby="status-email-note"
                className="h-11 bg-surface"
              />
              {/* Honeypot: people never see or fill it. */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
              <p id="status-email-note" className="mt-2 text-[13px] text-muted-foreground">
                {ERROR[state] ? (
                  <span role="alert" className="text-error">
                    {ERROR[state]}
                  </span>
                ) : (
                  CONSENT
                )}
              </p>
              <button
                type="submit"
                disabled={state === "sending"}
                className={cn(buttonVariants(), "mt-4 h-11 w-full")}
              >
                {state === "sending" ? <Icon name="loader-circle" size={16} variant="line" className="animate-spin" /> : null}
                {state === "sending" ? "Subscribing" : "Subscribe"}
              </button>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
