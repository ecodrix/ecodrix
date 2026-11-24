import Link from "next/link";
import { Icon } from "@/components/icons";
import { Faq, MkSection } from "@/components/marketing/kit";
import { ClosingCta } from "@/components/platform/ModulePage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getFAQSchema, getPersonSchema, SEO_CONSTANTS } from "@/lib/jsonld";
import { CONTACT_EMAIL } from "@/lib/site";

const { BASE_URL, PORTFOLIO_URL } = SEO_CONSTANTS;

/* ──────────────────────────────────────────────────────────────────────
   /founder — the founder's public page. Public name is "Dhanesh M" (founder,
   27 Oct 2026: the full name is not published). Only what customers get is
   described here; internal engines are not marketed.
─────────────────────────────────────────────────────────────────────── */

export const metadata = {
  title: "Dhanesh M — Founder of ECODrIx",
  description:
    "Dhanesh M (Erix) is the founder of ECODrIx, the Indian company behind ERIX: CRM, WhatsApp inbox, AI agents and automation for SMBs.",
  keywords: [
    "Dhanesh M",
    "Dhanesh Mekalthuru",
    "Erix",
    "erix.dhanesh",
    "ECODrIx founder",
    "ECODrIx CEO",
    "ECODrIx Dhanesh",
    "ERIX founder",
  ],
  alternates: { canonical: `${BASE_URL}/founder` },
  openGraph: {
    title: "Dhanesh M — Founder of ECODrIx",
    description: "Founder of ECODrIx and the ERIX suite, started in August 2025. Based in Andhra Pradesh, India.",
    url: `${BASE_URL}/founder`,
    type: "profile",
    images: ["/opengraph-image"],
  },
};

const FOUNDER_FAQS = [
  {
    q: "Who is Dhanesh M?",
    a: "Dhanesh M (known online as Erix or erix.dhanesh) is the founder and CEO of ECODrIx, the Indian company behind ERIX. He is a full-stack engineer based in Andhra Pradesh, India, and started the ERIX suite in August 2025: ERIX CRM, ERIX Connect, ERIX Flow and AI agents for businesses that sell over WhatsApp.",
  },
  {
    q: "When did ERIX start?",
    a: "In August 2025, when Dhanesh founded ECODrIx. ERIX 1.0 brings CRM, Connect, Flow and AI agents together.",
  },
  {
    q: "What does ERIX do for a business?",
    a: "Every WhatsApp message and call lands in one inbox on the right contact. AI agents answer from the business's own information, the pipeline tracks each deal, and automations run the follow-ups.",
  },
  {
    q: "Where is Dhanesh based?",
    a: "Andhra Pradesh, India. ECODrIx builds for Indian businesses first: rupee billing and IST everywhere.",
  },
  {
    q: "Is Dhanesh M the same person as Erix or erix.dhanesh?",
    a: "Yes. Erix and erix.dhanesh are online names Dhanesh uses. The ERIX product name comes from it.",
  },
  {
    q: "How can I contact Dhanesh?",
    a: `Email ${CONTACT_EMAIL}; a person replies on IST working hours.`,
  },
];

const ALIASES = ["Dhanesh M", "Erix", "erix.dhanesh"];

