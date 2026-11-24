import Link from "next/link";
import { Icon } from "@/components/icons";
import { Crumbs } from "@/components/platform/shared/ModulePage";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LEGAL, type LegalBlock, type LegalDoc } from "@/lib/legal/config";

/* ──────────────────────────────────────────────────────────────────────
   LegalLayout — renders any structured legal document (privacy, terms,
   refund, DPA, etc.). A readability pass only: the wording comes from
   lib/legal/docs and is never changed here. Lines stay near 68ch, the
   contents list is sticky on desktop and a disclosure on phones.
─────────────────────────────────────────────────────────────────────── */

const text = "text-[16.5px] leading-[1.75] text-muted-foreground";

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === "string") return <p className={text}>{block}</p>;
  if ("p" in block) return <p className={text}>{block.p}</p>;
  if ("subheading" in block) {
    return (
      <h3 className="pt-2 font-sans text-[18px] font-semibold tracking-normal text-foreground">{block.subheading}</h3>
    );
  }
  if ("note" in block) {
    return (
      <p className="rounded-[12px] bg-background px-4 py-3 text-[15px] leading-relaxed text-foreground">{block.note}</p>
    );
  }
  if ("list" in block) {
    return (
      <ul className="space-y-2.5">
        {block.list.map((item, i) => (
          <li key={i} className={`flex gap-3 ${text}`}>
            <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-accent" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }
  if ("ol" in block) {
    return (
      <ol className={`list-decimal space-y-2.5 pl-5 marker:font-semibold marker:text-accent ${text}`}>
        {block.ol.map((item, i) => (
          <li key={i} className="pl-1">
            {item}
          </li>
        ))}
      </ol>
    );
  }
  if ("table" in block) {
    return (
      <div className="overflow-x-auto rounded-[12px] shadow-[var(--shadow-card)]">
        <table className="w-full min-w-[480px] border-collapse bg-surface text-left text-[15px]">
          <thead>
            <tr className="bg-sunken">
              {block.table.headers.map((h) => (
                <th key={h} scope="col" className="px-4 py-3 text-[13px] font-semibold text-foreground">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.table.rows.map((row, ri) => (
              <tr key={ri} className="border-t border-border-soft align-top">
                {row.map((cell, ci) => (
                  <td key={ci} className="px-4 py-3 text-muted-foreground">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return null;
}

function Contents({ doc }: { doc: LegalDoc }) {
  return (
    <ol className="space-y-0.5">
      {doc.sections.map((s, i) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            className="flex gap-2 rounded-[8px] px-3 py-1.5 text-sm text-muted-foreground hover:bg-hover hover:text-foreground"
          >
            <span className="w-5 shrink-0 tabular-nums text-subtle">{i + 1}.</span>
            {s.title}
          </a>
        </li>
      ))}
    </ol>
  );
}

export function LegalLayout({ doc }: { doc: LegalDoc }) {
  const updated = doc.effectiveDate;

  return (
    <div className="w-full">
      <section data-tone="subtle" className="py-section bg-background pt-10! pb-12! md:pt-14!">
        <div className="mx-auto w-full max-w-wrap px-gutter">
          <Crumbs items={[{ name: "Legal", href: "/legal" }, { name: doc.title }]} />
          <p className="mt-6 text-[14px] font-semibold text-accent">{doc.pill}</p>
          <h1 className="mt-2 text-[clamp(34px,4.6vw,52px)] leading-[1.06] tracking-[-0.035em]">{doc.title}</h1>
          <p className="mt-4 text-[15px] text-muted-foreground">
            Last updated: <span className="font-semibold text-foreground">{updated}</span>
          </p>
          {doc.intro && <p className={`mt-6 max-w-[68ch] ${text}`}>{doc.intro}</p>}
        </div>
      </section>

      <div className="py-section pt-10! md:pt-14!">
        <div className="mx-auto w-full max-w-wrap px-gutter grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-16">
          <aside>
            <Accordion type="single" collapsible className="rounded-[12px] bg-background px-4 lg:hidden">
              <AccordionItem value="contents" className="border-b-0">
                <AccordionTrigger heading="div" className="py-4" icon={<Icon name="plus" size={18} variant="line" />}>
                  Contents
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <nav aria-label="Contents">
                    <Contents doc={doc} />
                  </nav>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <nav aria-label="Contents" className="sticky top-24 hidden lg:block">
              <p className="mb-3 px-3 text-sm font-semibold text-foreground">Contents</p>
              <Contents doc={doc} />
            </nav>
          </aside>

          <div className="min-w-0 max-w-[68ch] space-y-14">
            {doc.sections.map((section, idx) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-title`}
                className="scroll-mt-24"
              >
                <h2 id={`${section.id}-title`} className="flex gap-3 text-[clamp(22px,2.4vw,28px)] tracking-[-0.02em]">
                  <span className="tabular-nums text-subtle">{idx + 1}.</span>
                  {section.title}
                </h2>
                <div className="mt-5 space-y-4">
                  {section.body.map((block, i) => (
                    <Block key={i} block={block} />
                  ))}
                </div>
              </section>
            ))}

            <div className="rounded-[16px] bg-background p-6 md:p-8">
              <h2 className="font-sans text-[19px] font-semibold tracking-normal">Questions about this document?</h2>
              <p className="mt-2 text-[15px] text-muted-foreground">
                Write to{" "}
                <a href={`mailto:${LEGAL.emails.legal}`} className="text-accent underline underline-offset-4">
                  {LEGAL.emails.legal}
                </a>{" "}
                and we&apos;ll help clarify anything you need.
              </p>
              <Link
                href="/legal"
                className="inline-flex items-center gap-1.5 font-sans text-[15px]/5 font-[650] text-accent hover:underline hover:underline-offset-3 motion-safe:focus-visible:animate-focus group mt-4"
              >
                <Icon name="arrow-left" size={14} variant="line" />
                All legal documents
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
