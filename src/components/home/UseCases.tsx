import Link from "next/link";
import { type GlyphName, Icon } from "@/components/icons";
import { MkSection } from "@/components/marketing/kit";
import { SegTabs } from "@/components/marketing/seg-tabs";
import { cn } from "@/lib/utils";

type Moment = { time: string; text: string; ai?: boolean };

/** Verticals (DS `VerticalTabs`): a day in each trade, every moment a live v1.0 behaviour. */
const verticals: {
  id: string;
  label: string;
  icon: GlyphName;
  title: string;
  text: string;
  jobs: { icon: GlyphName; title: string; text: string }[];
  day: Moment[];
  href: string;
}[] = [
  {
    id: "clinics",
    label: "Clinics",
    icon: "stethoscope",
    title: "Clinics and service businesses",
    text: "Patients ask on WhatsApp, book from a link and expect a reminder. ERIX handles the routine and leaves anything medical to your team.",
    jobs: [
      {
        icon: "calendar-check",
        title: "Bookings in Indian time",
        text: "Your hours, gaps and notice period. One slot, one patient.",
      },
      {
        icon: "bell",
        title: "Reminders on WhatsApp",
        text: "From the Appointment Reminders template, before every visit.",
      },
      {
        icon: "shield-check",
        title: "Medical questions to a person",
        text: "The AI never answers symptoms or treatment questions.",
      },
    ],
    day: [
      {
        time: "8:40 pm",
        text: "A patient asks for a Thursday slot on WhatsApp. The agent offers the free times.",
        ai: true,
      },
      { time: "8:41 pm", text: "She books 11:30 am from your booking page. No double booking." },
      { time: "Thu, 10:30 am", text: "The reminder goes out on WhatsApp.", ai: true },
      { time: "Thu, 12:10 pm", text: "A thank-you and review request goes out after the visit.", ai: true },
    ],
    href: "/platform/erix-crm/healthcare",
  },
  {
    id: "real-estate",
    label: "Real estate",
    icon: "building-2",
    title: "Real estate and sales teams",
    text: "Leads from listings and ads land in one pipeline. Site visits are confirmed on WhatsApp, and the team sees who is hot, who is cold and who needs a call.",
    jobs: [
      {
        icon: "square-kanban",
        title: "Stages for the sale",
        text: "From enquiry to site visit to token amount, with rupee totals.",
      },
      { icon: "calendar-check", title: "Site visits booked", text: "Buyers pick a slot, and nobody double-books." },
      {
        icon: "message-circle",
        title: "Follow-ups on WhatsApp",
        text: "Wait for a reply, and a nudge when nobody answers.",
      },
    ],
    day: [
      { time: "10:05 pm", text: "A buyer's enquiry lands in the pipeline with the chat attached." },
      {
        time: "10:06 pm",
        text: "The agent answers from the listing: parking, possession date, visit slots.",
        ai: true,
      },
      { time: "Sat, 11:00 am", text: "Site visit on the calendar, reminder already sent." },
      { time: "Mon, 4:15 pm", text: "A follow-up goes out to everyone who has not replied.", ai: true },
    ],
    href: "/platform/erix-crm/real-estate",
  },
  {
    id: "d2c",
    label: "D2C and local brands",
    icon: "store",
    title: "D2C and local brands",
    text: "Answer order questions from one inbox, send offers on WhatsApp with templates WhatsApp has approved, and follow up with every enquiry.",
    jobs: [
      {
        icon: "inbox",
        title: "Every DM in one inbox",
        text: "WhatsApp messages and calls, each on the right customer. Instagram and website chat: coming soon.",
      },
      {
        icon: "megaphone",
        title: "Festive offers on WhatsApp",
        text: "Approved templates, and Meta bills you directly. No ERIX markup.",
      },
      { icon: "workflow", title: "Follow-ups that run themselves", text: "A nudge when nobody replies." },
    ],
    day: [
      { time: "9:15 pm", text: "A WhatsApp question and a missed call land on the same customer." },
      { time: "9:16 pm", text: "The agent answers from your price list.", ai: true },
      { time: "Fri, 11:00 am", text: "A festive offer goes to customers tagged diwali, on an approved template." },
      { time: "Sat, 2:40 pm", text: "A bulk-order enquiry moves to the next stage and the team is told." },
    ],
    href: "/platform/erix-crm/d2c-ecommerce",
  },
];

function Day({ moments, label }: { moments: Moment[]; label: string }) {
  return (
    <div className="rounded-lg bg-surface shadow-card p-5 md:p-6">
      <p className="text-[14px] font-semibold text-foreground">A day with ERIX: {label.toLowerCase()}</p>
      <ol className="mt-4">
        {moments.map((mo, i) => (
          <li key={mo.time} className="relative grid grid-cols-[16px_1fr] gap-3 pb-4 last:pb-0">
            {i < moments.length - 1 && (
              <span aria-hidden="true" className="absolute top-4 bottom-0 left-[7px] w-px bg-border" />
            )}
            <span
              aria-hidden="true"
              className={cn("relative mt-1 size-[9px] justify-self-center rounded-full", mo.ai ? "bg-ai" : "bg-accent")}
            />
            <div>
              <p className="text-[12.5px] font-semibold text-subtle">{mo.time}</p>
              <p className="mt-0.5 text-[14.5px] text-foreground">{mo.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function UseCases() {
  return (
    <MkSection id="verticals" title="Made for teams that sell on WhatsApp">
      <SegTabs
        label="Industry"
        tabs={verticals.map((v) => ({
          id: v.id,
          label: v.label,
          icon: <Icon name={v.icon} size={16} variant="line" />,
          iconActive: <Icon name={v.icon} size={16} variant="solid" />,
          panel: (
            <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-start gap-[clamp(28px,5vw,64px)] max-[900px]:grid-cols-[1fr]">
              <div>
                <h3 className="font-display text-mk-h3 text-foreground text-balance">{v.title}</h3>
                <p className="mt-3 max-w-[56ch] font-sans text-mk-body text-muted-foreground text-pretty">{v.text}</p>
                <ul className="mt-6 mb-7 grid list-none gap-[18px]">
                  {v.jobs.map((j) => (
                    <li key={j.title} className="grid grid-cols-[40px_1fr] gap-3.5">
                      <span className="grid size-10 place-items-center rounded-[11px] bg-accent-muted text-accent">
                        <Icon name={j.icon} size={18} variant="duo" />
                      </span>
                      <div>
                        <b className="font-sans text-[15.5px]/[22px] font-[650] text-foreground">{j.title}</b>
                        <p className="mt-0.5 font-sans text-[14.5px]/[1.55] text-muted-foreground">{j.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <Link
                  href={v.href}
                  className="group inline-flex items-center gap-1.5 font-sans text-[15px]/5 font-[650] text-accent hover:underline hover:underline-offset-3 motion-safe:focus-visible:animate-focus"
                >
                  ERIX for {v.label.toLowerCase()}
                  <Icon name="arrow-right" size={14} variant="line" />
                </Link>
              </div>
              <Day moments={v.day} label={v.label} />
            </div>
          ),
        }))}
      />
    </MkSection>
  );
}
