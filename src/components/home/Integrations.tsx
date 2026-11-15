import { Icon, type IconName, isBrandName } from "@/components/icons";
import { ErixMarkSvg } from "@/components/marketing/erix-mark";
import { type BeamItem, IntegrationBeam } from "@/components/marketing/integration-beam";
import { MkSection, TrustBar } from "@/components/marketing/kit";
import { fetchCatalog } from "@/lib/api";
import { itemStatus } from "@/lib/catalog";

/**
 * Home: what ERIX connects to, and what it turns a message into. The strip
 * lists only integrations that are live in v1. The beam follows the catalog
 * (admin › Catalog): a channel staff listed and released shows as live, a
 * Coming soon one wears the badge, a hidden one is left out (founder, 15 Nov 2026).
 */
export function WorksWith() {
  return (
    <section aria-label="Works with" className="border-b border-border-soft bg-surface">
      <div className="mx-auto w-full max-w-wrap px-gutter">
        <TrustBar
          items={[
            { label: "WhatsApp", icon: "whatsapp" },
            { label: "Phone calls", icon: "phone" },
            { label: "Google Calendar and Meet", icon: "googlecalendar" },
          ]}
        />
      </div>
    </section>
  );
}

/** Where a message or call can come from, in display order. `fallback` shows when the catalog cannot be read; null stays out. */
const CHANNELS = [
  { id: "connect.whatsapp", label: "WhatsApp", icon: "whatsapp", fallback: "live" },
  { id: "connect.voice", label: "Phone calls", icon: "phone", fallback: "live" },
  { id: "connect.email", label: "Email", icon: "mail", fallback: "soon" },
  { id: "connect.webchat", label: "Website chat", icon: "message-square", fallback: "soon" },
  { id: "connect.instagram", label: "Instagram", icon: "instagram", fallback: "soon" },
  { id: "connect.facebook", label: "Facebook Messenger", icon: "facebook", fallback: null },
  { id: "connect.telegram", label: "Telegram", icon: "telegram", fallback: null },
] as const;

const beam = (it: { label: string; icon: IconName; soon?: boolean }): BeamItem => ({
  label: it.label,
  soon: it.soon,
  brand: isBrandName(it.icon),
  glyph: isBrandName(it.icon) ? <Icon name={it.icon} size={18} /> : <Icon name={it.icon} size={18} variant="duo" />,
});

export async function ChannelBeam({ tone }: { tone?: "plain" | "subtle" }) {
  const items = await fetchCatalog();
  const channels = CHANNELS.flatMap((c) => {
    const status = itemStatus(items, c.id, c.fallback);
    return status ? [{ label: c.label, icon: c.icon, soon: status !== "live" }] : [];
  });
  const soon = channels.filter((c) => c.soon).map((c) => c.label);
  const soonLine = soon.length
    ? ` ${new Intl.ListFormat("en", { type: "conjunction" }).format(soon)} ${soon.length > 1 ? "are" : "is"} coming soon.`
    : "";
  return (
    <MkSection
      id="channels"
      tone={tone}
      kicker="One place for every enquiry"
      title="Every message and call in. Every outcome out."
      lead={`Messages and calls land in ERIX, and the next step happens on its own: the lead is in your pipeline, the visit is booked and the follow-up is set.${soonLine}`}
    >
      <IntegrationBeam
        mark={<ErixMarkSvg label="ERIX" />}
        inputs={channels.map(beam)}
        outputs={[
          { label: "Lead in your CRM", icon: "user-check" as const },
          { label: "Visit booked", icon: "calendar-check" as const },
          { label: "AI answers from your price list", icon: "sparkles" as const },
          { label: "Follow-up scheduled", icon: "calendar-clock" as const },
        ].map(beam)}
      />
    </MkSection>
  );
}
