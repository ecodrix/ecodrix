import Link from "next/link";
import { DocsSearch } from "@/components/docs/DocsSearch";
import { Icon } from "@/components/icons";
import {
  articleHref,
  articlesIn,
  byKey,
  CONSOLE_SIGNUP,
  HELP_COLLECTIONS,
  HELP_SEARCH,
  helpHref,
  START_HERE,
} from "@/lib/help";
import { helpMetadata } from "@/lib/help/meta";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata = helpMetadata({
  title: "ERIX Help",
  description:
    "Step-by-step help for ERIX: set up your workspace, answer customers from one inbox, take bookings, teach your AI agent and run automations.",
  path: "/",
});

/** doc.ecodrix.com — the help center home: search, where to start, every collection. */
export default function HelpHome() {
  const start = START_HERE.map(byKey).filter((a) => a !== undefined);
  return (
    <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-14 px-gutter py-12 lg:py-16">
      <section className="flex flex-col gap-5">
        <p className="text-[13px] font-semibold tracking-[0.08em] text-accent uppercase">ERIX Help</p>
        <h1 className="max-w-[18ch] font-display text-[clamp(2.2rem,1.6rem+2.4vw,3.4rem)] font-extrabold tracking-[-0.025em] text-balance text-foreground">
          How can we help?
        </h1>
        <p className="max-w-[62ch] text-[17px] leading-relaxed text-muted-foreground">
          Plain, step-by-step guides with real screens from ERIX. The screens show a demo dental clinic, so your menus
          may say Customers, Buyers or Students where ours say Patients. An orange outline marks what to select.
        </p>
        <div className="max-w-[560px]">
          <DocsSearch entries={HELP_SEARCH} />
        </div>
      </section>

      <section aria-labelledby="start" className="flex flex-col gap-5">
        <h2 id="start" className="font-display text-[24px] font-bold tracking-[-0.01em] text-foreground">
          New to ERIX? Start here
        </h2>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {start.map((a, i) => (
            <li key={a.slug}>
              <Link
                href={articleHref(a)}
                className="flex h-full flex-col gap-2 rounded-[12px] border border-border-soft bg-surface p-5 transition-colors hover:border-accent-border"
              >
                <span className="grid size-7 place-items-center rounded-full bg-accent text-[13px] font-bold text-white tabular-nums">
                  {i + 1}
                </span>
                <span className="font-semibold text-foreground">{a.title}</span>
                <span className="text-[14px] leading-snug text-muted-foreground">{a.summary}</span>
              </Link>
            </li>
          ))}
        </ol>
        <p className="text-[14.5px] text-muted-foreground">
          No account yet?{" "}
          <a href={CONSOLE_SIGNUP} className="font-semibold text-accent underline-offset-2 hover:underline">
            Create one free
          </a>
          .
        </p>
      </section>

      <section aria-labelledby="topics" className="flex flex-col gap-5">
        <h2 id="topics" className="font-display text-[24px] font-bold tracking-[-0.01em] text-foreground">
          Browse by topic
        </h2>
        <ul className="grid gap-4 md:grid-cols-2">
          {HELP_COLLECTIONS.map((c) => {
            const list = articlesIn(c.slug);
            return (
              <li key={c.slug} className="flex flex-col gap-3 rounded-[12px] border border-border-soft bg-surface p-5">
                <Link href={helpHref(`/${c.slug}`)} className="group flex items-start gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-accent-muted text-accent">
                    <Icon name={c.icon} size={20} />
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="font-display text-[18px] font-bold text-foreground group-hover:text-accent">
                      {c.title}
                    </span>
                    <span className="text-[14px] leading-snug text-muted-foreground">{c.summary}</span>
                  </span>
                </Link>
                <ul className="flex flex-col border-t border-border-soft pt-2">
                  {list.slice(0, 4).map((a) => (
                    <li key={a.slug}>
                      <Link
                        href={articleHref(a)}
                        className="flex items-center justify-between gap-3 rounded-[8px] px-2 py-2 text-[14.5px] text-foreground hover:bg-sunken"
                      >
                        {a.title}
                        <Icon name="chevron-right" size={16} variant="line" className="shrink-0 text-subtle" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="text-[13px] text-subtle">
                  {list.length} {list.length === 1 ? "article" : "articles"}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="flex flex-col gap-2 rounded-[12px] border border-border-soft bg-sunken p-6">
        <h2 className="font-display text-[20px] font-bold text-foreground">Still stuck?</h2>
        <p className="max-w-[64ch] text-[15.5px] leading-relaxed text-muted-foreground">
          In ERIX, select the <strong className="text-foreground">?</strong> at the top of any page and raise a ticket
          from <strong className="text-foreground">Help &amp; support</strong>. It carries the page you were on, so we
          see what you saw. Or write to{" "}
          <span className="font-semibold text-foreground select-all">{SUPPORT_EMAIL}</span>. Building on ERIX?{" "}
          <a href="https://ecodrix.com/docs" className="font-semibold text-accent underline-offset-2 hover:underline">
            Read the developer docs
          </a>
          .
        </p>
      </section>
    </div>
  );
}
