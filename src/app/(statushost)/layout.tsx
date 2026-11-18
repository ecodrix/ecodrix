import type { ReactNode } from "react";
import { LogoMark } from "@/components/layout/LogoMark";

/**
 * status.ecodrix.com's own chrome: logo and a slim footer. Not the brand site's header.
 * The header floats, in white, over the page's navy band; help links live there (StatusPageView).
 */
export default function StatusHostLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="absolute inset-x-0 top-0 z-10">
        <div className="mx-auto flex h-14 w-full max-w-3xl items-center px-4 sm:px-6">
          <a
            href="/"
            className="flex items-center gap-2 rounded-[8px] focus-visible:outline-2 focus-visible:outline-white"
          >
            <LogoMark priority className="size-7" />
            <span className="font-display text-[18px] font-bold tracking-[-0.02em] text-white">ERIX</span>
            <span className="rounded-[6px] bg-white/12 px-1.5 py-0.5 text-[12px] font-semibold text-white">Status</span>
            <span className="sr-only">, status home</span>
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
