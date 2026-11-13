/**
 * Scenes for the home story (server components; the Scene driver loops them
 * only while on screen). Redrawn from the SaaS: the inbox list on a phone
 * (UnifiedThreadList: red unread counts, channel under the name) and the
 * workspace Overview (app/[slug]/page.tsx: greeting, today's sentence, the
 * KPI row with the blue pipeline tile and the red approvals tile, Today).
 * Example data only.
 */

import { CalendarDays, ClipboardCheck, MessageCircle, UserPlus } from "@/components/icons";
import { PhoneFrame } from "@/components/marketing/kit";
import { Scene } from "@/components/motion/scene";
import { LiveDot } from "@/components/motion/surface";
import { cn } from "@/lib/utils";
import { AppFrame, Avatar, at, Channel } from "./parts";

const box = "rounded-[10px] bg-surface shadow-[var(--shadow-card)]";

const arrivals = [
  { name: "Priya Nair", ch: "phone", text: "Call answered: asked about 2BHKs near Wakad", time: "9:47 pm", step: 2 },
  {
    name: "Rohan Mehta",
    ch: "whatsapp",
    text: "Is the 3BHK at Baner still available? Can I visit Saturday?",
    time: "9:42 pm",
    step: 1,
  },
  { name: "Anita Desai", ch: "whatsapp", text: "Confirmed, 11 am on Saturday works", time: "6:10 pm" },
  { name: "Ananya Rao", ch: "whatsapp", text: "Thanks! See you on Saturday", time: "5:32 pm" },
] as const;

/** 9:42 pm: new chats land in the owner's inbox, live, while the shop is shut. */
export function ArrivalScene() {
  return (
    <Scene
      steps={3}
      timing={[0, 1300, 1500, 1300]}
      hold={3600}
      label="The ERIX inbox on the owner's phone at night: a WhatsApp message from Rohan Mehta about a 3BHK at Baner arrives at 9:42 pm, then a phone call about 2BHKs near Wakad that the agent answers, each with an unread count, live without a refresh."
      className="mx-auto w-fit"
    >
      <PhoneFrame
        head={
          <>
            <span className="text-[14px] font-semibold text-foreground">Inbox</span>
            <span className="ml-auto flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
              <LiveDot /> Live
            </span>
          </>
        }
      >
        <ul className="space-y-1.5">
          {arrivals.map((t) => (
            <li
              key={t.name}
              style={"step" in t ? at(t.step) : undefined}
              className={cn(box, "flex gap-2 p-2", "step" in t && "scene-in scene-x")}
            >
              <Avatar name={t.name} className="size-7 text-[10px]" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[12px] font-semibold text-foreground">{t.name}</span>
                  <span
                    className={cn("shrink-0 text-[10px]", "step" in t ? "font-semibold text-accent" : "text-subtle")}
                  >
                    {t.time}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center justify-between gap-2">
                  <span
                    className={cn("truncate text-[11px]", "step" in t ? "text-foreground" : "text-muted-foreground")}
                  >
                    {t.text}
                  </span>
                  {"step" in t && (
                    <span className="grid size-4 shrink-0 place-items-center rounded-full bg-error text-[9px] font-bold text-white">
                      1
                    </span>
                  )}
                </div>
                <Channel name={t.ch} className="mt-0.5" />
              </div>
            </li>
          ))}
        </ul>
        <p style={at(3)} className="scene-in mt-3 text-center text-[11px] text-muted-foreground">
          The tab shows (2) and a chime plays when you&apos;re away.
        </p>
      </PhoneFrame>
    </Scene>
  );
}

