import Link from "next/link";
import type { GlyphName } from "@/components/icons";
import { Icon } from "@/components/icons";
import { Faq, MkSection } from "@/components/marketing/kit";
import { ClosingCta } from "@/components/platform/shared/ModulePage";
import PricingPlansSection from "@/components/pricing/PriceToggle";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchPublicCatalogue } from "@/lib/api";
import { trialLine, yearlyDiscountPct } from "@/lib/pricing";
import { getFAQSchema } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/seo";

// Private during the pilot (founder decision): ECODrIx agrees terms with each
// pilot client, so this page is shared by link only. It stays out of search,
// the sitemap and every link on the site.
export const metadata = {
  ...pageMetadata({
    title: "Pricing in rupees, plus GST",
    description:
      "ERIX plans in Indian rupees, paid monthly or yearly. Prices are shown before GST, which is added on your invoice.",
    path: "/pricing",
  }),
  robots: { index: false, follow: false },
};

// ISR: matches the server-side cache TTL for the public plans endpoint.
export const revalidate = 300;

const facts = (gst: string): { icon: GlyphName; title: string; body: string }[] => [
  { icon: "indian-rupee", title: "Priced in rupees", body: "Every plan is in INR, with Indian number grouping." },
  {
    icon: "receipt",
    title: "GST invoice every time",
    body: `${gst} is added on top, and each payment gets a GST invoice.`,
  },
  {
    icon: "shield-check",
    title: "Change plans any time",
    body: "Upgrades take effect straight away. See the pricing policy for the rest.",
  },
];

export default async function PricingPage() {
  const data = await fetchPublicCatalogue();
  const plans = data?.plans ?? [];
  const pricesHidden = data === null || data.pricesHidden === true;
  const gstPercent = data?.gstPercent;
  const gst = gstPercent != null ? `GST at ${gstPercent}%` : "GST";
  const trial = trialLine(data);
  // shortcut: add-ons stay off this page, revisit when the founder wants them listed.
  const ref = plans.find((p) => (p.priceMonthlyPaise ?? 0) > 0);
  const pct = ref ? yearlyDiscountPct(ref.priceMonthlyPaise, ref.priceYearlyPaise) : 0;

  const faqs = [
    {
      q: "Are prices shown with GST?",
      a: `No. Prices are shown before GST. ${gst} is added on your invoice, and you get a GST invoice for each payment.`,
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
      a: "Every plan. Plans differ in how many AI requests a month they include, shown on each plan above.",
    },
    ...(trial ? [{ q: "Is there a trial?", a: trial }] : []),
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
            {gstPercent != null
              ? `Plans in rupees. GST added at ${gstPercent}%.`
              : "Plans in rupees. GST added on top."}
          </h1>
          <p className="mx-auto mt-5 max-w-[56ch] text-[clamp(16px,1.5vw,19px)] leading-relaxed text-muted-foreground">
            Every price below is before GST, monthly or yearly.
          </p>
          <ul className="mx-auto mt-10 grid max-w-4xl gap-6 text-left sm:grid-cols-3">
            {facts(gst).map((f) => (
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

      <PricingPlansSection plans={plans} pricesHidden={pricesHidden} gstPercent={gstPercent} trial={trial} />

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
