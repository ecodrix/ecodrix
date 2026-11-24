"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Clock,
  createIcon,
  type IconComponent,
  Mail,
  MessageCircle,
  Play,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
  Workflow,
  X,
  Zap,
} from "@/components/icons";
import { LiveDot } from "@/components/motion/surface";
import { AppFrame, Pill } from "@/components/product-screens/parts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const CircleDashed = createIcon("circle-dashed");

/* ── The step catalogue: what each kind of step is called and can be set to ── */

type Kind = "trigger" | "wait" | "whatsapp" | "waitReply" | "update" | "approval" | "ai" | "email";

const KINDS: Record<
  Kind,
  { kicker: string; icon: IconComponent; ai?: boolean; options: string[]; title?: (v: string) => string }
> = {
  trigger: {
    kicker: "When something happens",
    icon: Zap,
    options: ["New enquiry", "Form submitted", "Stage changed", "Payment received"],
  },
  wait: { kicker: "Wait", icon: Clock, options: ["5 minutes", "1 hour", "1 day"], title: (v) => `Wait ${v}` },
  whatsapp: { kicker: "Send WhatsApp", icon: MessageCircle, options: ["Welcome message", "Brochure", "Price list"] },
  waitReply: { kicker: "Wait for a reply", icon: Clock, options: ["Up to 1 hour", "Up to 1 day", "Up to 3 days"] },
  update: {
    kicker: "Update contact",
    icon: UserRound,
    options: ["Status: Interested", "Status: Hot lead", "Status: Not now"],
  },
  approval: { kicker: "Ask for approval", icon: ShieldCheck, options: ["Owner approves", "Sales lead approves"] },
  ai: {
    kicker: "AI reply",
    icon: Sparkles,
    ai: true,
    options: ["Draft a friendly follow-up", "Draft a formal follow-up", "Answer from the price list"],
  },
  email: { kicker: "Send email", icon: Mail, options: ["Brochure by email", "Thank-you email"] },
};

/** What a WhatsApp template says, for the preview (the contact's name filled in). */
const TEMPLATE: Record<string, string> = {
  "Welcome message": "Hi Rohan, thanks for your enquiry! Our team will share the details shortly.",
  Brochure: "Hi Rohan, here's the brochure for the Baner project. Shall we book a visit?",
  "Price list": "Hi Rohan, 3BHK flats at Baner start from ₹1.85 Cr. Want the full price list?",
};

/** Steps a person can add at the end of a path. */
const ADDABLE: Kind[] = ["wait", "whatsapp", "email", "update"];

interface Step {
  id: string;
  kind: Kind;
  value: string;
}

type Path = "main" | "replied" | "noReply";
type RunState = "idle" | "running" | "done" | "skipped" | "approval";

let uid = 0;
const step = (kind: Kind, value = KINDS[kind].options[0]): Step => ({ id: `s${++uid}`, kind, value });

const START: Record<Path, Step[]> = {
  main: [step("trigger"), step("wait"), step("whatsapp"), step("waitReply", "Up to 1 day")],
  replied: [step("update")],
  noReply: [step("approval"), step("ai")],
};

const titleOf = (s: Step) => KINDS[s.kind].title?.(s.value) ?? s.value;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ── One step on the canvas ── */

