import { Icon, Phone } from "@/components/icons";
import { useTween } from "./motion";
import type { Channel } from "./script";
import type { DemoState } from "./state";

export const CH: Record<Channel, string> = { wa: "WhatsApp", ph: "Phone" };
export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export function Count({ n, fmt = String }: { n: number; fmt?: (n: number) => string }) {
  return <>{fmt(useTween(n))}</>;
}

/** Avatar with the channel badge in the corner; `ring` = Riya is answering. */
export function Avatar({
  ini,
  ch,
  ring,
  className = "",
}: {
  ini: string;
  ch?: Channel;
  ring?: boolean;
  className?: string;
}) {
  return (
    <span className={`hx-av ${ring ? "ring " : ""}${className}`}>
      {ini}
      {ch && <span className="hx-mk">{ch === "wa" ? <Icon name="whatsapp" size={11} /> : <Phone size={11} />}</span>}
    </span>
  );
}

/** Props that make a target glow once when its word lights up (the counter parity restarts the animation). */
export function spotProps(s: DemoState, kind: "row" | "tab" | "thread", key: string) {
  const { k, id, n } = s.spot;
  if (!k) return {};
  const hit =
    kind === "tab"
      ? (k === "book" && key === "cal") || (k === "follow" && key === "flow")
      : (k === "answer" || (k === "you" && kind === "row")) && id === key;
  return hit ? { "data-spot": n % 2 ? "a" : "b", "data-spot-k": k === "you" ? "you" : "ai" } : {};
}
