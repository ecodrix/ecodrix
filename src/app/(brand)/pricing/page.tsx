import Link from "next/link";
import type { GlyphName } from "@/components/icons";
import { Icon } from "@/components/icons";
import { Faq, MkSection } from "@/components/marketing/kit";
import { ClosingCta } from "@/components/platform/ModulePage";
import PricingPlansSection from "@/components/pricing/PriceToggle";
import { JsonLd } from "@/components/seo/JsonLd";
import { getFAQSchema } from "@/lib/jsonld";
import { FALLBACK_PLANS, fetchPublicPlans, yearlyDiscountPct } from "@/lib/pricing";
import { pageMetadata } from "@/lib/seo";

// Private during the pilot (founder decision): ECODrIx agrees terms with each
// pilot client, so this page is shared by link only. It stays out of search,
// the sitemap and every link on the site.
export const metadata = {
  ...pageMetadata({
    title: "Pricing in rupees, plus 18% GST",
    description:
      "ERIX plans in Indian rupees: start on the free plan, then pay monthly or yearly as you grow. Prices are shown before GST, which is added at 18% on your invoice.",
    path: "/pricing",
  }),
  robots: { index: false, follow: false },
};

// ISR: matches the server-side cache TTL for the public plans endpoint.
export const revalidate = 300;

const facts: { icon: GlyphName; title: string; body: string }[] = [
  { icon: "indian-rupee", title: "Priced in rupees", body: "Every plan is in INR, with Indian number grouping." },
  {
    icon: "receipt",
    title: "GST invoice every time",
    body: "GST at 18% is added on top, and each payment gets a GST invoice.",
  },
  {
    icon: "shield-check",
    title: "Change plans any time",
    body: "Upgrades take effect straight away. See the pricing policy for the rest.",
  },
];

export default async function PricingPage() {
  const data = await fetchPublicPlans();
  const plans = data?.plans ?? FALLBACK_PLANS;
  // ponytail: add-ons are hidden because the API prices them in USD; show them once the catalog is in INR (founder sets the rupee prices).
  const ref = plans.find((p) => (p.priceMonthlyUsd ?? 0) > 0);
  const pct = ref ? yearlyDiscountPct(ref.priceMonthlyUsd, ref.priceYearlyUsd) : 0;

  const faqs = [
    {
      q: "Are prices shown with GST?",
      a: "No. Prices are shown before GST. GST at 18% is added on your invoice, and you get a GST invoice for each payment.",
    },
    {
      q: "Is there a free plan?",
      a: "Yes. The Free plan costs ₹0 and includes the AI agent, the inbox and the CRM for one person. Paid plans add AI requests, team members, contacts, automations and channels.",
    },
    {
      q: "Do you offer yearly billing?",
      a:
        pct > 0
          ? `Yes. Paying yearly costs about ${pct}% less than paying monthly for 12 months. Switch to Yearly above to see each plan's price.`
          : "Yes. Switch to Yearly above to see each plan's yearly price.",
    },
    {
      q: "Can I change plans later?",
      a: "Yes. Upgrades take effect straight away, and the difference may be prorated for the rest of your billing cycle. The pricing policy covers downgrades.",
    },
    {
      q: "Which plans include the AI agent?",
      a: "Every plan, Free included. Plans differ in how many AI requests a month they include, shown on each plan above.",
    },
    {
      q: "What is the 7-day Growth trial?",
      a: "Every new workspace starts with 7 days of Growth. After that it moves to Free, unless you pick a plan.",
    },
    {
      q: "Who pays for WhatsApp messages?",
      a: "Your business pays Meta directly, because ERIX sends on your own WhatsApp account. ERIX adds no markup to Meta's charges.",
    },
    {
      q: "Where are refunds and cancellations explained?",
      a: "In the refunds and cancellation policy, linked below and in the footer of every page.",
    },
  ];

  return (
    <div className="w-full">
      <JsonLd data={getFAQSchema(faqs)} />

      <section data-tone="subtle" className="py-section bg-background pt-12! pb-10! md:pt-16!">
        <div className="mx-auto w-full max-w-wrap px-gutter text-center">
          <h1 className="mx-auto max-w-3xl text-[clamp(38px,5.4vw,60px)] leading-[1.04] tracking-[-0.035em]">
            Plans in rupees. GST added at 18%.
          </h1>
          <p className="mx-auto mt-5 max-w-[56ch] text-[clamp(16px,1.5vw,19px)] leading-relaxed text-muted-foreground">
            Start on the free plan and move up when you grow. Every price below is before GST, monthly or yearly.
          </p>
          <ul className="mx-auto mt-10 grid max-w-4xl gap-6 text-left sm:grid-cols-3">
            {facts.map((f) => (
              <li key={f.title} className="flex gap-3">
                <Icon name={f.icon} size={20} variant="duo" className="mt-0.5 shrink-0 text-accent" />
                <span>
                  <span className="block font-semibold text-foreground">{f.title}</span>
                  <span className="block text-sm text-muted-foreground">{f.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <PricingPlansSection plans={plans} pricesHidden={data === null || data.pricesHidden === true} />

      <MkSection id="faq" tone="subtle" title="Pricing questions">
        <Faq items={faqs} />
        <p className="mt-8 text-sm text-muted-foreground">
          The details are in the{" "}
          <Link href="/legal/pricing-policy" className="text-accent underline underline-offset-4">
            pricing policy
          </Link>{" "}
          and the{" "}
          <Link href="/legal/refund-policy" className="text-accent underline underline-offset-4">
            refunds and cancellation policy
          </Link>
          .
        </p>
      </MkSection>

      <ClosingCta
        title="Not sure which plan fits?"
        body="Request early access and tell us how you sell today. We'll suggest a plan when your turn comes."
      />
    </div>
  );
}
