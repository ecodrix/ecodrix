import { getVoiceLang, setVoiceLang } from "./use-voice-lang";
import { AUDIO, CALLS, type Lang } from "./voice-calls";
import audioJson from "./voice-library.audio.json";
import { voiceName } from "./voice-names";
import { type Clip, getPlayer, play, stop } from "./voice-player";

type LibClip = { src: string; dur: number };
const LIB = audioJson as unknown as Record<string, Record<Lang, LibClip>>;

export const LANG_NAME: Record<Lang, string> = { en: "English", hi: "Hindi", te: "Telugu" };

/** The page-wide id of a call clip and of a voice clip (the voice by its code; its name is only shown). */
export const callId = (id: string) => `call:${id}`;
export const voiceId = (code: string) => `voice:${code}`;
/** DOM id of a voice tile: a name, so "#voice-kavya" is a link a person can share. */
export const voiceDomId = (code: string) => `voice-${voiceName(code).toLowerCase()}`;

export function callClip(id: string, lang: Lang): Clip {
  const c = CALLS.find((x) => x.id === id);
  const a = AUDIO[id][lang];
  return { id: callId(id), domId: `call-${id}`, label: `${c?.ind} call in ${LANG_NAME[lang]}`, src: a.src, dur: a.dur };
}

export function voiceClip(code: string, lang: Lang): Clip {
  const a = LIB[code][lang];
  return {
    id: voiceId(code),
    domId: voiceDomId(code),
    label: `${voiceName(code)} in ${LANG_NAME[lang]}`,
    src: a.src,
    dur: a.dur,
  };
}

function clipFor(id: string, lang: Lang): Clip | null {
  if (id.startsWith("call:")) return callClip(id.slice(5), lang);
  if (id.startsWith("voice:")) return voiceClip(id.slice(6), lang);
  return null;
}

/** Change the language; a clip that is playing carries on in the new language, anything else stops. */
export function pickLang(next: Lang) {
  if (next === getVoiceLang()) return;
  const cur = getPlayer();
  const keep = cur?.playing ? cur.id : null;
  stop();
  setVoiceLang(next);
  const c = keep && clipFor(keep, next);
  if (c) play(c);
}
