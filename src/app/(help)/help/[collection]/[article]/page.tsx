import Link from "next/link";
import { notFound } from "next/navigation";
import { Rich } from "@/components/docs/Rich";
import { HelpBlocks } from "@/components/help/HelpBlocks";
import { Helpful } from "@/components/help/Helpful";
import { Icon } from "@/components/icons";
import { article, articleHref, articlesIn, byKey, collection, HELP_ARTICLES, helpHref, KIND_LABEL } from "@/lib/help";
import { helpMetadata } from "@/lib/help/meta";

type Params = Promise<{ collection: string; article: string }>;

export function generateStaticParams() {
  return HELP_ARTICLES.map((a) => ({ collection: a.collection, article: a.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const p = await params;
  const a = article(p.collection, p.article);
  if (!a) return {};
  return helpMetadata({ title: a.title, description: a.summary, path: `/${a.collection}/${a.slug}` });
}

const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });

/** One help article: what you'll do, before you start, the steps with real screens, questions, related. */
export default async function HelpArticlePage({ params }: { params: Params }) {
  const p = await params;
  const a = article(p.collection, p.article);
  const c = collection(p.collection);
  if (!a || !c) notFound();
  const siblings = articlesIn(c.slug);
  const related = (a.related ?? []).map(byKey).filter((r) => r !== undefined);

  return (
    <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-gutter py-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:py-14">
      <nav aria-label={`${c.title} articles`} className="hidden lg:block">
        <div className="sticky top-24 flex flex-col gap-2">
          <Link
            href={helpHref(`/${c.slug}`)}
            className="px-2 text-[13px] font-semibold tracking-[0.06em] text-subtle uppercase hover:text-foreground"
          >
            {c.title}
          </Link>
          <ul className="flex flex-col">
            {siblings.map((s) => (
              <li key={s.slug}>
                <Link
                  href={articleHref(s)}
                  aria-current={s.slug === a.slug ? "page" : undefined}
                  className={
                    s.slug === a.slug
                      ? "block rounded-[8px] bg-accent-muted px-2 py-2 text-[14.5px] font-semibold text-accent"
                      : "block rounded-[8px] px-2 py-2 text-[14.5px] text-muted-foreground hover:bg-sunken hover:text-foreground"
                  }
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <article className="flex max-w-[760px] min-w-0 flex-col gap-8">
        <nav aria-label="Breadcrumb" className="text-[14px] text-subtle">
          <Link href={helpHref("/")} className="hover:text-foreground">
            Help
          </Link>
          <span aria-hidden> / </span>
          <Link href={helpHref(`/${c.slug}`)} className="hover:text-foreground">
            {c.title}
          </Link>
        </nav>

        <header className="flex flex-col gap-3">
          <h1 className="font-display text-[clamp(1.9rem,1.4rem+1.8vw,2.7rem)] font-extrabold tracking-[-0.02em] text-balance text-foreground">
            {a.title}
          </h1>
          <p className="text-[17.5px] leading-relaxed text-muted-foreground">{a.summary}</p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13.5px] text-subtle">
            <span className="rounded-[6px] bg-sunken px-2 py-0.5 font-semibold text-foreground">
              {KIND_LABEL[a.kind]}
            </span>
            <span>{a.minutes} min</span>
            <span>
              Checked against ERIX on <time dateTime={a.updated}>{dateFmt.format(new Date(a.updated))}</time>
            </span>
          </p>
        </header>

        {a.before && (
          <section
            aria-labelledby="before"
            className="flex flex-col gap-2 rounded-[12px] border border-border-soft bg-sunken p-5"
          >
            <h2 id="before" className="font-semibold text-foreground">
              Before you start
            </h2>
            <ul className="flex list-disc flex-col gap-1.5 pl-5 text-[15px] leading-relaxed text-muted-foreground">
              {a.before.map((t) => (
                <li key={t}>
                  <Rich text={t} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <HelpBlocks blocks={a.blocks} />

        {a.problems && a.problems.length > 0 && (
          <section id="questions" aria-labelledby="questions-h" className="flex scroll-mt-24 flex-col gap-3">
            <h2 id="questions-h" className="font-display text-[21px] font-bold tracking-[-0.01em] text-foreground">
              {a.collection === "reference" ? "Questions" : "If something isn't right"}
            </h2>
            <div className="flex flex-col divide-y divide-border-soft rounded-[12px] border border-border-soft bg-surface">
              {a.problems.map((q) => (
                <details key={q.q} className="group px-5 py-3.5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-foreground">
                    <Rich text={q.q} />
                    <Icon
                      name="chevron-down"
                      size={16}
                      variant="line"
                      className="shrink-0 text-subtle transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <p className="pt-2 text-[15px] leading-relaxed text-muted-foreground">
                    <Rich text={q.a} />
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        <div className="border-t border-border-soft pt-6">
          <Helpful article={`${a.collection}/${a.slug}`} />
        </div>

        {related.length > 0 && (
          <section aria-labelledby="related" className="flex flex-col gap-3">
            <h2 id="related" className="font-semibold text-foreground">
              Related
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <li key={`${r.collection}/${r.slug}`}>
                  <Link
                    href={articleHref(r)}
                    className="flex h-full flex-col gap-1 rounded-[10px] border border-border-soft bg-surface p-4 hover:border-accent-border"
                  >
                    <span className="font-semibold text-foreground">{r.title}</span>
                    <span className="text-[14px] leading-snug text-muted-foreground">{r.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </div>
  );
}
