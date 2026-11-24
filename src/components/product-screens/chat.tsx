"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BookOpen, Check, CheckCheck, FileText, Send, Sparkles, UserRound } from "@/components/icons";
import { cn } from "@/lib/utils";

/* ── A scripted AI agent for the marketing demos (no network, example data) ── */

export interface ChatMsg {
  id: number;
  /** customer = the person enquiring; ai = the AI agent; you = the business; team = a teammate. */
  from: "customer" | "ai" | "you" | "team";
  text: string;
  time: string;
  source?: string;
  attach?: string;
  status?: "sent" | "delivered" | "read";
}

interface Answer {
  text: string;
  source?: string;
  attach?: string;
  /** Hand the chat to a person instead of answering. */
  handoff?: boolean;
}

// What the agent knows about the example business (a Pune builder's Baner project).
const KNOWLEDGE: { match: RegExp; answer: Answer }[] = [
  {
    match: /discount|negotiat|lower|best price|deal|call me|talk|speak|person|human|someone|manager/i,
    answer: { text: "Let me bring in Priya from our sales team. She'll reply here in a few minutes.", handoff: true },
  },
  {
    match: /price|cost|rate|budget|how much|kitna|kitne|daam|₹|lakh|crore|cr\b/i,
    answer: {
      text: "3BHK flats at Baner start from ₹1.85 Cr; 2BHK from ₹1.2 Cr. Shall I send the full price list?",
      source: "Price list",
    },
  },
  {
    match: /\b(11|4)\s?(am|pm)?\b|morning|evening/i,
    answer: { text: "Booked for Saturday. We'll send a WhatsApp reminder before your visit.", source: "Visit slots" },
  },
  {
    match: /visit|see the|saturday|sunday|tomorrow|book|available|open/i,
    answer: {
      text: "Yes, two 3BHK flats are open. Saturday has visits at 11 am and 4 pm. Which suits you?",
      source: "Visit slots",
    },
  },
  {
    match: /park/i,
    answer: { text: "Every 3BHK has one covered parking spot. A second spot is ₹3,00,000.", source: "Baner listing" },
  },
  {
    match: /photo|picture|pic|brochure|video|floor plan|layout|send/i,
    answer: {
      text: "Here's the brochure with photos and floor plans.",
      source: "Baner listing",
      attach: "Baner-3BHK-brochure.pdf",
    },
  },
  {
    match: /loan|emi|bank|finance/i,
    answer: {
      text: "We work with HDFC, SBI and ICICI for home loans, and our team helps with the paperwork.",
      source: "FAQ",
    },
  },
  {
    match: /possession|ready|when.*(move|complete)|handover/i,
    answer: { text: "Possession is December 2027. The tower is RERA registered.", source: "Baner listing" },
  },
  {
    match: /^(hi|hello|hey|namaste|hii+)\b/i,
    answer: { text: "Hi Rohan! Ask me about prices, site visits, parking, loans or the brochure." },
  },
  {
    match: /thank|thanks|ok|great|cool|👍/i,
    answer: { text: "Happy to help! Message here any time." },
  },
];

const FALLBACK: Answer = {
  text: "Good question. I've passed it to the team, and they'll reply here shortly.",
  handoff: true,
};

export function answerFor(text: string): Answer {
  return KNOWLEDGE.find((k) => k.match.test(text.trim()))?.answer ?? FALLBACK;
}

const now = () => new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }).toLowerCase();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let seq = 0;
export const msg = (m: Omit<ChatMsg, "id" | "time"> & { time?: string }): ChatMsg => ({
  id: ++seq,
  time: m.time ?? now(),
  ...m,
});

/* ── Pieces ── */

/** ✓ sent → ✓✓ delivered → ✓✓ read (blue), WhatsApp's meaning. */
function Ticks({ status }: { status: ChatMsg["status"] }) {
  if (!status) return null;
  if (status === "sent") return <Check aria-label="Sent" className="size-3.5 text-subtle" />;
  return (
    <CheckCheck
      aria-label={status === "read" ? "Read" : "Delivered"}
      className={cn("size-3.5", status === "read" ? "text-accent" : "text-subtle")}
      strokeWidth={status === "read" ? 2.75 : undefined}
    />
  );
}

export function MessageBubble({ m }: { m: ChatMsg }) {
  const out = m.from !== "customer";
  return (
    <li
      className={cn(
        "max-w-[88%] rounded-[10px] border px-2.5 py-1.5 text-[12px] leading-snug text-foreground motion-safe:animate-rise",
        out ? "ml-auto border-accent-border bg-accent-muted" : "border-border bg-surface",
      )}
    >
      {m.from === "ai" && (
        <span className="mb-0.5 flex items-center gap-1 text-[10.5px] font-semibold text-ai">
          <Sparkles aria-hidden="true" className="size-3" /> AI agent
        </span>
      )}
      {m.from === "team" && (
        <span className="mb-0.5 flex items-center gap-1 text-[10.5px] font-semibold text-accent">
          <UserRound aria-hidden="true" className="size-3" /> Priya · Sales
        </span>
      )}
      <p>{m.text}</p>
      {m.attach && (
        <span className="mt-1.5 flex items-center gap-1.5 rounded-[6px] bg-surface px-2 py-1 text-[11px] font-medium shadow-[var(--shadow-xs)]">
          <FileText aria-hidden="true" className="size-3.5 text-error" /> {m.attach}
        </span>
      )}
      <span className="mt-0.5 flex items-center justify-end gap-1.5 text-[10px] text-subtle">
        {m.source && (
          <span className="mr-auto flex items-center gap-1">
            <BookOpen aria-hidden="true" className="size-3" /> From: {m.source}
          </span>
        )}
        {m.time}
        {out && <Ticks status={m.status} />}
      </span>
    </li>
  );
}

