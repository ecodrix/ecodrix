import { CodeSample } from "@/components/docs/CodeSample";
import { Rich } from "@/components/docs/Rich";
import { Icon } from "@/components/icons";
import type { DocBlock, DocSection } from "@/lib/docs/docs";
import { cn } from "@/lib/utils";

/* One API reference section (prose, endpoints, samples). Content: lib/docs/docs.ts (public API only). */

const METHOD: Record<string, string> = {
  GET: "bg-success-subtle text-success",
  POST: "bg-accent-muted text-accent",
  PUT: "bg-warning-subtle text-warning",
  PATCH: "bg-warning-subtle text-warning",
  DELETE: "bg-error-subtle text-error",
};

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
        <div className="overflow-x-auto rounded-[12px] bg-surface border border-border-soft">
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
                    // biome-ignore lint/suspicious/noArrayIndexKey: cells repeat, the column is the identity
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
          className="group scroll-mt-20 rounded-[12px] border border-border-soft bg-surface p-4 sm:p-5"
        >
          <h2
            id={`${block.id}-h`}
            data-toc={`${block.method} ${block.path.replace(/^\/v1\/api/, "")}`}
            className="flex flex-wrap items-center gap-x-2.5 gap-y-1"
          >
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
          </h2>
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

/** One API section: prose and endpoints, then the TypeScript and cURL samples. */
export function ApiSection({ s }: { s: DocSection }) {
  return (
    <section id={s.id} aria-labelledby={`${s.id}-title`} className="flex flex-col gap-8">
      <div className="group flex min-w-0 flex-col gap-5">
        <div>
          <p className={cn("text-[13px] font-semibold", s.ai ? "text-ai" : "text-accent")}>{s.eyebrow || s.group}</p>
          <h1 id={`${s.id}-title`} className="mt-1 font-display text-[clamp(28px,3.2vw,38px)] tracking-[-0.025em]">
            {s.title}
            <Anchor id={s.id} label={s.title} />
          </h1>
        </div>
        {s.blocks.map((b, i) => (
          <Block key={b.kind === "endpoint" ? b.id : `${s.id}-${i}`} block={b} />
        ))}
      </div>
      {s.code.length > 0 && (
        <div className="flex min-w-0 flex-col gap-4">
          {s.code.map((c) => (
            <CodeSample key={c.label} sample={c} />
          ))}
        </div>
      )}
    </section>
  );
}
