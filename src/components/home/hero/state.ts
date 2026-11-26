import { type Act, type Conv, type Seed, seed, type ToastGo, type VerbKey, type View } from "./script";

export type CallState = {
  who: "in" | "ai";
  st: string;
  line: [who: string, text: string] | null;
  /** The mm:ss the card shows. */
  t: string;
  /** Demo-clock ms when the call began (-1 once it ended). */
  startedAt: number;
  ended: boolean;
};
export type ToastItem = { id: number; text: string; color: string; go: ToastGo; at: number; out: boolean };
export type Pane = "list" | "chat" | "card";
export type DemoState = Seed & {
  sel: string;
  /** Small frames show one of these at a time; wide frames show them all and ignore it. */
  pane: Pane;
  view: View;
  typingFor: string | null;
  /** Message keys (`conv:index`) that animate in; cleared when the user changes thread. */
  newKeys: string[];
  now: string;
  cap: string;
  vb: VerbKey | null;
  call: CallState | null;
  toasts: ToastItem[];
  toastSeq: number;
  /** Riya's cursor: target key, a move counter and a click counter (changes trigger the effects). */
  cur: { to: string | null; n: number; click: number };
  /** The visitor touched the console: Riya's cursor and view switching stay off until the next loop. */
  visitor: boolean;
  /** Which word just lit, which conversation it is about, and a counter that re-triggers the glow. */
  spot: { k: VerbKey | null; id: string | null; n: number };
  /** `day|time` of the slot Riya just booked (it pops once). */
  popSlot: string | null;
};
export type Action =
  | { type: "script"; a: Act; at: number; quiet?: boolean }
  | { type: "tick"; at: number }
  | { type: "view"; view: View }
  | { type: "select"; id: string }
  | { type: "pane"; pane: Pane }
  | { type: "take" }
  | { type: "back" }
  | { type: "send"; text: string }
  | { type: "visitor" };

export const CAP_DEFAULT = "Riya is reading new messages";
const NOW_DEFAULT = "Reading new messages";
const TOAST_MS = 3200;
const TOAST_OUT_MS = 360;

export const initialState = (): DemoState => ({
  ...seed(),
  sel: "ar",
  pane: "list",
  view: "inbox",
  typingFor: null,
  newKeys: [],
  now: NOW_DEFAULT,
  cap: CAP_DEFAULT,
  vb: null,
  call: null,
  toasts: [],
  toastSeq: 0,
  cur: { to: null, n: 0, click: 0 },
  visitor: false,
  spot: { k: null, id: null, n: 0 },
  popSlot: null,
});

// One demo second is 100 clock-ms on the call card: the whole call reads as about a minute.
const callDur = (at: number, from: number) => {
  const sec = from < 0 ? 0 : Math.round((at - from) / 100);
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
};
const conv = (s: DemoState, id: string) => s.convs.find((c) => c.id === id);
const pushMsg = (s: DemoState, c: Conv, msg: Conv["msgs"][number]) => {
  c.msgs.push(msg);
  s.newKeys.push(`${c.id}:${c.msgs.length - 1}`);
};
const touch = (s: DemoState, id: string, time?: string) => {
  const i = s.convs.findIndex((c) => c.id === id);
  if (i < 0) return;
  const [c] = s.convs.splice(i, 1);
  if (time) c.time = time;
  s.convs.unshift(c);
};

