import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { BrowserFrame, Faq, PrimaryCta } from "@/components/marketing/kit";
import { SCREENS } from "@/components/scenes/screens";
import { JsonLd } from "@/components/seo/JsonLd";
import { buttonVariants } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { getModuleView } from "@/lib/catalog";
import { getBreadcrumbSchema, getFAQSchema } from "@/lib/jsonld";
import { getModuleBySlug } from "@/lib/platform-modules";
import { getProductPages } from "@/lib/product-pages";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { ClosingCta, Crumbs, GuideList, ModuleEyebrow, TYPE_LABEL } from "./ModulePage";

const anchor = (heading: string) =>
  heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function subPageParams(module: string) {
  return getProductPages(module).map((p) => ({ slug: p.slug }));
}

export function subPageMetadata(module: string, slug: string): Metadata {
  const page = getProductPages(module).find((p) => p.slug === slug);
  if (!page) return { title: "Not found" };
  return pageMetadata({ title: page.title, description: page.description, path: `/platform/${module}/${page.slug}` });
}

/** /platform/{module}/{slug}: a guide, use case, feature or comparison. */
export async function SubPageLayout({ module, slug }: { module: string; slug: string }) {
  const m = getModuleBySlug(module);
  const pages = getProductPages(module);
  const page = pages.find((p) => p.slug === slug);
  if (!m || !page) notFound();
  const v = await getModuleView(m.slug, m.status);
  const Screen = page.screen ? SCREENS[page.screen] : null;
  const related = pages.filter((p) => p.slug !== page.slug).slice(0, 4);
  const path = `/platform/${m.slug}/${page.slug}`;
  const toc = [
    ...(page.steps ? [{ id: "how-it-works", label: "How it works" }] : []),
    ...page.sections.map((s) => ({ id: anchor(s.heading), label: s.heading })),
    ...(page.faqs ? [{ id: "questions", label: "Questions" }] : []),
  ];

  return (
    <div className="w-full">
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Platform", url: "/platform" },
          { name: m.brand, url: `/platform/${m.slug}` },
          { name: page.title, url: path },
        ])}
      />
      {page.faqs && page.faqs.length > 0 && <JsonLd data={getFAQSchema(page.faqs)} />}

      {/* ── Header (light: only navy bands carry the brand flourish) ── */}
      <section data-tone="subtle" className="py-section bg-background pt-10! md:pt-14!">
        <div
          className={cn(
            "mx-auto w-full max-w-wrap px-gutter grid items-center gap-10",
            Screen && "lg:grid-cols-[1fr_1.05fr] lg:gap-14",
          )}
        >
          <div className={Screen ? "" : "max-w-3xl"}>
            <Crumbs
              items={[
                { name: "Platform", href: "/platform" },
                { name: m.brand, href: `/platform/${m.slug}` },
                { name: page.title },
              ]}
            />
            <p className="mt-6 flex flex-wrap items-center gap-3">
              <ModuleEyebrow m={m} />
              <StatusBadge status={v.status} isNew={v.isNew} />
              <span className="rounded-[6px] bg-sunken px-2 py-0.5 text-[12px] font-semibold text-muted-foreground">
                {TYPE_LABEL[page.type]}
              </span>
            </p>
            <h1 className="mt-4 text-[clamp(34px,4.6vw,52px)] leading-[1.06] tracking-[-0.035em]">{page.title}</h1>
            <p className="mt-5 max-w-[60ch] text-[clamp(16px,1.5vw,19px)] leading-relaxed text-muted-foreground">
              {page.lead}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryCta />
              <Link href={`/platform/${m.slug}`} className={buttonVariants({ variant: "ghost" })}>
                About {m.brand}
              </Link>
            </div>
          </div>
          {Screen && (
            <BrowserFrame light>
              <Screen />
            </BrowserFrame>
          )}
        </div>
      </section>

      <section className="py-section">
        <div className="mx-auto w-full max-w-wrap px-gutter grid gap-10 lg:grid-cols-[14rem_1fr] lg:gap-16">
          {/* On this page */}
          <nav aria-label="On this page" className="hidden lg:block">
            <div className="sticky top-24">
              <p className="text-sm font-semibold text-foreground">On this page</p>
              <ul className="mt-3 space-y-0.5">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a
                      href={`#${t.id}`}
                      className="block rounded-[8px] px-3 py-1.5 text-sm text-muted-foreground hover:bg-hover hover:text-foreground"
                    >
                      {t.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="min-w-0 max-w-[68ch]">
            {page.notice && (
              <p className="mb-10 flex gap-3 rounded-[12px] bg-sunken p-4 text-[15px] text-foreground">
                <Icon name="info" size={20} variant="solid" className="mt-0.5 shrink-0 text-warning" />
                <span>{page.notice}</span>
              </p>
            )}

            {page.steps && (
              <section id="how-it-works" aria-labelledby="how-it-works-title" className="mb-14 scroll-mt-24">
                <h2 id="how-it-works-title" className="text-[clamp(24px,2.6vw,32px)] tracking-[-0.02em]">
                  How it works
                </h2>
                <ol className="mt-6 space-y-5">
                  {page.steps.map((s, i) => (
                    <li key={s} className="flex gap-4">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent font-sans text-[14px]/none font-bold text-white shadow-[0_0_0_6px_var(--accent-dim)]">
                        {i + 1}
                      </span>
                      <p className="pt-1 text-[17px] text-foreground">{s}</p>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <div className="space-y-12">
              {page.sections.map((s) => (
                <section key={s.heading} id={anchor(s.heading)} className="scroll-mt-24">
                  <h2 className="text-[clamp(22px,2.2vw,28px)] tracking-[-0.02em]">{s.heading}</h2>
                  {s.body.map((b) => (
                    <p key={b} className="mt-4 text-[17px] leading-[1.75] text-muted-foreground">
                      {b}
                    </p>
                  ))}
                  {s.points && (
                    <ul className="mt-5 grid list-none gap-2.5 [&_.erix-icon]:mt-[3px] [&_.erix-icon]:text-accent">
                      {s.points.map((pt) => (
                        <li
                          key={pt}
                          className="flex items-start gap-2.5 font-sans text-[15px]/[22px] font-medium text-foreground"
                        >
                          <Icon
                            name="check"
                            size={16}
                            strokeWidth={2.2}
                            variant="line"
                            className={m.ai ? "text-ai!" : undefined}
                          />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            {page.faqs && page.faqs.length > 0 && (
              <section id="questions" aria-labelledby="questions-title" className="mt-16 scroll-mt-24">
                <h2 id="questions-title" className="mb-6 text-[clamp(24px,2.6vw,32px)] tracking-[-0.02em]">
                  Questions
                </h2>
                <Faq items={page.faqs} />
              </section>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-title" data-tone="subtle" className="py-section bg-background">
          <div className="mx-auto w-full max-w-wrap px-gutter">
            <h2 id="related-title" className="font-display text-mk-h2 text-foreground text-balance mb-8">
              More on {m.brand}
            </h2>
            <GuideList module={m.slug} pages={related} />
          </div>
        </section>
      )}

      <ClosingCta
        title="See it with your own business"
        body="Request early access and tell us how you sell today. We'll set ERIX up around it."
        disabled={v.status === "soon"}
      />
    </div>
  );
}