function Node({
  s,
  state,
  selected,
  dashed,
  onSelect,
  onApprove,
}: {
  s: Step;
  state: RunState;
  selected: boolean;
  dashed?: boolean;
  onSelect: () => void;
  onApprove?: () => void;
}) {
  const k = KINDS[s.kind];
  const Icon = k.icon;
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={`${k.kicker}: ${titleOf(s)}. Edit step`}
        className={cn(
          "relative flex w-full min-w-0 items-center gap-2 rounded-[10px] bg-surface px-2 py-1.5 text-left shadow-[var(--shadow-card)] transition-[box-shadow,transform] duration-150 hover:-translate-y-px hover:shadow-[var(--shadow-sm),0_0_0_1px_var(--accent-border)] focus-visible:outline-2 focus-visible:outline-accent",
          dashed && "border border-dashed border-border-strong bg-transparent shadow-none",
          selected && "shadow-[0_0_0_2px_var(--accent)]",
        )}
      >
        <span
          className={cn(
            "grid size-6 shrink-0 place-items-center rounded-[6px]",
            k.ai ? "bg-ai-subtle text-ai" : "bg-accent-muted text-accent",
          )}
        >
          <Icon aria-hidden="true" className="size-3.5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[9.5px] text-subtle">{k.kicker}</span>
          <span className="block truncate text-[11px] font-semibold text-foreground">{titleOf(s)}</span>
        </span>
        <span className="ml-auto shrink-0" aria-hidden="true">
          {state === "done" && <CheckCircle2 className="size-3.5 text-success" />}
          {state === "running" && <Workflow className="size-3.5 animate-pulse text-accent" />}
          {state === "approval" && <ShieldCheck className="size-3.5 text-error" />}
          {state === "skipped" && <CircleDashed className="size-3.5 text-warning" />}
        </span>
        {(state === "running" || state === "approval") && (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute -inset-px rounded-[10px] ring-2",
              state === "approval" ? "ring-error" : k.ai ? "ring-ai" : "ring-accent",
            )}
          />
        )}
      </button>
      {state === "approval" && onApprove && (
        <button
          type="button"
          onClick={onApprove}
          className="absolute -right-1 -bottom-3 z-10 rounded-[6px] bg-accent px-2 py-0.5 text-[10.5px] font-semibold text-white shadow-[var(--shadow-sm)] hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Approve
        </button>
      )}
    </div>
  );
}

const wire = "mx-auto h-2.5 w-px bg-border-strong";

/**
 * A working miniature of the ERIX Flow editor: click a step to change it, add
 * or remove steps, switch the flow off, and press Test run to watch a contact
 * go through it (pick whether they reply; approve the follow-up yourself).
 * Plays one run by itself the first time it's seen, unless motion is reduced.
 */
