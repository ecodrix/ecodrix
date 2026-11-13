import { Bot, Plus, Sparkles } from "@/components/icons";
import { Scene } from "@/components/motion/scene";
import { cn } from "@/lib/utils";
import { AppFrame, at, Pill } from "./parts";

const kinds = ["Agent", "Automation", "Conversation", "Campaign"];
const agenda = [
  "Answer WhatsApp messages from your course list and fees",
  "Offer open demo slots and book the call",
  "Hand refunds and complaints to your team",
];
const levels = ["Off", "Suggest", "With approval", "Act and report"];

/**
 * AI › Agents, redrawn from the real page (saas FlowAgents + AskErix): the
 * owner describes the job, taps Plan it, and ERIX answers with a plan first
 * (the kind, the agenda, one question). Build agent saves a draft at Suggest
 * with no channels; nothing goes live until it is published. The copy is the
 * app's own.
 */
export function AgentsScreen() {
  return (
    <Scene
      steps={7}
      timing={[1200, 1000, 900, 700, 700, 1200, 1300]}
      hold={4200}
      label="Building an AI agent by chatting: the owner writes 'Answer WhatsApp messages about our courses and book a demo call' and taps Plan it. ERIX shows the plan first: an agent that answers from the course list, books demo calls and hands refunds to the team, with one question. Build agent saves it as a draft at Suggest with no channels, so nothing goes live until it is published."
      className="w-full"
    >
      <AppFrame title="AI / Agents" nav="ai" className="h-[25rem]">
        <div className="flex h-full flex-col gap-3 overflow-hidden p-3.5 @2xl:p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-display text-[17px] leading-6 font-bold text-foreground">AI agents</p>
              <p className="hidden text-[11px] leading-4 text-muted-foreground @2xl:block">
                You decide how much each may do on its own.{" "}
                <span className="font-semibold text-foreground">Money and customer messages always wait for you.</span>
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-1 rounded-[6px] bg-accent px-2.5 py-1 text-[11px] font-semibold text-white">
              <Plus aria-hidden="true" className="size-3" /> New agent
            </span>
          </div>

          {/* Describe it → Plan it */}
          <div className="flex items-center gap-2 rounded-[10px] border border-border bg-surface py-1.5 pr-1.5 pl-3">
            <Sparkles aria-hidden="true" className="size-3.5 shrink-0 text-ai" />
            <span className="inline-grid min-w-0 flex-1 text-[11.5px] *:[grid-area:1/1]">
              <span className="scene-in truncate text-subtle" style={at(0, 1)}>
                Describe it…
              </span>
              <span className="scene-in truncate text-foreground" style={at(1)}>
                Answer WhatsApp messages about our courses and book a demo call.
              </span>
            </span>
            <span
              className={cn(
                "shrink-0 rounded-[6px] px-3 py-1.5 text-[11px] font-semibold text-white",
                "bg-[var(--purple-600)]",
              )}
            >
              Plan it
            </span>
          </div>

          <div className="grid min-h-0 flex-1 gap-3 @3xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
            {/* The plan, before anything is built */}
            <div
              style={at(2)}
              className="scene-in min-h-0 space-y-2 rounded-[10px] border border-border bg-surface p-3"
            >
              <div className="flex flex-wrap items-center gap-1.5">
                <p className="mr-1 text-[10.5px] font-semibold text-ai">Here&apos;s the plan. Nothing is built yet.</p>
                {kinds.map((k, i) => (
                  <span
                    key={k}
                    className={cn(
                      "rounded-[4px] px-1 py-0.5 text-[9.5px] leading-3 font-bold",
                      i === 0
                        ? "bg-ai-subtle text-ai shadow-[inset_0_0_0_1.5px_currentColor]"
                        : "bg-sunken text-subtle",
                    )}
                  >
                    {k}
                  </span>
                ))}
              </div>
              <p className="text-[12.5px] font-semibold text-foreground">WhatsApp course enquiries</p>
              <ol className="list-decimal space-y-1 pl-4 text-[11px] leading-4 text-foreground marker:text-subtle">
                {agenda.map((line, i) => (
                  <li key={line} className="scene-in" style={at(3 + i)}>
                    {line}
                  </li>
                ))}
              </ol>
              <div style={at(5)} className="scene-in rounded-[8px] bg-sunken px-2 py-1.5">
                <p className="text-[10px] font-semibold text-muted-foreground">
                  A few things that change what gets built (optional)
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
                  <span className="text-foreground">Which days can people book a demo?</span>
                  <span className="flex-1 rounded-[6px] border border-border bg-surface px-2 py-0.5 text-foreground">
                    Mon to Sat, 11 am to 6 pm
                  </span>
                </div>
              </div>
              <span
                style={at(6)}
                className="scene-in inline-flex rounded-[6px] bg-[var(--purple-600)] px-2.5 py-1 text-[11px] font-semibold text-white"
              >
                Build agent
              </span>
            </div>

            {/* The draft it saved: Suggest, no channels yet */}
            <div
              style={at(7)}
              className="scene-in scene-pop hidden min-h-0 space-y-2.5 rounded-[10px] border border-border bg-surface p-3 @3xl:block"
            >
              <div className="flex items-start gap-2">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-[var(--purple-600)] text-white">
                  <Bot aria-hidden="true" className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] font-semibold text-foreground">WhatsApp course agent</p>
                  <span className="mt-0.5 flex flex-wrap gap-1">
                    <Pill tone="neutral">Draft</Pill>
                    <Pill tone="ai">Suggest</Pill>
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground">May do on its own</p>
                <div className="mt-1 grid grid-cols-4 gap-0.5 rounded-[7px] bg-sunken p-0.5 text-center text-[9.5px] leading-3">
                  {levels.map((l) => (
                    <span
                      key={l}
                      className={cn(
                        "rounded-[5px] px-1 py-1",
                        l === "Suggest" ? "bg-surface font-semibold text-ai shadow-[var(--shadow-sm)]" : "text-subtle",
                      )}
                    >
                      {l}
                    </span>
                  ))}
                </div>
                <p className="mt-1 text-[10px] leading-3.5 text-muted-foreground">
                  Reads and suggests. Changes are noted on the contact; a person makes them.
                </p>
              </div>
              <p className="text-[10px] leading-3.5 text-subtle">
                No channels yet. It opens as a draft you can keep changing by chatting. Nothing goes live until you
                publish it.
              </p>
            </div>
          </div>
        </div>
      </AppFrame>
    </Scene>
  );
}
