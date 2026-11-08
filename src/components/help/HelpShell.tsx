import type { ReactNode } from "react";
import { HelpHeader } from "@/components/help/HelpHeader";

const FOOT = [
  { href: "https://ecodrix.com", label: "ecodrix.com" },
  { href: "https://ecodrix.com/docs", label: "Developers" },
  { href: "https://ecodrix.com/status", label: "Status" },
  { href: "https://ecodrix.com/legal/privacy", label: "Privacy" },
  { href: "https://ecodrix.com/legal/terms", label: "Terms" },
];

/** ERIX Help's chrome (doc.ecodrix.com): one-row header, slim footer. */
export function HelpShell({ children }: { children: ReactNode }) {
  return (
    <>
      <HelpHeader />
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
                  <a href={l.href} className="transition-colors hover:text-foreground">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </footer>
    </>
  );
}
