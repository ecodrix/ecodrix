import audioJson from "./voice-calls.audio.json";
import callsJson from "./voice-calls.json";

/** Types over the two JSON files: voice-calls.json (transcripts, voices) and voice-calls.audio.json (rendered by scripts/voice-samples.py). */
export type Lang = "en" | "hi" | "te";
/** r = assistant, c = caller, h = team member, e = event (not spoken). */
export type Who = "r" | "c" | "h" | "e";
export type Turn = readonly [Who, string];
export type TagKind = "book" | "back" | "hand";

export type Call = {
  id: string;
  ind: string;
  title: string;
  dir: string;
  tag: readonly [TagKind, string];
  caller: string;
  human?: string;
  voices: { r: Record<Lang, string> };
  lines: Record<Lang, readonly Turn[]>;
};
export type Audio = {
  src: string;
  dur: number;
  segs: readonly (readonly [Who, number, number])[];
  peaks: readonly number[];
};

export const CALLS = callsJson.calls as unknown as readonly Call[];
export const AUDIO = audioJson as unknown as Record<string, Record<Lang, Audio>>;

const NATIVE: Record<Lang, string> = { en: "English", hi: "हिन्दी", te: "తెలుగు" };
export const LANGS: readonly { id: Lang; label: string }[] = (callsJson.langs as Lang[]).map((id) => ({
  id,
  label: NATIVE[id],
}));

/** The assistant's display name is its voice name for the language, capitalised. */
export const assistantName = (c: Call, lang: Lang) => {
  const v = c.voices.r[lang];
  return v.charAt(0).toUpperCase() + v.slice(1);
};
