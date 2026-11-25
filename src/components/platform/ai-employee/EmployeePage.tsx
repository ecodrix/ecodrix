import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { BrowserFrame, CtaBand, EmailCta, Faq, MkHero, MkSection, PrimaryCta, Steps } from "@/components/marketing/kit";
import { DoesNot, ExampleChat, NeedsList, Path, RowList } from "@/components/platform/ai-employee/EmployeeBlocks";
import { EmployeeBuild } from "@/components/platform/ai-employee/EmployeeBuild";
import { LazyScreen } from "@/components/product-screens/lazy-screen";
import { JsonLd } from "@/components/seo/JsonLd";
import { StatusBadge } from "@/components/ui/status-badge";
import { fetchCatalog } from "@/lib/api";
import { resolveByCatalog } from "@/lib/platform/catalog";
import {
  DESKS,
  EMPLOYEE_PAGES,
  type EmployeePage as EmployeePageData,
  HANDOFF_COMMON,
  HIRE_STEPS,
  HUB,
  notLiveLine,
} from "@/lib/platform/employee-pages";
import { getBreadcrumbSchema, getFAQSchema } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/seo";

const BASE = "/platform/ai-employee";

export const employeeMetadata = (p?: EmployeePageData) =>
  p
    ? pageMetadata({ title: p.title, description: p.description, path: `${BASE}/${p.slug}` })
    : pageMetadata({ title: HUB.title, description: HUB.description, path: BASE });

const Cards = ({ items }: { items: { title: string; text: string; example?: string }[] }) => (
  // Three columns only when the cards fill the last row; otherwise two, so no cell stays empty.
  <ul className={`grid list-none gap-4 sm:grid-cols-2 ${items.length % 3 === 0 ? "lg:grid-cols-3" : ""}`}>
    {items.map((it) => (
      <li key={it.title} className="rounded-xl border border-border-soft bg-surface p-5 sm:p-6">
        <h3 className="font-sans text-[17px] font-semibold">{it.title}</h3>
        <p className="mt-2 text-[15px]/[1.6] text-muted-foreground">{it.text}</p>
        {it.example && (
          <p className="mt-3 border-t border-border-soft pt-3 text-[14px]/[1.55] text-muted-foreground">
            <span className="font-semibold text-foreground">For example: </span>
            {it.example}
          </p>
        )}
      </li>
    ))}
  </ul>
);

/** Reasons a chat reaches a person, as one list. */
const HandoffList = ({ items }: { items: { title: string; text: string }[] }) => (
  <ul className="grid list-none gap-x-10 md:grid-cols-2">
    {items.map((it) => (
      <li key={it.title} className="border-t border-border-soft py-4">
        <h3 className="font-sans text-[16.5px] font-semibold">{it.title}</h3>
        <p className="mt-1 text-[15px]/[1.6] text-muted-foreground">{it.text}</p>
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
export async function EmployeePage({ page }: { page?: EmployeePageData }) {
  const hub = !page;
  const desks = resolveByCatalog(DESKS, await fetchCatalog());
  const status = page ? desks.find((d) => d.name === page.name)?.status : undefined;
  // Staff hid this desk in the catalog: its page goes too.
  if (page && !status) notFound();
  const faqs = page ? page.faqs : HUB.faqs;
  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Platform", url: "/platform" },
    { name: "AI Employee", url: BASE },
    ...(page ? [{ name: page.name, url: `${BASE}/${page.slug}` }] : []),
  ];
  const hero = page ? page.hero : HUB.hero;
  const notLive = !!status && status !== "live";

  return (
    <div className="w-full">
      <JsonLd data={getBreadcrumbSchema(crumbs)} />
      <JsonLd data={getFAQSchema(faqs)} />

      <MkHero
        top={
          // No visible breadcrumbs in navy heroes (founder); the BreadcrumbList JSON-LD above stays.
          status && status !== "live" ? (
            <div className="mb-6">
              <StatusBadge status={status} />
            </div>
          ) : undefined
        }
        title={hero.title}
        lead={
          notLive && page ? (
            <>
              {hero.lead}
              <span className="mt-3 block font-medium text-white">{notLiveLine(page.name)}</span>
            </>
          ) : (
            hero.lead
          )
        }
        facts={page?.heroFacts}
        actions={
          <>
            <PrimaryCta lg />
            <EmailCta lg />
          </>
        }
        visual={
          <BrowserFrame url={page?.slug === "website-chat" ? "yourwebsite.com" : undefined}>
            {page ? (
              <div className="p-4">
                <ExampleChat example={page.example} compact={page.heroTurns} />
              </div>
            ) : (
              <LazyScreen name="agents" />
            )}
          </BrowserFrame>
        }
      />

      {hub ? (
        <>
          <EmployeeBuild />
          <MkSection
            id="desks"
            title="Pick a desk"
            lead="One AI employee, set up on each channel where customers reach you."
          >
            <ul className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {desks.map((d) => {
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
        <>
          <MkSection id="example" title={page.example.title} lead={page.example.lead}>
            <ExampleChat example={page.example} />
          </MkSection>
          <MkSection id="path" tone="subtle" title="What happens to one message" lead={page.pathLead}>
            <Path steps={page.path} />
          </MkSection>
          <MkSection id="does" title={`What your AI employee does on ${page.name}`}>
            <Cards items={page.jobs} />
          </MkSection>
          <MkSection id="does-not" tone="subtle" title="What it does not do">
            <DoesNot items={page.doesNot} />
          </MkSection>
          <MkSection id="needs" title="What you need before you start" lead={page.needsLead}>
            <NeedsList items={page.needs} />
          </MkSection>
        </>
      )}

      {page && (
        <>
          <MkSection id="steps" tone="subtle" title="Set up in three steps">
            <Steps items={page.setup} />
          </MkSection>
          <MkSection id="controls" title="What you control">
            <RowList items={page.controls} />
          </MkSection>
          <MkSection id="rules" tone="subtle" title={`${page.name}'s own rules, in plain words`}>
            <RowList items={page.rules} icon="shield" />
          </MkSection>
        </>
      )}

      <MkSection id="handoff" tone="plain" title="When it hands over to you" lead={HUB.handoffLead}>
        <HandoffList items={page ? page.handoff : HANDOFF_COMMON} />
        {hub && <HandoffList items={HUB.handoffAfter} />}
        {page && (
          <p className="mt-6 max-w-[68ch] rounded-xl bg-sunken px-5 py-4 text-[15px]/[1.65] text-muted-foreground">
            <span className="font-semibold text-foreground">What the customer sees. </span>
            {page.handoffNote}
          </p>
        )}
      </MkSection>

      {hub && (
        <MkSection id="steps" tone="subtle" title="Set up in three steps">
          <Steps items={HIRE_STEPS} />
        </MkSection>
      )}

      {page && (
        <MkSection id="more" tone="subtle" title="The same employee on other desks">
          <ul className="flex list-none flex-wrap gap-2.5">
            {desks
              .filter((d) => d.href && d.name !== page.name)
              .map((d) => (
                <li key={d.name}>
                  <Link
                    href={d.href as string}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border-soft bg-surface px-4 py-2 text-[15px] font-medium hover:bg-hover"
                  >
                    <Icon name={d.icon} size={16} />
                    {d.name}
                  </Link>
                </li>
              ))}
            <li>
              <Link
                href={BASE}
                className="inline-flex min-h-11 items-center gap-2 px-3 py-2 text-[15px] font-semibold text-accent"
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
