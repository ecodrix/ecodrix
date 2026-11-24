import { CheckCheck, Clock, Sparkles, UserRound } from "@/components/icons";
import { Scene } from "@/components/motion/scene";
import { AppFrame, at, Bubble, Pill } from "@/components/product-screens/parts";

function Case({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2 border-b border-border p-3 last:border-b-0 sm:p-4">
      <p className="text-[11px] font-semibold text-subtle">{label}</p>
      {children}
    </div>
  );
}

/**
 * The agent's three outcomes, from the real reply rules: a grounded answer
 * goes out (auto-reply on), an unsure one becomes a draft that waits for a
 * person, a sensitive topic (refund) is handed to the team with "Needs you".
 */
export function AgentScene() {
  return (
    <Scene
      steps={6}
      timing={[0, 1200, 1800, 1200, 2200, 1200]}
      hold={4000}
      label="Three customer questions. The AI agent answers the parking question from the business's listing and sends it. It isn't sure about a discount, so it writes a draft that waits for the owner. A refund request goes to the team, marked Needs you."
      className="w-full"
    >
      <AppFrame
        title="Inbox"
        nav="inbox"
        action={
          <Pill tone="ai" icon={Sparkles}>
            AI replies on its own
          </Pill>
        }
      >
        <Case label="It knows the answer">
          <Bubble show={at(1)}>Do the 3BHKs come with parking?</Bubble>
          <Bubble side="out" ai show={at(2)} source="Baner listing">
            Yes, every 3BHK at Baner comes with one covered parking spot.
          </Bubble>
          <div className="flex justify-end">
            <Pill tone="success" icon={CheckCheck} className="scene-in" style={at(2)}>
              Sent by AI
            </Pill>
          </div>
        </Case>

        <Case label="It isn't sure">
          <Bubble show={at(3)}>Can you do ₹5 lakh less on the price?</Bubble>
          <div
            style={at(4)}
            className="scene-in ml-auto max-w-[85%] rounded-[10px] border border-dashed border-[var(--purple-500)] bg-surface px-3 py-2"
          >
            <span className="flex items-center gap-1 text-[11px] font-semibold text-ai">
              <Sparkles aria-hidden="true" className="size-3" /> AI draft
            </span>
            <p className="mt-1 text-[13px] leading-snug text-foreground">
              Let me check with the team and come back to you today.
            </p>
            <span className="mt-2 flex gap-2">
              <span className="rounded-[6px] bg-accent px-2.5 py-1 text-[11px] font-semibold text-white">Send</span>
              <span className="rounded-[6px] border border-border-strong px-2.5 py-1 text-[11px] font-semibold text-foreground">
                Edit
              </span>
            </span>
          </div>
          <div className="flex justify-end">
            <Pill tone="warning" icon={Clock} className="scene-in" style={at(4)}>
              Waiting for you
            </Pill>
          </div>
        </Case>

        <Case label="It shouldn't answer">
          <Bubble show={at(5)}>I want a refund of my booking amount.</Bubble>
          <p
            style={at(6)}
            className="scene-in mx-auto w-fit rounded-[8px] bg-surface px-3 py-1 shadow-[var(--shadow-card)] text-center text-[11px] text-muted-foreground"
          >
            I&apos;ve passed this to the team. Someone will reply soon.
          </p>
          <div className="flex justify-end">
            <Pill tone="error" icon={UserRound} className="scene-in" style={at(6)}>
              Needs you
            </Pill>
          </div>
        </Case>
      </AppFrame>
    </Scene>
  );
}
