import Link from "next/link";
import { Icon } from "@/components/icons";
import { FeatureSplit, MkSection } from "@/components/marketing/kit";

/**
 * The heart of the site: why ECODrIx exists, in the founder's voice (facts
 * from /founder), and how a pilot works today: our team sets the workspace
 * up with the owner, and terms are agreed with each pilot (no prices).
 */
export function Heart() {
  return (
    <MkSection id="why" tone="subtle" title="Why ECODrIx exists">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <figure>
          <blockquote className="space-y-4 text-[clamp(17px,1.6vw,19px)] leading-relaxed text-foreground">
            <p className="text-inherit">
              Before ERIX, I spent a year building systems for Indian businesses. Every one of them needed the same
              stitched-together stack: a CRM, WhatsApp, email, automation and somewhere to keep files.
            </p>
            <p className="text-inherit">
              Enquiries came in on WhatsApp at night, follow-ups lived in someone&apos;s head, invoices were made in a
              spreadsheet and payments were checked in the bank app. ERIX is the one workspace I wanted to give them.
            </p>
          </blockquote>
          <figcaption className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="grid size-10 place-items-center rounded-full bg-accent-muted font-display text-[14px] font-bold text-accent"
              >
                DM
              </span>
              <span>
                <span className="block text-[15px] font-semibold text-foreground">Dhanesh M</span>
                <span className="block text-[13.5px] text-muted-foreground">Founder, ECODrIx · Andhra Pradesh</span>
              </span>
            </span>
            <Link
              href="/founder"
              className="group inline-flex items-center gap-1.5 font-sans text-[15px]/5 font-[650] text-accent hover:underline hover:underline-offset-3 motion-safe:focus-visible:animate-focus"
            >
              Read his story
              <Icon name="arrow-right" size={14} variant="line" />
            </Link>
          </figcaption>
        </figure>
        <div className="rounded-[16px] bg-surface p-6 shadow-[var(--shadow-card)] md:p-8">
          <h3 className="font-display text-mk-h3 text-foreground text-balance">
            How a pilot works: we set it up with you
          </h3>
          <ol className="mt-6 space-y-6">
            {[
              {
                title: "Tell us how you sell today",
                text: "A short WhatsApp or video call about your enquiries, your team and how you bill.",
              },
              {
                title: "We set ERIX up with you",
                text: "We connect your WhatsApp number and phone line, shape the pipeline, teach the agent your price list and hours, and switch on the follow-ups you send by hand today.",
              },
              {
                title: "You run it, we stay close",
                text: "The agent starts in Suggest, so nothing goes out without you. Your feedback decides what we build next, and terms are agreed with each pilot.",
              },
            ].map((s, i) => (
              <li key={s.title} className="grid grid-cols-[36px_1fr] gap-4">
                <span className="mb-0 grid size-9 place-items-center rounded-full bg-accent font-sans text-[15px]/none font-bold text-white shadow-[0_0_0_6px_var(--accent-dim)]">
                  {i + 1}
                </span>
                <div>
                  <p className="text-[16.5px] font-semibold text-foreground">{s.title}</p>
                  <p className="mt-1 text-[15px]">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </MkSection>
  );
}

/** The GST maths the invoices do, both ways. Same facts as before, on a subtle band. */
export function BuiltForIndia() {
  return (
    <MkSection id="india" tone="subtle">
      <FeatureSplit
        module="Built for India"
        icon="indian-rupee"
        title="Made for how India sells"
        headingLevel="h2"
        points={[
          "WhatsApp first: templates, broadcasts and the 24-hour reply window handled for you",
          "Rupees, not dollars: Indian number grouping and pricing in INR",
          "India's working day: reminders, reports and quiet hours run on Indian time",
        ]}
        visual={
          <div className="rounded-[16px] bg-surface p-5 shadow-[var(--shadow-card)] md:p-6">
            <p className="text-[15px] font-semibold text-foreground">One site visit, booked in Indian time</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Saturday visit",
                  rows: [
                    ["Date", "Sat, 17 Oct"],
                    ["Time", "4:00 pm IST"],
                  ],
                  foot: ["Reminder", "Fri, 10:00 am"],
                },
                {
                  title: "Weekday visit",
                  rows: [
                    ["Date", "Tue, 20 Oct"],
                    ["Time", "11:30 am IST"],
                  ],
                  foot: ["Reminder", "Mon, 10:00 am"],
                },
              ].map((c) => (
                <div key={c.title} className="flex flex-col rounded-[12px] bg-background p-4">
                  <p className="text-[13px] font-semibold text-accent">{c.title}</p>
                  <dl className="mt-3 mb-3 space-y-1.5 text-sm text-muted-foreground">
                    {c.rows.map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <dt>{k}</dt>
                        <dd className="tabular-nums">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-auto flex justify-between border-t border-border pt-3 text-xl font-bold text-foreground">
                    <span>{c.foot[0]}</span>
                    <span>{c.foot[1]}</span>
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 font-mono text-xs text-muted-foreground">
              Reminders go out on WhatsApp, before every visit
            </p>
          </div>
        }
      />
    </MkSection>
  );
}
