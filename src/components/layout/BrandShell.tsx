import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PlatformNavProvider } from "@/components/layout/platform-nav";
import { getPlatformNav } from "@/lib/catalog";

/**
 * The brand site's chrome (ecodrix.com marketing pages): the mega-menu header
 * and the full footer. Developer pages (docs, changelog, status) use DocsShell.
 */
export async function BrandShell({ children }: { children: ReactNode }) {
  // The header menus follow admin › Catalog like the footer does (ISR 300 s, static fallback).
  const platformNav = await getPlatformNav();
  return (
    <>
      <PlatformNavProvider nav={platformNav}>
        <Navbar />
      </PlatformNavProvider>
      <main id="main-content" tabIndex={-1} className="brand-main flex flex-1 flex-col outline-none">
        {children}
      </main>
      <Footer />
    </>
  );
}
