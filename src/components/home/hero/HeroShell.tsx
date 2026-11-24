"use client";

import { type ReactNode, useCallback, useEffect, useReducer, useRef, useState, useSyncExternalStore } from "react";
import { Console } from "./Console";
import { type Act, SCRIPT } from "./script";
import { initialState, reduce } from "./state";
import { useDemoClock } from "./use-demo-clock";
import { useTilt } from "./use-tilt";
import "./hero.css";

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
  const hero = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [hover, setHover] = useState(false);
  const [focusIn, setFocusIn] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const playing = !reduced && ready && inView && tabVisible && !hover && !focusIn && !userPaused;

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 900); // let the entrance play first
    const onVis = () => setTabVisible(document.visibilityState === "visible");
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    if (hero.current) io.observe(hero.current);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearTimeout(t);
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
      for (const a of acts) dispatch({ type: "script", a, at, quiet: true });
  }, [reduced]);

  const fire = useCallback((a: Act, at: number) => dispatch({ type: "script", a, at }), []);
  const tick = useCallback((at: number) => dispatch({ type: "tick", at }), []);
  useDemoClock(playing, fire, tick);
  useTilt(tilt, stage, !reduced && fine);

  const pausers = {
    onPointerEnter: () => setHover(true),
    onPointerLeave: () => setHover(false),
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
      className={`hx${playing ? "" : " paused"}`}
      aria-labelledby="hero-title"
    >
      {motif}
      <div className="hx-frame">
        <div className="hx-type">
          <div className="hx-type-in">
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
              className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-3 focus-visible:left-3 focus-visible:z-20 focus-visible:rounded-md focus-visible:bg-surface focus-visible:px-3 focus-visible:py-1.5 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-foreground focus-visible:shadow-md"
            >
              {userPaused ? "Play demo" : "Pause demo"}
            </button>
          )}
          <div className="hx-tilt" ref={tilt}>
            <div className="edge" aria-hidden="true" />
            <Console s={s} dispatch={dispatch} {...pausers} />
          </div>
        </div>
        <div className="hx-veil" aria-hidden="true" />
      </div>
    </section>
  );
}
