"use client";

import { type ReactNode, useCallback, useEffect, useReducer, useRef, useState, useSyncExternalStore } from "react";
import { GridSparks } from "@/components/motion/GridSparks";
import { Console } from "./Console";
import { Cursor } from "./Cursor";
import { type Act, SCRIPT } from "./script";
import { initialState, reduce } from "./state";
import { useDemoClock } from "./use-demo-clock";
import { useHeroTilt } from "./use-hero-tilt";
import "./hero.css";

// Cursor moves and the view switches they cause only make sense with the cursor on screen.
const CURSOR_ACTS = new Set<Act["t"]>(["cur", "click", "view", "select"]);
const TITLE = "Hire an AI employee for your team";

const useMedia = (query: string) =>
  useSyncExternalStore(
    (cb) => {
      const m = matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => matchMedia(query).matches,
    () => false,
  );

/**
 * Homepage hero: the words (in the first HTML byte) over a live, scripted ERIX console.
 * The demo clock only runs while the hero is on screen and the tab is visible, and stops while the
 * pointer is over the console, focus is inside it, or the (keyboard-only) Pause button was pressed.
 */
export function HeroShell({ actions, motif }: { actions: ReactNode; motif: ReactNode }) {
  const [s, dispatch] = useReducer(reduce, undefined, initialState);
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const fine = useMedia("(pointer: fine)");
  const phone = useMedia("(max-width: 680px)");
  // Riya's cursor (and the view switching it does) is for wide, motion-OK screens only.
  const cursorOn = !reduced && !phone;
  const hero = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  // The opening moment (rows drop in, status line types) is CSS keyed on this class, once per load.
  const [boot, setBoot] = useState(true);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [hover, setHover] = useState(false);
  const [focusIn, setFocusIn] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const playing = !reduced && ready && inView && tabVisible && !hover && !focusIn && !userPaused;

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1700); // let the opening play first
    const tb = setTimeout(() => setBoot(false), 1800);
    const onVis = () => setTabVisible(document.visibilityState === "visible");
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    if (hero.current) io.observe(hero.current);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearTimeout(t);
      clearTimeout(tb);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // Reduced motion: no clock; play the script once to its end state and stop.
  const ran = useRef(false);
  useEffect(() => {
    if (!reduced || ran.current) return;
    ran.current = true;
    for (const [at, acts] of SCRIPT.slice(0, -1))
      for (const a of acts) if (!CURSOR_ACTS.has(a.t)) dispatch({ type: "script", a, at, quiet: true });
  }, [reduced]);

  const fire = useCallback(
    (a: Act, at: number) => {
      if (!cursorOn && CURSOR_ACTS.has(a.t)) return;
      dispatch({ type: "script", a, at });
    },
    [cursorOn],
  );
  const tick = useCallback((at: number) => dispatch({ type: "tick", at }), []);
  useDemoClock(playing, fire, tick);
  useHeroTilt(tilt, stage, !reduced && fine);

  const pausers = {
    onPointerEnter: () => setHover(true),
    onPointerLeave: () => setHover(false),
    onPointerDown: () => dispatch({ type: "visitor" }),
    onKeyDown: () => dispatch({ type: "visitor" }),
    onFocus: () => setFocusIn(true),
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget)) setFocusIn(false);
    },
  };

  return (
    <section
      ref={hero}
      data-hx-hero=""
      data-vb={s.vb ?? undefined}
      className={`hx${playing ? "" : " paused"}${boot ? " boot" : ""}`}
      aria-labelledby="hero-title"
    >
      <GridSparks />
      {motif}
      <div className="hx-frame" ref={frame}>
        <div className="hx-type">
          <div className="hx-type-in" data-sparks-avoid="">
            <h1 id="hero-title">
              {TITLE.split(" ").map((w, i) => (
                <span key={w}>
                  <span className="w" style={{ animationDelay: `${i * 70}ms` }}>
                    {w}
                  </span>{" "}
                </span>
              ))}
            </h1>
            <p className="hx-lead">
              It{" "}
              <span className="vb" data-k="answer">
                answers chats and calls
              </span>
              ,{" "}
              <span className="vb" data-k="book">
                books visits
              </span>
              ,{" "}
              <span className="vb" data-k="follow">
                follows up
              </span>{" "}
              and{" "}
              <span className="vb" data-k="pay">
                collects payments
              </span>
              , all inside your CRM.{" "}
              <span className="vb" data-k="you">
                You step in only when it matters.
              </span>
            </p>
            <div className="hx-ctas">{actions}</div>
            <p className="hx-try">
              <span className="hx-cap" key={s.cap}>
                {s.cap}
              </span>
            </p>
          </div>
        </div>
        <div className="hx-stage" ref={stage}>
          {/* Keyboard users get a way to stop the motion (WCAG 2.2.2); it shows only on focus. */}
          {!reduced && (
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-3 focus-visible:left-3 focus-visible:z-20 focus-visible:rounded-full focus-visible:bg-surface focus-visible:px-3 focus-visible:py-1.5 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-foreground focus-visible:shadow-md"
            >
              {userPaused ? "Play demo" : "Pause demo"}
            </button>
          )}
          <div className="hx-tilt" ref={tilt} data-sparks-avoid="">
            <div className="edge" aria-hidden="true" />
            <Console s={s} dispatch={dispatch} {...pausers} />
          </div>
        </div>
        <div className="hx-veil" aria-hidden="true" />
        {cursorOn && <Cursor cur={s.cur} hidden={s.visitor} playing={playing} frame={frame} />}
      </div>
    </section>
  );
}
