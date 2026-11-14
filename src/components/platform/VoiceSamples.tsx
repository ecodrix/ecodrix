import { MkSection } from "@/components/marketing/kit";

/** Demo lines made with the Sarvam Bulbul v3 voices customers get (ECOD/docs/voice/ab/2026-11-14). */
const SAMPLES = [
  {
    lang: "English",
    src: "/audio/voice-agent/erix-voice-booking-en.mp3",
    text: "Your appointment is on twenty-third November 2026 at four thirty PM.",
  },
  {
    lang: "Hindi",
    src: "/audio/voice-agent/erix-voice-booking-hi.mp3",
    text: "आपका appointment कल शाम 4 बजे confirm हो गया है।",
  },
  {
    lang: "Telugu",
    src: "/audio/voice-agent/erix-voice-booking-te.mp3",
    text: "మీ appointment రేపు సాయంత్రం 4 గంటలకు confirm అయ్యింది.",
  },
] as const;

/** "Hear it": three booking lines, each with native audio controls and its transcript beside it. */
export function VoiceSamples() {
  return (
    <MkSection
      id="hear-it"
      title="Hear it"
      lead="The same line, confirming an appointment, in the three languages live today. These are sample lines, not recordings of a customer's call."
    >
      <ul className="grid gap-4 md:grid-cols-3">
        {SAMPLES.map((s) => (
          <li key={s.lang} className="rounded-lg bg-surface p-5 shadow-card">
            <h3 className="font-sans text-[17px] font-semibold tracking-normal">{s.lang}</h3>
            {/* biome-ignore lint/a11y/useMediaCaption: the transcript is printed below the player */}
            <audio controls preload="none" src={s.src} className="mt-3 h-11 w-full" aria-label={`${s.lang} sample`} />
            <p className="mt-3 text-[15px] text-muted-foreground">
              <span className="font-semibold text-foreground">Transcript: </span>
              <span lang={s.lang === "English" ? "en" : s.lang === "Hindi" ? "hi" : "te"}>{s.text}</span>
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-[14px] text-muted-foreground">
        Voices powered by Sarvam AI&apos;s Bulbul text-to-speech.{" "}
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
  );
}
