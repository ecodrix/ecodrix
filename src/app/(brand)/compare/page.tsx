import Link from "next/link";
import { Icon } from "@/components/icons";
import { Faq, MkSection, PrimaryCta } from "@/components/marketing/kit";
import { ClosingCta } from "@/components/platform/ModulePage";
import { JsonLd } from "@/components/seo/JsonLd";
import { COMPARISONS } from "@/lib/comparisons";
import { getBreadcrumbSchema, getFAQSchema, getItemListSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

/* ──────────────────────────────────────────────────────────────────────
   /compare — comparison hub, targets "best WhatsApp CRM in India" and
   funnels into each "ECODrIx vs X" decision page.
─────────────────────────────────────────────────────────────────────── */

export const metadata = {
  ...pageMetadata({
    title: "WhatsApp CRM comparison: ECODrIx vs Wati and more",
    description:
      "Compare ECODrIx (ERIX) with Wati, AiSensy and Interakt. All use Meta's official WhatsApp platform; ERIX adds a CRM, GST invoices, automation and an AI agent.",
    path: "/compare",
  }),
  keywords: [
    "best whatsapp crm india",
    "whatsapp crm comparison",
    "wati alternative",
    "aisensy alternative",
    "interakt alternative",
    "ECODrIx",
    "ERIX",
  ],
};

const HUB_FAQS = [
  {
    q: "What should a small business in India look for in a WhatsApp CRM?",
    a: "Official WhatsApp API access, a shared inbox, broadcasts with approved templates, and a way to track each enquiry to a sale and an invoice. ERIX by ECODrIx covers these with a pipeline, GST invoices with payment links, automations and an AI agent, priced in rupees. Wati, AiSensy and Interakt are strong messaging-first alternatives.",
  },
  {
    q: "How is ERIX different from Wati, AiSensy and Interakt?",
    a: "All four use Meta's official WhatsApp platform, so the messaging itself is comparable. The difference is scope: Wati is messaging and support-led, AiSensy is broadcast-marketing-led, and Interakt leans toward commerce. ERIX adds a CRM, GST invoices, automation and an AI agent around the messaging.",
  },
  {
    q: "How should I compare WhatsApp CRM prices in India?",
    a: "Compare what each plan includes, not only the platform fee: a messaging-only tool plus a separate CRM, invoicing and automation adds up. Check each vendor's own pricing page, since plans change often. Also ask how Meta's message charges reach your bill: with ERIX you connect your own WhatsApp account, so Meta bills you directly and ERIX adds no markup. During the pilot, ERIX pricing is agreed with each business.",
  },
];

export default function CompareHubPage() {
  return (
    <div className="w-full">
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Compare", url: "/compare" },
        ])}
      />
      <JsonLd
        data={getItemListSchema(
          COMPARISONS.map((c) => ({
            name: `ECODrIx vs ${c.competitor}`,
            url: `/compare/${c.slug}`,
            description: c.description,
          })),
        )}
      />
      <JsonLd data={getFAQSchema(HUB_FAQS)} />

      <section data-tone="subtle" className="py-section bg-background pt-12! md:pt-16!">
        <div className="mx-auto w-full max-w-wrap px-gutter">
          <h1 className="max-w-4xl text-[clamp(38px,5.4vw,60px)] leading-[1.04] tracking-[-0.035em]">
            Choosing a WhatsApp CRM in India
          </h1>
          <p className="mt-5 max-w-[62ch] text-[clamp(16px,1.5vw,19px)] leading-relaxed text-muted-foreground">
            Wati, AiSensy and Interakt all run on Meta&apos;s official WhatsApp platform, and so does ECODrIx. The
            difference is what you get around the messaging: ERIX adds a CRM, GST invoices with payment links,
            automation and an AI agent, in one platform priced in rupees.
          </p>
          <div className="mt-8">
            <PrimaryCta />
          </div>
        </div>
      </section>

      <MkSection id="comparisons" title="Pick a comparison">
        <ul className="grid gap-x-10 md:grid-cols-3">
          {COMPARISONS.map((c) => (
            <li key={c.slug} className="border-t border-border-soft">
              <Link
                href={`/compare/${c.slug}`}
                className="group -mx-3 flex h-full flex-col rounded-[12px] px-3 py-6 hover:bg-hover"
              >
                <span className="text-[19px] font-semibold text-foreground">ECODrIx vs {c.competitor}</span>
                <span className="mt-2 text-[15px] text-muted-foreground">{c.description}</span>
                <ul className="mt-4 space-y-1.5">
                  {c.rows
                    .filter((r) => r.ecodrixWins)
                    .slice(0, 3)
                    .map((r) => (
                      <li key={r.dimension} className="flex gap-2 text-[14px] text-foreground">
                        <Icon
                          name="check"
                          size={15}
                          strokeWidth={2.2}
                          variant="line"
                          className="mt-0.5 shrink-0 text-accent"
                        />
                        {r.dimension}
                      </li>
                    ))}
                </ul>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-accent">
                  Read the comparison
                  <Icon name="arrow-right" size={14} variant="line" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </MkSection>

      <MkSection id="faq" tone="subtle" title="Choosing a WhatsApp CRM: common questions">
        <Faq items={HUB_FAQS} />
      </MkSection>

      <ClosingCta
        title="See ERIX on your own business"
        body="Request early access and tell us how you sell today. We'll set ERIX up around it."
      />
    </div>
  );
}