export function FlowEditorDemo() {
  const [paths, setPaths] = useState(START);
  const [on, setOn] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<"noReply" | "replied">("noReply");
  const [states, setStates] = useState<Record<string, RunState>>({});
  const [run, setRun] = useState<{ status: "running" | "approval" | "done"; startedAt: string } | null>(null);
  const [adding, setAdding] = useState<Path | null>(null);
  const approveRef = useRef<(() => void) | null>(null);
  const runId = useRef(0);
  const root = useRef<HTMLDivElement>(null);
  const autoplayed = useRef(false);

  const all = [...paths.main, ...paths.replied, ...paths.noReply];
  const sel = all.find((s) => s.id === selected) ?? null;
  const running = run?.status === "running" || run?.status === "approval";

  const setState = (id: string, st: RunState) => setStates((m) => ({ ...m, [id]: st }));

  async function testRun(auto = false) {
    const id = ++runId.current;
    const live = () => runId.current === id;
    const fast = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const beat = (ms: number) => sleep(fast ? 120 : ms);
    setSelected(null);
    setAdding(null);
    setStates({});
    setRun({
      status: "running",
      startedAt: new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
    });
    const taken = outcome;
    const skipped = taken === "noReply" ? paths.replied : paths.noReply;
    for (const s of [...paths.main, ...paths[taken]]) {
      if (!live()) return;
      if (s.kind === "approval") {
        setState(s.id, "approval");
        setRun((r) => r && { ...r, status: "approval" });
        // A person approves; the first automatic run approves for them after a moment.
        await new Promise<void>((resolve) => {
          approveRef.current = resolve;
          if (auto) setTimeout(resolve, fast ? 200 : 1800);
        });
        approveRef.current = null;
        if (!live()) return;
        setRun((r) => r && { ...r, status: "running" });
      } else {
        setState(s.id, "running");
        await beat(s.kind === "ai" ? 1300 : s.kind === "waitReply" ? 1000 : 650);
      }
      if (!live()) return;
      setState(s.id, "done");
      if (s.kind === "waitReply") for (const x of skipped) setState(x.id, "skipped");
    }
    setRun((r) => r && { ...r, status: "done" });
  }

  // Play one run the first time the editor scrolls into view.
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !autoplayed.current) {
          autoplayed.current = true;
          io.disconnect();
          void testRun(true);
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
    // biome-ignore lint/correctness/useExhaustiveDependencies: runs once on mount
  }, []);

  // Stop a run that's in flight when the editor goes away.
  useEffect(() => () => void ++runId.current, []);

  const edit = (id: string, value: string) =>
    setPaths((p) => {
      const map = (list: Step[]) => list.map((s) => (s.id === id ? { ...s, value } : s));
      return { main: map(p.main), replied: map(p.replied), noReply: map(p.noReply) };
    });
  const remove = (id: string) => {
    setPaths((p) => ({
      main: p.main.filter((s) => s.id !== id),
      replied: p.replied.filter((s) => s.id !== id),
      noReply: p.noReply.filter((s) => s.id !== id),
    }));
    setSelected(null);
  };
  const add = (path: Path, kind: Kind) => {
    const s = step(kind);
    setPaths((p) => ({ ...p, [path]: [...p[path], s] }));
    setAdding(null);
    setSelected(s.id);
    setRun(null);
    setStates({});
  };

  const node = (s: Step, dashed?: boolean) => (
    <Node
      key={s.id}
      s={s}
      state={states[s.id] ?? "idle"}
      selected={selected === s.id}
      dashed={dashed && states[s.id] === "skipped"}
      onSelect={() => setSelected(selected === s.id ? null : s.id)}
      onApprove={() => approveRef.current?.()}
    />
  );

  const addButton = (path: Path) => (
    <div className="relative mt-1.5">
      <button
        type="button"
        onClick={() => setAdding(adding === path ? null : path)}
        disabled={running}
        aria-expanded={adding === path}
        className="mx-auto flex items-center gap-1 rounded-[6px] px-2 py-0.5 text-[10.5px] font-semibold text-subtle transition-colors hover:bg-surface hover:text-accent focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-40"
      >
        <Plus aria-hidden="true" className="size-3" /> Add step
      </button>
      {adding === path && (
        <ul className="absolute top-full left-1/2 z-20 mt-1 w-40 -translate-x-1/2 rounded-[10px] bg-surface p-1 shadow-[0_0_0_1px_var(--border),var(--shadow-lg)]">
          {ADDABLE.map((k) => {
            const I = KINDS[k].icon;
            return (
              <li key={k}>
                <button
                  type="button"
                  onClick={() => add(path, k)}
                  className="flex w-full items-center gap-2 rounded-[6px] px-2 py-1.5 text-left text-[11px] font-medium text-foreground hover:bg-sunken focus-visible:bg-sunken focus-visible:outline-none"
                >
                  <I aria-hidden="true" className="size-3.5 text-accent" />
                  {KINDS[k].kicker}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );

  const canDelete = sel && sel.kind !== "trigger" && sel.kind !== "waitReply";

  return (
    <div ref={root}>
      <AppFrame
        title="Flow / Automations / New enquiry follow-up"
        nav="flow"
        className="h-[25rem]"
        action={
          <button
            type="button"
            role="switch"
            aria-checked={on}
            onClick={() => setOn(!on)}
            className="rounded-[6px] focus-visible:outline-2 focus-visible:outline-accent"
          >
            <span className="sr-only">Flow switched on</span>
            {on ? (
              <Pill tone="success">
                <LiveDot className="mr-0.5" /> On
              </Pill>
            ) : (
              <Pill tone="neutral">Off</Pill>
            )}
          </button>
        }
      >
        <div className="flex h-full">
          <div
            data-lenis-prevent
            className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:14px_14px] p-3"
          >
            <div className="mx-auto flex w-full max-w-[19rem] flex-col">
              {paths.main.map((s, i) => (
                <div key={s.id} className="flex flex-col">
                  {i > 0 && <span aria-hidden="true" className={wire} />}
                  {node(s)}
                </div>
              ))}
            </div>
            <div className="mx-auto mt-1 grid w-full max-w-[24rem] grid-cols-2 gap-2">
              {(["replied", "noReply"] as const).map((path) => (
                <div key={path} className="flex min-w-0 flex-col">
                  <p className="pb-1 text-center text-[9.5px] font-semibold text-subtle">
                    {path === "replied" ? "Replied" : "No reply"}
                  </p>
                  {paths[path].map((s, i) => (
                    <div key={s.id} className="flex flex-col">
                      {i > 0 && <span aria-hidden="true" className={wire} />}
                      {node(s, true)}
                    </div>
                  ))}
                  {addButton(path)}
                </div>
              ))}
            </div>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-2 rounded-[10px] bg-surface px-2.5 py-2 text-[10.5px] shadow-[var(--shadow-card)]">
              {run ? (
                <span className="text-foreground">
                  Run · <span className="font-semibold">Rohan Mehta</span>
                  <span className="text-subtle"> · started {run.startedAt}</span>
                </span>
              ) : (
                <fieldset className="flex items-center gap-1.5">
                  <legend className="sr-only">In the test run, the contact</legend>
                  <span className="text-subtle">Test as Rohan:</span>
                  {(["replied", "noReply"] as const).map((o) => (
                    <button
                      key={o}
                      type="button"
                      aria-pressed={outcome === o}
                      onClick={() => setOutcome(o)}
                      className={cn(
                        "rounded-[6px] px-1.5 py-0.5 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-accent",
                        outcome === o ? "bg-accent-muted text-accent" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {o === "replied" ? "Replies" : "Doesn't reply"}
                    </button>
                  ))}
                </fieldset>
              )}
              <span className="flex items-center gap-1.5" aria-live="polite">
                {run?.status === "running" && <Pill tone="primary">Running</Pill>}
                {run?.status === "approval" && (
                  <Pill tone="error" icon={ShieldCheck}>
                    Needs approval
                  </Pill>
                )}
                {run?.status === "done" && (
                  <Pill tone="success" icon={CheckCircle2}>
                    Done
                  </Pill>
                )}
                {!running && (
                  <button
                    type="button"
                    onClick={() => (run ? (setRun(null), setStates({})) : void testRun())}
                    disabled={!on}
                    title={on ? undefined : "Switch the flow on to test it"}
                    className="inline-flex items-center gap-1 rounded-[6px] bg-accent px-2 py-1 font-semibold text-white transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {run ? (
                      "New test"
                    ) : (
                      <>
                        <Play aria-hidden="true" className="size-3" /> Test run
                      </>
                    )}
                  </button>
                )}
              </span>
            </div>
          </div>

          {sel && (
            <aside
              aria-label="Step settings"
              className="absolute inset-x-0 bottom-0 z-30 flex flex-col gap-2.5 border-t border-border bg-surface p-3 shadow-[var(--shadow-lg)] sm:static sm:w-52 sm:shrink-0 sm:border-t-0 sm:border-l sm:shadow-none"
              onKeyDown={(e) => e.key === "Escape" && !e.defaultPrevented && setSelected(null)}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[12px] font-semibold text-foreground">{KINDS[sel.kind].kicker}</p>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Close step settings"
                  className="grid size-6 place-items-center rounded-[6px] text-subtle hover:bg-sunken hover:text-foreground"
                >
                  <X aria-hidden="true" className="size-3.5" />
                </button>
              </div>
              <label className="flex flex-col gap-1 text-[10.5px] font-semibold text-muted-foreground">
                {sel.kind === "trigger" ? "Start when" : sel.kind === "whatsapp" ? "Template" : "Setting"}
                <Select value={sel.value} onValueChange={(v) => edit(sel.id, v)} disabled={running}>
                  <SelectTrigger size="sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {KINDS[sel.kind].options.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
              {sel.kind === "whatsapp" && (
                <p className="rounded-[8px] border border-accent-border bg-accent-muted px-2 py-1.5 text-[11px] leading-snug text-foreground">
                  {TEMPLATE[sel.value]}
                </p>
              )}
              {sel.kind === "ai" && (
                <p className="text-[10.5px] leading-snug text-muted-foreground">
                  Writes from your price list and past chats. Nothing goes out until it&apos;s approved.
                </p>
              )}
              {sel.kind === "approval" && (
                <p className="text-[10.5px] leading-snug text-muted-foreground">
                  The run waits here until they approve in the Approvals inbox.
                </p>
              )}
              {canDelete && (
                <button
                  type="button"
                  onClick={() => remove(sel.id)}
                  disabled={running}
                  className="mt-auto inline-flex items-center gap-1.5 self-start rounded-[6px] px-1.5 py-1 text-[11px] font-semibold text-error hover:bg-error-subtle disabled:opacity-40"
                >
                  <Trash2 aria-hidden="true" className="size-3.5" /> Delete step
                </button>
              )}
            </aside>
          )}
        </div>
      </AppFrame>
      <p className="mt-3 flex h-7 items-center justify-center gap-1.5 text-[12.5px] text-muted-foreground motion-reduce:hidden">
        <Sparkles aria-hidden="true" className="size-3.5 text-ai" />
        Try it: click a step to change it, add one, or press <span className="font-semibold">Test run</span>.
      </p>
    </div>
  );
}
