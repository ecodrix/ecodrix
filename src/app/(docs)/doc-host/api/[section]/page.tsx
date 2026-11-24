import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiSection } from "@/components/docs/ApiSection";
import { Icon } from "@/components/icons";
import { DOC_SECTIONS } from "@/lib/docs/docs";
import { helpMetadata } from "@/lib/help/meta";

type Params = Promise<{ section: string }>;

export function generateStaticParams() {
  return DOC_SECTIONS.map((s) => ({ section: s.id }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const id = (await params).section;
  const s = DOC_SECTIONS.find((x) => x.id === id);
  if (!s) return {};
  return helpMetadata({
    title: `${s.title} | ERIX API docs`,
    description: `ERIX API reference: ${s.title}.`,
    path: `/api/${s.id}`,
    site: "ERIX API docs",
  });
}

const pager =
  "flex flex-1 flex-col gap-1 rounded-[12px] border border-border-soft bg-surface p-4 transition-colors hover:border-accent-border";

/** One API reference section, with the previous and next section underneath. */
export default async function ApiSectionPage({ params }: { params: Params }) {
  const id = (await params).section;
  const i = DOC_SECTIONS.findIndex((x) => x.id === id);
  if (i < 0) notFound();
  const prev = DOC_SECTIONS[i - 1];
  const next = DOC_SECTIONS[i + 1];
  return (
    <div className="mx-auto flex w-full max-w-[880px] flex-col gap-10 px-gutter py-6 lg:py-10">
      <nav aria-label="Breadcrumb" className="text-[14px] text-subtle">
        <Link href="/api" className="hover:text-foreground">
          API reference
        </Link>
        <span aria-hidden> / </span>
        <span aria-current="page" className="text-foreground">
          {DOC_SECTIONS[i].title}
        </span>
      </nav>
      <ApiSection s={DOC_SECTIONS[i]} />
      <nav aria-label="More sections" className="flex flex-col gap-3 border-t border-border-soft pt-6 sm:flex-row">
        {prev ? (
          <Link href={`/api/${prev.id}`} className={pager}>
            <span className="flex items-center gap-1 text-[13px] text-subtle">
              <Icon name="arrow-left" size={14} variant="line" /> Previous
            </span>
            <span className="font-semibold text-foreground">{prev.title}</span>
          </Link>
        ) : (
          <span className="hidden flex-1 sm:block" />
        )}
        {next && (
          <Link href={`/api/${next.id}`} className={`${pager} sm:items-end sm:text-right`}>
            <span className="flex items-center gap-1 text-[13px] text-subtle">
              Next <Icon name="arrow-right" size={14} variant="line" />
            </span>
            <span className="font-semibold text-foreground">{next.title}</span>
          </Link>
        )}
      </nav>
    </div>
  );
}
