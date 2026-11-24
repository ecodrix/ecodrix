import { type RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { DemoState } from "./state";

type Pt = { x: number; y: number };
type Box = { left: number; top: number; right: number; bottom: number };

// The cursor element is a fixed 76x30 box (arrow + label), so its own rect is the whole thing.
const W = 76;
const H = 30;
const PAD = 10;
const MOVE_MS = 700;
const EASE = "cubic-bezier(.2,.7,.2,1)";

const boxAt = (p: Pt): Box => ({ left: p.x - 4, top: p.y - 4, right: p.x + W, bottom: p.y + H });
const hits = (b: Box, rs: Box[]) =>
  rs.some((r) => b.left < r.right + PAD && b.right > r.left - PAD && b.top < r.bottom + PAD && b.bottom > r.top - PAD);
const segmentClear = (a: Pt, b: Pt, rs: Box[]) => {
  const n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 6));
  for (let i = 0; i <= n; i++)
    if (hits(boxAt({ x: a.x + ((b.x - a.x) * i) / n, y: a.y + ((b.y - a.y) * i) / n }), rs)) return false;
  return true;
};

/** The words and buttons Riya's cursor must never cover: per-word, per-line and per-button rects. */
function textRects(frame: HTMLElement): Box[] {
  const out: Box[] = [];
  const add = (r: DOMRect) => r.width && out.push({ left: r.left, top: r.top, right: r.right, bottom: r.bottom });
  for (const w of frame.querySelectorAll(".hx-type h1 .w, .hx-ctas > *, .hx-try")) add(w.getBoundingClientRect());
  const lead = frame.querySelector(".hx-lead");
  if (lead) {
    const rg = document.createRange();
    rg.selectNodeContents(lead);
    for (const r of rg.getClientRects()) add(r);
  }
  return out;
}

/** First point inside the target (tip position) whose cursor box clears the text. */
function pickPoint(t: HTMLElement, rs: Box[]): Pt | null {
  const r = t.getBoundingClientRect();
  const xs = [10, 26, r.width / 2, r.width - 30];
  const ys = [r.height / 2, 14, r.height - 14];
  for (const dy of ys)
    for (const dx of xs) {
      const p = { x: r.left + Math.min(dx, r.width - 4), y: r.top + Math.max(4, Math.min(dy, r.height - 4)) };
      if (!hits(boxAt(p), rs)) return p;
    }
  return null;
}

/** A straight line if it clears the text, else an elbow, else via the rail; null = no safe path. */
function safePath(a: Pt, b: Pt, rs: Box[], railX: number): Pt[] | null {
  const tries: Pt[][] = [
    [a, b],
    [a, { x: a.x, y: b.y }, b],
    [a, { x: b.x, y: a.y }, b],
    [a, { x: railX, y: a.y }, { x: railX, y: b.y }, b],
  ];
  return tries.find((path) => path.every((p, i) => i === 0 || segmentClear(path[i - 1], p, rs))) ?? null;
}

/**
 * Riya's cursor: an overlay on the (flat) hero frame, so its screen rect is exact. It moves between
 * `data-cur` targets on WAAPI animations that pause with the demo clock, and only ever lands or
 * travels where the cursor box stays clear of the words and buttons.
 */
export function Cursor({
  cur,
  hidden,
  playing,
  frame,
}: {
  cur: DemoState["cur"];
  hidden: boolean;
  playing: boolean;
  frame: RefObject<HTMLElement | null>;
}) {
  const el = useRef<HTMLDivElement>(null);
  const anim = useRef<Animation | null>(null);
  const target = useRef<HTMLElement | null>(null);
  const placed = useRef(false);
  const [ripple, setRipple] = useState(0);
  const [shown, setShown] = useState(false);
  const playingRef = useRef(playing);
  playingRef.current = playing;

  // biome-ignore lint/correctness/useExhaustiveDependencies: a move runs when the script bumps cur.n
  useLayoutEffect(() => {
    const root = frame.current;
    const node = el.current;
    if (!root || !node || !cur.to) return;
    const t = root.querySelector<HTMLElement>(`[data-cur="${cur.to}"]`);
    if (!t) return;
    const rs = textRects(root);
    const dest = pickPoint(t, rs);
    if (!dest) return; // nowhere safe on this target: stay put (the click effect still happens)
    target.current = t;
    const f = root.getBoundingClientRect();
    const toLocal = (p: Pt): Pt => ({ x: p.x - f.left, y: p.y - f.top });
    const tr = (p: Pt) => `translate(${p.x}px, ${p.y}px)`;
    let from: Pt | null = null;
    if (placed.current) {
      const c = node.getBoundingClientRect();
      from = { x: c.left, y: c.top };
    }
    anim.current?.commitStyles();
    anim.current?.cancel();
    const rail = root.querySelector(".hx-rail")?.getBoundingClientRect();
    const path = from ? safePath(from, dest, rs, rail ? rail.left + 10 : dest.x) : null;
    let keys: Keyframe[];
    if (path) {
      const lens = path.slice(1).map((p, i) => Math.hypot(p.x - path[i].x, p.y - path[i].y));
      const total = lens.reduce((a, b) => a + b, 0) || 1;
      let acc = 0;
      keys = path.map((p, i) => {
        if (i) acc += lens[i - 1];
        return { transform: tr(toLocal(p)), offset: acc / total };
      });
    } else {
      // first appearance or no clear path: fade in at the destination
      keys = [{ transform: tr(toLocal(dest)) }, { transform: tr(toLocal(dest)) }];
    }
    placed.current = true;
    setShown(true);
    const a = node.animate(keys, { duration: path ? MOVE_MS : 250, easing: EASE, fill: "forwards" });
    if (!playingRef.current) a.pause();
    anim.current = a;
  }, [cur.n]);

  useEffect(() => {
    const a = anim.current;
    if (!a) return;
    if (playing) a.play();
    else a.pause();
  }, [playing]);

  useEffect(() => {
    if (!cur.click) return;
    setRipple((n) => n + 1);
    const t = target.current;
    if (!t) return;
    t.setAttribute("data-pressed", "");
    const id = setTimeout(() => t.removeAttribute("data-pressed"), 220);
    return () => clearTimeout(id);
  }, [cur.click]);

  return (
    <div ref={el} className="hx-cursor" aria-hidden="true">
      <div className={`in${shown && !hidden && cur.to ? " on" : ""}`}>
        <svg viewBox="0 0 18 18" aria-hidden="true">
          <path
            d="M2 1.5v13l3.6-3.2 2.6 5.2 2.4-1.2-2.6-5.1H13z"
            fill="var(--hx-ai)"
            stroke="#fff"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
        <span className="lbl">Riya</span>
        {ripple > 0 && <i className="rip" key={ripple} />}
      </div>
    </div>
  );
}
