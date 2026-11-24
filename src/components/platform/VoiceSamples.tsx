import { MkSection } from "@/components/marketing/kit";
import { VoiceGallery } from "./VoiceGallery";
import { VoiceLibrary } from "./VoiceLibrary";

/** "Listen": six call cards in three languages. Server-rendered in English; the player is the client part. */
export function VoiceSamples() {
  return (
    <>
      <MkSection
        id="hear-it"
        kicker={
          <span className="inline-flex h-[30px] items-center gap-2 rounded-full border border-border bg-surface px-3 text-[13px] font-semibold text-muted-foreground">
            <span aria-hidden="true" className="size-[7px] rounded-full bg-ai" />
            Listen
          </span>
        }
        title="Every call answered, in your caller's language"
        lead="Eight calls a small business gets every week. Pick a language and press play."
      >
        <VoiceGallery />
        <p className="mt-6 flex max-w-[78ch] items-start gap-2.5 text-[14px] text-subtle">
          <span aria-hidden="true" className="mt-1.5 size-2.5 flex-none rounded-full bg-ai" />
          <span>
            Purple is the assistant; grey is the caller. Every call here is a real ERIX voice made with Sarvam AI&apos;s
            Bulbul, the voices your callers hear (
            <a
              href="https://www.sarvam.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent hover:underline"
            >
              sarvam.ai<span className="sr-only"> (opens in a new tab)</span>
            </a>
            ). Both sides are sample voices: none of these is a customer&apos;s call, and on every real call the
            assistant first says it is an AI.
          </span>
        </p>
      </MkSection>
      <MkSection
        id="voices"
        tone="subtle"
        title="37 voices, 11 languages"
        lead="Every voice speaks all 11 languages. Pick the one that sounds like your business; the samples are in the three languages live today."
      >
        <VoiceLibrary />
        <p className="mt-6 text-[14px] text-subtle">
          Voices made with Sarvam AI&apos;s Bulbul.{" "}
          <a
            href="https://www.sarvam.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-accent hover:underline"
          >
            sarvam.ai<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
      </MkSection>
    </>
  );
}
