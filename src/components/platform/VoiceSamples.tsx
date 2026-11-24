import Link from "next/link";
import { Icon } from "@/components/icons";
import { MkSection } from "@/components/marketing/kit";
import { VoiceGallery } from "./VoiceGallery";

/** The "Listen" pill used above the call galleries. */
export function ListenChip() {
  return (
    <span className="inline-flex h-[30px] items-center gap-2 rounded-full border border-border bg-surface px-3 text-[13px] font-semibold text-muted-foreground">
      <span aria-hidden="true" className="size-[7px] rounded-full bg-ai" />
      Listen
    </span>
  );
}

/** Note under the call cards. Voices are ERIX voices; no provider is named. */
export function CallsNote() {
  return (
    <p className="mt-6 flex max-w-[78ch] items-start gap-2.5 text-[14px] text-subtle">
      <span aria-hidden="true" className="mt-1.5 size-2.5 flex-none rounded-full bg-ai" />
      <span>
        Purple is the assistant; grey is the caller. Every call here is a real ERIX voice, and both sides are sample
        voices: none of these is a customer&apos;s call.
      </span>
    </p>
  );
}

/** ERIX Voice product page: a four-call teaser; the full gallery and the voice library live on /voices. */
export function VoiceSamples() {
  return (
    <MkSection
      id="hear-it"
      kicker={<ListenChip />}
      title="Every call answered, in your caller's language"
      lead="Eight calls a small business gets every week. Pick a language and press play."
    >
      <VoiceGallery limit={4} />
      <CallsNote />
      <Link
        href="/platform/erix-voice/voices"
        className="group mt-5 inline-flex items-center gap-1.5 font-semibold text-accent hover:underline"
      >
        Hear all 8 calls and 37 voices
        <Icon
          name="arrow-right"
          variant="line"
          size={16}
          className="transition-transform duration-150 group-hover:translate-x-1 motion-reduce:transition-none"
        />
      </Link>
    </MkSection>
  );
}
