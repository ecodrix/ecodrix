#!/usr/bin/env python3
"""Render the ERIX Voice page's sample calls with Sarvam Bulbul (billed per character).

Reads src/components/platform/voice/voice-calls.json, speaks every line with the voice set for
its speaker, joins the turns into one call per language and writes:
  public/audio/voice-agent/calls/<call>-<lang>.mp3
  src/components/platform/voice/voice-calls.audio.json   (duration, line timings, 48 loudness bars)

Run it with the voice runtime's Python (PY=../voice-runtime/.venv/bin/python): every line goes through the
live product's own speaking rules first, so "2BHK", "6:30 pm" and "₹2,500" are said the way a real call says them.

  $PY scripts/voice-samples.py --plan            # characters and cost, calls nothing
  $PY scripts/voice-samples.py --assemble        # rebuild the audio from cached lines; free, calls nothing
  ERIX_PAID_EVAL=1 bash ../voice-runtime/scripts/with_local_env.sh \
    $PY scripts/voice-samples.py --render        # needs SARVAM_API_KEY in the local voice env
  add --set library for the voice library (one self-introduction per voice and language)

A call is assembled to sound like a call, not like glued clips: each line loses the engine's edge
silence and gets one speech level, the pause differs per turn, the caller sits on a phone line, room
tone runs under everything and every file ends at the same loudness.

Spoken lines are cached by (model, voice, language, text), so a rerun only pays for changed lines.
Needs ffmpeg on PATH. Standard library only.
"""
from __future__ import annotations

import argparse
import base64
import hashlib
import io
import json
import math
import os
import random
import re
import struct
import subprocess
import sys
import tempfile
import urllib.error
import urllib.request
import wave
from array import array
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CALLS = ROOT / "src/components/platform/voice/voice-calls.json"
MANIFEST = ROOT / "src/components/platform/voice/voice-calls.audio.json"
AUDIO = ROOT / "public/audio/voice-agent/calls"
LIB = ROOT / "src/components/platform/voice/voice-library.json"
IDS = ROOT / "scripts/voice-ids.json"  # private: ERIX code -> provider speaker, never imported by the site
LIB_MANIFEST = ROOT / "src/components/platform/voice/voice-library.audio.json"
LIB_AUDIO = ROOT / "public/audio/voice-agent/voices"
URL = "https://api.sarvam.ai/text-to-speech"
LANG_CODE = {"en": "en-IN", "hi": "hi-IN", "te": "te-IN"}
RATE = 22050
INR_PER_1000 = 3.0  # sarvam.ai/api-pricing, Bulbul v3 pay as you go (Nov 2026)
LEAD, TAIL, BARS = 0.2, 0.3, 48
FRAME = RATE // 50  # 20 ms
LEVEL_DB = -23.0  # speech level every line is set to before the mix (dBFS)
TARGET_I, LIMIT_DB = -19.0, -2.5  # loudness of every file (LUFS); peaks are held under this (dBFS), mp3 adds about 1 dB
PHONE = "highpass=f=300,lowpass=f=3400,lowpass=f=3400"  # the caller is on a phone line; our side stays clean
ROOM = 0.004  # room-tone amplitude: a real call is never digital silence
RAW = ["-f", "s16le", "-ar", str(RATE), "-ac", "1"]
V3_SPEAKERS = set(
    "shubh aditya ritu priya neha rahul pooja rohan simran kavya amit dev ishita shreya ratan varun manan sumit "
    "roopa kabir aayan ashutosh advait anand tanya tarun sunny mani gokul vijay shruti suhani mohit kavitha rehan "
    "soham rupali".split()
)


def render_model() -> str:
    """The render model lives in the private id file, so it never ships in the site's JSON."""
    return json.loads(IDS.read_text(encoding="utf-8"))["model"]


def provider(code: str) -> str:
    v = json.loads(IDS.read_text(encoding="utf-8"))["ids"][code]
    assert v in V3_SPEAKERS, f"{code}: unknown bulbul:v3 voice {v!r}"
    return v


def spoken_form(text: str, lang: str) -> str:
    """What the live product hands the voice engine for this line. The transcript keeps the written text."""
    try:
        from voice_runtime.orchestration.pronounce import map_for, speak_text
    except ImportError:
        raise SystemExit("Run with the voice runtime's Python: ../voice-runtime/.venv/bin/python scripts/voice-samples.py")
    return speak_text(text, lang, map_for("", None))


