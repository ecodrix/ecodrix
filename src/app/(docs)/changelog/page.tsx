import Link from "next/link";
import { Rich } from "@/components/docs/Rich";
import { Icon } from "@/components/icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { RELEASES, type ReleaseBadge } from "@/lib/changelog";
import { getBreadcrumbSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

/* ──────────────────────────────────────────────────────────────────────
   /changelog — every ERIX release, newest first. Each version has its own
   anchor (/changelog#v0-9-0) for linking from docs and posts.
─────────────────────────────────────────────────────────────────────── */

export const metadata = pageMetadata({
  title: "ERIX changelog",
  description:
    "What changed in each ERIX release, from the first in August 2025 to 1.0: inbox, CRM, automations, AI agents and the API.",
  path: "/changelog",
});

const BADGE: Record<ReleaseBadge, "primary" | "success" | "danger"> = {
  Launch: "primary",
  New: "success",
  Breaking: "danger",
};

const anchor = (version: string) => version.replace(/\./g, "-");

export default function ChangelogPage() {
  return (
    <div className="w-full">
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Changelog", url: "/changelog" },
        ])}
      />
      <section data-tone="subtle" className="bg-background pt-6 pb-[clamp(56px,7vw,96px)]">
        <div className="mx-auto w-full max-w-6xl px-gutter">
          <h1 className="text-[clamp(36px,5vw,54px)] leading-[1.05] tracking-[-0.035em]">Changelog</h1>
          <p className="mt-4 max-w-[60ch] text-[clamp(16px,1.5vw,18px)] leading-relaxed text-muted-foreground">
            What changed in each release, from the first in August 2025 to 1.0. See what's running right now on the{" "}
            <Link href="/status" className="font-semibold text-accent hover:underline">
              status page
            </Link>
            .
          </p>

          <ol className="mt-12 flex flex-col gap-10">
            {RELEASES.map((r) => (
              <li
                key={r.version}
                id={anchor(r.version)}
                className="grid scroll-mt-24 grid-cols-1 gap-4 md:grid-cols-[180px_minmax(0,1fr)] md:gap-8"
              >
                <div className="md:sticky md:top-24 md:self-start">
                  <h2 className="font-display text-[26px] tracking-[-0.02em]">
                    <a href={`#${anchor(r.version)}`} className="hover:text-accent">
                      {r.version}
                    </a>
                  </h2>
                  <p className="mt-1 text-[14px] text-muted-foreground">{r.date}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {r.badges.map((b) => (
                      <Badge key={b} variant={BADGE[b]}>
                        {b}
                      </Badge>
                    ))}
                  </div>
                </div>
                <ul className="flex min-w-0 flex-col gap-4 rounded-[16px] bg-surface p-5 shadow-[var(--shadow-card)] [overflow-wrap:anywhere] sm:p-6">
                  {r.items.map((item) => (
                    <li key={item.title} className="flex gap-3 text-[15px] leading-relaxed">
                      <Icon
                        name={item.icon}
                        size={18}
                        variant="duo"
                        className={
                          item.title.startsWith("Breaking")
                            ? "mt-0.5 shrink-0 text-error"
                            : "mt-0.5 shrink-0 text-accent"
                        }
                      />
                      <span>
                        <strong className="font-semibold text-foreground">{item.title}.</strong>{" "}
                        <span className="text-muted-foreground">
                          <Rich text={item.text} />
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
