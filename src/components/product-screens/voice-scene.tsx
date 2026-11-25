import { Icon, Play, Sparkles } from "@/components/icons";
import { Scene } from "@/components/motion/scene";
import { AppFrame, Avatar, at, Channel, Pill } from "@/components/product-screens/parts";
import { cn } from "@/lib/utils";

// Words and labels follow the console's call thread (saas components/inbox/voice/VoiceThread.tsx and
// channels/voice/voiceLabels.ts): "Inbound call, answered by the assistant", "Completed" + "Goal met",
// "Play the whole call", one play button per line, and no typing box on a phone thread.
const lines = [
  { who: "c", text: "Hi, I'd like a teeth cleaning this week. Is there a free slot?", time: "10:41 am", step: 2 },
  { who: "a", text: "Thursday at 11 am is free with Dr. Rao. Shall I book it for you?", time: "10:41 am", step: 3 },
  { who: "c", text: "Yes, please.", time: "10:42 am", step: 4 },
  { who: "a", text: "Done. You're booked for Thursday, 11 am.", time: "10:42 am", step: 5 },
] as const;

function LinePlay() {
  return (
    <span className="grid size-4 shrink-0 place-items-center rounded-full border border-border bg-surface text-muted-foreground">
      <Play aria-hidden="true" className="size-2" />
    </span>
  );
}

/** One inbound call as the Inbox shows it: who called, the assistant answered, summary, result, transcript. */
export function VoiceCallScreen() {
  return (
    <Scene
      steps={6}
      timing={[0, 1100, 1300, 1500, 1300, 1500, 1400]}
      hold={4200}
      label="The ERIX inbox showing one phone call from Sneha Rao, answered by the assistant. The call card says Completed, Goal met, 1 minute 58 seconds, with the summary: she asked for a teeth cleaning and was booked for Thursday at 11 am. Below it the call is written out line by line, each line with its own play button."
      className="w-full"
    >
      <AppFrame title="Inbox" nav="inbox" className="h-[25rem]">
        <div className="flex h-full flex-col overflow-hidden">
          <div className="flex shrink-0 items-center gap-2.5 border-b border-border-soft px-3 py-1.5">
            <Avatar name="Sneha Rao" className="size-7" />
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-[12.5px] font-semibold text-foreground">Sneha Rao</p>
              <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                +91 55501 00123 <Channel name="phone" />
              </p>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden bg-sunken p-2.5">
            <div
              style={at(1)}
              className="scene-in shrink-0 space-y-2 rounded-[10px] border border-border bg-surface p-2.5"
            >
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="grid size-6 shrink-0 place-items-center rounded-[6px] bg-accent-muted text-accent">
                  <Icon name="phone-incoming" variant="line" size={13} />
                </span>
                <p className="min-w-0 flex-1 basis-36 text-[12px] leading-tight font-semibold text-foreground">
                  Inbound call, answered by the assistant
                  <span className="block text-[11px] font-normal text-muted-foreground">10:41 am · 1:58 · English</span>
                </p>
                <span className="flex items-center gap-1">
                  <Pill tone="success">Completed</Pill>
                  <span className="scene-in" style={at(6)}>
                    <Pill tone="success">Goal met</Pill>
                  </span>
                </span>
              </div>
              <p className="text-[11.5px] leading-snug text-foreground">
                Asked for a teeth cleaning this week. Booked Thursday, 11 am with Dr. Rao.
              </p>
              <div className="flex items-center gap-2">
                <span className="flex shrink-0 items-center gap-1 rounded-[6px] border border-border-strong bg-surface px-2 py-1 text-[11px] font-semibold text-foreground">
                  <Play aria-hidden="true" className="size-3" /> Play the whole call
                </span>
                <span className="h-1.5 min-w-0 flex-1 rounded-full bg-sunken" />
                <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">0:00 / 1:58</span>
              </div>
            </div>

            <ul className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-hidden">
              {lines.map((l) => (
                <li
                  key={l.text}
                  style={at(l.step)}
                  className={cn("scene-in flex items-center gap-1.5", l.who === "a" && "flex-row-reverse")}
                >
                  <p
                    className={cn(
                      "max-w-[82%] rounded-[10px] border px-2.5 py-1.5 text-[12px] leading-snug text-foreground",
                      l.who === "a" ? "border-[var(--purple-300)] bg-ai-subtle" : "border-border bg-surface",
                    )}
                  >
                    {l.who === "a" && l.step === 3 && (
                      <span className="mb-0.5 flex items-center gap-1 text-[11px] font-semibold text-ai">
                        <Sparkles aria-hidden="true" className="size-3" /> Assistant
                      </span>
                    )}
                    {l.text}
                  </p>
                  <LinePlay />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AppFrame>
    </Scene>
  );
}
