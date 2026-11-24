"use client";

import { type CSSProperties, type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";

/** `glyph` is drawn by the server (ChannelBeam), so no icon data ships with
 *  the beam; `brand` marks a third-party mark (white chip); `soon` adds the
 *  "Coming soon" badge. */
export type BeamItem = { label: string; brand?: boolean; glyph: ReactNode; soon?: boolean };
/** One wire: which side of ERIX it is on and its row (0 = top), for the wave's timing. */
type Wire = { k: string; d: string; side: "in" | "out"; r: number };
const row = (r: number) => ({ "--r": r }) as CSSProperties;

/**
 * IntegrationBeam (design system v13): channels flow into ERIX and out to
 * outcomes. One wave loops forever, left to right: it leaves every channel,
 * lands on ERIX (the tile glows), then fans out and lights each outcome as
 * it arrives, while the wires carry a slow, steady flow. All of it runs on
 * one CSS clock that starts once the wires exist, so the parts stay in step.
 * The nodes are
 * plain HTML in a CSS grid (server-rendered, readable without JS); only the
 * wires are measured from the DOM after layout, in an absolutely positioned
 * SVG, so nothing shifts. Pulses and the halo stop under reduced motion.
 * The ERIX mark (server-drawn, `mark`) catches each wave: a band of light
 * crosses its blue letters as the wave lands.
 * On phones the three parts stack (labels stay readable) and the wires run
 * top to bottom instead of left to right.
 */
export function IntegrationBeam({
  inputs,
  outputs,
  mark,
}: {
  inputs: BeamItem[];
  outputs: BeamItem[];
  /** The ERIX mark, drawn by the server (`ErixMarkSvg`) with its own label. */
  mark: ReactNode;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const mid = useRef<HTMLDivElement>(null);
  const ins = useRef<(HTMLLIElement | null)[]>([]);
  const outs = useRef<(HTMLLIElement | null)[]>([]);
  const [paths, setPaths] = useState<{ w: number; h: number; d: Wire[] }>({
    w: 0,
    h: 0,
    d: [],
  });

  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el || !mid.current) return;
    const centre = mid.current;
    const calc = () => {
      const b = el.getBoundingClientRect();
      const m = centre.getBoundingClientRect();
      const mx1 = m.left - b.left;
      const mx2 = m.right - b.left;
      const my = m.top - b.top + m.height / 2;
      const d: Wire[] = [];
      // Compare against the whole inputs column: on desktop a tall column can
      // end its first row above the centre tile without being stacked.
      const col = ins.current[0]?.parentElement?.getBoundingClientRect();
      if (col && m.top >= col.bottom) {
        // Stacked (phones): inputs above the centre, outputs below it.
        const cx = m.left - b.left + m.width / 2;
        const top = m.top - b.top;
        const bottom = m.bottom - b.top;
        ins.current.forEach((n, i) => {
          if (!n) return;
          const r = n.getBoundingClientRect();
          const x = r.left - b.left + r.width / 2;
          const y = r.bottom - b.top;
          const c = (top - y) / 2;
          d.push({ k: `i${i}`, d: `M${x} ${y} C${x} ${y + c} ${cx} ${top - c} ${cx} ${top}`, side: "in", r: i });
        });
        outs.current.forEach((n, i) => {
          if (!n) return;
          const r = n.getBoundingClientRect();
          const x = r.left - b.left + r.width / 2;
          const y = r.top - b.top;
          const c = (y - bottom) / 2;
          d.push({ k: `o${i}`, d: `M${cx} ${bottom} C${cx} ${bottom + c} ${x} ${y - c} ${x} ${y}`, side: "out", r: i });
        });
        setPaths({ w: b.width, h: b.height, d });
        return;
      }
      ins.current.forEach((n, i) => {
        if (!n) return;
        const r = n.getBoundingClientRect();
        const x = r.right - b.left;
        const y = r.top - b.top + r.height / 2;
        const c = (mx1 - x) / 2;
        d.push({ k: `i${i}`, d: `M${x} ${y} C${x + c} ${y} ${mx1 - c} ${my} ${mx1} ${my}`, side: "in", r: i });
      });
      outs.current.forEach((n, i) => {
        if (!n) return;
        const r = n.getBoundingClientRect();
        const x = r.left - b.left;
        const y = r.top - b.top + r.height / 2;
        const c = (x - mx2) / 2;
        d.push({ k: `o${i}`, d: `M${mx2} ${my} C${mx2 + c} ${my} ${x - c} ${y} ${x} ${y}`, side: "out", r: i });
      });
      setPaths({ w: b.width, h: b.height, d });
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, [inputs.length, outputs.length]);

  // Channels give off the wave (emit); outcomes light up when it lands (land).
  const node = (it: BeamItem, side: Wire["side"]) => (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 rounded-[9999px] bg-surface py-2 pr-3.5 pl-2 font-sans text-sm/5 font-semibold whitespace-nowrap text-foreground shadow-[0_0_0_1px_var(--border-soft),var(--shadow-sm)]",
        "max-[760px]:gap-2 max-[760px]:py-[5px] max-[760px]:pr-3 max-[760px]:pl-[5px] max-[760px]:text-[13px]",
        // Use the animate-* utility for each side: Tailwind only emits @theme keyframes that a utility uses.
        side === "out"
          ? "motion-safe:group-[.is-live]/beam:animate-beam-land"
          : "motion-safe:group-[.is-live]/beam:animate-beam-emit",
        "motion-safe:group-[.is-live]/beam:[animation-delay:calc(var(--r,0)*70ms)]",
      )}
    >
      <span
        className={cn(
          "grid size-8 place-items-center rounded-[9999px] text-accent max-[760px]:size-7",
          it.brand ? "bg-white shadow-[0_0_0_1px_rgba(11,27,100,0.08)]" : "bg-accent-muted",
        )}
      >
        {it.glyph}
      </span>
      <span>{it.label}</span>
      {it.soon && <StatusBadge status="soon" plain />}
    </span>
  );

  // One dash, 22% of the wire, parked before the start; the wave runs it in, then out.
  const pulse = (side: Wire["side"]) =>
    cn(
      "fill-none stroke-accent opacity-0 [stroke-dasharray:0.22_1] [stroke-dashoffset:0.22] [stroke-linecap:round]",
      side === "out"
        ? "motion-safe:group-[.is-live]/beam:animate-beam-out"
        : "motion-safe:group-[.is-live]/beam:animate-beam-in",
      "motion-safe:group-[.is-live]/beam:[animation-delay:calc(var(--r,0)*70ms)]",
    );

  return (
    <div
      ref={wrap}
      className={cn(
        // One clock for the whole beam: wave out of the channels, onto ERIX, out to the outcomes.
        "group/beam relative grid grid-cols-[1fr_auto_1fr] items-center gap-[clamp(48px,9vw,140px)] py-3 [--beam-dur:3.6s] [--beam-ease:cubic-bezier(0.4,0,0.2,1)]",
        // Phones: channels on top, ERIX in the middle, outcomes below, labels kept.
        "max-[760px]:grid-cols-[minmax(0,1fr)] max-[760px]:justify-items-center max-[760px]:gap-11",
        paths.d.length > 0 && "is-live",
      )}
    >
      <svg
        className="pointer-events-none absolute inset-0 overflow-visible"
        width={paths.w}
        height={paths.h}
        aria-hidden="true"
      >
        {paths.d.map((p) => (
          <path
            key={p.k}
            d={p.d}
            // The wires flow slowly all the time, in the direction of the wave.
            className="fill-none stroke-border [stroke-linecap:round] [stroke-width:1.5] motion-safe:group-[.is-live]/beam:animate-beam-flow motion-safe:group-[.is-live]/beam:[stroke-dasharray:3_6]"
          />
        ))}
        {paths.d.map((p) => (
          <path
            key={`g${p.k}`}
            d={p.d}
            pathLength={1}
            className={cn(pulse(p.side), "[stroke-opacity:0.16] [stroke-width:9]")}
            style={row(p.r)}
          />
        ))}
        {paths.d.map((p) => (
          <path
            key={`p${p.k}`}
            d={p.d}
            pathLength={1}
            className={cn(pulse(p.side), "[stroke-width:2.25]")}
            style={row(p.r)}
          />
        ))}
      </svg>
      <ul
        className="relative z-1 flex list-none flex-col gap-3.5 max-[760px]:flex-row max-[760px]:flex-wrap max-[760px]:justify-center max-[760px]:gap-2.5"
        aria-label="Comes in from"
      >
        {inputs.map((it, i) => (
          <li
            key={it.label}
            ref={(n) => void (ins.current[i] = n)}
            style={row(i)}
            className="self-end max-[760px]:self-auto"
          >
            {node(it, "in")}
          </li>
        ))}
      </ul>
      <div ref={mid} className="relative z-1 w-[104px] max-[760px]:w-[76px]">
        {/* ERIX: the mark alone (public/logo.svg's shapes on the mark's box, x 90-410, y 146-330), no tile, plate or ring behind it. A band of light crosses it each time the wave lands (founder's pick, 2 Nov 2026). */}
        <span className="relative block aspect-[320/184]">{mark}</span>
      </div>
      <ul
        className="relative z-1 flex list-none flex-col gap-3.5 max-[760px]:flex-row max-[760px]:flex-wrap max-[760px]:justify-center max-[760px]:gap-2.5"
        aria-label="Goes out as"
      >
        {outputs.map((it, i) => (
          <li
            key={it.label}
            ref={(n) => void (outs.current[i] = n)}
            style={row(i)}
            className="self-start max-[760px]:self-auto"
          >
            {node(it, "out")}
          </li>
        ))}
      </ul>
    </div>
  );
}
