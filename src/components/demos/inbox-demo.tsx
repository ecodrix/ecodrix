"use client";

import { useRef, useState } from "react";
import { BookOpen, Send, Sparkles } from "@/components/icons";
import { LiveDot } from "@/components/motion/surface";
import { AppFrame, Avatar, Channel, Pill } from "@/components/scenes/parts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { type ChatMsg, Composer, MessageList, msg, reducedMotion, sleep } from "./chat";

type Ch = "whatsapp";

interface Draft {
  text: string;
  source: string;
  confidence: number;
  attach?: string;
}

/** One conversation: what's been said, then each turn's AI draft and the customer's next message. */
interface Thread {
  id: string;
  name: string;
  ch: Ch;
  history: ChatMsg[];
  turns: { draft: Draft; next: string }[];
}

const THREADS: Thread[] = [
  {
    id: "rohan",
    name: "Rohan Mehta",
    ch: "whatsapp",
    history: [
      msg({
        from: "customer",
        text: "Is a site visit free? And what does a 2BHK in Vijay Nagar cost?",
        time: "12:03 pm",
      }),
    ],
    turns: [
      {
        draft: {
          text: "Site visits are free. A 2BHK in Vijay Nagar starts from ₹48,00,000.",
          source: "Office hours and prices",
          confidence: 94,
        },
        next: "Great. Can I come on Sunday at 11?",
      },
      {
        draft: {
          text: "Sunday, 11 am is booked for you. We'll send the location on WhatsApp.",
          source: "Visit slots",
          confidence: 91,
        },
        next: "Thanks!",
      },
    ],
  },
  {
    id: "neha",
    name: "Neha Kapoor",
    ch: "whatsapp",
    history: [msg({ from: "customer", text: "Do you have anything under ₹1 Cr?", time: "11:48 am" })],
    turns: [
      {
        draft: {
          text: "Yes, 2BHK flats in Wakad start at ₹82,00,000. Shall I send photos?",
          source: "Price list",
          confidence: 89,
        },
        next: "Yes please, send photos",
      },
      {
        draft: {
          text: "Here are the photos and the floor plan.",
          source: "Listings",
          confidence: 92,
          attach: "Wakad-2BHK.pdf",
        },
        next: "Lovely, thank you",
      },
    ],
  },
  {
    id: "priya",
    name: "Priya Shah",
    ch: "whatsapp",
    history: [msg({ from: "customer", text: "Can I move my Saturday visit to Sunday?", time: "10:15 am" })],
    turns: [
      {
        draft: {
          text: "Sunday at 11 am is free. Shall I move your visit?",
          source: "Visit slots",
          confidence: 93,
        },
        next: "Yes please, thanks.",
      },
    ],
  },
  {
    id: "arjun",
    name: "Arjun Rao",
    ch: "whatsapp",
    history: [
      msg({ from: "customer", text: "Is the office open on Sunday?", time: "9:20 am" }),
      msg({
        from: "ai",
        text: "Yes, 10 am to 6 pm on Sundays.",
        source: "Office hours and prices",
        time: "9:20 am",
        status: "read",
      }),
      msg({ from: "customer", text: "Thanks, see you Saturday!", time: "9:21 am" }),
    ],
    turns: [],
  },
];

interface State {
  messages: ChatMsg[];
  turn: number;
  /** The AI's draft for the latest customer message, waiting for a person. */
  draft: Draft | null;
  unread: number;
}

const initial = (): Record<string, State> =>
  Object.fromEntries(
    THREADS.map((t, i) => [
      t.id,
      { messages: t.history, turn: 0, draft: t.turns[0]?.draft ?? null, unread: i === 0 || !t.turns.length ? 0 : 1 },
    ]),
  );

/**
 * A working miniature of the ERIX inbox: four channels in one list. The AI
 * drafts each answer; you send it, edit it, write your own, or let the AI
 * reply on its own. The customer answers back, so it plays out like a real chat.
 */
