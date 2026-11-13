import { type IconComponent, Inbox, KanbanSquare, Sparkles, Workflow } from "@/components/icons";
import { Scene } from "@/components/motion/scene";
import { Avatar, at, Pill } from "./parts";

const events: { tool: string; icon: IconComponent; tone: "primary" | "ai"; text: string; time: string }[] = [
  {
    tool: "Connect",
    icon: Inbox,
    tone: "primary",
    text: "WhatsApp: “Is the 3BHK at Baner still available?”",
    time: "9:42 pm",
  },
  { tool: "AI agent", icon: Sparkles, tone: "ai", text: "Answered from the Baner listing", time: "9:42 pm" },
  { tool: "CRM", icon: KanbanSquare, tone: "primary", text: "Site visit booked for Saturday, 4 pm", time: "9:44 pm" },
  { tool: "Flow", icon: Workflow, tone: "ai", text: "Reminder sent on WhatsApp", time: "Fri, 10:00 am" },
  { tool: "CRM", icon: KanbanSquare, tone: "primary", text: "Moved to Site visit done", time: "Sat, 5:10 pm" },
  { tool: "Flow", icon: Workflow, tone: "ai", text: "Follow-up sent on WhatsApp", time: "Mon, 11:31 am" },
];

/** /platform hero: one contact, every tool writing to the same timeline. */
export function TimelineScene() {
  return (
    <Scene
      steps={events.length}
      timing={1100}
      hold={3800}
      label="One contact record for Rohan Mehta. Events from every ERIX tool land on the same timeline: a WhatsApp enquiry, the AI agent's answer, a booked site visit, an automated reminder, a stage move and a follow-up on WhatsApp."
      className="motion-safe:animate-rise motion-safe:[animation-delay:var(--d,200ms)] mx-auto w-full max-w-[34rem] lg:max-w-none"
    >
      <div className="surface-light overflow-hidden rounded-[12px] bg-surface shadow-[var(--shadow-lg)]">
        <div className="flex items-center gap-3 border-b border-border p-4">
          <Avatar name="Rohan Mehta" className="size-10 text-[13px]" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground">Rohan Mehta</p>
            <p className="text-[12px] text-muted-foreground">3BHK, Baner · ₹1,85,000</p>
          </div>
          <Pill tone="primary">Site visit booked</Pill>
        </div>
        <ol className="bg-background p-4">
          {events.map((e, i) => (
            <li key={e.text} style={at(i + 1)} className="scene-in relative flex gap-3 pb-4 last:pb-0">
              {i < events.length - 1 && (
                <span aria-hidden="true" className="absolute top-7 bottom-0 left-[13px] w-px bg-border-strong/40" />
              )}
              <Pill tone={e.tone} className="relative size-7 shrink-0 justify-center p-0">
                <e.icon aria-hidden="true" className="size-3.5" />
              </Pill>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="flex flex-wrap items-baseline justify-between gap-x-2 text-[11px]">
                  <span className="font-semibold text-muted-foreground">{e.tool}</span>
                  <span className="text-subtle">{e.time}</span>
                </p>
                <p className="mt-0.5 text-[13px] text-foreground">{e.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Scene>
  );
}
