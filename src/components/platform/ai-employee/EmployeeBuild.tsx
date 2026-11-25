"use client";

import dynamic from "next/dynamic";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { ArrowRight, Check, type GlyphName, Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  BUILD_CHIPS,
  BUILD_LANGUAGES,
  BUILD_MAX_LENGTH,
  BUILD_MIN_LENGTH,
  BUILD_NOTE_FROM,
  BUILD_PLACEHOLDERS,
  interestFor,
} from "@/lib/platform/employee-build";
import { cn } from "@/lib/utils";

// Same lazy load as the home page: the form's libraries load only when it is needed (the wrapper holds its height).
const loadForm = () => import("@/components/home/Waitlist").then((m) => m.WaitlistForm);
const WaitlistForm = dynamic(loadForm, {
  ssr: false,
  loading: () => <div className="min-h-[432px] md:min-h-[348px]" />,
});

const TYPE_MS = 34;
const HOLD_MS = 2600;
const ERASE_MS = 16;

/** Types the placeholder through the sentences; frozen on the full sentence while `run` is false. */
function useTypingPlaceholder(run: boolean) {
  const [shown, setShown] = useState(BUILD_PLACEHOLDERS[0]);
  const idx = useRef(0);
  useEffect(() => {
    if (!run || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(BUILD_PLACEHOLDERS[idx.current]);
      return;
    }
    let n = 0;
    let t: ReturnType<typeof setTimeout>;
    const type = () => {
      const s = BUILD_PLACEHOLDERS[idx.current];
      n += 1;
      setShown(s.slice(0, n));
      if (n < s.length) t = setTimeout(type, TYPE_MS);
      else t = setTimeout(erase, HOLD_MS);
    };
    const erase = () => {
      n -= 1;
      setShown(BUILD_PLACEHOLDERS[idx.current].slice(0, n));
      if (n > 0) t = setTimeout(erase, ERASE_MS);
      else {
        idx.current = (idx.current + 1) % BUILD_PLACEHOLDERS.length;
        t = setTimeout(type, 250);
      }
    };
    // Resume by erasing the frozen full sentence, then move on.
    n = BUILD_PLACEHOLDERS[idx.current].length;
    t = setTimeout(erase, HOLD_MS);
    return () => clearTimeout(t);
  }, [run]);
  return shown;
}

/** Example-job chip: the chosen one swaps its icon for a check and fills, so it never relies on colour alone. */
function Chip({
  on,
  icon,
  onClick,
  children,
}: {
  on: boolean;
  icon?: GlyphName;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-[14px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 md:min-h-9 md:px-3.5",
        on
          ? "border-white bg-white/16 text-foreground forced-colors:border-[Highlight]"
          : "border-border text-muted-foreground hover:border-border-mid hover:bg-hover hover:text-foreground",
      )}
    >
      {on ? <Check aria-hidden="true" className="size-4" /> : icon && <Icon name={icon} size={16} variant="line" />}
      {children}
    </button>
  );
}

