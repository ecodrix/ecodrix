#!/usr/bin/env python3
"""Render the ERIX Voice page's sample calls with Sarvam Bulbul (billed per character).

Reads src/components/platform/voice-calls.json, speaks every line with the voice set for
its speaker, joins the turns into one call per language and writes:
  public/audio/voice-agent/calls/<call>-<lang>.mp3
  src/components/platform/voice-calls.audio.json   (duration, line timings, 48 loudness bars)

  python3 scripts/voice-samples.py --plan            # characters and cost, calls nothing
  ERIX_PAID_EVAL=1 bash ../voice-runtime/scripts/with_local_env.sh \
    python3 scripts/voice-samples.py --render        # needs SARVAM_API_KEY in the local voice env
  add --set library for the voice library (one self-introduction per voice and language)

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
import struct
import subprocess
import sys
import urllib.error
import urllib.request
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CALLS = ROOT / "src/components/platform/voice-calls.json"
MANIFEST = ROOT / "src/components/platform/voice-calls.audio.json"
AUDIO = ROOT / "public/audio/voice-agent/calls"
LIB = ROOT / "src/components/platform/voice-library.json"
LIB_MANIFEST = ROOT / "src/components/platform/voice-library.audio.json"
LIB_AUDIO = ROOT / "public/audio/voice-agent/voices"
URL = "https://api.sarvam.ai/text-to-speech"
LANG_CODE = {"en": "en-IN", "hi": "hi-IN", "te": "te-IN"}
RATE = 22050
INR_PER_1000 = 3.0  # sarvam.ai/api-pricing, Bulbul v3 pay as you go (Nov 2026)
TURN_GAP, LEAD, TAIL, BARS = 0.35, 0.2, 0.3, 48
V3_SPEAKERS = set(
    "shubh aditya ritu priya neha rahul pooja rohan simran kavya amit dev ishita shreya ratan varun manan sumit "
    "roopa kabir aayan ashutosh advait anand tanya tarun sunny mani gokul vijay shruti suhani mohit kavitha rehan "
    "soham rupali".split()
)


def load() -> dict:
    data = json.loads(CALLS.read_text(encoding="utf-8"))
    for c in data["calls"]:  # self-check: every spoken line has a known voice and fits Sarvam's limit
        for lang in data["langs"]:
            for who, text in c["lines"][lang]:
                if who == "e":
                    continue
                voice = c["voices"][who][lang]
                assert voice in V3_SPEAKERS, f"{c['id']}/{lang}: unknown bulbul:v3 voice {voice!r}"
                assert 0 < len(text) <= 2500, f"{c['id']}/{lang}: line length {len(text)}"
    return data


def spoken(data: dict):
    for c in data["calls"]:
        for lang in data["langs"]:
            for who, text in c["lines"][lang]:
                if who != "e":
                    yield c, lang, who, text, c["voices"][who][lang]


def speak(key: str, model: str, voice: str, lang: str, text: str, cache: Path) -> bytes:
    """16-bit mono PCM at RATE for one line, from the cache or from Sarvam."""
    h = hashlib.sha1(f"{model}|{voice}|{lang}|{text}".encode()).hexdigest()[:16]
    hit = cache / f"{h}.pcm"
    if hit.exists():
        return hit.read_bytes()
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


def mp3(pcm: bytes, out: Path) -> None:
    buf = io.BytesIO()
    with wave.open(buf, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(RATE); w.writeframes(pcm)
    out.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "wav", "-i", "-", "-ac", "1", "-codec:a", "libmp3lame",
                    "-b:a", "48k", str(out)], input=buf.getvalue(), check=True)


def library_lines(lib: dict):
    """(voice, lang, text) for the voice library: every voice says the same line with its own name."""
    for v in lib["voices"]:
        assert v in V3_SPEAKERS, f"unknown bulbul:v3 voice {v!r}"
        for lang in lib["langs"]:
            yield v, lang, lib["lines"][lang].format(name=v.capitalize())


def render_library(key: str, lib: dict, cache: Path) -> None:
    manifest: dict = {}
    for v, lang, text in library_lines(lib):
        pcm = silence(0.15) + speak(key, lib["model"], v, lang, text, cache) + silence(0.25)
        name = f"{v}-{lang}.mp3"
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
    ap.add_argument("--cache", type=Path, default=Path("/tmp/erix-voice-samples-cache"))
    a = ap.parse_args()
    if a.set == "library":
        lib = json.loads(LIB.read_text(encoding="utf-8"))
        lines = [(None, lang, None, text, v) for v, lang, text in library_lines(lib)]
        model = lib["model"]
    else:
        data = load()
        model = data["model"]
        lines = list(spoken(data))
    todo = [x for x in lines
            if not (a.cache / f"{hashlib.sha1(f'{model}|{x[4]}|{x[1]}|{x[3]}'.encode()).hexdigest()[:16]}.pcm").exists()]
    chars = sum(len(x[3]) for x in todo)
    print(f"{len(lines)} spoken lines, {len(todo)} not cached, {chars} characters ≈ ₹{chars * INR_PER_1000 / 1000:.2f}")
    if not a.render:
        return 0
    if os.environ.get("ERIX_PAID_EVAL") != "1":
        print("This run is billed by Sarvam. Get the founder's OK, then run with ERIX_PAID_EVAL=1.", file=sys.stderr)
        return 2
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
            pcm, segs, t = silence(LEAD), [], LEAD
            for i, (who, text) in enumerate(c["lines"][lang]):
                if i:
                    pcm += silence(TURN_GAP); t += TURN_GAP
                part = ringback() if who == "e" else speak(key, model, c["voices"][who][lang], lang, text, a.cache)
                d = len(part) / 2 / RATE
                segs.append([who, round(t, 2), round(t + d, 2)])
                pcm += part; t += d
            pcm += silence(TAIL); t += TAIL
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
