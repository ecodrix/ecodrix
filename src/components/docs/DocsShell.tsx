import type { ReactNode } from "react";
import { DocsFrame } from "@/components/docs/DocsFrame";
import { ALL_SEARCH, buildDocsNav } from "@/lib/docs/nav";
import { STATUS_URL } from "@/lib/site";

const FOOT = [
  { href: "https://ecodrix.com", label: "ecodrix.com" },
  { href: STATUS_URL, label: "Status" },
  { href: "https://ecodrix.com/legal/privacy", label: "Privacy" },
  { href: "https://ecodrix.com/legal/terms", label: "Terms" },
];

const NAV = buildDocsNav();

/** The doc host's chrome (doc.ecodrix.com): Help, API reference and changelog share it. */
export function DocsShell({ children }: { children: ReactNode }) {
  return (
    <DocsFrame
      nav={NAV}
      search={ALL_SEARCH}
      footer={
        <footer className="border-t border-border-soft">
          <div className="flex flex-col gap-3 px-gutter py-4 text-[13.5px] text-subtle sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} ECODrIx. Made in India.</p>
            <nav aria-label="Footer">
              <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
                {FOOT.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="transition-colors hover:text-foreground">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </footer>
      }
    >
      {children}
    </DocsFrame>
  );
}