export default function FounderPage() {
  return (
    <div className="w-full">
      {/* JSON-LD payloads — Person + FAQPage + Breadcrumb */}
      <JsonLd data={getPersonSchema()} />
      <JsonLd data={getFAQSchema(FOUNDER_FAQS)} />
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Founder", url: "/founder" },
        ])}
      />

      {/* ── Profile ── */}
      <section data-tone="subtle" className="py-section bg-background pt-12! md:pt-16!">
        <div className="mx-auto w-full max-w-wrap px-gutter grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <div>
            <h1 className="text-[clamp(36px,5vw,56px)] leading-[1.05] tracking-[-0.035em]">
              Meet Dhanesh M, founder of ECODrIx and the ERIX suite.
            </h1>
            <div className="mt-6 max-w-[60ch] space-y-4 text-[clamp(16px,1.5vw,19px)] leading-relaxed">
              <p>
                Dhanesh M, known online as <strong className="text-foreground">Erix</strong>, is a full-stack engineer
                and SaaS founder based in Andhra Pradesh, India. He started ECODrIx and the ERIX suite in August 2025,
                after building client systems that all needed the same stitched-together stack: CRM, WhatsApp, email and
                automation.
              </p>
              <p>
                Today that is one product: ERIX CRM, ERIX Connect, ERIX Flow and AI agents that take care of enquiries
                from the first message to the booked visit.
              </p>
            </div>
            <ul className="mt-6 flex flex-wrap gap-2">
              {ALIASES.map((alias) => (
                <li
                  key={alias}
                  className="rounded-[6px] bg-surface px-2.5 py-1 text-[13px] text-muted-foreground shadow-[var(--shadow-card)]"
                >
                  Also known as: {alias}
                </li>
              ))}
            </ul>
          </div>

          <aside className="self-start rounded-[16px] bg-surface p-7 shadow-[var(--shadow-card)]">
            <span
              aria-hidden="true"
              className="grid size-16 place-items-center rounded-full bg-accent-muted font-display text-2xl font-bold text-accent"
            >
              DM
            </span>
            <p className="mt-4 text-lg font-semibold text-foreground">Dhanesh M</p>
            <p className="text-sm text-muted-foreground">Founder and CEO, ECODrIx</p>
            <ul className="mt-5 space-y-2.5 text-[15px]">
              <li className="flex items-center gap-2.5 text-muted-foreground">
                <Icon name="map-pin" size={16} variant="line" className="text-accent" />
                Andhra Pradesh, India
              </li>
              <li className="flex items-center gap-2.5">
                <Icon name="mail" size={16} variant="line" className="text-accent" />
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-muted-foreground hover:text-accent">
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
            <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-border-soft pt-5">
              {[
                { value: "August 2025", label: "ERIX started" },
                { value: "4", label: "Parts of ERIX live" },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col">
                  <dt className="order-2 text-[13px] text-muted-foreground">{label}</dt>
                  <dd className="order-1 text-[22px] font-bold tracking-[-0.02em] text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      {/* ── FAQ ── */}
      <MkSection id="faq" tone="subtle" title="Things people ask about Dhanesh">
        <Faq items={FOUNDER_FAQS} />
      </MkSection>

      {/* ── Elsewhere ── */}
      <MkSection id="elsewhere" title="Dhanesh's portfolio">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              <li>
                <a
                  href={PORTFOLIO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-sans text-[15px]/5 font-[650] text-accent hover:underline hover:underline-offset-3 motion-safe:focus-visible:animate-focus"
                >
                  portfolio.ecodrix.com
                  <Icon name="external-link" size={14} variant="line" />
                </a>
              </li>
            </ul>
            <p className="mt-5 max-w-[56ch] text-[15px] text-muted-foreground">
              The full developer portfolio, with projects, services, FAQs and process, lives at portfolio.ecodrix.com.
            </p>
          </div>
          <ul className="grid gap-x-8 sm:grid-cols-2">
            {[
              { href: "/platform", title: "Platform modules", desc: "Every product served by api.ecodrix.com." },
              { href: "/about", title: "About ECODrIx", desc: "The company, mission, infrastructure and stack." },
            ].map((l) => (
              <li key={l.href} className="border-t border-border-soft">
                <Link
                  href={l.href}
                  className="group -mx-3 flex items-start justify-between gap-3 rounded-[12px] px-3 py-5 hover:bg-hover"
                >
                  <span>
                    <span className="block font-semibold text-foreground">{l.title}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{l.desc}</span>
                  </span>
                  <Icon name="arrow-right" size={16} variant="line" className="mt-1 shrink-0 text-accent" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </MkSection>

      <ClosingCta
        title="See what Dhanesh is building"
        body={`Request early access to ERIX, or email ${CONTACT_EMAIL}.`}
      />
    </div>
  );
}
