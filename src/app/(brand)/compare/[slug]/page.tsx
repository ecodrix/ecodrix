import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { Faq, MkSection, PrimaryCta } from "@/components/marketing/kit";
import { ClosingCta, Crumbs } from "@/components/platform/ModulePage";
import { JsonLd } from "@/components/seo/JsonLd";
import { buttonVariants } from "@/components/ui/button";
import { COMPARISONS, getComparisonBySlug, getComparisonSlugs } from "@/lib/comparisons";
import { getBreadcrumbSchema, getFAQSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────────────
   /compare/[slug] — "ECODrIx vs {Competitor}" comparison page.
   Targets high-intent India decision queries and AI "alternatives to X"
   prompts. Honest, factual framing; no fabricated ratings.
─────────────────────────────────────────────────────────────────────── */

interface Params {
  slug: string;
}

export function generateStaticParams(): Params[] {
  return getComparisonSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getComparisonBySlug(slug);
  if (!c) return { title: "Comparison not found" };
  return {
    ...pageMetadata({
      title: `ECODrIx vs ${c.competitor}: WhatsApp CRM compared`,
      description: c.description,
      path: `/compare/${c.slug}`,
    }),
    keywords: [...c.searchQueries, "ECODrIx", "ERIX", c.competitor, "WhatsApp CRM India"],
  };
}

/** What ERIX adds around the messaging: live v1.0 facts (design system product page), the same on every comparison. */
const AROUND = [
  "One inbox for WhatsApp and phone calls",
  "An AI agent that answers from your own price list and hours; refunds, complaints and medical questions go to a person",
  "A pipeline with stages for your trade, and bookings in Indian time with no double bookings",
  "Your own WhatsApp account, so Meta bills you directly and ERIX adds no markup",
  "Automations that wait for a reply, ask for approval before money or a customer message goes out, and keep a run history on each contact",
];

// Comparison table on phones: rows become stacked blocks and each cell is labelled with its
// column (from data-label), so nothing scrolls sideways.
const CELL_PHONE =
  "max-md:block max-md:py-1.5 max-md:before:mb-0.5 max-md:before:block max-md:before:text-[12px] max-md:before:font-semibold max-md:before:text-subtle max-md:before:content-[attr(data-label)]";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default async function ComparePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const c = getComparisonBySlug(slug);
  if (!c) notFound();
  const others = COMPARISONS.filter((x) => x.slug !== slug);

  return (
    <div className="w-full">
      {/* JSON-LD: Breadcrumb + FAQ (no fabricated ratings) */}
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Compare", url: "/compare" },
          { name: `ECODrIx vs ${c.competitor}`, url: `/compare/${c.slug}` },
        ])}
      />
      <JsonLd data={getFAQSchema(c.faqs)} />

      <section data-tone="subtle" className="py-section bg-background pt-10! md:pt-14!">
        <div className="mx-auto w-full px-gutter max-w-[calc(var(--mk-wrap))]">
          <Crumbs items={[{ name: "Compare", href: "/compare" }, { name: `ECODrIx vs ${c.competitor}` }]} />
          <h1 className="mt-6 max-w-4xl text-[clamp(36px,5vw,56px)] leading-[1.05] tracking-[-0.035em]">
            ECODrIx (ERIX) vs {c.competitor}
          </h1>
          <p className="mt-5 max-w-[64ch] text-[clamp(16px,1.5vw,19px)] leading-relaxed text-muted-foreground">
            {c.tldr}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PrimaryCta />
            <Link href="/platform" className={buttonVariants({ variant: "ghost" })}>
              See the whole platform
            </Link>
          </div>
        </div>
      </section>

      {/* ── Side by side ── */}
      <MkSection id="table" title={`Side by side: ERIX and ${c.competitor}`}>
        <div className="overflow-hidden rounded-[16px] shadow-[var(--shadow-card)]">
          <table className="w-full border-collapse bg-surface text-left text-[15px] max-md:block">
            <caption className="sr-only">ECODrIx (ERIX) compared with {c.competitor}</caption>
            <thead className="max-md:absolute max-md:size-px max-md:overflow-hidden max-md:[clip-path:inset(50%)]">
              <tr className="bg-sunken text-[13px] text-muted-foreground max-md:block">
                <th scope="col" className="w-1/4 px-5 py-3 font-semibold max-md:block max-md:py-1.5">
                  What
                </th>
                <th scope="col" className="px-5 py-3 font-semibold text-foreground max-md:block max-md:py-1.5">
                  ECODrIx (ERIX)
                </th>
                <th scope="col" className="px-5 py-3 font-semibold max-md:block max-md:py-1.5">
                  {c.competitor}
                </th>
              </tr>
            </thead>
            <tbody className="max-md:block">
              {c.rows.map((row) => (
                <tr
                  key={row.dimension}
                  className="border-t border-border-soft align-top max-md:block max-md:px-0 max-md:py-2"
                >
                  <th scope="row" className="px-5 py-4 font-semibold text-foreground max-md:block max-md:py-1.5">
                    {row.dimension}
                  </th>
                  <td data-label="ECODrIx (ERIX)" className={cn("px-5 py-4 text-foreground", CELL_PHONE)}>
                    <span className="flex gap-2">
                      {row.ecodrixWins && (
                        <Icon
                          name="circle-check"
                          size={16}
                          variant="solid"
                          label="ERIX has the edge"
                          className="mt-0.5 shrink-0 text-accent"
                        />
                      )}
                      {row.ecodrix}
                    </span>
                  </td>
                  <td data-label={c.competitor} className={cn("px-5 py-4 text-muted-foreground", CELL_PHONE)}>
                    {row.competitor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[13.5px] text-subtle">
          {c.competitor} details last checked on {fmtDate(c.lastVerified)}. Competitor plans change often, so check
          their site for current features and prices.
        </p>
      </MkSection>

      {/* ── Which to pick ── */}
      <MkSection id="pick" tone="subtle" title="Which one fits you">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-[16px] bg-surface p-6 shadow-[var(--shadow-card)] md:p-8">
            <p className="text-[13px] font-semibold text-muted-foreground">Pick {c.competitor} if</p>
            <p className="mt-2 text-[17px] text-foreground">{c.competitorBestFor}</p>
          </div>
          <div className="rounded-[16px] bg-surface p-6 shadow-[var(--shadow-card)] ring-2 ring-accent md:p-8">
            <p className="text-[13px] font-semibold text-accent">Pick ERIX if</p>
            <p className="mt-2 text-[17px] text-foreground">{c.ecodrixBestFor}</p>
          </div>
        </div>
      </MkSection>

      {/* ── What ERIX adds ── */}
      <MkSection
        id="around"
        title="What ERIX adds around the messaging"
        lead="Every provider here uses Meta's official WhatsApp platform. These are the parts ERIX builds around it, all on one contact record."
      >
        <ul className="mt-5 grid list-none gap-2.5 [&_.erix-icon]:mt-[3px] [&_.erix-icon]:text-accent md:grid-cols-2">
          {AROUND.map((a) => (
            <li key={a} className="flex items-start gap-2.5 font-sans text-[15px]/[22px] font-medium text-foreground">
              <Icon name="check" size={16} strokeWidth={2.2} variant="line" />
              {a}
            </li>
          ))}
        </ul>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="font-sans text-[19px] font-semibold tracking-normal">Before you switch</h3>
            <ul className="mt-3 space-y-2 text-[16px] text-muted-foreground">
              <li>List the tools you pay for today next to WhatsApp, such as a CRM, invoicing and a booking app.</li>
              <li>Note which WhatsApp templates you rely on; they need WhatsApp&apos;s approval on your number.</li>
              <li>
                Plan the number move with your current provider, since a number works with one provider at a time.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-sans text-[19px] font-semibold tracking-normal">What stays the same</h3>
            <p className="mt-3 text-[16px] text-muted-foreground">
              Your WhatsApp Business number, Meta&apos;s message charges and the 24-hour reply window work the same way
              on every official provider. What changes is what you can do with each conversation after it arrives.
            </p>
          </div>
        </div>
      </MkSection>

      {/* ── FAQ ── */}
      <MkSection id="faq" tone="subtle" title={`ERIX and ${c.competitor}: common questions`}>
        <Faq items={c.faqs} />
      </MkSection>

      {/* ── Other comparisons ── */}
      <MkSection id="others" title="Other comparisons">
        <ul className="grid gap-x-10 md:grid-cols-2">
          {others.map((o) => (
            <li key={o.slug} className="border-t border-border-soft">
              <Link
                href={`/compare/${o.slug}`}
                className="group -mx-3 flex items-start justify-between gap-4 rounded-[12px] px-3 py-5 hover:bg-hover"
              >
                <span>
                  <span className="block text-[17px] font-semibold text-foreground">ECODrIx vs {o.competitor}</span>
                  <span className="mt-1 block text-[15px] text-muted-foreground">{o.description}</span>
                </span>
                <Icon name="arrow-right" size={16} variant="line" className={cn("mt-1.5 shrink-0 text-accent")} />
              </Link>
            </li>
          ))}
        </ul>
      </MkSection>

      <ClosingCta
        title="See ERIX on your own business"
        body="Request early access and tell us how you sell today. We'll set ERIX up around it."
      />
    </div>
  );
}