export function TypingDots({ who = "AI agent" }: { who?: string }) {
  return (
    <li className="ml-auto flex w-fit items-center gap-2 rounded-[10px] border border-accent-border bg-accent-muted px-2.5 py-1.5 text-[10.5px] font-semibold text-ai">
      <Sparkles aria-hidden="true" className="size-3" /> {who} is typing
      <span className="inline-flex items-center gap-[3px]" aria-hidden="true">
        <i className="size-1.5 animate-dot rounded-full bg-current" />
        <i className="size-1.5 animate-dot rounded-full bg-current [animation-delay:0.15s]" />
        <i className="size-1.5 animate-dot rounded-full bg-current [animation-delay:0.3s]" />
      </span>
    </li>
  );
}

/**
 * A scrollable message list that follows new messages, unless the reader
 * has scrolled up to read. `data-lenis-prevent` keeps the page's smooth
 * scrolling from taking over the wheel inside it.
 */
export function MessageList({
  messages,
  typing,
  label,
  className,
  children,
}: {
  messages: ChatMsg[];
  typing?: string | null;
  label: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const pinned = useRef(true);
  // biome-ignore lint/correctness/useExhaustiveDependencies: follow every new message or typing change
  useEffect(() => {
    const el = box.current;
    if (el && pinned.current) el.scrollTo({ top: el.scrollHeight, behavior: reducedMotion() ? "auto" : "smooth" });
  }, [messages.length, typing]);
  return (
    // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable log must be reachable by keyboard
    <div
      ref={box}
      data-lenis-prevent
      tabIndex={0}
      role="log"
      aria-label={label}
      onScroll={(e) => {
        const el = e.currentTarget;
        pinned.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
      }}
      className={cn(
        "overflow-y-auto overscroll-contain focus-visible:outline-2 focus-visible:outline-accent",
        className,
      )}
    >
      <ul className="flex flex-col gap-2">
        {messages.map((m) => (
          <MessageBubble key={m.id} m={m} />
        ))}
        {typing && <TypingDots who={typing} />}
        {children}
      </ul>
    </div>
  );
}

/** A text box and send button. */
export function Composer({
  placeholder,
  disabled,
  onSend,
  value,
  onChange,
}: {
  placeholder: string;
  disabled?: boolean;
  onSend: (text: string) => void;
  value?: string;
  onChange?: (v: string) => void;
}) {
  const [own, setOwn] = useState("");
  const text = value ?? own;
  const set = onChange ?? setOwn;
  const send = () => {
    const t = text.trim();
    if (!t || disabled) return;
    onSend(t);
    set("");
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        send();
      }}
      className="flex items-center gap-1.5"
    >
      <input
        value={text}
        onChange={(e) => set(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        maxLength={200}
        className="h-8 min-w-0 flex-1 rounded-[8px] bg-surface px-2.5 text-[12px] text-foreground shadow-[inset_0_0_0_1px_var(--border-strong)] outline-none placeholder:text-subtle focus:shadow-[inset_0_0_0_2px_var(--accent)]"
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        aria-label="Send"
        className="grid size-8 shrink-0 place-items-center rounded-[8px] bg-accent text-white transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-45"
      >
        <Send aria-hidden="true" className="size-3.5" />
      </button>
    </form>
  );
}

/* ── The agent loop: customer message → typing → answer (or a hand-off) ── */

export function useAgentChat(initial: ChatMsg[] = []) {
  const [messages, setMessages] = useState<ChatMsg[]>(initial);
  const [typing, setTyping] = useState<string | null>(null);
  const [handedOff, setHandedOff] = useState(false);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const push = useCallback((m: ChatMsg) => setMessages((list) => [...list, m]), []);
  const patch = useCallback(
    (id: number, p: Partial<ChatMsg>) => setMessages((list) => list.map((m) => (m.id === id ? { ...m, ...p } : m))),
    [],
  );

  /** Ticks for an outgoing message: delivered, then read. */
  const deliver = useCallback(
    async (id: number) => {
      await sleep(reducedMotion() ? 0 : 500);
      if (alive.current) patch(id, { status: "delivered" });
      await sleep(reducedMotion() ? 0 : 900);
      if (alive.current) patch(id, { status: "read" });
    },
    [patch],
  );

  /** The agent (or, after a hand-off, a teammate) answers a customer message. */
  const answer = useCallback(
    async (text: string) => {
      const a = answerFor(text);
      const fast = reducedMotion();
      if (handedOff) {
        setTyping("Priya");
        await sleep(fast ? 0 : 1400);
        if (!alive.current) return;
        setTyping(null);
        const m = msg({ from: "team", text: "Noted. I'll call you in 10 minutes to go over it.", status: "sent" });
        push(m);
        void deliver(m.id);
        return;
      }
      setTyping("AI agent");
      await sleep(fast ? 0 : 900 + Math.min(900, a.text.length * 12));
      if (!alive.current) return;
      setTyping(null);
      const m = msg({ from: "ai", text: a.text, source: a.source, attach: a.attach, status: "sent" });
      push(m);
      void deliver(m.id);
      if (a.handoff) setHandedOff(true);
    },
    [deliver, handedOff, push],
  );

  return { messages, setMessages, typing, setTyping, handedOff, push, patch, deliver, answer };
}

export { sleep };
