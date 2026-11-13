import { MkSection, PrimaryCta } from "@/components/marketing/kit";
import { ClosingCta, GuideList } from "@/components/platform/ModulePage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getItemListSchema } from "@/lib/jsonld";
import { getLivePages } from "@/lib/product-pages";
import { pageMetadata } from "@/lib/seo";

/* ──────────────────────────────────────────────────────────────────────
   /guides — every setup guide in one place, grouped by module. New guides
   (product sub-pages of type "guide") appear here on their own.
─────────────────────────────────────────────────────────────────────── */

export const metadata = pageMetadata({
  title: "ERIX setup guides",
  description: "Step-by-step guides to set up ERIX: the WhatsApp Business API and Google Meet bookings.",
  path: "/guides",
});

const GROUPS = [
  { module: "erix-connect", title: "WhatsApp" },
  { module: "erix-crm", title: "Bookings" },
  { module: "erix-flow", title: "Automations" },
].map((g) => ({ ...g, pages: getLivePages(g.module).filter((p) => p.type === "guide") }));

export default function GuidesPage() {
  return (
    <div className="w-full">
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Guides", url: "/guides" },
        ])}
      />
      <JsonLd
        data={getItemListSchema(
          GROUPS.flatMap((g) =>
            g.pages.map((p) => ({ name: p.title, url: `/platform/${g.module}/${p.slug}`, description: p.description })),
          ),
        )}
      />

      <section data-tone="subtle" className="py-section bg-background pt-12! md:pt-16!">
        <div className="mx-auto w-full max-w-wrap px-gutter">
          <h1 className="max-w-4xl text-[clamp(38px,5.4vw,60px)] leading-[1.04] tracking-[-0.035em]">
            Set up ERIX, one step at a time
          </h1>
          <p className="mt-5 max-w-[62ch] text-[clamp(16px,1.5vw,19px)] leading-relaxed text-muted-foreground">
            Plain steps for connecting your WhatsApp number and taking bookings with Google Meet. Website chat, email
            and payment guides are coming soon.
          </p>
          <div className="mt-8">
            <PrimaryCta />
          </div>
        </div>
      </section>

      {GROUPS.map((g) => (
        <MkSection key={g.module} id={g.module} title={g.title}>
          <GuideList module={g.module} pages={g.pages} />
        </MkSection>
      ))}

      <ClosingCta
        title="Want a hand setting it up?"
        body="Request early access and our team sets up your pilot workspace with you."
      />
    </div>
  );
}
