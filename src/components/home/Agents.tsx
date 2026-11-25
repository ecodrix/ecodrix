import { type GlyphName, Icon } from "@/components/icons";
import { MkSection } from "@/components/marketing/kit";
import { Reveal } from "@/components/motion/motion";
import { LazyScreen } from "@/components/product-screens/lazy-screen";

/** What the agent does — each line is a shipped v1.0 behaviour (docs/modules/agents.md). */
const abilities: { icon: GlyphName; title: string; body: string }[] = [
  {
    icon: "file-text",
    title: "Answers only what it knows",
    body: "Replies come from your own prices, hours, listings and policies. With auto-reply on, it sends the answers it's sure of. Anything else becomes a draft for you.",
  },
  {
    icon: "calendar-check",
    title: "Books the appointment",
    body: "Offers the free slots from your hours, confirms the time, and the reminder goes out on its own.",
  },
  {
    icon: "user-plus",
    title: "Saves the customer's details",
    body: "The name, phone or email a customer types lands on their contact, matched by phone, then email. No duplicates.",
  },
  {
    icon: "user-check",
    title: "Hands off to a person",
    body: "Refunds, complaints and medical questions go to your team with the chat attached, and the customer is told.",
  },
];

const controls = [
  "Starts in Suggest: it drafts, you send",
  "Money and sensitive topics always go to a person",
  "Monthly limits and a pause button",
  "AI messages are marked as AI",
];

/** Founder thesis (24 Oct): human-like agents over template bots. A navy band. */
export function Agents() {
  return (
    <MkSection
      id="agents"
      tone="navy"
      kicker={
        <span className="inline-flex items-center gap-1 rounded-sm bg-ai-subtle px-2 py-0.5 text-[12px] font-semibold text-ai">
          <Icon name="sparkles" variant="solid" size={12} /> AI Employee
        </span>
      }
      title="AI employees, not template chatbots"
      lead="A template bot asks people to pick 1, 2 or 3, and most of them leave. An ERIX AI employee reads your price list, hours and listings, answers like your best front-desk person, and knows when to stop and ask you."
    >
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div>
          <div className="grid gap-3 sm:grid-cols-[0.85fr_1.15fr]">
            <figure className="rounded-[12px] bg-white/5 p-4 ring-1 ring-white/10">
              <figcaption className="flex items-center gap-1.5 text-[13px] font-semibold text-white/60">
                <Icon name="x" variant="line" size={14} /> Template chatbot
              </figcaption>
              <p className="mt-2 text-[15px] text-white/70">“Sorry, I didn’t get that. Reply 1, 2 or 3.”</p>
            </figure>
            <figure className="rounded-[12px] bg-white/10 p-4 ring-1 ring-[var(--ai)]">
              <figcaption className="flex items-center gap-1.5 text-[13px] font-semibold text-ai">
                <Icon name="sparkles" variant="solid" size={14} /> ERIX AI employee
              </figcaption>
              <p className="mt-2 text-[15px] text-white">
                “Yes, every 3BHK comes with covered parking. Want to see it on Saturday?”
              </p>
            </figure>
          </div>

          <ul className="mt-10 space-y-7">
            {abilities.map((a) => (
              <li key={a.title} className="grid grid-cols-[40px_1fr] gap-4">
                <span className="grid size-10 place-items-center rounded-[11px] bg-ai-subtle text-ai">
                  <Icon name={a.icon} size={20} variant="duo" />
                </span>
                <div>
                  <h3 className="font-sans text-[17px] font-semibold tracking-normal text-white">{a.title}</h3>
                  <p className="mt-1 text-[15px] text-white/75">{a.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* The sales agent's held action on Approvals (the story above shows the inbox side). */}
        <Reveal className="lg:sticky lg:top-24">
          <LazyScreen name="ai" />
        </Reveal>
      </div>

      <div className="mt-14 rounded-[16px] bg-white/5 p-6 ring-1 ring-white/10 md:p-8">
        <p className="text-[19px] font-semibold text-white">You decide how far it goes</p>
        <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2 xl:grid-cols-4">
          {controls.map((c) => (
            <li key={c} className="flex gap-2.5 text-[15px] text-white/85">
              <Icon
                name="shield-check"
                variant="line"
                size={16}
                className="mt-0.5 shrink-0 text-[var(--on-navy-link)]"
              />
              {c}
            </li>
          ))}
        </ul>
      </div>
    </MkSection>
  );
}
