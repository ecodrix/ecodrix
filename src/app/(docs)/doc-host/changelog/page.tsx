import { DocLead } from "@/components/docs/DocLead";
import { Rich } from "@/components/docs/Rich";
import { Icon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { helpMetadata } from "@/lib/help/meta";
import { RELEASES, type ReleaseBadge, versionAnchor } from "@/lib/resources/changelog";
import { STATUS_URL } from "@/lib/site";

/* doc.ecodrix.com/changelog: every ERIX release, newest first (the old What's new page is
   merged in). Each version has its own anchor (/changelog#v1-0-0) for linking from docs. */

export const metadata = helpMetadata({
  title: "ERIX changelog",
  description:
    "What changed in each ERIX release, from the first in August 2025 to 1.0: inbox, CRM, automations, AI agents and the API.",
  path: "/changelog",
  site: "ERIX changelog",
});

const BADGE: Record<ReleaseBadge, "primary" | "success" | "danger"> = {
  Launch: "primary",
  New: "success",
  Breaking: "danger",
};

export default function ChangelogPage() {
  const items = RELEASES.reduce((n, r) => n + r.items.length, 0);
  return (
    <div className="mx-auto flex w-full max-w-[880px] flex-col gap-10 px-gutter py-6 lg:py-10">
      <DocLead
        eyebrow="Releases · What's new"
        title="Changelog"
        text="What changed in each release, newest first, from the first in August 2025 to 1.0."
        facts={[
          { value: String(RELEASES.length), label: "releases" },
          { value: String(items), label: "changes listed" },
          { value: RELEASES[0].version, label: "latest version" },
          { value: RELEASES[0].date.split(" · ")[0], label: "latest release" },
        ]}
      />
      <p className="-mt-4 text-[14.5px] text-muted-foreground">
        See what is running right now on the{" "}
        <a href={STATUS_URL} className="font-semibold text-accent hover:underline">
          status page
        </a>
        .
      </p>

      <ol className="flex flex-col gap-10">
        {RELEASES.map((r) => (
          <li key={r.version} className="grid grid-cols-1 gap-4 md:grid-cols-[150px_minmax(0,1fr)] md:gap-8">
            <div className="md:sticky md:top-20 md:self-start">
              <h2 id={versionAnchor(r.version)} className="font-display text-[26px] tracking-[-0.02em]">
                <a href={`#${versionAnchor(r.version)}`} className="hover:text-accent">
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
            <ul className="flex min-w-0 flex-col gap-4 rounded-[16px] border border-border-soft bg-surface p-5 [overflow-wrap:anywhere] sm:p-6">
              {r.items.map((item) => (
                <li key={item.title} className="flex gap-3 text-[15px] leading-relaxed">
                  <Icon
                    name={item.icon}
                    size={18}
                    variant="duo"
                    className={
                      item.title.startsWith("Breaking") ? "mt-0.5 shrink-0 text-error" : "mt-0.5 shrink-0 text-accent"
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
  );
}
