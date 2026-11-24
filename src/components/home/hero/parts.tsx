import { Icon, MessageCircle, Phone } from "@/components/icons";
import { useTween } from "./motion";
import type { Channel } from "./script";

export const CH: Record<Channel, string> = { wa: "WhatsApp", web: "Website chat", ig: "Instagram", ph: "Phone" };
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
      {ch && (
        <span className="hx-mk">
          {ch === "wa" ? (
            <Icon name="whatsapp" size={11} />
          ) : ch === "ig" ? (
            <Icon name="instagram" size={11} />
          ) : ch === "ph" ? (
            <Phone size={11} />
          ) : (
            <MessageCircle size={11} />
          )}
        </span>
      )}
    </span>
  );
}
