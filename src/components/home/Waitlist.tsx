"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CheckCircle2, Copy, Loader2, LogIn } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StyledPhoneInput } from "@/components/ui/phone-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CONSOLE_URL } from "@/lib/docs";
import { analyticsConsented } from "@/lib/legal/consent";
import { getLanding, getVisitorId, trackEvent } from "@/lib/track";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_ERIX_SOCKET_URL || "https://api.ecodrix.com";

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  interest: string;
}

const interests = [
  { value: "full_platform", label: "The whole platform" },
  { value: "crm", label: "CRM and pipeline" },
  { value: "whatsapp", label: "WhatsApp inbox and broadcasts" },
  { value: "email", label: "Email campaigns" },
  // { value: "laie", label: "Finding new leads (LAIE)" },
  { value: "other", label: "Something else" },
];

const fieldError = "mt-1.5 text-sm text-error";

/**
 * Early-access waitlist form (POST /v1/api/platform/public/waitlist), shown
 * on the closing navy band. Errors show under the form with their cause,
 * never as a browser alert. A repeat signup says which case it is (`status`):
 * already on the list, or already has an account (sign in); either way the
 * details go to that inbox, never onto this page.
 */
export function WaitlistForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [outcome, setOutcome] = useState<"joined" | "waitlisted" | "account">("joined");
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState<number | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({ defaultValues: { interest: "full_platform" } });

  const onSubmit = async (data: FormData) => {
    setState("sending");
    setError(null);
    try {
      const res = await fetch(`${API_URL}/v1/api/platform/public/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          source: "ecodrix_website",
          // An invite link lands here as ?ref=CODE.
          referral: new URLSearchParams(window.location.search).get("ref") || undefined,
          // First-touch attribution, only with analytics consent.
          attribution: analyticsConsented() ? { ...getLanding(), visitorId: getVisitorId() } : undefined,
        }),
      });
      const result = await res.json().catch(() => null);
      if (!res.ok || !result?.success) {
        setState("idle");
        setError(
          res.status === 429
            ? "Too many tries from this network. Wait a minute and try again."
            : (result?.message ?? "We couldn't add you to the list. Try again in a moment."),
        );
        return;
      }
      setOutcome(result.status === "account" ? "account" : res.status === 201 ? "joined" : "waitlisted");
      setState("sent");
      // A new entry (201, not "already on the list"): GA4 `generate_lead` +
      // the first-party form_submit action, both consent-gated in trackEvent.
      if (res.status === 201) trackEvent("generate_lead", "form_submit", { form: "waitlist" });
      setPosition(result.data?.position ?? null);
      setReferralCode(result.data?.referralCode ?? null);
      reset();
    } catch {
      setState("idle");
      setError("We couldn't reach the server. Check your connection and try again.");
    }
  };

  const copyReferralLink = async () => {
    if (!referralCode) return;
    await navigator.clipboard.writeText(`${window.location.origin}?ref=${referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="surface-light rounded-lg bg-surface p-6 text-foreground shadow-[var(--shadow-lg)] md:p-8">
      {state === "sent" && outcome === "account" ? (
        <div role="status" className="py-6 text-center">
          <LogIn aria-hidden="true" className="mx-auto size-10 text-accent" />
          <h3 className="mt-4 text-2xl">You already have an account</h3>
          <p className="mt-2 text-muted-foreground">
            No need to wait: sign in to your ECODrIx workspace. We&apos;ve also emailed you the link.
          </p>
          <a href={`${CONSOLE_URL}/auth/login`} className={cn(buttonVariants(), "mt-6")}>
            Sign in
          </a>
        </div>
      ) : state === "sent" && outcome === "waitlisted" ? (
        <div role="status" className="py-6 text-center">
          <CheckCircle2 aria-hidden="true" className="mx-auto size-10 text-success" />
          <h3 className="mt-4 text-2xl">You&apos;re already on the early-access list</h3>
          <p className="mt-2 text-muted-foreground">
            We&apos;ll email you as soon as your turn comes. Your place in the queue and your invite link are in your
            inbox.
          </p>
        </div>
      ) : state === "sent" ? (
        <div role="status" className="py-6 text-center">
          <CheckCircle2 aria-hidden="true" className="mx-auto size-10 text-success" />
          <h3 className="mt-4 text-2xl">You’re on the early-access list</h3>
          <p className="mt-2 text-muted-foreground">
            {position
              ? `You're number ${position.toLocaleString("en-IN")}. We'll be in touch soon.`
              : "We'll be in touch soon."}
          </p>
          {referralCode && (
            <div className="mt-6">
              <p className="text-sm text-muted-foreground">
                Share your link: every business that joins through it moves you up the list.
              </p>
              <button
                type="button"
                onClick={copyReferralLink}
                className={cn(buttonVariants({ variant: "ghost" }), "mt-3")}
              >
                <Copy aria-hidden="true" className="size-4" />
                {copied ? "Link copied" : "Copy your invite link"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label htmlFor="wl-name">Your name</Label>
            <Input
              id="wl-name"
              autoComplete="name"
              placeholder="First and last name"
              type="text"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "wl-name-err" : undefined}
              className="mt-1.5"
              {...register("name", { required: "Enter your name." })}
            />
            {errors.name && (
              <p id="wl-name-err" className={fieldError}>
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="wl-email">Work email</Label>
              <Input
                id="wl-email"
                type="email"
                placeholder="Work email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "wl-email-err" : undefined}
                className="mt-1.5"
                {...register("email", {
                  required: "Enter your email.",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Check the email address." },
                })}
              />
              {errors.email && (
                <p id="wl-email-err" className={fieldError}>
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="wl-company">Business name</Label>
              <Input
                id="wl-company"
                autoComplete="organization"
                placeholder="Business name"
                className="mt-1.5"
                {...register("company")}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="wl-phone">WhatsApp number (optional)</Label>
            <div className="mt-1.5">
              <Controller
                name="phone"
                control={control}
                render={({ field }) => <StyledPhoneInput id="wl-phone" value={field.value} onChange={field.onChange} />}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="wl-interest">What do you want to use first?</Label>
            <Controller
              name="interest"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="wl-interest" className="mt-1.5 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {interests.map((i) => (
                      <SelectItem key={i.value} value={i.value}>
                        {i.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {error && (
            <p role="alert" className="rounded-md bg-error-subtle px-3 py-2 text-sm text-error">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={state === "sending"}
            className={cn(buttonVariants(), "w-full disabled:cursor-not-allowed disabled:opacity-60")}
          >
            {state === "sending" && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
            {state === "sending" ? "Sending…" : "Request early access"}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            We only use your details to contact you about early access. See our{" "}
            <a href="/legal/privacy" className="underline hover:text-accent">
              privacy policy
            </a>
            .
          </p>
        </form>
      )}
    </div>
  );
}