def load() -> dict:
    data = json.loads(CALLS.read_text(encoding="utf-8"))
    for c in data["calls"]:  # self-check: every spoken line has a known voice and fits Sarvam's limit
        for lang in data["langs"]:
            for who, text in c["lines"][lang]:
                if who == "e":
                    continue
                provider(c["voices"][who][lang])  # every code resolves to a known speaker
                assert 0 < len(text) <= 2500, f"{c['id']}/{lang}: line length {len(text)}"
    return data


def spoken(data: dict):
    for c in data["calls"]:
        for lang in data["langs"]:
            for who, text in c["lines"][lang]:
                if who != "e":
                    yield c, lang, who, spoken_form(text, lang), provider(c["voices"][who][lang])


def speak(key: str, model: str, voice: str, lang: str, text: str, cache: Path) -> bytes:
    """16-bit mono PCM at RATE for one line, from the cache or from Sarvam."""
    h = hashlib.sha1(f"{model}|{voice}|{lang}|{text}".encode()).hexdigest()[:16]
    hit = cache / f"{h}.pcm"
    if hit.exists():
        return hit.read_bytes()
    if not key:  # --assemble: never reach the paid API
        raise SystemExit(f"{voice}/{lang}: line is not cached and there is no key; nothing was billed")
    body = json.dumps({"text": text, "language_code": LANG_CODE[lang], "speaker": voice, "model": model,
                       "speech_sample_rate": RATE, "output_audio_codec": "wav", "enable_preprocessing": True}).encode()
    req = urllib.request.Request(URL, data=body, method="POST",
                                 headers={"api-subscription-key": key, "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            audios = json.load(r)["audios"]
    except urllib.error.HTTPError as e:  # Sarvam's error body names the problem; the key is never printed
        raise SystemExit(f"Sarvam {e.code} for {voice}/{lang}: {e.read().decode('utf-8', 'replace')[:300]}")
    pcm = b""
    for a in audios:
        with wave.open(io.BytesIO(base64.b64decode(a))) as w:
            assert (w.getnchannels(), w.getsampwidth(), w.getframerate()) == (1, 2, RATE), "unexpected WAV format"
            pcm += w.readframes(w.getnframes())
    cache.mkdir(parents=True, exist_ok=True)
    hit.write_bytes(pcm)
    return pcm


def silence(sec: float) -> bytes:
    return b"\x00\x00" * int(sec * RATE)


def ringback(sec: float = 1.2) -> bytes:
    """Indian ringback (425 Hz, 0.4 s on, 0.2 s off), quiet: stands for the transfer."""
    out = bytearray()
    for i in range(int(sec * RATE)):
        t = i / RATE
        on = (t % 0.6) < 0.4
        out += struct.pack("<h", int(3000 * math.sin(2 * math.pi * 425 * t)) if on else 0)
    return bytes(out)


def bars(pcm: bytes) -> list[float]:
    n = len(pcm) // 2
    s = struct.unpack(f"<{n}h", pcm[: n * 2])
    k = max(1, n // BARS)
    r = [math.sqrt(sum(x * x for x in s[i * k:(i + 1) * k]) / k) for i in range(BARS)]
    m = max(r) or 1
    return [round(max(0.08, v / m), 2) for v in r]


def shape(pcm: bytes, db: float = LEVEL_DB) -> bytes:
    """One spoken line: edge silence cut, speech set to db dBFS, 8 ms fades. The pauses become ours, not the engine's."""
    a = array("h")
    a.frombytes(pcm[: len(pcm) // 2 * 2])
    e = [sum(x * x for x in a[i:i + FRAME]) / FRAME for i in range(0, len(a) - FRAME + 1, FRAME)]
    floor = (32768 * 10 ** (-45 / 20)) ** 2  # frames under -45 dBFS are silence
    live = [i for i, v in enumerate(e) if v > floor]
    if not live:
        return pcm
    a = a[max(0, live[0] - 1) * FRAME:(live[-1] + 2) * FRAME]
    g = 32768 * 10 ** (db / 20) / math.sqrt(sum(e[i] for i in live) / len(live))  # level of the speech, pauses left out
    g = min(g, 32000 / max(1, max(abs(x) for x in a)))  # never clip a line
    n, f = len(a), RATE // 125
    return array("h", (int(x * g * min(1, i / f, (n - 1 - i) / f)) for i, x in enumerate(a))).tobytes()


def gap(prev: str, who: str, text: str, rng: random.Random) -> float:
    """Pause before a turn. People do not answer on a metronome: a short reply comes fast, the assistant takes a moment."""
    if "e" in (prev, who):
        return 0.3
    if who == "c":
        return rng.uniform(0.15, 0.28) if len(text.split()) <= 4 else rng.uniform(0.25, 0.5)
    return rng.uniform(0.45, 0.7)


def call_tracks(c: dict, lang: str, say) -> tuple:
    """(our side, caller, segments): two tracks, so only the caller gets the phone-line sound."""
    rng = random.Random(f"{c['id']}|{lang}")  # same pauses on every run
    parts, t, prev = [], LEAD, ""
    for who, text in c["lines"][lang]:
        if prev:
            t += gap(prev, who, text, rng)
        part = ringback() if who == "e" else shape(say(who, text))
        parts.append((who, int(t * RATE), part))
        t, prev = t + len(part) / 2 / RATE, who
    n = int((t + TAIL) * RATE)
    ours, caller = bytearray(2 * n), bytearray(2 * n)
    for who, at, part in parts:
        (caller if who == "c" else ours)[2 * at:2 * at + len(part)] = part
    segs = [[who, round(at / RATE, 2), round(at / RATE + len(part) / 2 / RATE, 2)] for who, at, part in parts]
    return bytes(ours), bytes(caller), segs


def ff(args: list, data: bytes = b"") -> subprocess.CompletedProcess:
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-y", *args], input=data, capture_output=True)
    if r.returncode:
        raise SystemExit(f"ffmpeg failed: {r.stderr.decode('utf-8', 'replace')[-400:]}")
    return r


def mix(ours: bytes, caller: bytes) -> bytes:
    """Our side + the caller through a phone line + room tone, as PCM of the same length."""
    with tempfile.TemporaryDirectory() as d:
        p = Path(d, "caller.pcm")
        p.write_bytes(caller)
        graph = (f"[1:a]{PHONE}[c];anoisesrc=r={RATE}:c=pink:a={ROOM}:s=7[n];"
                 "[0:a][c][n]amix=inputs=3:duration=first,volume=3")  # amix divides by its 3 inputs
        return ff([*RAW, "-i", "-", *RAW, "-i", str(p), "-filter_complex", graph, *RAW, "-"], ours).stdout


def mp3(pcm: bytes, out: Path) -> None:
    """Every file at one loudness. The gain is linear, so quiet pauses are not pumped up; a limiter holds the few peaks."""
    log = ff([*RAW, "-i", "-", "-af", "loudnorm=print_format=json", "-f", "null", "-"], pcm).stderr.decode()
    g = TARGET_I - float(json.loads(re.findall(r"\{[^{}]*\}", log)[-1])["input_i"])
    assert math.isfinite(g), f"{out.name}: silent audio"
    out.parent.mkdir(parents=True, exist_ok=True)
    tame = f"volume={g:.2f}dB,alimiter=limit={10 ** (LIMIT_DB / 20):.3f}:attack=5:release=50:level=0"
    ff([*RAW, "-i", "-", "-af", tame, "-codec:a", "libmp3lame", "-b:a", "64k", str(out)], pcm)


def selfcheck() -> None:
    tone = b"".join(struct.pack("<h", int(8000 * math.sin(2 * math.pi * 220 * i / RATE))) for i in range(RATE // 2))
    a = array("h")
    a.frombytes(shape(silence(0.3) + tone + silence(0.4)))
    assert abs(len(a) / RATE - 0.5) < 0.08, "shape() must cut the edge silence and keep the speech"
    assert abs(20 * math.log10(math.sqrt(sum(x * x for x in a) / len(a)) / 32768) - LEVEL_DB) < 1, "shape() must set the level"
    rng = random.Random("check")
    gaps = [gap("c", "r", "ok", rng) for _ in range(20)]
    assert 0.45 <= min(gaps) and max(gaps) <= 0.7 and len(set(gaps)) > 10, "pauses must differ and stay in range"
    assert gap("r", "e", "", rng) == 0.3 and gap("r", "c", "Yes please", rng) <= 0.28, "event and short-reply pauses"


def library_lines(lib: dict):
    """(voice, lang, text) for the voice library: every voice says the same line with its own name."""
    for code in lib["voices"]:
        for lang in lib["langs"]:
            yield code, lang, lib["lines"][lang]


def render_library(key: str, lib: dict, cache: Path) -> None:
    manifest: dict = {}
    for v, lang, text in library_lines(lib):
        pcm = silence(0.15) + shape(speak(key, render_model(), provider(v), lang, spoken_form(text, lang), cache)) + silence(0.25)
        name = f"{v.lower().replace(' ', '-')}-{lang}.mp3"
        mp3(pcm, LIB_AUDIO / name)
        manifest.setdefault(v, {})[lang] = {"src": f"/audio/voice-agent/voices/{name}",
                                             "dur": round(len(pcm) / 2 / RATE, 2), "peaks": bars(pcm)}
    LIB_MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"wrote {LIB_MANIFEST.relative_to(ROOT)} and {sum(len(x) for x in manifest.values())} clips")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--set", choices=["calls", "library"], default="calls",
                    help="calls: the sample calls; library: one self-introduction per voice and language")
    ap.add_argument("--plan", action="store_true", help="print characters and cost; call nothing")
    ap.add_argument("--render", action="store_true")
    ap.add_argument("--assemble", action="store_true", help="rebuild the audio from cached lines only; free, calls nothing")
    ap.add_argument("--cache", type=Path, default=Path("/tmp/erix-voice-samples-cache"))
    a = ap.parse_args()
    selfcheck()
    if a.set == "library":
        lib = json.loads(LIB.read_text(encoding="utf-8"))
        lines = [(None, lang, None, spoken_form(text, lang), provider(v)) for v, lang, text in library_lines(lib)]
        model = render_model()
    else:
        data = load()
        model = render_model()
        lines = list(spoken(data))
    todo = [x for x in lines
            if not (a.cache / f"{hashlib.sha1(f'{model}|{x[4]}|{x[1]}|{x[3]}'.encode()).hexdigest()[:16]}.pcm").exists()]
    chars = sum(len(x[3]) for x in todo)
    print(f"{len(lines)} spoken lines, {len(todo)} not cached, {chars} characters ≈ ₹{chars * INR_PER_1000 / 1000:.2f}")
    if not (a.render or a.assemble):
        return 0
    key = ""
    if not a.render:
        if todo:
            print(f"{len(todo)} lines are not cached; --assemble never calls the provider.", file=sys.stderr)
            return 4
    elif os.environ.get("ERIX_PAID_EVAL") != "1":
        print("This run is billed by Sarvam. Get the founder's OK, then run with ERIX_PAID_EVAL=1.", file=sys.stderr)
        return 2
    else:
        key = os.environ.get("SARVAM_API_KEY", "")
        if not key or key.startswith(("dev-", "mock-", "replace-", "test-")):
            print("No SARVAM_API_KEY in the environment (use voice-runtime/scripts/with_local_env.sh).", file=sys.stderr)
            return 3
    if a.set == "library":
        render_library(key, lib, a.cache)
        return 0
    manifest: dict = {}
    for c in data["calls"]:
        for lang in data["langs"]:
            ours, caller, segs = call_tracks(
                c, lang, lambda who, text: speak(key, model, provider(c["voices"][who][lang]), lang, spoken_form(text, lang), a.cache))
            pcm = mix(ours, caller)
            t = len(pcm) / 2 / RATE
            assert abs(len(pcm) - len(ours)) <= 2 * FRAME, "the mix must keep the call's length"
            name = f"{c['id']}-{lang}.mp3"
            mp3(pcm, AUDIO / name)
            assert all(s[1] < s[2] for s in segs) and all(x[2] <= y[1] for x, y in zip(segs, segs[1:])), "segments overlap"
            manifest.setdefault(c["id"], {})[lang] = {"src": f"/audio/voice-agent/calls/{name}", "dur": round(t, 2),
                                                      "segs": segs, "peaks": bars(pcm)}
            print(f"  {name}  {t:.1f}s")
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"wrote {MANIFEST.relative_to(ROOT)} and {len(manifest) * len(data['langs'])} clips")
    return 0


if __name__ == "__main__":
    sys.exit(main())
