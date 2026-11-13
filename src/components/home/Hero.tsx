import { MkHero, PrimaryCta, WhatsAppCta } from "@/components/marketing/kit";
import { HeroScene } from "@/components/scenes/hero-scene";

/**
 * Homepage hero (DS marketing `Hero`): navy band with the logo flourish, the
 * headline sharpening in, then the lead and actions. Server-rendered: the
 * text and the scene's finished frame are in the first HTML byte.
 */
export function Hero() {
  return (
    <MkHero
      top={
        <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/8 py-1 pr-3 pl-2 text-[13px] font-semibold text-white/85 ring-1 ring-white/15">
          <span aria-hidden="true" className="size-2 rounded-full bg-[var(--hero-dot)]" />
          Early access is opening soon
        </p>
      }
      title="Every WhatsApp message and call answered, booked and followed up."
      lead="One inbox for WhatsApp and phone calls. An AI agent that answers from your own price list and hands the rest to your team. A pipeline, bookings and automatic follow-ups behind it. More channels coming."
      actions={
        <>
          <PrimaryCta lg />
          <WhatsAppCta lg />
        </>
      }
      facts={[
        { icon: "message-circle", label: "Official WhatsApp Business API" },
        { icon: "phone", label: "WhatsApp and phone calls" },
        { icon: "indian-rupee", label: "Priced in rupees" },
      ]}
      visual={<HeroScene />}
    />
  );
}
