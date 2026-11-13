import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Icon } from "@/components/icons";
import { BrowserFrame, CtaBand, Faq, MkHero, MkSection, PrimaryCta, WhatsAppCta } from "@/components/marketing/kit";
import { Story } from "@/components/marketing/story";
import { MarketingBody } from "@/components/platform/MarketingBody";
import { MODULE_TOURS } from "@/components/platform/module-tours";
import { SCREENS } from "@/components/scenes/screens";
import { JsonLd } from "@/components/seo/JsonLd";
import { StatusBadge } from "@/components/ui/status-badge";
import { getModuleView } from "@/lib/catalog";
import { getBreadcrumbSchema, getFAQSchema } from "@/lib/jsonld";
import { getModuleBySlug, type PlatformModule } from "@/lib/platform-modules";
import { getLivePages, getProductPages, type ScreenKey } from "@/lib/product-pages";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

/** The coded screen each module page leads with. */
const HERO_SCREEN: Record<string, ScreenKey> = {
  "erix-crm": "crm",
  "erix-connect": "inbox",
  "erix-flow": "flowCanvas",
  "erix-storage": "documents",
};

export const TYPE_LABEL = {
  "use-case": "Use case",
  capability: "Feature",
  guide: "Guide",
  comparison: "Comparison",
} as const;

export function moduleMetadata(slug: string): Metadata {
  const m = getModuleBySlug(slug);
  if (!m) return {};
  return pageMetadata({ title: m.title, description: m.description, path: `/platform/${m.slug}` });
}

/** Brand line: purple for AI/automation modules, blue otherwise. */
export function ModuleEyebrow({ m, onNavy }: { m: PlatformModule; onNavy?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[14px] font-semibold",
        m.ai ? "text-ai" : onNavy ? "text-[var(--on-navy-link)]" : "text-accent",
      )}
    >
      <Icon name={m.ai ? "sparkles" : "layout-dashboard"} size={14} variant="solid" />
      {m.brand}
    </span>
  );
}

