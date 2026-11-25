"use client";

import { type KeyboardEvent, type PointerEvent, useRef } from "react";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { type Clip, play, seek, toggle, usePlayer } from "./voice-player";

export const fmt = (s: number) => {
  const t = Math.max(0, Math.round(s));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};

export const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/** Play button, seekable waveform (a slider: arrows 5 s, Page keys 15 s, Home, End, Space) and elapsed time. `idPrefix` keeps ids unique when a clip has two views. */
export function PlayerRow({
  clip,
  peaks,
  idPrefix,
  compact,
}: {
  clip: Clip;
  peaks: readonly number[];
  idPrefix: string;
  compact?: boolean;
}) {
  const st = usePlayer(clip.id);
  const drag = useRef(false);
  const playing = !!st?.playing;
  const t = st?.t ?? 0;
  const lit = Math.round((t / clip.dur) * peaks.length);
  const goto = (to: number) => (st && !st.error ? seek(to) : play(clip, to));
  const at = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    goto(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * clip.dur);
  };
  const onKey = (e: KeyboardEvent) => {
    const k = e.key;
    const step =
      k === "ArrowRight" || k === "ArrowUp"
        ? 5
        : k === "ArrowLeft" || k === "ArrowDown"
          ? -5
          : k === "PageUp"
            ? 15
            : k === "PageDown"
              ? -15
              : 0;
    const to = k === "Home" ? 0 : k === "End" ? clip.dur - 0.1 : step ? t + step : null;
    if (to !== null) {
      e.preventDefault();
      goto(Math.min(clip.dur - 0.1, Math.max(0, to)));
    } else if (k === " ") {
      e.preventDefault();
      toggle(clip);
    }
  };
  return (
    <div className={cn("flex items-center rounded-xl bg-background", compact ? "gap-2.5 p-2.5" : "gap-3 p-3")}>
      <button
        type="button"
        id={`${idPrefix}-play`}
        aria-label={`${playing ? "Pause" : "Play"} ${clip.label}`}
        onClick={() => toggle(clip)}
        className={cn(
          "grid flex-none cursor-pointer place-items-center rounded-full bg-accent text-accent-foreground hover:bg-accent-hover",
          compact ? "size-11" : "size-14",
          FOCUS,
        )}
      >
        {st?.loading ? (
          <span
            aria-hidden="true"
            className="size-5 animate-spin rounded-full border-[3px] border-current border-t-transparent"
          />
        ) : (
          <Icon name={playing ? "pause" : "play"} size={20} variant="solid" />
        )}
      </button>
      {/* Container query: a narrow waveform drops every other bar so the rest stay wide enough to see. */}
      <div className="@container min-w-0 flex-1">
        <div
          role="slider"
          tabIndex={0}
          aria-label={`Position in ${clip.label}`}
          aria-valuemin={0}
          aria-valuemax={Math.round(clip.dur)}
          aria-valuenow={Math.round(t)}
          aria-valuetext={`${fmt(t)} of ${fmt(clip.dur)}`}
          onKeyDown={onKey}
          onPointerDown={(e) => {
            drag.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            at(e);
          }}
          onPointerMove={(e) => drag.current && st && at(e)}
          onPointerUp={() => {
            drag.current = false;
          }}
          onPointerCancel={() => {
            drag.current = false;
          }}
          className={cn("flex h-11 cursor-pointer touch-pan-y items-center gap-0.5 rounded-md", FOCUS)}
        >
          {peaks.map((h, i) => (
            <i
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length decorative bars
              key={i}
              style={{ height: `${Math.round(8 + h * 92)}%` }}
              className={cn(
                "min-w-px flex-1 rounded-sm @max-[310px]:even:hidden",
                i < lit ? "bg-accent" : "bg-accent/35",
              )}
            />
          ))}
        </div>
        <div className="flex justify-between text-[13px] text-muted-foreground tabular-nums">
          <span>{fmt(t)}</span>
          <span>{fmt(clip.dur)}</span>
        </div>
      </div>
    </div>
  );
}

/** Plain message plus retry hint when a clip could not load. */
export function ClipError({ id }: { id: string }) {
  const st = usePlayer(id);
  if (!st?.error) return null;
  return (
    <p role="alert" className="mt-3 rounded-lg bg-error-subtle px-3 py-2 text-[15px] font-semibold text-error">
      This clip could not load. Check your connection and press play again.
    </p>
  );
}
