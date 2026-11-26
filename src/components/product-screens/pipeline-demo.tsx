"use client";

import { useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Plus, Workflow, X } from "@/components/icons";
import { AppFrame, Pill } from "@/components/product-screens/parts";
import { cn } from "@/lib/utils";

const STAGES = [
  { id: "enquiry", name: "Enquiry", dot: "bg-[var(--blue-500)]" },
  { id: "visit", name: "Site visit booked", dot: "bg-accent" },
  { id: "shortlisted", name: "Shortlisted", dot: "bg-[var(--purple-500)]" },
  { id: "token", name: "Token paid", dot: "bg-success" },
] as const;
type StageId = (typeof STAGES)[number]["id"];

interface Deal {
  id: string;
  name: string;
  detail: string;
  value: number;
  stage: StageId;
}

const START: Deal[] = [
  { id: "d1", name: "Meera Iyer", detail: "2BHK, Wakad", value: 120000, stage: "enquiry" },
  { id: "d2", name: "Rohan Mehta", detail: "3BHK, Baner", value: 185000, stage: "enquiry" },
  { id: "d3", name: "Ravi Kumar", detail: "Plot, Hinjewadi", value: 125000, stage: "visit" },
  { id: "d4", name: "Isha Shah", detail: "Villa, Baner", value: 240000, stage: "shortlisted" },
];

/** What shows on a deal when it lands in a stage: the visit reminder automation, or the win. */
const ON_ENTER: Partial<Record<StageId, { label: string; tone: "ai" | "success"; icon: typeof Workflow }>> = {
  visit: { label: "Reminder set", tone: "ai", icon: Workflow },
  token: { label: "Won", tone: "success", icon: CheckCircle2 },
};

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const index = (s: StageId) => STAGES.findIndex((x) => x.id === s);

/**
 * A working miniature of the ERIX pipeline board: drag a deal to another
 * stage (or use its arrows), watch the stage totals change and the stage's
 * automation kick in, and add a lead of your own.
 */
