import Link from "next/link";
import { CodeSample } from "@/components/docs/CodeSample";
import { Rich } from "@/components/docs/Rich";
import { Icon } from "@/components/icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { API_BASE_URL, DOC_SECTIONS, type DocBlock, type DocSection } from "@/lib/docs";
import { getBreadcrumbSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────────────
   /docs — the ERIX API and SDK reference: one page, a section per topic,
   prose and endpoints on the left, TypeScript/cURL samples on the right.
   Content lives in lib/docs.ts (public API only).
─────────────────────────────────────────────────────────────────────── */

export const metadata = pageMetadata({
  title: "ERIX API docs",
  description:
    "Build on ERIX: authentication, the TypeScript SDK, leads and pipelines, events and flows, the unified inbox, WhatsApp templates, Google Meet, storage and realtime.",
  path: "/docs",
});

const METHOD: Record<string, string> = {
  GET: "bg-success-subtle text-success",
  POST: "bg-accent-muted text-accent",
  PUT: "bg-warning-subtle text-warning",
  PATCH: "bg-warning-subtle text-warning",
  DELETE: "bg-error-subtle text-error",
};

const GROUPS = [...new Set(DOC_SECTIONS.map((s) => s.group))].map((group) => ({
  group,
  sections: DOC_SECTIONS.filter((s) => s.group === group),
}));

function Anchor({ id, label }: { id: string; label: string }) {
  return (
    <a
      href={`#${id}`}
      aria-label={`Link to ${label}`}
      className="ml-2 inline-flex align-middle text-subtle opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
    >
      <Icon name="link" size={14} variant="line" />
    </a>
  );
}

function Block({ block }: { block: DocBlock }) {
  switch (block.kind) {
    case "p":
      return (
        <p className="text-[15.5px] leading-relaxed text-muted-foreground">
          <Rich text={block.text} />
        </p>
      );
    case "list":
      return (
        <ul className="flex flex-col gap-2.5">
          {block.items.map((item) => (
            <li key={item} className="flex gap-2.5 text-[15px] leading-relaxed text-muted-foreground">
              <Icon name="check" size={16} variant="line" className="mt-1 shrink-0 text-accent" />
              <span>
                <Rich text={item} />
              </span>
            </li>
          ))}
        </ul>
      );
    case "note":
      return (
        <div role="note" className="flex gap-3 rounded-[12px] bg-warning-subtle p-4 text-[14.5px] leading-relaxed">
          <Icon name="lock" size={18} variant="duo" className="mt-0.5 shrink-0 text-warning" />
          <p className="text-muted-foreground">
            <strong className="font-semibold text-foreground">{block.title}</strong> <Rich text={block.text} />
          </p>
        </div>
      );
    case "table":
      return (
        <div className="overflow-x-auto rounded-[12px] bg-surface shadow-[var(--shadow-card)]">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-border-soft">
                {block.head.map((h) => (
                  <th key={h} scope="col" className="px-4 py-2.5 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join("|")} className="border-t border-border-soft first:border-t-0">
                  {row.map((cell, i) => (
                    <td key={`${i}-${cell}`} className="px-4 py-2.5 align-top text-muted-foreground">
                      <Rich text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "endpoint":
      return (
        <article
          id={block.id}
          aria-labelledby={`${block.id}-h`}
          className="group scroll-mt-24 rounded-[12px] bg-surface p-4 shadow-[var(--shadow-card)] sm:p-5"
        >
          <h3 id={`${block.id}-h`} className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span
              className={cn(
                "rounded-[6px] px-1.5 py-0.5 font-mono text-[11.5px] font-bold",
                METHOD[block.method] ?? "bg-sunken",
              )}
            >
              {block.method}
            </span>
            <code className="font-mono text-[13.5px] font-semibold break-all text-foreground">{block.path}</code>
            <Anchor id={block.id} label={`${block.method} ${block.path}`} />
          </h3>
          <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">
            <Rich text={block.purpose} />
          </p>
          {block.params.length > 0 && (
            <dl aria-label="Parameters" className="mt-3 divide-y divide-border-soft border-t border-border-soft">
              {block.params.map((p) => (
                <div
                  key={p.name}
                  className="grid gap-1 py-2.5 sm:grid-cols-[minmax(150px,190px)_minmax(0,1fr)] sm:gap-4"
                >
                  <dt className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <code className="font-mono text-[12.5px] font-semibold break-all text-foreground">{p.name}</code>
                    <span className="text-[12.5px] text-subtle">{p.type}</span>
                    {p.required ? (
                      <span className="rounded-[4px] bg-error-subtle px-1.5 py-0.5 text-[11.5px] font-semibold text-error">
                        Required
                      </span>
                    ) : (
                      <span className="sr-only">Optional</span>
                    )}
                  </dt>
                  <dd className="text-[13.5px] leading-relaxed text-muted-foreground">
                    <Rich text={p.text} />
                  </dd>
                </div>
              ))}
            </dl>
          )}
          {block.note && (
            <p className="mt-3 text-[13.5px] text-muted-foreground">
              <Rich text={block.note} />
            </p>
          )}
        </article>
      );
  }
}

function Section({ s }: { s: DocSection }) {
  return (
    <section
      id={s.id}
      aria-labelledby={`${s.id}-title`}
      className="grid scroll-mt-24 gap-8 border-t border-border-soft py-12 2xl:grid-cols-[minmax(0,1fr)_minmax(0,460px)]"
    >
      <div className="group flex min-w-0 flex-col gap-5">
        <div>
          <p className={cn("text-[13px] font-semibold", s.ai ? "text-ai" : "text-accent")}>{s.eyebrow || s.group}</p>
          <h2 id={`${s.id}-title`} className="mt-1 font-display text-[clamp(24px,2.6vw,30px)] tracking-[-0.02em]">
            {s.title}
            <Anchor id={s.id} label={s.title} />
          </h2>
        </div>
        {s.blocks.map((b, i) => (
          <Block key={b.kind === "endpoint" ? b.id : `${s.id}-${i}`} block={b} />
        ))}
      </div>
      {s.code.length > 0 && (
        <div className="flex min-w-0 flex-col gap-4 2xl:sticky 2xl:top-24 2xl:self-start">
          {s.code.map((c) => (
            <CodeSample key={c.label} sample={c} />
          ))}
        </div>
      )}
    </section>
  );
}

const navLink =
  "block rounded-[6px] px-2.5 py-1.5 text-[14px] text-muted-foreground transition-colors hover:bg-sunken hover:text-foreground";

export default function DocsPage() {
  return (
    <div className="w-full">
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "API docs", url: "/docs" },
        ])}
      />
      <div className="mx-auto grid w-full max-w-360 gap-10 px-gutter pt-2 pb-20 lg:grid-cols-[210px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <nav aria-label="Docs sections" className="sticky top-18 max-h-[calc(100dvh-4.5rem)] overflow-y-auto pb-6">
            {GROUPS.map((g) => (
              <div key={g.group} className="mb-5">
                <p className="mb-1 px-2.5 text-[12px] font-semibold text-subtle">{g.group}</p>
                <ul>
                  {g.sections.map((s) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className={navLink}>
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Until the code column sits beside the prose (2xl), cap the reading width so lines stay readable. */}
        <div className="min-w-0 max-w-[860px] 2xl:max-w-none">
          <header className="pb-10">
            <p className="text-[13px] font-semibold text-accent">Developers</p>
            <h1 className="mt-2 text-[clamp(36px,5vw,54px)] leading-[1.05] tracking-[-0.035em]">ERIX API docs</h1>
            <p className="mt-4 max-w-[62ch] text-[clamp(16px,1.5vw,18px)] leading-relaxed text-muted-foreground">
              Everything in ERIX over the API: leads, events and flows, the inbox, WhatsApp templates, bookings, files
              and live updates. Use the TypeScript SDK or plain HTTP.
            </p>
            <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-[14px]">
              <div>
                <dt className="text-subtle">Base URL</dt>
                <dd>
                  <code className="font-mono text-[13px] font-semibold">{API_BASE_URL}</code>
                </dd>
              </div>
              <div>
                <dt className="text-subtle">SDK</dt>
                <dd>
                  <a
                    href="https://www.npmjs.com/package/@ecodrix/erix-api"
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[13px] font-semibold text-accent hover:underline"
                  >
                    @ecodrix/erix-api
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-subtle">Version</dt>
                <dd>
                  <Link href="/changelog" className="font-semibold text-accent hover:underline">
                    v1.0
                  </Link>
                </dd>
              </div>
            </dl>
            <Accordion
              type="single"
              collapsible
              className="mt-4 rounded-[12px] bg-surface px-4 shadow-[var(--shadow-card)] lg:hidden"
            >
              <AccordionItem value="sections" className="border-b-0">
                <AccordionTrigger heading="div" className="py-4" icon={<Icon name="plus" size={18} variant="line" />}>
                  Jump to a section
                </AccordionTrigger>
                <AccordionContent className="pb-3">
                  <nav aria-label="Docs sections" className="-mx-2">
                    {GROUPS.map((g) => (
                      <div key={g.group} className="mt-2">
                        <p className="px-2.5 text-[12px] font-semibold text-subtle">{g.group}</p>
                        <ul>
                          {g.sections.map((s) => (
                            <li key={s.id}>
                              <a href={`#${s.id}`} className={navLink}>
                                {s.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </nav>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </header>

          {DOC_SECTIONS.map((s) => (
            <Section key={s.id} s={s} />
          ))}
        </div>
      </div>
    </div>
  );
}
