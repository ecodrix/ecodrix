import type { GlyphName } from "@/components/icons";
import { Icon } from "@/components/icons";
import { CtaBand, EmailCta, MkSection, PrimaryCta } from "@/components/marketing/kit";
import { GridSparks } from "@/components/motion/GridSparks";
import { VoiceGallery } from "@/components/platform/voice/VoiceGallery";
import { VoiceLibrary } from "@/components/platform/voice/VoiceLibrary";
import { CallsNote, ListenChip } from "@/components/platform/voice/VoiceSamples";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/seo";

export const metadata = pageMetadata({
  title: "ERIX Voices: 37 voices, 11 languages for your business calls",
  description:
    "Listen to eight real calls and every ERIX voice in English, Hindi and Telugu. Pick the voice that sounds like your business; the assistant speaks 11 Indian languages.",
  path: "/platform/erix-voice/voices",
});

/** Each option is live: languages.py (TTS_LANGUAGES, accent_voice, language_instruction), preview.py, IdentityTab.tsx, VoicePicker.tsx, BehaviourTab.tsx. */
const OPTIONS: { icon: GlyphName; title: string; text: string }[] = [
  {
    icon: "languages",
    title: "11 Indian languages",
    text: "English, Hindi, Telugu, Tamil, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi and Odia.",
  },
  {
    icon: "repeat",
    title: "Follows your caller",
    text: "If the caller switches between the languages you allow, the assistant switches with them.",
  },
  {
    icon: "mic",
    title: "Accent matched to the language",
    text: "When the call moves to Telugu, the voice moves to one that speaks Telugu natively.",
  },
  {
    icon: "gauge",
    title: "Your pace",
    text: "Speaking speed from 0.8× to 1.2×, so it suits a quick order line or a careful clinic desk.",
  },
  {
    icon: "sliders-horizontal",
    title: "Calm, natural or lively",
    text: "Pick the tone of the voice, and hear it on your own greeting before a customer does.",
  },
  {
    icon: "message-circle",
    title: "The way locals talk",
    text: "Everyday Hinglish or Tenglish mix, or the formal language, per language.",
  },
  {
    icon: "bot",
    title: "Tells callers it is an AI",
    text: "On by default: the assistant says so at the start of the call. You can switch it off, and the choice is yours.",
  },
];

export default function Page() {
  return (
    <div className="w-full">
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Platform", url: "/platform" },
          { name: "ERIX Voice", url: "/platform/erix-voice" },
          { name: "ERIX Voices", url: "/platform/erix-voice/voices" },
        ])}
      />

      <section className="band-navy pt-[clamp(40px,6vw,64px)] pb-[clamp(48px,6vw,80px)]" aria-labelledby="voices-title">
        <GridSparks />
        <div data-sparks-avoid="" className="relative mx-auto w-full max-w-wrap px-gutter">
          <div className="mb-6 space-y-4">
            <ListenChip />
          </div>
          <h1 id="voices-title" className="font-display text-mk-hero text-balance text-white">
            Every voice, in every language
          </h1>
          <p className="mt-4 mb-8 max-w-[44em] font-sans text-mk-lead text-pretty text-white/80">
            Eight calls a small business gets every week, in English, Hindi and Telugu. Pick a language and press play.
          </p>
          <VoiceGallery />
          <CallsNote />
        </div>
      </section>

      <MkSection id="options" title="Make it sound like your business">
        <ul className="grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {OPTIONS.map((o) => (
            <li key={o.title} className="grid grid-cols-[40px_1fr] gap-4">
              <span className="grid size-10 place-items-center rounded-[11px] bg-ai-subtle text-ai">
                <Icon name={o.icon} size={20} variant="duo" />
              </span>
              <div>
                <h3 className="font-display text-mk-h3 text-foreground">{o.title}</h3>
                <p className="mt-1.5 text-[15px] text-muted-foreground">{o.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </MkSection>

      <MkSection
        id="voices"
        tone="subtle"
        title="37 voices, 11 languages"
        lead="Every voice speaks all 11 languages. Pick the one that sounds like your business; the samples are in the three languages live today."
      >
        <VoiceLibrary />
      </MkSection>

      <CtaBand
        id="voices-cta"
        title="Hear your business on a call"
        actions={
          <>
            <PrimaryCta lg />
            <EmailCta lg />
          </>
        }
      />
    </div>
  );
}