/** Mutates the (already cloned) state; the clone is made once in `reduce`. */
function apply(s: DemoState, a: Act, at: number, quiet: boolean): void {
  switch (a.t) {
    case "doing":
      s.now = a.text;
      s.vb = a.k;
      if (a.cap) s.cap = a.cap;
      if (a.k) s.spot = { k: a.k, id: a.id ?? s.sel, n: s.spot.n + 1 };
      return;
    case "view":
      if (s.visitor) return;
      s.view = a.view;
      s.newKeys = [];
      if (a.view in s.unseen) s.unseen[a.view as keyof Seed["unseen"]] = 0;
      return;
    case "select":
      if (s.visitor) return;
      s.sel = a.id;
      s.pane = "chat";
      s.newKeys = [];
      return;
    case "cur":
      if (!s.visitor) s.cur = { ...s.cur, to: a.to, n: s.cur.n + 1 };
      return;
    case "click":
      if (!s.visitor) s.cur.click++;
      return;
    case "say": {
      const c = conv(s, a.id);
      if (!c || (a.msg.f === "ai" && c.state === "you")) return;
      pushMsg(s, c, a.msg.t.includes("{dur}") ? { ...a.msg, t: a.msg.t.replace("{dur}", s.call?.t ?? "0:00") } : a.msg);
      if (a.state && c.state !== "you") c.state = a.state;
      if (a.tl) c.tl.push(a.tl);
      touch(s, a.id, a.time);
      if (s.view !== "inbox" || s.sel !== a.id) s.unseen.inbox++;
      for (const n of a.also ?? []) apply(s, n, at, quiet);
      return;
    }
    case "book": {
      const c = conv(s, a.id);
      if (!c || c.state === "you") return;
      s.slots[a.day][a.time] = c.name;
      s.booked++;
      c.stage = "Booked";
      s.popSlot = `${a.day}|${a.time}`;
      if (s.view !== "cal") s.unseen.cal++;
      apply(
        s,
        {
          t: "toast",
          text: `Booked · ${c.name.split(" ")[0]}, ${a.day.split(" ")[0]} ${a.time}`,
          color: "var(--hx-blue)",
          go: { view: "cal" },
        },
        at,
        quiet,
      );
      return;
    }
    case "flow": {
      const f = s.flows.find((x) => x.id === a.id);
      if (!f) return;
      f.runs++;
      if (s.view !== "flow") s.unseen.flow++;
      return;
    }
    case "typing":
      s.typingFor = a.id;
      return;
    case "add":
      s.convs.unshift(a.conv);
      s.newKeys.push(`${a.conv.id}:0`);
      return;
    case "unseen":
      s.unseen[a.k]++;
      return;
    case "toast":
      if (quiet) return; // reduced motion: no transient toasts
      s.toasts.push({ id: s.toastSeq++, text: a.text, color: a.color, go: a.go, at, out: false });
      while (s.toasts.length > 3) s.toasts.shift();
      return;
    case "call": {
      const p = a.p;
      if (p.hide) {
        s.call = null;
        return;
      }
      if (!s.call) s.call = { who: "in", st: "", line: null, t: "0:00", startedAt: -1, ended: false };
      const k = s.call;
      if (p.start) k.startedAt = at;
      if (p.who) k.who = p.who;
      if (p.st) k.st = p.st;
      if (p.line !== undefined) k.line = p.line;
      if (p.end) {
        k.t = callDur(at, k.startedAt);
        k.ended = true;
        k.startedAt = -1;
      }
      return;
    }
    case "reset": {
      const keep = s.sel;
      const view = s.view;
      Object.assign(s, initialState());
      s.view = view;
      if (conv(s, keep)) s.sel = keep;
    }
  }
}

export function reduce(state: DemoState, action: Action): DemoState {
  if (action.type === "tick") {
    // Idle ticks (every animation frame) must return the same object so React skips the render.
    const k = state.call;
    const t = k && k.startedAt >= 0 ? callDur(action.at, k.startedAt) : null;
    const live = state.toasts.filter((x) => action.at - x.at < TOAST_MS + TOAST_OUT_MS);
    const flip = state.toasts.some((x) => !x.out && action.at - x.at >= TOAST_MS);
    if ((t === null || t === k?.t) && live.length === state.toasts.length && !flip) return state;
    const s = structuredClone(state);
    if (s.call && t) s.call.t = t;
    s.toasts = live.map((x) => ({ ...x, out: action.at - x.at >= TOAST_MS }));
    return s;
  }
  const s = structuredClone(state);
  if (action.type !== "script") s.visitor = true; // any user action: Riya's cursor steps back
  switch (action.type) {
    case "script":
      apply(s, action.a, action.at, !!action.quiet);
      break;
    case "view":
      s.view = action.view;
      s.unseen[action.view as "inbox"] = 0;
      s.newKeys = [];
      break;
    case "select":
      s.sel = action.id;
      s.pane = "chat";
      s.newKeys = [];
      break;
    case "pane":
      s.pane = action.pane;
      break;
    case "take": {
      const c = conv(s, s.sel);
      if (!c) break;
      c.state = "you";
      if (s.typingFor === c.id) s.typingFor = null;
      pushMsg(s, c, { f: "ev", t: "You took over" });
      break;
    }
    case "back": {
      const c = conv(s, s.sel);
      if (!c) break;
      c.state = "ai";
      pushMsg(s, c, { f: "ev", t: "Handed back to Riya" });
      break;
    }
    case "send": {
      const c = conv(s, s.sel);
      const text = action.text.trim();
      if (!c || !text) break;
      pushMsg(s, c, { f: "you", t: text });
      touch(s, c.id, "now");
      break;
    }
  }
  return s;
}