export function InboxDemo() {
  const [threads, setThreads] = useState(initial);
  const [open, setOpen] = useState(THREADS[0].id);
  const [auto, setAuto] = useState(false);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [typing, setTyping] = useState<Record<string, string | null>>({});
  const alive = useRef(true);

  const t = THREADS.find((x) => x.id === open) as Thread;
  const st = threads[open];
  const update = (id: string, f: (s: State) => Partial<State>) =>
    setThreads((all) => ({ ...all, [id]: { ...all[id], ...f(all[id]) } }));

  /** Our message goes out, ticks go blue, then the customer replies and the AI drafts the next answer. */
  async function reply(id: string, out: ChatMsg) {
    const thread = THREADS.find((x) => x.id === id) as Thread;
    const fast = reducedMotion();
    setBusy(id);
    update(id, (s) => ({ messages: [...s.messages, out], draft: null }));
    const tick = (status: ChatMsg["status"]) =>
      update(id, (s) => ({ messages: s.messages.map((m) => (m.id === out.id ? { ...m, status } : m)) }));
    await sleep(fast ? 0 : 500);
    tick("delivered");
    await sleep(fast ? 0 : 700);
    tick("read");
    const turn = threads[id].turn;
    const next = thread.turns[turn];
    if (!next) return setBusy(null);
    setTyping((m) => ({ ...m, [id]: thread.name.split(" ")[0] }));
    await sleep(fast ? 0 : 1300);
    setTyping((m) => ({ ...m, [id]: null }));
    const incoming = msg({ from: "customer", text: next.next });
    const after = thread.turns[turn + 1]?.draft ?? null;
    update(id, (s) => ({
      messages: [...s.messages, incoming],
      turn: turn + 1,
      unread: open === id ? 0 : s.unread + 1,
    }));
    if (after) {
      setTyping((m) => ({ ...m, [id]: "AI agent" }));
      await sleep(fast ? 0 : 1200);
      setTyping((m) => ({ ...m, [id]: null }));
      if (auto) {
        setBusy(null);
        return void reply(
          id,
          msg({ from: "ai", text: after.text, source: after.source, attach: after.attach, status: "sent" }),
        );
      }
      update(id, () => ({ draft: after }));
    }
    setBusy(null);
  }

  const sendDraft = () =>
    st.draft &&
    void reply(
      open,
      msg({
        from: auto ? "ai" : "you",
        text: st.draft.text,
        source: st.draft.source,
        attach: st.draft.attach,
        status: "sent",
      }),
    );

  const choose = (id: string) => {
    setOpen(id);
    setText("");
    update(id, () => ({ unread: 0 }));
  };

  const last = st.messages[st.messages.length - 1];

  return (
    <div>
      <AppFrame
        title="Inbox"
        nav="inbox"
        badges={{ inbox: 3 }}
        className="h-[25rem]"
        action={
          <button
            type="button"
            role="switch"
            aria-checked={auto}
            onClick={() => setAuto(!auto)}
            className="flex items-center gap-1.5 rounded-[6px] px-1.5 py-1 text-[11px] font-semibold text-muted-foreground hover:bg-sunken focus-visible:outline-2 focus-visible:outline-accent"
          >
            <span
              aria-hidden="true"
              className={cn("relative h-3.5 w-6 rounded-full transition-colors", auto ? "bg-ai" : "bg-border-strong")}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 size-2.5 rounded-full bg-white transition-transform",
                  auto && "translate-x-2.5",
                )}
              />
            </span>
            AI replies on its own
          </button>
        }
      >
        <div className="flex h-full">
          <ul
            aria-label="Conversations"
            className="hidden w-[38%] shrink-0 overflow-y-auto border-r border-border bg-surface md:block"
            data-lenis-prevent
          >
            {THREADS.map((x) => {
              const s = threads[x.id];
              const tail = s.messages[s.messages.length - 1];
              return (
                <li key={x.id}>
                  <button
                    type="button"
                    onClick={() => choose(x.id)}
                    aria-current={open === x.id ? "true" : undefined}
                    className={cn(
                      "w-full border-b border-border px-3 py-2.5 text-left transition-colors hover:bg-sunken focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
                      open === x.id && "bg-accent-muted shadow-[inset_2px_0_0_var(--accent)] hover:bg-accent-muted",
                    )}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-[12px] font-semibold text-foreground">{x.name}</span>
                      <span className="shrink-0 text-[10px] text-subtle">{tail.time}</span>
                    </span>
                    <span className="mt-0.5 flex items-center justify-between gap-2">
                      <span className="truncate text-[11px] text-muted-foreground">{tail.text}</span>
                      {s.unread > 0 && (
                        <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-error text-[9px] font-bold text-white">
                          {s.unread}
                        </span>
                      )}
                      {s.draft && s.unread === 0 && <Pill tone="error">Needs you</Pill>}
                    </span>
                    <Channel name={x.ch} className="mt-1" />
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-2 border-b border-border bg-surface px-3 py-2">
              <Avatar name={t.name} className="size-7" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12px] font-semibold text-foreground">{t.name}</span>
                <Channel name={t.ch} />
              </span>
              {/* Phones: the list is hidden, so switch conversations here. */}
              <label className="md:hidden">
                <span className="sr-only">Conversation</span>
                <Select value={open} onValueChange={choose}>
                  <SelectTrigger size="sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {THREADS.map((x) => (
                      <SelectItem key={x.id} value={x.id}>
                        {x.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
              {busy !== open && last && (
                <span className="hidden items-center gap-1 text-[10.5px] text-subtle sm:flex">
                  <LiveDot /> Live
                </span>
              )}
            </div>

            <MessageList
              label={`Chat with ${t.name}`}
              messages={st.messages}
              typing={typing[open]}
              className="min-h-0 flex-1 bg-background p-3"
            >
              {st.draft && (
                <li className="ml-auto w-[90%] rounded-[10px] bg-ai-subtle px-3 py-2">
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-ai">
                    <Sparkles aria-hidden="true" className="size-3" /> AI draft
                    <span className="font-medium text-muted-foreground">· {st.draft.confidence}% confident</span>
                  </span>
                  <p className="mt-1 text-[12px] text-foreground">{st.draft.text}</p>
                  <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                    <BookOpen aria-hidden="true" className="size-3" /> Based on: {st.draft.source}
                  </p>
                  <span className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={sendDraft}
                      disabled={busy === open}
                      className="inline-flex items-center gap-1 rounded-[6px] bg-accent px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50"
                    >
                      <Send aria-hidden="true" className="size-3" /> Send
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setText(st.draft?.text ?? "");
                        update(open, () => ({ draft: null }));
                      }}
                      className="rounded-[6px] border border-border-strong bg-surface px-2.5 py-1 text-[11px] font-semibold text-foreground hover:bg-sunken focus-visible:outline-2 focus-visible:outline-accent"
                    >
                      Edit
                    </button>
                  </span>
                </li>
              )}
            </MessageList>

            <div className="border-t border-border bg-surface p-2.5">
              <Composer
                placeholder="Message via WhatsApp…"
                value={text}
                onChange={setText}
                disabled={busy === open}
                onSend={(v) => void reply(open, msg({ from: "you", text: v, status: "sent" }))}
              />
            </div>
          </div>
        </div>
      </AppFrame>
      <p className="mt-3 flex h-7 items-center justify-center gap-1.5 text-[12.5px] text-muted-foreground motion-reduce:hidden">
        <Sparkles aria-hidden="true" className="size-3.5 text-ai" />
        Try it: send or edit the AI draft, or switch on &ldquo;AI replies on its own&rdquo;.
      </p>
    </div>
  );
}
