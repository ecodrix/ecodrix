import Link from "next/link";
import { type GlyphName, Icon } from "@/components/icons";
import { MkSection } from "@/components/marketing/kit";
import { OnceVisible, SegTabs } from "@/components/marketing/seg-tabs";
import { LazyScreen, type LazyScreenName } from "@/components/scenes/lazy-screen";
import { cn } from "@/lib/utils";

/**
 * "Inside ERIX": one redrawn screen per part, three benefits and a link. The
 * screen runs the section's full width, so the app shell shows its labelled
 * sidebar (components/scenes/parts AppFrame) as the real app does. Live
 * v1.0 only (DS product.md); Analytics shows just the two live charts. The
 * screens load only once their tab is opened and they're near the screen
 * (OnceVisible + LazyScreen), so the home page doesn't pay for them up front.
 */
const parts: {
  id: string;
  label: string;
  icon: GlyphName;
  ai?: boolean;
  screen: LazyScreenName;
  title: string;
  points: string[];
  href: string;
  link: string;
}[] = [
  {
    id: "connect",
    label: "Connect",
    icon: "inbox",
    screen: "inbox",
    title: "Every channel in one inbox, live",
    points: [
      "WhatsApp chats and phone calls on the same contact. Instagram, email and website chat: coming soon",
      "Ticks you know: ✓ sent, ✓✓ delivered, blue ✓✓ read",
      "AI drafts show their source. Send them, or edit first",
    ],
    href: "/platform/erix-connect",
    link: "Explore ERIX Connect",
  },
  {
    id: "crm",
    label: "CRM",
    icon: "square-kanban",
    screen: "crm",
    title: "From pipeline to booked visit, on one record",
    points: [
      "Drag a deal to the next stage and the totals update in rupees",
      "Every chat, call and booking on the contact's timeline",
      "Forms and bookings that add contacts by themselves",
    ],
    href: "/platform/erix-crm",
    link: "Explore ERIX CRM",
  },
  {
    id: "flow",
    label: "Flow",
    icon: "workflow",
    ai: true,
    screen: "flowCanvas",
    title: "Follow-ups that run themselves, with you in charge",
    points: [
      "Start on a new enquiry, then wait, send and wait for a reply",
      "Replied or No reply: each path does the right next thing",
      "Approval before anything risky, and an AI reply step that drafts",
    ],
    href: "/platform/erix-flow",
    link: "Explore ERIX Flow",
  },
  {
    id: "agents",
    label: "AI agents",
    icon: "sparkles",
    ai: true,
    screen: "agents",
    title: "Build an agent by describing it",
    points: [
      "Say what it should do. ERIX shows the plan before it builds anything",
      "It starts as a draft that only suggests, with no channels",
      "You choose how much it may do. Money and messages wait for you",
    ],
    href: "/platform#agents",
    link: "See AI agents",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: "chart-line",
    screen: "analytics",
    title: "See what's coming in and what's open",
    points: [
      "New contacts over time, by day, week or month",
      "Open deal value at every stage, in rupees",
      "Lakh and crore in the summaries, Indian grouping everywhere",
    ],
    href: "/platform/erix-crm",
    link: "See ERIX CRM",
  },
];

export function InsideErix() {
  return (
    <MkSection
      id="inside"
      tone="subtle"
      title="Inside ERIX"
      lead="The parts you'll use every day, redrawn from the real app. Pick one to see it work."
    >
      <SegTabs
        label="Part of ERIX"
        tabs={parts.map((p) => ({
          id: p.id,
          label: p.label,
          icon: <Icon name={p.icon} size={16} variant="line" />,
          iconActive: <Icon name={p.icon} size={16} variant="solid" />,
          panel: (
            // The screen runs the full width, so the app's sidebar shows its labels as it does on a laptop.
            <div className="grid gap-[clamp(24px,4vw,40px)]">
              <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-start gap-x-[clamp(32px,6vw,88px)] gap-y-5 max-[900px]:grid-cols-[1fr]">
                <div>
                  <span
                    className={cn(
                      "mb-3.5 inline-flex items-center gap-[7px] font-sans text-[13.5px]/[18px] font-[650]",
                      p.ai ? "text-ai" : "text-accent",
                    )}
                  >
                    <Icon name={p.icon} size={14} variant="solid" />
                    {p.label}
                  </span>
                  <h3 className="font-display text-mk-h3 text-foreground text-balance">{p.title}</h3>
                  <Link
                    href={p.href}
                    className="group mt-4 inline-flex items-center gap-1.5 font-sans text-[15px]/5 font-[650] text-accent hover:underline hover:underline-offset-3 motion-safe:focus-visible:animate-focus"
                  >
                    {p.link}
                    <Icon name="arrow-right" size={14} variant="line" />
                  </Link>
                </div>
                <ul className="grid list-none gap-2.5 [&_.erix-icon]:mt-[3px] [&_.erix-icon]:text-accent">
                  {p.points.map((t) => (
                    <li
                      key={t}
                      className="flex items-start gap-2.5 font-sans text-[15px]/[22px] font-medium text-foreground"
                    >
                      <Icon name="check" size={16} strokeWidth={2.2} variant="line" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative rounded-3xl bg-background p-[clamp(14px,3vw,32px)] shadow-[inset_0_0_0_1px_var(--border-soft)] in-data-[tone=subtle]:bg-surface">
                <OnceVisible>
                  <LazyScreen name={p.screen} />
                </OnceVisible>
              </div>
            </div>
          ),
        }))}
      />
    </MkSection>
  );
}