/** Hub section: one question, a big text box, example jobs, then (in place) the early-access form. */
export function EmployeeBuild() {
  const [step, setStep] = useState<1 | 2>(1);
  const [text, setText] = useState("");
  const [lang, setLang] = useState<string>(BUILD_LANGUAGES[0].value);
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState("");
  const boxRef = useRef<HTMLTextAreaElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  const placeholder = useTypingPlaceholder(!focused && text === "");
  const langLabel = BUILD_LANGUAGES.find((l) => l.value === lang)?.label ?? "English";
  const left = BUILD_MAX_LENGTH - text.length;

  const focusEnd = useCallback(() => {
    const el = boxRef.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, []);

  // Focus follows the swap: step 2 heading going forward, the text box coming back.
  useEffect(() => {
    if (!moved.current) return;
    if (step === 2) doneRef.current?.focus();
    else focusEnd();
  }, [step, focusEnd]);

  const pick = (sentence: string) => {
    flushSync(() => {
      setText(sentence);
      setError("");
    });
    focusEnd();
  };

  const build = () => {
    if (text.trim().length < BUILD_MIN_LENGTH) {
      setError("Write the job in a sentence or two first.");
      boxRef.current?.focus();
      return;
    }
    setError("");
    moved.current = true;
    setStep(2);
  };

  return (
    <section id="build" aria-labelledby="build-title" className="py-section scroll-mt-20">
      <div className="mx-auto w-full max-w-wrap px-gutter">
        <div className="band-navy forced-colors:border forced-colors:border-[CanvasText] rounded-[24px] p-5 sm:p-7 md:rounded-[28px] md:p-10">
          {step === 1 ? (
            // No fade on first paint, only when coming back from step 2.
            <div className={cn(moved.current && "motion-safe:animate-fade")}>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-0">
                <h2
                  id="build-title"
                  className="font-display text-[clamp(24px,3vw,34px)]/[1.2] font-bold tracking-tight"
                >
                  What should your AI employee do?
                </h2>
                <Select value={lang} onValueChange={setLang}>
                  <SelectTrigger
                    aria-label="Language your AI employee replies in"
                    className="-ml-2 h-auto min-h-11 w-auto cursor-pointer justify-start gap-1.5 rounded-full border-transparent bg-transparent px-2 font-display text-[clamp(24px,3vw,34px)]/[1.2] font-bold tracking-tight text-ai hover:border-transparent hover:bg-hover focus:border-transparent focus:ring-0 focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/60 forced-colors:border-[ButtonText] [&>svg]:size-5 [&>svg]:text-ai"
                  >
                    <span aria-hidden="true" className="text-foreground">
                      in
                    </span>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="min-w-48 rounded-[12px]! border-border bg-white" align="start">
                    {BUILD_LANGUAGES.map((l) => (
                      <SelectItem
                        key={l.value}
                        value={l.value}
                        className="min-h-11 text-[15px] focus:text-foreground data-[state=checked]:text-foreground"
                      >
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Textarea
                ref={boxRef}
                aria-labelledby="build-title"
                aria-describedby="build-note build-error"
                value={text}
                maxLength={BUILD_MAX_LENGTH}
                rows={4}
                placeholder={placeholder}
                onChange={(e) => {
                  setText(e.target.value);
                  setError("");
                }}
                onFocus={() => {
                  setFocused(true);
                  void loadForm();
                }}
                onBlur={() => setFocused(false)}
                className="mt-4 block max-h-[40dvh] min-h-32 resize-none overflow-y-auto rounded-2xl border-border bg-surface p-4 text-[17px]/[1.55] placeholder:text-subtle hover:border-border-mid focus-visible:border-white focus-visible:ring-white/25 md:min-h-40 md:p-5"
              />
              <p
                id="build-note"
                aria-live="polite"
                className="mt-2 text-right text-sm text-muted-foreground empty:hidden"
              >
                {text.length > BUILD_NOTE_FROM ? `${left} letters left` : ""}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="mr-1 text-[15px] font-medium text-muted-foreground">Try:</span>
                {BUILD_CHIPS.map((c) => (
                  <Chip key={c.key} on={text === c.sentence} icon={c.icon} onClick={() => pick(c.sentence)}>
                    {c.label}
                  </Chip>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-4 min-[600px]:flex-row min-[600px]:items-center min-[600px]:justify-between min-[600px]:gap-6">
                <p className="text-[15px] text-muted-foreground">Write it your way: English, Hindi or Telugu.</p>
                <Button
                  type="button"
                  size="lg"
                  onClick={build}
                  className="w-full whitespace-nowrap min-[600px]:w-auto min-[600px]:shrink-0"
                >
                  Build my AI employee
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Button>
              </div>
              <p
                id="build-error"
                role="alert"
                className="mt-3 w-fit rounded-md bg-error-subtle px-3 py-2 text-[15px] font-medium text-error empty:hidden"
              >
                {error}
              </p>
            </div>
          ) : (
            <div className="motion-safe:animate-fade">
              <h2
                id="build-title"
                ref={doneRef}
                tabIndex={-1}
                className="font-display text-[clamp(24px,3vw,34px)]/[1.2] font-bold tracking-tight outline-none"
              >
                Tell us where to reach you
              </h2>
              <p className="mt-3 max-w-[60ch] text-[16px]/[1.6] text-muted-foreground">
                ERIX is in early access. We set up this AI employee with you, around the job you wrote.
              </p>
              <div className="mt-8 grid gap-8 md:grid-cols-[1fr_minmax(0,460px)] md:gap-12">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">Your AI employee&apos;s job</p>
                  <blockquote className="mt-2 whitespace-pre-wrap break-words rounded-2xl border border-border-soft bg-surface p-4 text-[16px]/[1.6]">
                    {text}
                  </blockquote>
                  <p className="mt-3 flex flex-wrap items-center gap-x-4 text-[15px] text-muted-foreground">
                    <span>
                      Replies in <span className="font-semibold text-ai">{langLabel}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="inline-flex min-h-11 cursor-pointer items-center font-semibold text-foreground underline underline-offset-4"
                    >
                      Edit
                    </button>
                  </p>
                  <ul className="mt-4 list-none space-y-3 border-t border-border-soft pt-5 text-[15px]/[1.55] text-muted-foreground">
                    {[
                      "We email you when your turn comes.",
                      "We set it up with you, from this job.",
                      "You test it, then switch it on.",
                    ].map((l) => (
                      <li key={l} className="flex gap-3">
                        <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-ai" />
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
                <WaitlistForm job={{ note: text, lang, interest: interestFor(text) }} />
              </div>
            </div>
          )}
        </div>
        <p className="mx-auto mt-4 max-w-[60ch] text-balance text-center text-sm text-muted-foreground">
          Early access. We set it up with you, and nothing answers your customers until you switch it on.
        </p>
      </div>
    </section>
  );
}
