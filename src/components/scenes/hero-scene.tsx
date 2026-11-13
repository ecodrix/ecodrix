import { HeroChat } from "@/components/demos/hero-chat";
import { CalendarCheck, CheckCircle2, MessageCircle, Sparkles } from "@/components/icons";
import { BrowserFrame, PhoneFrame } from "@/components/marketing/kit";
import { Scene } from "@/components/motion/scene";
import { AppFrame, Avatar, at, Channel, Pill } from "./parts";

/**
 * Home hero: one enquiry, start to finish, as the DS hero composite (the
 * ERIX window with a phone overlapping it). The phone is live (HeroChat): it
 * plays the WhatsApp enquiry, then visitors can ask the AI agent themselves.
 * It sits outside the Scene, whose content is one image to screen readers.
 * The window is the real app's Overview page (sidebar, top bar, greeting,
 * tiles, the Today card): the new enquiry ticks the count up, the site visit
 * lands on Today, and a WhatsApp follow-up is scheduled and goes out.
 */
export function HeroScene() {
  return (
    // Window plus a phone overlapping its lower corner; on phones the window runs to the screen edge.
    <div className="relative pr-[120px] max-[900px]:pr-0">
      <Scene
        steps={8}
        timing={[0, 1000, 1500, 800, 900, 1500, 1700, 1600]}
        hold={3600}
        // The phone overlaps the bottom-right corner, so the pause button goes left.
        toggleClassName="mr-auto"
        label="ERIX at work: after a WhatsApp enquiry about a 3BHK flat, the Overview counts the new enquiry, a site visit is booked for 4 pm, and a WhatsApp follow-up is scheduled and sent."
      >
        <BrowserFrame className="max-[900px]:-mr-gutter max-[900px]:rounded-[12px_0_0_0]">
          {/* The real Overview page: greeting, tiles, Today. The phone overlaps the window's right edge on desktop, so the page keeps clear of it. */}
          <AppFrame title="Overview" nav="overview" badges={{ inbox: 1 }} className="h-[23rem]">
            <div className="h-full space-y-3 overflow-hidden p-3.5 lg:pr-[128px]">
              <div>
                <p className="text-[10.5px] text-subtle">Saturday</p>
                <p className="font-display text-[17px] leading-6 font-bold text-foreground">Good morning, Priya</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* The app's hero tile: brand blue, white type */}
                <div className="rounded-[10px] bg-[var(--brand-blue)] p-2.5 text-white">
                  <p className="text-[10.5px] font-medium text-white/85">New enquiries today</p>
                  <p className="mt-1 inline-grid font-display text-[20px] leading-6 font-bold text-white tabular-nums *:[grid-area:1/1]">
                    <span className="scene-in" style={at(0, 1)}>
                      3
                    </span>
                    <span className="scene-in scene-pop" style={at(1)}>
                      4
                    </span>
                  </p>
                  <p className="mt-0.5 truncate text-[10px] text-white/80">Answered in under a minute</p>
                </div>
                <div className="rounded-[10px] border border-border bg-surface p-2.5">
                  <p className="text-[10.5px] font-medium text-muted-foreground">Answered today</p>
                  <p className="mt-1 inline-grid font-display text-[20px] leading-6 font-bold text-foreground tabular-nums *:[grid-area:1/1]">
                    <span className="scene-in" style={at(0, 8)}>
                      0
                    </span>
                    <span className="scene-in scene-pop" style={at(8)}>
                      1
                    </span>
                  </p>
                  <p className="mt-0.5 inline-grid truncate text-[10px] text-muted-foreground *:[grid-area:1/1]">
                    <span className="scene-in" style={at(0, 8)}>
                      1 enquiry waiting
                    </span>
                    <span className="scene-in" style={at(8)}>
                      Answered by the agent
                    </span>
                  </p>
                </div>
              </div>

              {/* Today: the day's visits and money, as on the Overview card */}
              <div className="overflow-hidden rounded-[10px] border border-border bg-surface">
                <div className="flex items-baseline justify-between gap-2 px-3 pt-2.5 pb-2">
                  <p className="text-[12.5px] font-semibold text-foreground">Today</p>
                  <span className="text-[10.5px] font-semibold text-accent">Calendar</span>
                </div>
                <ul className="divide-y divide-border border-t border-border text-[11px]">
                  <li className="flex items-center gap-2.5 px-3 py-2">
                    <span className="w-12 shrink-0 whitespace-nowrap text-subtle tabular-nums">11:30 am</span>
                    <CalendarCheck aria-hidden="true" className="size-3.5 shrink-0 text-accent" />
                    <span className="min-w-0 flex-1 truncate">
                      <span className="font-semibold text-foreground">Meera Iyer</span>
                      <span className="text-muted-foreground"> · Site visit, Wakad</span>
                    </span>
                  </li>
                  <li style={at(6)} className="scene-in scene-x flex items-center gap-2.5 bg-accent-muted/40 px-3 py-2">
                    <span className="w-12 shrink-0 whitespace-nowrap text-subtle tabular-nums">4 pm</span>
                    <CalendarCheck aria-hidden="true" className="size-3.5 shrink-0 text-accent" />
                    <span className="min-w-0 flex-1 truncate">
                      <span className="font-semibold text-foreground">Rohan Mehta</span>
                      <span className="text-muted-foreground"> · Site visit, 3BHK Baner</span>
                    </span>
                  </li>
                  <li style={at(7)} className="scene-in flex items-center gap-2.5 px-3 py-2">
                    <span className="w-12 shrink-0 text-subtle">Next</span>
                    <MessageCircle aria-hidden="true" className="size-3.5 shrink-0 text-accent" />
                    <span className="min-w-0 flex-1 truncate">
                      <span className="font-semibold text-foreground">Rohan Mehta</span>
                      <span className="text-muted-foreground"> · WhatsApp follow-up</span>
                    </span>
                    <span className="inline-grid justify-items-end *:[grid-area:1/1]">
                      <Pill tone="primary" icon={CalendarCheck} className="scene-in" style={at(7, 8)}>
                        Scheduled
                      </Pill>
                      <Pill tone="success" icon={CheckCircle2} className="scene-in scene-pop" style={at(8)}>
                        Sent
                      </Pill>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </AppFrame>
        </BrowserFrame>
      </Scene>
      {/* The owner's inbox on a phone, live. Below the Scene, so it's offset past the pause button's row. */}
      <div className="absolute right-0 bottom-0 z-2 max-[900px]:relative max-[900px]:right-auto max-[900px]:bottom-auto max-[900px]:mt-[-180px] max-[900px]:ml-auto max-[900px]:w-max">
        <PhoneFrame
          className="w-[250px] max-[900px]:w-[230px]"
          head={
            <>
              <Avatar name="Rohan Mehta" className="size-7" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-semibold text-foreground">Rohan Mehta</span>
                <Channel name="whatsapp" />
              </span>
              <Pill tone="ai" icon={Sparkles}>
                AI on
              </Pill>
            </>
          }
        >
          <HeroChat />
        </PhoneFrame>
      </div>
    </div>
  );
}
