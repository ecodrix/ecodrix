import Link from "next/link";
import type { GlyphName } from "@/components/icons";
import { Icon } from "@/components/icons";
import { BrowserFrame, CtaBand, HeroMotif, MkSection, PrimaryCta } from "@/components/marketing/kit";
import { HeroCall } from "@/components/platform/voice/HeroCall";
import { ListenBar, NowSpacer } from "@/components/platform/voice/ListenBar";
import { VoiceGallery } from "@/components/platform/voice/VoiceGallery";
import { VoiceHeroHead } from "@/components/platform/voice/VoiceHeroHead";
import { VoiceLibrary } from "@/components/platform/voice/VoiceLibrary";
import { JsonLd } from "@/components/seo/JsonLd";
import { buttonVariants } from "@/components/ui/button";
import { getBreadcrumbSchema } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/seo";

export const metadata = pageMetadata({
  title: "ERIX Voices: 37 voices, 11 languages for your business calls",
  description:
    "Listen to eight demo calls and every ERIX voice by name in English, Hindi and Telugu. Pick the voice that sounds like your business; the assistant speaks 11 Indian languages.",
  path: "/platform/erix-voice/voices",
});

function SectionHead({
  id,
  title,
  jump,
  jumpLabel,
  children,
}: {
  id: string;
  title: string;
  jump: string;
  jumpLabel: string;
  children: string;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-baseline gap-x-3 min-[600px]:gap-x-6">
      <h2 id={id} className="scroll-mt-36 font-display text-[24px] leading-tight font-bold tracking-[-0.01em]">
        {title}
      </h2>
      <a
        href={jump}
        className="inline-flex min-h-11 items-center text-[15px] font-semibold text-accent underline underline-offset-[3px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent max-[599px]:ml-auto"
      >
        {jumpLabel}
      </a>
      <p className="max-w-[60ch] flex-[1_1_100%] text-[15px] text-muted-foreground">{children}</p>
    </div>
  );
}

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

      <section
        className="band-navy relative py-[clamp(40px,6vw,56px)] min-[1000px]:flex min-[1000px]:min-h-[min(100svh,760px)] min-[1000px]:flex-col min-[1000px]:justify-center"
        aria-labelledby="voices-title"
      >
        <HeroMotif />
        <div className="relative mx-auto grid w-full max-w-wrap items-center gap-[clamp(32px,5vw,64px)] px-gutter min-[1000px]:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
          <div className="min-w-0">
            <VoiceHeroHead />
            <p className="mt-3.5 max-w-[34em] font-sans text-[length:clamp(15px,1.5vw,19px)] leading-[1.55] text-pretty text-white/80">
              ERIX Voice is an AI assistant that answers your business calls in 11 Indian languages. It books
              appointments, takes messages and tells every caller it is an AI.
            </p>
            <p className="mt-3 flex max-w-[56ch] items-baseline gap-2.5 text-[13px] leading-snug text-on-navy-link">
              <span aria-hidden="true" className="size-1.5 flex-none -translate-y-0.5 rounded-full bg-ai" />
              <span>
                These 8 calls are demo recordings made for this page, not customers&apos; calls. You can hear 3 of the
                11 languages here.
              </span>
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5 max-[599px]:*:flex-[1_1_100%] min-[1000px]:mt-8">
              <PrimaryCta lg />
              <Link href="/platform/erix-voice" className={buttonVariants({ variant: "ghost", size: "lg" })}>
                About ERIX Voice
              </Link>
            </div>
          </div>
          <div className="hidden min-w-0 min-[1000px]:block">
            <BrowserFrame url="Demo call">
              <HeroCall />
            </BrowserFrame>
          </div>
        </div>
      </section>

      <ListenBar />

      <div className="bg-background px-gutter pt-6 pb-[clamp(32px,5vw,56px)]">
        <div className="mx-auto w-full max-w-wrap">
          <section aria-labelledby="h-calls">
            <SectionHead id="h-calls" title="Recorded calls" jump="#h-lib" jumpLabel="Hear the voices by name">
              Whole calls: hear an assistant handle a caller from hello to goodbye.
            </SectionHead>
            <VoiceGallery tabs={false} />
          </section>
          <section aria-labelledby="h-lib" className="pt-8">
            <SectionHead id="h-lib" title="Voice library" jump="#h-calls" jumpLabel="Back to the calls">
              One voice at a time, all saying the same sentence, so you can compare.
            </SectionHead>
            <VoiceLibrary />
          </section>
        </div>
      </div>

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

      <CtaBand
        id="voices-cta"
        title="Hear a call in your own language, then ask for access."
        actions={
          <>
            <PrimaryCta lg />
            <Link href="/platform/erix-voice" className={buttonVariants({ variant: "ghost", size: "lg" })}>
              About ERIX Voice
            </Link>
          </>
        }
      />
      <NowSpacer />
    </div>
  );
}