export function PipelineDemo() {
  const [deals, setDeals] = useState(START);
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<StageId | null>(null);
  const [moved, setMoved] = useState<Record<string, StageId>>({});
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: "", value: "" });
  const [said, setSaid] = useState("");

  const move = (id: string, stage: StageId) => {
    const d = deals.find((x) => x.id === id);
    if (!d || d.stage === stage) return;
    setDeals((list) => list.map((x) => (x.id === id ? { ...x, stage } : x)));
    setMoved((m) => ({ ...m, [id]: stage }));
    const auto = ON_ENTER[stage];
    setSaid(`${d.name} moved to ${STAGES[index(stage)].name}.${auto ? ` ${auto.label}.` : ""}`);
  };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const name = draft.name.trim();
    const value = Number(draft.value.replace(/[^\d]/g, ""));
    if (!name) return;
    const d: Deal = {
      id: `n${Date.now()}`,
      name,
      detail: "From the website form",
      value: value || 50000,
      stage: "enquiry",
    };
    setDeals((list) => [...list, d]);
    setSaid(`${name} added to Enquiry.`);
    setDraft({ name: "", value: "" });
    setAdding(false);
  };

  return (
    <div>
      <AppFrame
        title="CRM / Pipeline"
        nav="crm"
        className="h-[25rem]"
        action={
          <span className="flex gap-1 text-[11px]">
            <span className="rounded-[6px] px-2 py-1 text-muted-foreground">List</span>
            <span className="rounded-[6px] bg-accent px-2 py-1 font-semibold text-white">Board</span>
          </span>
        }
      >
        <p className="sr-only" aria-live="polite">
          {said}
        </p>
        <div
          data-lenis-prevent
          // Stages stack (1 column, then 2) until the frame can show all four side by side: no header is ever cut off.
          className="grid h-full grid-cols-1 content-start items-start gap-2.5 overflow-y-auto overscroll-contain p-3 sm:p-4 @xl:grid-cols-2 @5xl:flex @5xl:overflow-x-auto @5xl:overflow-y-hidden"
        >
          {STAGES.map((stage, si) => {
            const list = deals.filter((d) => d.stage === stage.id);
            return (
              <section
                key={stage.id}
                aria-label={stage.name}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOver(stage.id);
                }}
                onDragLeave={() => setOver((o) => (o === stage.id ? null : o))}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData("text/plain") || dragging;
                  if (id) move(id, stage.id);
                  setOver(null);
                  setDragging(null);
                }}
                className={cn(
                  "flex w-full flex-col rounded-[12px] bg-sunken p-1.5 transition-shadow @5xl:max-h-full @5xl:w-[172px] @5xl:shrink-0",
                  over === stage.id && dragging && "shadow-[inset_0_0_0_2px_var(--accent)]",
                )}
              >
                <div className="flex items-center justify-between gap-1 px-1 pb-2 text-[11px] font-semibold text-foreground">
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", stage.dot)} />
                    <span className="truncate">{stage.name}</span>
                    <span className="text-subtle">{list.length}</span>
                  </span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {inr(list.reduce((n, d) => n + d.value, 0))}
                  </span>
                </div>
                <ul className="min-h-10 space-y-2 overflow-y-auto">
                  {list.map((d) => {
                    const auto = moved[d.id] === d.stage ? ON_ENTER[d.stage] : undefined;
                    return (
                      <li
                        key={d.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", d.id);
                          e.dataTransfer.effectAllowed = "move";
                          setDragging(d.id);
                        }}
                        onDragEnd={() => {
                          setDragging(null);
                          setOver(null);
                        }}
                        className={cn(
                          "group relative cursor-grab rounded-[10px] bg-surface p-2.5 shadow-[var(--shadow-card)] transition-[transform,box-shadow,opacity] active:cursor-grabbing motion-safe:animate-rise",
                          dragging === d.id && "opacity-50",
                          moved[d.id] === d.stage && "ring-1 ring-accent-border",
                        )}
                      >
                        <p className="truncate text-[12px] font-semibold text-foreground">{d.name}</p>
                        <p className="truncate text-[11px] text-muted-foreground">{d.detail}</p>
                        <p className="mt-1 text-[11px] font-semibold tabular-nums text-foreground">{inr(d.value)}</p>
                        {auto && (
                          <Pill tone={auto.tone} icon={auto.icon} className="mt-1.5">
                            {auto.label}
                          </Pill>
                        )}
                        {/* Keyboard and touch: the arrows do what dragging does. */}
                        <span className="absolute top-1.5 right-1.5 flex gap-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                          {si > 0 && (
                            <button
                              type="button"
                              onClick={() => move(d.id, STAGES[si - 1].id)}
                              aria-label={`Move ${d.name} back to ${STAGES[si - 1].name}`}
                              className="grid size-5 place-items-center rounded-[5px] bg-sunken text-muted-foreground hover:bg-accent-muted hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
                            >
                              <ChevronLeft aria-hidden="true" className="size-3" />
                            </button>
                          )}
                          {si < STAGES.length - 1 && (
                            <button
                              type="button"
                              onClick={() => move(d.id, STAGES[si + 1].id)}
                              aria-label={`Move ${d.name} to ${STAGES[si + 1].name}`}
                              className="grid size-5 place-items-center rounded-[5px] bg-sunken text-muted-foreground hover:bg-accent-muted hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
                            >
                              <ChevronRight aria-hidden="true" className="size-3" />
                            </button>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                {stage.id === "enquiry" &&
                  (adding ? (
                    <form
                      onSubmit={add}
                      className="mt-2 space-y-1.5 rounded-[10px] bg-surface p-2 shadow-[var(--shadow-card)]"
                    >
                      <input
                        // biome-ignore lint/a11y/noAutofocus: opened by the person on purpose
                        autoFocus
                        value={draft.name}
                        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                        placeholder="Name"
                        aria-label="Lead name"
                        maxLength={40}
                        className="h-7 w-full rounded-[6px] bg-background px-2 text-[11.5px] shadow-[inset_0_0_0_1px_var(--border-strong)] outline-none focus:shadow-[inset_0_0_0_2px_var(--accent)]"
                      />
                      <input
                        value={draft.value}
                        onChange={(e) => setDraft({ ...draft, value: e.target.value })}
                        placeholder="Deal value, ₹"
                        aria-label="Deal value in rupees"
                        inputMode="numeric"
                        maxLength={12}
                        className="h-7 w-full rounded-[6px] bg-background px-2 text-[11.5px] shadow-[inset_0_0_0_1px_var(--border-strong)] outline-none focus:shadow-[inset_0_0_0_2px_var(--accent)]"
                      />
                      <span className="flex gap-1">
                        <button
                          type="submit"
                          disabled={!draft.name.trim()}
                          className="flex-1 rounded-[6px] bg-accent py-1 text-[11px] font-semibold text-white hover:bg-accent-hover disabled:opacity-45"
                        >
                          Add lead
                        </button>
                        <button
                          type="button"
                          onClick={() => setAdding(false)}
                          aria-label="Cancel"
                          className="grid size-6 place-items-center rounded-[6px] text-subtle hover:bg-sunken"
                        >
                          <X aria-hidden="true" className="size-3.5" />
                        </button>
                      </span>
                    </form>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAdding(true)}
                      className="mt-2 flex items-center justify-center gap-1 rounded-[8px] py-1.5 text-[11px] font-semibold text-subtle hover:bg-surface hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
                    >
                      <Plus aria-hidden="true" className="size-3" /> Add lead
                    </button>
                  ))}
              </section>
            );
          })}
        </div>
      </AppFrame>
    </div>
  );
}
