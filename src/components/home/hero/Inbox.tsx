import { type Dispatch, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useFlip } from "./motion";
import { Avatar, CH, inr } from "./parts";
import type { ConvState } from "./script";
import type { Action, DemoState } from "./state";

const STATE: Record<ConvState, { label: string; cls: string; color: string }> = {
  ai: { label: "Riya is answering", cls: "ai", color: "var(--hx-ai)" },
  need: { label: "Waiting for you", cls: "need", color: "var(--hx-danger)" },
  you: { label: "You took over", cls: "you", color: "var(--hx-blue)" },
  done: { label: "Done", cls: "done", color: "var(--hx-ink3)" },
};

/** Reply box; remounts per thread so a half-typed reply never leaks into another chat. */
function Compose({ s, dispatch }: { s: DemoState; dispatch: Dispatch<Action> }) {
  const c = s.convs.find((x) => x.id === s.sel);
  const [text, setText] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const you = c?.state === "you";
  useEffect(() => {
    if (you) input.current?.focus();
  }, [you]);
  if (!c) return null;
  const send = () => {
    if (!text.trim()) return;
    dispatch({ type: "send", text });
    setText("");
    input.current?.focus();
  };
  if (you)
    return (
      <div className="hx-compose">
        <label htmlFor="hx-reply" className="sr-only">
          Your reply
        </label>
        <input
          ref={input}
          id="hx-reply"
          value={text}
          placeholder="Type a reply…"
          autoComplete="off"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              send();
            }
          }}
        />
        <button type="button" className="hx-small primary" onClick={send}>
          Send
        </button>
      </div>
    );
  return (
    <div className="hx-compose">
      <span className="note">
        {c.state === "ai"
          ? "Riya is answering. Take over to reply yourself."
          : c.state === "need"
            ? "Riya handed this to you."
            : "Done."}
      </span>
      {c.state !== "done" && (
        <button type="button" className="hx-small" onClick={() => dispatch({ type: "take" })}>
          Take over
        </button>
      )}
    </div>
  );
}

export function Inbox({ s, dispatch }: { s: DemoState; dispatch: Dispatch<Action> }) {
  const list = useRef<HTMLDivElement>(null);
  const msgs = useRef<HTMLDivElement>(null);
  useFlip(list, ".hx-row");
  const v = s.convs.find((c) => c.id === s.sel) ?? s.convs[0];
  const st = STATE[v.state];
  const typing = s.typingFor === v.id;
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run when the thread, its length or typing changes
  useLayoutEffect(() => {
    if (msgs.current) msgs.current.scrollTop = msgs.current.scrollHeight;
  }, [v.id, v.msgs.length, typing]);

  return (
    <div className="hx-inbox">
      <div className="hx-list" ref={list} role="listbox" aria-label="Conversations">
        {s.convs.map((c) => {
          const cs = STATE[c.state];
          const last = c.msgs[c.msgs.length - 1];
          const prev = last ? (last.f === "ai" ? "Riya: " : last.f === "you" ? "You: " : "") + last.t : "";
          return (
            <button
              key={c.id}
              type="button"
              role="option"
              aria-selected={c.id === v.id}
              className={`hx-row${c.id === v.id ? " sel" : ""}`}
              data-key={c.id}
              style={{ "--edge": cs.color } as React.CSSProperties}
              onClick={() => dispatch({ type: "select", id: c.id })}
            >
              <Avatar ini={c.ini} ch={c.ch} ring={c.state === "ai"} />
              <span className="r-main">
                <span className="r-top">
                  <b>{c.name}</b>
                  <time>{c.time}</time>
                </span>
                <span className="r-prev">{prev}</span>
                <span className="r-state" style={{ color: cs.color }}>
                  {cs.label}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="hx-thread">
        <div className="hx-strip" style={{ "--strip": st.color } as React.CSSProperties} />
        <div className="hx-thead">
          <Avatar ini={v.ini} ch={v.ch} ring={v.state === "ai"} />
          <span className="who">
            <b>{v.name}</b>
            <span>
              {CH[v.ch]} · {v.ph}
            </span>
          </span>
          <span className={`hx-pill ${st.cls}`}>{st.label}</span>
          {(v.state === "ai" || v.state === "need") && (
            <button type="button" className="hx-small primary" onClick={() => dispatch({ type: "take" })}>
              Take over
            </button>
          )}
          {v.state === "you" && (
            <button type="button" className="hx-small" onClick={() => dispatch({ type: "back" })}>
              Hand back to Riya
            </button>
          )}
        </div>
        <div className="hx-msgs" ref={msgs} aria-live="polite">
          {v.msgs.map((m, i) => {
            const isNew = s.newKeys.includes(`${v.id}:${i}`) ? " new" : "";
            return m.f === "ev" ? (
              // biome-ignore lint/suspicious/noArrayIndexKey: lists are append-only, the index is the identity
              <span key={`${v.id}:${i}`} className={`hx-m ev ${m.k ?? ""}${isNew}`}>
                {m.t}
              </span>
            ) : (
              // biome-ignore lint/suspicious/noArrayIndexKey: lists are append-only, the index is the identity
              <span key={`${v.id}:${i}`} className={`hx-m ${m.f}${isNew}`}>
                {m.f === "ai" && <small>Riya · AI</small>}
                {m.f === "you" && <small>You</small>}
                {m.t}
              </span>
            );
          })}
          {typing && (
            <span className="hx-dots" role="img" aria-label="Riya is typing">
              <span />
              <span />
              <span />
            </span>
          )}
        </div>
        <Compose key={v.id} s={s} dispatch={dispatch} />
      </div>
      <aside className="hx-side" aria-label="Customer">
        <span className="big-av">{v.ini}</span>
        <h3>{v.name}</h3>
        <span className="ph">{v.ph}</span>
        <dl className="hx-kv">
          <dt>Stage</dt>
          <dd>{v.stage}</dd>
          <dt>Value</dt>
          <dd>{v.value ? inr(v.value) : "—"}</dd>
          <dt>Channel</dt>
          <dd>{CH[v.ch]}</dd>
        </dl>
        <ol className="hx-timeline" aria-label="Activity">
          {/* biome-ignore lint/suspicious/noArrayIndexKey: lists are append-only, the index is the identity */}
          {v.tl.map((t, i) => <li key={`${i}:${t}`}>{t}</li>).reverse()}
        </ol>
      </aside>
    </div>
  );
}
