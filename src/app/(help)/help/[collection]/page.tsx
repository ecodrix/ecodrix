import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { articleHref, articlesIn, collection, HELP_COLLECTIONS, helpHref, KIND_LABEL } from "@/lib/help";
import { helpMetadata } from "@/lib/help/meta";

export function generateStaticParams() {
  return HELP_COLLECTIONS.map((c) => ({ collection: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }) {
  const c = collection((await params).collection);
  if (!c) return {};
  return helpMetadata({ title: `${c.title} | ERIX Help`, description: c.summary, path: `/${c.slug}` });
}

/** One collection: every article in it, with what each helps you do. */
export default async function HelpCollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const c = collection((await params).collection);
  if (!c) notFound();
  const list = articlesIn(c.slug);
  return (
    <div className="mx-auto flex w-full max-w-[880px] flex-col gap-8 px-gutter py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="text-[14px] text-subtle">
        <Link href={helpHref("/")} className="hover:text-foreground">
          Help
        </Link>
        <span aria-hidden> / </span>
        <span aria-current="page" className="text-foreground">
          {c.title}
        </span>
      </nav>
      <header className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-[12px] bg-accent-muted text-accent">
          <Icon name={c.icon} size={24} />
        </span>
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-[clamp(1.8rem,1.4rem+1.6vw,2.5rem)] font-extrabold tracking-[-0.02em] text-foreground">
            {c.title}
          </h1>
          <p className="text-[16.5px] text-muted-foreground">{c.summary}</p>
        </div>
      </header>
      <ul className="flex flex-col divide-y divide-border-soft rounded-[12px] border border-border-soft bg-surface">
        {list.map((a) => (
          <li key={a.slug}>
            <Link href={articleHref(a)} className="flex items-center gap-4 px-5 py-4 hover:bg-sunken">
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="font-semibold text-foreground">{a.title}</span>
                <span className="text-[14.5px] leading-snug text-muted-foreground">{a.summary}</span>
              </span>
              <span className="hidden shrink-0 text-[13px] text-subtle sm:block">
                {KIND_LABEL[a.kind]} · {a.minutes} min
              </span>
              <Icon name="chevron-right" size={16} variant="line" className="shrink-0 text-subtle" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