function Kpi({
  label,
  value,
  unit,
  hint,
  tone,
  icon: Icon,
  style,
}: {
  label: string;
  value: string;
  unit?: string;
  hint: string;
  tone?: "blue" | "red";
  icon?: typeof UserPlus;
  style?: React.CSSProperties;
}) {
  const solid = tone !== undefined;
  return (
    <div
      style={style}
      className={cn(
        "scene-in rounded-[10px] p-2.5",
        tone === "blue" && "bg-[var(--brand-blue)] text-white shadow-[var(--shadow-btn)]",
        tone === "red" && "bg-[var(--red-600)] text-white shadow-[var(--shadow-btn)]",
        !solid && box,
      )}
    >
      <p
        className={cn(
          "flex items-center justify-between gap-1 text-[10px]",
          solid ? "text-white/85" : "text-muted-foreground",
        )}
      >
        {label}
        {Icon && <Icon aria-hidden="true" className={cn("size-3", solid ? "text-white/85" : "text-accent")} />}
      </p>
      <p
        className={cn(
          "mt-1 font-display text-[18px] leading-none font-bold tabular-nums",
          solid ? "text-white" : "text-foreground",
        )}
      >
        {value}
        {unit && <span className="ml-0.5 text-[12px]">{unit}</span>}
      </p>
      <p className={cn("mt-1 truncate text-[9.5px]", solid ? "text-white/85" : "text-subtle")}>{hint}</p>
    </div>
  );
}

const agenda = [
  { when: "11:30 AM", icon: CalendarDays, title: "Isha Shah", text: "Site visit · Baner" },
  { when: "Today", icon: MessageCircle, title: "4 contacts need a follow-up", text: "Silent for 2+ days" },
  { when: "3:00 PM", icon: CalendarDays, title: "Meera Iyer", text: "Site visit · Wakad" },
] as const;

/** The owner's morning: the Overview, as the SaaS draws it. */
export function OverviewScreen() {
  return (
    <Scene
      steps={3}
      timing={[0, 1000, 1000, 1200]}
      hold={4200}
      label="The ERIX Overview at 8:30 in the morning: Good morning, Priya. You have 3 unread conversations and 2 items waiting for approval. Pipeline value ₹18.4 lakh, 2 items waiting for approval, 3 unread conversations, 26 new contacts, and today's site visits and follow-ups."
    >
      <AppFrame title="Overview" nav="overview" className="h-[25rem]">
        <div className="flex h-full flex-col gap-2.5 overflow-hidden p-3 sm:p-4">
          <div>
            <p className="text-[10px] text-subtle">Tuesday, 3 Nov</p>
            <p className="font-display text-[17px] leading-tight font-bold text-foreground">Good morning, Priya</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              You have <b className="font-semibold text-foreground">3 unread conversations</b> and{" "}
              <b className="font-semibold text-foreground">2 items</b> waiting for approval.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Kpi
              style={at(1)}
              tone="blue"
              label="Pipeline value"
              value="₹18.4"
              unit="L"
              hint="Open deals across your pipeline"
            />
            <Kpi
              style={at(1)}
              tone="red"
              icon={ClipboardCheck}
              label="Waiting for approval"
              value="2"
              hint="1 AI draft · 1 held automation"
            />
            <Kpi style={at(2)} icon={MessageCircle} label="Unread conversations" value="3" hint="5 new messages" />
            <Kpi style={at(2)} icon={UserPlus} label="New contacts" value="26" hint="Last 30 days" />
          </div>
          <div style={at(3)} className={cn(box, "scene-in min-h-0 flex-1 p-2.5")}>
            <p className="text-[12px] font-semibold text-foreground">Today</p>
            <ul className="mt-1.5 divide-y divide-border-soft">
              {agenda.map((a) => (
                <li key={a.title} className="flex items-center gap-2.5 py-1.5">
                  <span className="w-12 shrink-0 text-[10px] text-subtle">{a.when}</span>
                  <span className="grid size-6 shrink-0 place-items-center rounded-[6px] bg-accent-muted text-accent">
                    <a.icon aria-hidden="true" className="size-3" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[11px] font-semibold text-foreground">{a.title}</span>
                    <span className="block truncate text-[10px] text-muted-foreground">{a.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AppFrame>
    </Scene>
  );
}
