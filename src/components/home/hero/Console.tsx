import type { Dispatch } from "react";
import { Calendar, Inbox as InboxIcon, IndianRupee, Phone, Users, Workflow } from "@/components/icons";
import { Inbox } from "./Inbox";
import { Count } from "./parts";
import type { View } from "./script";
import type { Action, DemoState } from "./state";
import { Board, Calendar as CalendarView, Flows, Payments } from "./Views";

const TABS: { view: View; label: string; Icon: typeof Users; badge?: "inbox" | "cal" | "pay" | "flow" }[] = [
  { view: "inbox", label: "Inbox", Icon: InboxIcon, badge: "inbox" },
  { view: "board", label: "Customers", Icon: Users },
  { view: "cal", label: "Calendar", Icon: Calendar, badge: "cal" },
  { view: "pay", label: "Payments", Icon: IndianRupee, badge: "pay" },
  { view: "flow", label: "Automations", Icon: Workflow, badge: "flow" },
];
const WAVE = Array.from({ length: 16 }, (_, i) => i);
const TITLES = Object.fromEntries(TABS.map((t) => [t.view, t.label])) as Record<View, string>;

export function Console({
  s,
  dispatch,
  ...rest
}: { s: DemoState; dispatch: Dispatch<Action> } & React.ComponentProps<"section">) {
  const need = s.convs.filter((c) => c.state === "need").length;
  const ai = s.convs.filter((c) => c.state === "ai").length;
  const call = s.call;
  return (
    <section className="hx-console" aria-label="Live example of the ERIX console" {...rest}>
      <div className="hx-rail" role="tablist" aria-label="Console sections">
        <span className="brand" aria-hidden="true">
          EX
        </span>
        {TABS.map(({ view, label, Icon, badge }) => {
          const n = badge && s.view !== view ? s.unseen[badge] : 0;
          return (
            <button
              key={view}
              type="button"
              className="hx-tab"
              role="tab"
              id={`hx-tab-${view}`}
              aria-controls={`hx-view-${view}`}
              aria-selected={s.view === view}
              onClick={() => dispatch({ type: "view", view })}
            >
              <Icon size={20} />
              {n > 0 && <span className="badge">{n}</span>}
              <span className="tip">{label}</span>
            </button>
          );
        })}
      </div>
      <div className="hx-main">
        <div className="hx-ctop">
          <b>{TITLES[s.view]}</b>
          <span className="hx-nowline" aria-live="polite">
            <span className="spin" aria-hidden="true" />
            <span className="who-ai">Riya</span>
            <span className="act" key={s.now}>
              {s.now}
            </span>
          </span>
          <div className="nums">
            <span className="num need">
              <strong>
                <Count n={need} />
              </strong>
              need you
            </span>
            <span className="num ai">
              <strong>
                <Count n={ai} />
              </strong>
              AI answering
            </span>
            <span className="num book">
              <strong>
                <Count n={s.booked} />
              </strong>
              booked today
            </span>
          </div>
        </div>
        <div className="hx-views">
          {(
            [
              ["inbox", <Inbox key="i" s={s} dispatch={dispatch} />],
              ["board", <Board key="b" s={s} />],
              ["cal", <CalendarView key="c" s={s} />],
              ["pay", <Payments key="p" s={s} />],
              ["flow", <Flows key="f" s={s} />],
            ] as [View, React.ReactNode][]
          ).map(([v, node]) => (
            <div
              key={v}
              className={`hx-view${s.view === v ? " on" : ""}`}
              id={`hx-view-${v}`}
              role="tabpanel"
              aria-labelledby={`hx-tab-${v}`}
            >
              {node}
            </div>
          ))}
        </div>
        {call && (
          <div className={`hx-call${call.ended ? " ended" : ""}`} data-who={call.who} aria-hidden="true">
            <div className="call-top">
              <span className="call-ic">
                <Phone size={15} />
              </span>
              <span>
                <b>Suresh K · Phone call</b>
                <small>{call.st}</small>
              </span>
              <span className="call-t">{call.t}</span>
            </div>
            <div className="wave">
              {WAVE.map((i) => (
                <i key={i} style={{ "--i": i } as React.CSSProperties} />
              ))}
            </div>
            <div className="call-line">
              {call.line && (
                <>
                  <b>{call.line[0]}</b> {call.line[1]}
                </>
              )}
            </div>
          </div>
        )}
        <div className="hx-toasts" aria-live="polite">
          {s.toasts.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`hx-toast${t.out ? " out" : ""}`}
              style={{ "--c": t.color } as React.CSSProperties}
              onClick={() => {
                dispatch({ type: "view", view: t.go.view });
                if (t.go.id) dispatch({ type: "select", id: t.go.id });
              }}
            >
              <i />
              <span>{t.text}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
