import Link from "next/link";
import { Icon } from "@/components/icons";
import { BrowserFrame, CtaBand, EmailCta, Faq, MkHero, MkSection, PrimaryCta, Steps } from "@/components/marketing/kit";
import { AgentScene } from "@/components/product-screens/agent-scene";
import { LazyScreen } from "@/components/product-screens/lazy-screen";
import { JsonLd } from "@/components/seo/JsonLd";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  DESKS,
  EMPLOYEE_PAGES,
  type EmployeePage as EmployeePageData,
  HANDOFF_COMMON,
  HIRE_STEPS,
  HUB,
} from "@/lib/platform/employee-pages";
import { getBreadcrumbSchema, getFAQSchema } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/seo";

const BASE = "/platform/ai-employee";

export const employeeMetadata = (p?: EmployeePageData) =>
  p
    ? pageMetadata({ title: p.title, description: p.description, path: `${BASE}/${p.slug}` })
    : pageMetadata({ title: HUB.title, description: HUB.description, path: BASE });

const Cards = ({ items }: { items: { title: string; text: string }[] }) => (
  <ul className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {items.map((it) => (
      <li key={it.title} className="rounded-xl border border-border-soft bg-surface p-6">
        <h3 className="font-sans text-[17px] font-semibold">{it.title}</h3>
        <p className="mt-2 text-[15px]/[1.6] text-muted-foreground">{it.text}</p>
      </li>
    ))}
  </ul>
);

/** Reasons a chat reaches a person, as one list. */
const HandoffList = ({ items }: { items: { title: string; text: string }[] }) => (
  <ul className="grid list-none gap-x-10 md:grid-cols-2">
    {items.map((it) => (
      <li key={it.title} className="grid grid-cols-[28px_1fr] gap-3 border-t border-border-soft py-5">
        <Icon name="hand" size={20} variant="line" className="mt-0.5 text-accent" />
        <div>
          <h3 className="font-sans text-[17px] font-semibold">{it.title}</h3>
          <p className="mt-1 text-[15px]/[1.6] text-muted-foreground">{it.text}</p>
        </div>
      </li>
    ))}
  </ul>
);

const Closing = () => (
  <CtaBand
    title="Hire your first AI employee"
    lead="Request early access and tell us where your customers write. We will set ERIX up around it."
    actions={
      <>
        <PrimaryCta lg />
        <EmailCta lg />
      </>
    }
  />
);

/** The hub and every channel page: one parent, content from lib/platform/employee-pages.ts. */
export function EmployeePage({ page }: { page?: EmployeePageData }) {
  const hub = !page;
  const faqs = page ? page.faqs : HUB.faqs;
  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Platform", url: "/platform" },
    { name: "AI Employee", url: BASE },
    ...(page ? [{ name: page.name, url: `${BASE}/${page.slug}` }] : []),
  ];
  const hero = page ? page.hero : HUB.hero;
  const steps = page ? [{ ...HIRE_STEPS[0] }, { ...HIRE_STEPS[1] }, { ...HIRE_STEPS[2] }] : HIRE_STEPS;

  return (
    <div className="w-full">
      <JsonLd data={getBreadcrumbSchema(crumbs)} />
      <JsonLd data={getFAQSchema(faqs)} />

      <MkHero
        top={
          // No visible breadcrumbs in navy heroes (founder); the BreadcrumbList JSON-LD above stays.
          page?.status && page.status !== "live" ? (
            <div className="mb-6">
              <StatusBadge status={page.status} />
            </div>
          ) : undefined
        }
        title={hero.title}
        lead={hero.lead}
        actions={
          <>
            <PrimaryCta lg />
            <EmailCta lg />
          </>
        }
        visual={
          <BrowserFrame url={page?.visual === "widget" ? "yourwebsite.com" : undefined}>
            {page?.visual === "outcomes" ? (
              <AgentScene />
            ) : (
              <LazyScreen name={page ? (page.visual as "inbox") : "agents"} />
            )}
          </BrowserFrame>
        }
      />

      {hub ? (
        <>
          <MkSection
            id="desks"
            title="Pick a desk"
            lead="One AI employee, set up on each channel where customers reach you."
          >
            <ul className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {DESKS.map((d) => {
                const body = (
                  <>
                    <span className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2.5">
                        <Icon name={d.icon} size={22} {...(d.status === "soon" ? { className: "opacity-50" } : {})} />
                        <span className="font-sans text-[17px] font-semibold">{d.name}</span>
                      </span>
                      {d.status !== "live" && <StatusBadge status={d.status} />}
                    </span>
                    <span className="mt-3 block text-[15px]/[1.6] text-muted-foreground">{d.blurb}</span>
                    {d.href && (
                      <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent">
                        See how it works <Icon name="arrow-right" size={14} variant="line" />
                      </span>
                    )}
                  </>
                );
                return (
                  <li key={d.name} className="flex">
                    {d.href ? (
                      <Link
                        href={d.href}
                        className="w-full rounded-xl border border-border-soft bg-surface p-6 hover:bg-hover"
                      >
                        {body}
                      </Link>
                    ) : (
                      <div className="w-full rounded-xl border border-dashed border-border-soft p-6 text-muted-foreground">
                        {body}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </MkSection>

          <MkSection id="one" tone="subtle" title="One employee, every desk">
            <Cards items={HUB.one} />
          </MkSection>
        </>
      ) : (
        <MkSection id="does" title={`What your AI employee does`}>
          <Cards items={page.jobs} />
        </MkSection>
      )}

      <MkSection id="handoff" tone={hub ? "plain" : "subtle"} title="When it hands to you" lead={HUB.handoffLead}>
        <HandoffList items={page ? page.handoff : HANDOFF_COMMON} />
        <HandoffList items={HUB.handoffAfter} />
        {page?.handoffNote && (
          <p className="mt-6 max-w-[68ch] text-[15.5px]/[1.65] text-muted-foreground">{page.handoffNote}</p>
        )}
      </MkSection>

      <MkSection id="steps" tone={hub ? "subtle" : "plain"} title="Set up in three steps">
        <Steps items={steps} />
        {page && <p className="mt-8 text-[15px] text-muted-foreground">Before step 1: {page.needs}</p>}
      </MkSection>

      {page && (
        <MkSection id="more" tone="subtle" title="The same employee on other desks">
          <ul className="flex list-none flex-wrap gap-2.5">
            {DESKS.filter((d) => d.href && d.name !== page.name).map((d) => (
              <li key={d.name}>
                <Link
                  href={d.href as string}
                  className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface px-4 py-2 text-[15px] font-medium hover:bg-hover"
                >
                  <Icon name={d.icon} size={16} />
                  {d.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={BASE}
                className="inline-flex items-center gap-2 px-3 py-2 text-[15px] font-semibold text-accent"
              >
                All AI Employee desks <Icon name="arrow-right" size={14} variant="line" />
              </Link>
            </li>
          </ul>
        </MkSection>
      )}

      <MkSection id="faq" title="Questions">
        <Faq items={faqs} />
      </MkSection>

      <Closing />
    </div>
  );
}

export const employeeParams = () => EMPLOYEE_PAGES.map((p) => ({ slug: p.slug }));
