import type { ReactNode } from "react";
import { LogoMark } from "@/components/layout/LogoMark";
import { WHATSAPP_CTA } from "@/lib/site";

/** status.ecodrix.com's own chrome: logo, one help link, slim footer. Not the brand site's header. */
export default function StatusHostLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="border-b border-border-soft bg-surface">
        <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4 sm:px-6">
          <a href="/" className="flex items-center gap-2">
            <LogoMark priority className="size-7" />
            <span className="font-display text-[18px] font-bold tracking-[-0.02em] text-foreground">ERIX</span>
            <span className="rounded-[6px] bg-accent-muted px-1.5 py-0.5 text-[12px] font-semibold text-accent">
              Status
            </span>
            <span className="sr-only">, status home</span>
          </a>
          <a
            href={WHATSAPP_CTA.href}
            target="_blank"
            rel="noopener"
            className="rounded-[8px] px-3 py-2 text-[14.5px] font-medium text-muted-foreground hover:bg-sunken hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
          >
            Get help<span className="sr-only"> (opens WhatsApp in a new tab)</span>
          </a>
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col outline-none">
        {children}
      </main>
      <footer className="border-t border-border-soft">
        <p className="mx-auto w-full max-w-3xl px-4 py-4 text-[13px] text-subtle sm:px-6">
          © {new Date().getFullYear()} ECODrIx.{" "}
          <a href="https://ecodrix.com" className="hover:text-foreground">
            ecodrix.com
          </a>
        </p>
      </footer>
    </>
  );
}
