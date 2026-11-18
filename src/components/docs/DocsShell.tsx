import Link from "next/link";
import type { ReactNode } from "react";
import { DocsHeader } from "@/components/docs/DocsHeader";
import { DEV_NAV, DOC_SEARCH } from "@/lib/docs";

const FOOT = [
  ...DEV_NAV,
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/terms", label: "Terms" },
  { href: "/", label: "ecodrix.com" },
];

/**
 * The developer area's chrome (docs, changelog): one-row header and a
 * one-line footer, same theme as the brand site. Marketing pages use BrandShell.
 */
export function DocsShell({ children }: { children: ReactNode }) {
  return (
    <>
      <DocsHeader search={DOC_SEARCH} />
      <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col outline-none">
        {children}
      </main>
      <footer className="border-t border-border-soft">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-gutter py-4 text-[13.5px] text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ECODrIx. Made in India.</p>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
              {FOOT.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </footer>
    </>
  );
}
