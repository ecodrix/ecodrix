import Link from "next/link";
import { DocLead } from "@/components/docs/DocLead";
import { Icon } from "@/components/icons";
import { API_BASE_URL, DOC_SECTIONS } from "@/lib/docs/docs";
import { helpMetadata } from "@/lib/help/meta";

/* doc.ecodrix.com/api: the ERIX API and SDK reference home. One page per section
   (/api/<section>); content lives in lib/docs/docs.ts (public API only). */

export const metadata = helpMetadata({
  title: "ERIX API docs",
  description:
    "Build on ERIX: authentication, the TypeScript SDK, leads and pipelines, events and flows, the unified inbox, WhatsApp templates, storage and realtime.",
  path: "/api",
  site: "ERIX API docs",
});

const GROUPS = [...new Set(DOC_SECTIONS.map((s) => s.group))].map((group) => ({
  group,
  sections: DOC_SECTIONS.filter((s) => s.group === group),
}));

const ENDPOINTS = DOC_SECTIONS.reduce((n, s) => n + s.blocks.filter((b) => b.kind === "endpoint").length, 0);

export default function ApiHome() {
  return (
    <div className="mx-auto flex w-full max-w-[880px] flex-col gap-10 px-gutter py-6 lg:py-10">
      <DocLead
        eyebrow="Developers · API reference"
        title="Build on ERIX"
        text="Everything in ERIX over the API: leads, events and flows, the inbox, WhatsApp templates, bookings, files and live updates. Use the TypeScript SDK or plain HTTP."
        facts={[
          { value: String(ENDPOINTS), label: "documented endpoints" },
          { value: String(DOC_SECTIONS.length), label: "reference sections" },
          { value: "2", label: "key types: workspace and scoped" },
          { value: "v1", label: "API version in every path" },
        ]}
      />

      <dl className="flex flex-wrap gap-x-8 gap-y-3 text-[14px]">
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
          <dt className="text-subtle">Release notes</dt>
          <dd>
            <Link href="/changelog" className="font-semibold text-accent hover:underline">
              Changelog
            </Link>
          </dd>
        </div>
      </dl>

      {GROUPS.map((g) => (
        <section key={g.group} aria-labelledby={`g-${g.group.replace(/\W+/g, "-")}`} className="flex flex-col gap-3">
          <h2
            id={`g-${g.group.replace(/\W+/g, "-")}`}
            className="font-display text-[22px] font-bold tracking-[-0.01em] text-foreground"
          >
            {g.group}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {g.sections.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/api/${s.id}`}
                  className="group flex h-full items-start gap-3 rounded-[12px] border border-border-soft bg-surface p-4 transition-colors hover:border-accent-border"
                >
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="font-semibold text-foreground group-hover:text-accent">{s.title}</span>
                    <span className="text-[13.5px] text-muted-foreground">
                      {s.blocks.filter((b) => b.kind === "endpoint").length || "Guide"}
                      {s.blocks.some((b) => b.kind === "endpoint") ? " endpoints" : ""}
                    </span>
                  </span>
                  <Icon name="chevron-right" size={16} variant="line" className="mt-1 shrink-0 text-subtle" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
