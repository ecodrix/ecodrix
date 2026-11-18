"use client";

/**
 * Plan cards with a monthly / yearly switch. Plans come from the server page
 * (live catalogue, whole paise, no static fallback). Prices are GST-exclusive
 * (founder decision): paid prices say "+ GST", with the rate when the API
 * sends it. The trial line is passed in from the catalogue; nothing here
 * holds a price, a GST rate or a trial length. Growth is the recommended plan.
 */

import { RadioGroup } from "radix-ui";
import { useState } from "react";
import { Icon } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { segClass, segItemClass } from "@/components/ui/tabs";
import { formatInr, humaniseFeatures, type PublicPlan, planDescription, yearlyDiscountPct } from "@/lib/pricing";
import { PRIMARY_CTA } from "@/lib/site";
import { cn } from "@/lib/utils";

type Billing = "monthly" | "yearly";

function priceFor(plan: PublicPlan, billing: Billing) {
  const { priceMonthlyPaise: monthly, priceYearlyPaise: yearly } = plan;
  if (monthly == null || yearly == null) return null;
  if (billing === "yearly") {
    return {
      amount: formatInr(Math.round(yearly / 12 / 100) * 100),
      note: `a month, billed ${formatInr(yearly)} a year`,
    };
  }
  return { amount: formatInr(monthly), note: "a month" };
}

export default function PricingPlansSection({
  plans,
  pricesHidden,
  gstPercent,
  trial,
}: {
  plans: PublicPlan[];
  /** Prices aren't public yet (or the live catalogue couldn't load): plans and features show, no amounts, no billing switch. */
  pricesHidden?: boolean;
  /** GST rate from the catalogue; absent until the API sends it, then copy says plain "GST". */
  gstPercent?: number;
  /** Trial sentence from the catalogue (`trialLine`); null renders nothing. */
  trial?: string | null;
}) {
  const gst = gstPercent != null ? `${gstPercent}% GST` : "GST";
  const [billing, setBilling] = useState<Billing>("monthly");
  const grid = [...plans].sort((a, b) => a.sortOrder - b.sortOrder || a.tier - b.tier);
  const ref = grid.find((p) => (p.priceMonthlyPaise ?? 0) > 0);
  const yearlyPct = ref ? yearlyDiscountPct(ref.priceMonthlyPaise, ref.priceYearlyPaise) : 0;

  return (
    <section aria-label="Plans" className="py-section pt-10! md:pt-12!">
      <div className="mx-auto w-full max-w-wrap px-gutter">
        {pricesHidden && (
          <p
            role="status"
            className="mx-auto mb-8 max-w-3xl rounded-[12px] bg-sunken px-4 py-3 text-center text-sm text-foreground"
          >
            {plans.length > 0
              ? "Pricing is agreed with you before you start. Pick the plan that fits and talk to us for a quote."
              : "Pricing is agreed with you before you start. Talk to us for a quote."}
          </p>
        )}

        {/* Billing period: Radix radios drawn as the DS segmented control */}
        <div className={cn("flex flex-wrap items-center justify-center gap-3", pricesHidden && "hidden")}>
          <RadioGroup.Root
            aria-label="Billing period"
            value={billing}
            onValueChange={(v) => setBilling(v as Billing)}
            className={segClass}
          >
            {(["monthly", "yearly"] as const).map((b) => (
              <RadioGroup.Item key={b} value={b} className={segItemClass}>
                {b === "monthly" ? "Monthly" : "Yearly"}
              </RadioGroup.Item>
            ))}
          </RadioGroup.Root>
          {yearlyPct > 0 && (
            <span className="rounded-[6px] bg-ai-subtle px-2.5 py-0.5 text-[12.5px] font-semibold text-ai">
              Save {yearlyPct}% yearly
            </span>
          )}
        </div>
        {trial && <p className="mt-5 text-center text-[15px] font-semibold text-foreground">{trial}</p>}

        <ul className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4 xl:items-stretch">
          {grid.map((plan) => {
            const price = priceFor(plan, billing);
            const featured = plan.slug === "growth";
            return (
              <li
                key={plan.slug}
                // Featured: `tile-blue` is a solid-blue tile with a soft white bloom (same hue).
                className={cn(
                  "relative flex flex-col gap-4 rounded-[20px] bg-surface px-[26px] py-7 shadow-card",
                  featured && "tile-blue",
                )}
              >
                {featured && (
                  <span className="absolute -top-3 left-6 rounded-sm bg-navy px-2.5 py-1 font-sans text-xs/4 font-[650] text-white shadow-btn">
                    Recommended
                  </span>
                )}
                <h2 className="font-display text-xl font-bold text-foreground">{plan.name}</h2>
                <p className="-mt-2 min-h-10 text-sm text-muted-foreground">{planDescription(plan.slug)}</p>
                {price && (
                  <div>
                    <p className="text-[40px] leading-none font-bold tracking-[-0.035em] text-foreground tabular-nums">
                      {price.amount}
                    </p>
                    <p className="mt-2 text-sm text-subtle">{price.note}</p>
                    {plan.priceMonthlyPaise ? (
                      <p
                        className={cn(
                          "mt-2 w-fit rounded-[6px] px-2 py-0.5 text-[12px] font-semibold",
                          featured ? "bg-white/15 text-white" : "bg-accent-muted text-accent",
                        )}
                      >
                        + {gst}
                      </p>
                    ) : null}
                  </div>
                )}
                <a
                  href={PRIMARY_CTA.href}
                  className={cn("group w-full", buttonVariants({ variant: featured ? "primary" : "ghost" }))}
                >
                  {PRIMARY_CTA.label}
                  <Icon name="arrow-right" size={16} variant="line" />
                </a>
                <ul className="space-y-2.5 border-t border-border-soft pt-5">
                  {humaniseFeatures(plan).map((f) => (
                    <li key={f} className="flex gap-2.5 text-[14px] leading-snug text-foreground">
                      <Icon
                        name="check"
                        size={15}
                        strokeWidth={2.2}
                        variant="line"
                        className={cn("mt-0.5 shrink-0", featured ? "text-white" : "text-accent")}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>

        <p className="mx-auto mt-8 max-w-[64ch] text-center text-[13.5px] text-subtle">
          {pricesHidden
            ? `Plans are billed in rupees, plus ${gst} on your invoice.`
            : `Prices exclude ${gst}, which is added on your invoice.`}{" "}
          WhatsApp messages go out on your own WhatsApp account, so Meta bills you directly and ERIX adds no markup.
        </p>
      </div>
    </section>
  );
}