/** Visible breadcrumb trail; pair with getBreadcrumbSchema. */
export function Crumbs({ items, onNavy }: { items: { name: string; href?: string }[]; onNavy?: boolean }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol
        className={cn(
          "flex flex-wrap items-center gap-1 text-[13px]",
          onNavy ? "text-white/70" : "text-muted-foreground",
        )}
      >
        {items.map((c, i) => (
          <li key={c.name} className="flex items-center gap-1">
            {i > 0 && <Icon name="chevron-right" size={14} variant="line" className="opacity-60" />}
            {c.href ? (
              <Link href={c.href} className={onNavy ? "hover:text-white" : "hover:text-accent"}>
                {c.name}
              </Link>
            ) : (
              <span aria-current="page" className={onNavy ? "text-white" : "text-foreground"}>
                {c.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Links to a module's guides as rows, not a wall of identical cards. */
export function GuideList({ module, pages }: { module: string; pages: ReturnType<typeof getProductPages> }) {
  return (
    <ul className="grid gap-x-10 md:grid-cols-2">
      {pages.map((p) => (
        <li key={p.slug} className="border-t border-border-soft">
          <Link
            href={`/platform/${module}/${p.slug}`}
            className="group -mx-3 flex items-start justify-between gap-4 rounded-[12px] px-3 py-5 hover:bg-hover"
          >
            <span className="min-w-0">
              <span className="block text-[13px] font-semibold text-accent">{TYPE_LABEL[p.type]}</span>
              <span className="mt-1 block text-[17px] font-semibold text-foreground">{p.title}</span>
              <span className="mt-1 block text-[15px] text-muted-foreground">{p.lead}</span>
            </span>
            <Icon name="arrow-right" size={16} variant="line" className="mt-7 shrink-0 text-accent" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Closing navy band with the two calls to action. `disabled` only dims WhatsApp: early access stays open. */
export function ClosingCta({ title, body, disabled }: { title: string; body: ReactNode; disabled?: boolean }) {
  return (
    <CtaBand
      title={title}
      lead={body}
      actions={
        <>
          <PrimaryCta lg />
          <WhatsAppCta lg disabled={disabled} />
        </>
      }
    />
  );
}

/** /platform/{module}: navy hero with the module's own coded screen, then detail. */
export async function ModulePage({ slug }: { slug: string }) {
  const m = getModuleBySlug(slug);
  if (!m) notFound();
  // Badge, availability and the admin-managed copy come from the catalog (static copy when it has none).
  const v = await getModuleView(slug, m.status);
  const soon = v.status === "soon";
  const Screen = SCREENS[HERO_SCREEN[m.slug]];
  const pages = getLivePages(m.slug);
  const soonPages = getProductPages(m.slug).filter((p) => p.soon);
  const tour = MODULE_TOURS[m.slug];

  return (
    <div className="w-full">
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Platform", url: "/platform" },
          { name: m.brand, url: `/platform/${m.slug}` },
        ])}
      />
      {m.faqs.length > 0 && <JsonLd data={getFAQSchema(m.faqs)} />}

      <MkHero
        top={
          <div className="mb-6 space-y-4">
            <Crumbs onNavy items={[{ name: "Platform", href: "/platform" }, { name: m.brand }]} />
            <p className="flex flex-wrap items-center gap-2">
              <ModuleEyebrow m={m} onNavy />
              <StatusBadge status={v.status} isNew={v.isNew} />
            </p>
          </div>
        }
        title={m.tagline}
        lead={v.marketing?.summary?.trim() || m.longDescription}
        actions={
          <>
            <PrimaryCta lg />
            <WhatsAppCta lg disabled={soon} />
          </>
        }
        visual={
          <BrowserFrame>
            <Screen />
          </BrowserFrame>
        }
      />

      {v.marketing && (v.marketing.body || v.marketing.image) && (
        <MkSection id="about" title={`About ${m.brand}`}>
          <MarketingBody marketing={v.marketing} />
        </MkSection>
      )}

      {/* Live modules: one chapter per feature, each with its screen. */}
      {tour && <Story id="features" title={tour.title} lead={tour.lead} chapters={tour.chapters} />}

      {!tour && (
        <MkSection id="features" title={`What you can do with ${m.brand}`}>
          <ul className="grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {m.features.map((f) => (
              <li key={f.title} className="grid grid-cols-[40px_1fr] gap-4">
                <span
                  className={cn(
                    "grid size-10 place-items-center rounded-[11px]",
                    m.ai ? "bg-ai-subtle text-ai" : "bg-accent-muted text-accent",
                  )}
                >
                  <Icon name="check" size={18} variant="line" strokeWidth={2.2} />
                </span>
                <div>
                  <h3 className="font-sans text-[17px] font-semibold tracking-normal">{f.title}</h3>
                  <p className="mt-1 text-[15px] text-muted-foreground">{f.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </MkSection>
      )}

      {m.steps.length > 0 && (
        <MkSection id="steps" tone="subtle">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <h2 id="steps-title" className="font-display text-mk-h2 text-foreground text-balance">
              Getting started with {m.brand}
            </h2>
            <ol className="space-y-6">
              {m.steps.map((s, i) => (
                <li key={s} className="flex gap-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent font-sans text-[15px]/none font-bold text-white shadow-[0_0_0_6px_var(--accent-dim)]">
                    {i + 1}
                  </span>
                  <p className="pt-1.5 text-[17px] text-foreground">{s}</p>
                </li>
              ))}
            </ol>
          </div>
        </MkSection>
      )}

      {pages.length > 0 && (
        <MkSection id="guides" title={`Guides for ${m.brand}`}>
          <GuideList module={m.slug} pages={pages} />
        </MkSection>
      )}

      {soonPages.length > 0 && (
        <MkSection id="coming-soon" title="Coming soon">
          <ul className="grid gap-x-10 md:grid-cols-2">
            {soonPages.map((p) => (
              <li key={p.slug} className="border-t border-border-soft py-5 text-[17px] font-semibold text-foreground">
                {p.title}
              </li>
            ))}
          </ul>
        </MkSection>
      )}

      {m.faqs.length > 0 && (
        <MkSection id="faq" tone="subtle" title={`Questions about ${m.brand}`}>
          <Faq items={m.faqs} />
        </MkSection>
      )}

      <ClosingCta
        title={soon ? `Hear first when ${m.brand} opens` : `Try ${m.brand} with your own business`}
        body="Request early access and tell us how you sell today. We'll set ERIX up around it."
        disabled={soon}
      />
    </div>
  );
}
