import { useRef } from "react";
import { Workflow } from "@/components/icons";
import { useFlip } from "./motion";
import { Avatar, CH, Count, inr } from "./parts";
import { STAGES } from "./script";
import type { DemoState } from "./state";

const initials = (n: string) =>
  n
    .split(" ")
    .map((w) => w[0])
    .join("");

export function Board({ s }: { s: DemoState }) {
  const ref = useRef<HTMLDivElement>(null);
  useFlip(ref, ".hx-card");
  return (
    <div className="hx-board" ref={ref}>
      {STAGES.map((st) => {
        const cs = s.convs.filter((c) => c.stage === st);
        return (
          <div className="col" key={st}>
            <h4>
              {st}
              <span>{cs.length}</span>
            </h4>
            {cs.map((c) => (
              <div className="hx-card" data-key={c.id} key={c.id}>
                <Avatar ini={c.ini} ch={c.ch} />
                <span className="min-w-0">
                  <b>{c.name}</b>
                  <span>{CH[c.ch]}</span>
                </span>
                <span className="val">{c.value ? inr(c.value) : ""}</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export function Calendar({ s }: { s: DemoState }) {
  return (
    <div className="hx-cal">
      {Object.entries(s.slots).map(([day, slots]) => (
        <div className="day" key={day}>
          <h4>{day}</h4>
          {Object.entries(slots).map(([t, who]) => (
            <div className={`hx-slot${who ? " full" : ""}${s.popSlot === `${day}|${t}` ? " pop" : ""}`} key={t}>
              <time>{t}</time>
              {who ? (
                <span className="who">
                  <Avatar ini={initials(who)} className="sm" />
                  {who}
                  {s.popSlot === `${day}|${t}` && <em>booked by Riya</em>}
                </span>
              ) : (
                <span>Free</span>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function Payments({ s }: { s: DemoState }) {
  const total = s.txns.reduce((a, t) => a + t.amt, 0);
  return (
    <div className="hx-pay">
      <div className="total">
        <strong>
          <Count n={total} fmt={inr} />
        </strong>
        <span>collected today</span>
      </div>
      {s.txns
        .map((t, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: lists are append-only, the index is the identity
          <div className="txn" key={`${i}:${t.name}`}>
            <Avatar ini={initials(t.name)} className="md" />
            <span>
              <b>{t.name}</b>
              <br />
              <span className="what">{t.what}</span>
            </span>
            <span className="amt">{inr(t.amt)}</span>
            <span className="tag">Paid · UPI</span>
          </div>
        ))
        .reverse()}
    </div>
  );
}

export function Flows({ s }: { s: DemoState }) {
  return (
    <div className="hx-flows">
      {s.flows.map((f) => (
        <div className="hx-flow" key={f.id}>
          <span className="ic">
            <Workflow size={18} />
          </span>
          <span>
            <b>{f.name}</b>
            <span>{f.when}</span>
          </span>
          <span className="runs">
            <strong>
              <Count n={f.runs} />
            </strong>
            <span>runs</span>
          </span>
        </div>
      ))}
    </div>
  );
}
