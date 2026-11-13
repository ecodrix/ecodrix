import { Icon, type IconName, isBrandName } from "@/components/icons";
import { ErixMarkSvg } from "@/components/marketing/erix-mark";
import { type BeamItem, IntegrationBeam } from "@/components/marketing/integration-beam";
import { MkSection, TrustBar } from "@/components/marketing/kit";

/**
 * Home: what ERIX connects to, and what it turns a message into. Only
 * integrations that are live in v1: WhatsApp, phone calls and Google
 * Calendar. Instagram, email, website chat and Razorpay are Coming soon.
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

const beam = (it: { label: string; icon: IconName }): BeamItem => ({
  label: it.label,
  brand: isBrandName(it.icon),
  glyph: isBrandName(it.icon) ? <Icon name={it.icon} size={18} /> : <Icon name={it.icon} size={18} variant="duo" />,
});

export function ChannelBeam({ tone }: { tone?: "plain" | "subtle" }) {
  return (
    <MkSection
      id="channels"
      tone={tone}
      kicker="One place for every enquiry"
      title="Every message and call in. Every outcome out."
      lead="WhatsApp messages and phone calls land in ERIX, and the next step happens on its own: the lead is in your pipeline, the visit is booked and the follow-up is set. More channels coming soon."
    >
      <IntegrationBeam
        mark={<ErixMarkSvg label="ERIX" />}
        inputs={[
          { label: "WhatsApp", icon: "whatsapp" as const },
          { label: "Phone calls", icon: "phone" as const },
        ].map(beam)}
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
