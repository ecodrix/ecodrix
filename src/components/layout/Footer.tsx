import Link from "next/link";
import { type GlyphName, Icon } from "@/components/icons";
import { LogoMark } from "@/components/layout/LogoMark";
import { CookiePrefsButton } from "@/components/legal/CookiePrefsButton";
import { Wordmark } from "@/components/marketing/wordmark";
import { buttonVariants } from "@/components/ui/button";
import { SoonControl } from "@/components/ui/soon";
import { StatusBadge } from "@/components/ui/status-badge";
import { getPlatformNav } from "@/lib/catalog";
import { COMPANY_NAV, INDUSTRY_NAV, PRIMARY_CTA, RESOURCE_NAV, SOCIALS, SUPPORT_EMAIL, WHATSAPP_CTA } from "@/lib/site";
import { cn } from "@/lib/utils";

/** The v1.0 job, enquiry to payment, each step linking to the part of ERIX that does it. */
const journey: { label: string; href: string; icon: GlyphName; ai?: boolean }[] = [
  { label: "Enquiry lands", href: "/platform/erix-connect", icon: "inbox" },
  { label: "AI replies", href: "/platform#agents", icon: "sparkles", ai: true },
  { label: "Deal and invoice", href: "/platform/erix-crm", icon: "square-kanban" },
  { label: "Follow-ups run", href: "/platform/erix-flow", icon: "workflow", ai: true },
];

const product = [
  { name: "ERIX Connect", href: "/platform/erix-connect" },
  { name: "ERIX CRM", href: "/platform/erix-crm" },
  { name: "ERIX Flow", href: "/platform/erix-flow" },
  { name: "AI agents", href: "/platform#agents" },
  { name: "How it fits together", href: "/platform" },
];

/** India-first facts, each true of ERIX today (DS product.md). */
const facts: { icon: GlyphName; text: string }[] = [
  { icon: "indian-rupee", text: "Billed in rupees" },
  { icon: "receipt", text: "GST invoices: CGST, SGST, IGST" },
  { icon: "clock", text: "Runs on IST" },
  { icon: "message-circle", text: "Your own WhatsApp, no markup" },
];

/** Developer pages, on this site (the API serves JSON only). */
const developer: { label: string; href: string; live?: boolean }[] = [
  { label: "API docs", href: "/docs" },
  { label: "System status", href: "/status", live: true },
  { label: "Changelog", href: "/changelog" },
  { label: "What's new", href: "/whats-new" },
];

const legal = [
  { label: "Terms", href: "/legal/terms" },
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Cookies", href: "/legal/cookie-policy" },
  { label: "WhatsApp policy", href: "/legal/whatsapp-policy" },
  { label: "Refunds", href: "/legal/refund-policy" },
  { label: "Security", href: "/legal/security" },
  { label: "All policies", href: "/legal" },
];

/** One edge gutter for the whole footer, wordmark included: full width, edges aligned. */
const gutter = "px-4 sm:px-6 lg:px-10";

const linkCls =
  "inline-flex min-h-8 items-center text-[14px] text-muted-foreground transition-colors hover:text-foreground";

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-sans text-[13px] font-semibold text-foreground">{title}</h2>
      <ul className="mt-3 space-y-0.5">{children}</ul>
    </div>
  );
}

/**
 * Site footer (redesigned 27 Oct 2026 with the founder), full width with one
 * edge gutter shared by every row and the wordmark. Light and quiet so
 * the page's own closing band keeps the spotlight; it ends on the giant
 * "ECODrIx" wordmark, light grey, which breaks into bright pixels under the
 * pointer.
 *
 * Top to bottom: brand block (promise, the two actions, the founder) beside
 * four link columns; the v1.0 job as one slim journey bar ending in the logo's
 * red dot ("Paid"); India-first facts; the legal bar; the wordmark.
 */
export async function Footer() {
  const also = (await getPlatformNav()).filter((m) => m.key === "storage");
  return (
    <footer className="mt-auto border-t border-border-soft bg-background">
      <nav id="site-map" aria-label="Site map" className={cn("scroll-mt-20", gutter)}>
        {/* ── Brand + columns ── */}
        <div className="grid gap-12 pt-14 pb-10 md:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-20">
          <div className="max-w-[420px]">
            <Link href="/" className="inline-flex items-center gap-2">
              <LogoMark className="size-7" />
              <span className="font-display text-[19px] font-bold tracking-[-0.02em] text-foreground">ERIX</span>
              <span className="text-[13px] text-subtle">by ECODrIx</span>
              <span className="sr-only">, home</span>
            </Link>
            <p className="mt-5 font-display text-[clamp(22px,2.2vw,26px)] leading-[1.2] font-bold tracking-[-0.02em] text-foreground">
              Every enquiry answered. Every follow-up done.
            </p>
            <p className="mt-3 text-[14.5px] leading-relaxed text-muted-foreground">
              One workspace for Indian businesses that sell on WhatsApp: one inbox, a CRM with GST invoices,
              automations, and AI agents for the routine replies.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link href={PRIMARY_CTA.href} className={cn(buttonVariants(), "group min-h-10! px-4! text-[14px]")}>
                {PRIMARY_CTA.label}
                <Icon
                  name="arrow-right"
                  size={15}
                  variant="line"
                  className="group-hover:translate-x-1 ease-in-out duration-300 transform transition-transform"
                />
              </Link>
              <a
                href={WHATSAPP_CTA.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "ghost" }), "min-h-10! px-4! text-[14px]")}
              >
                <Icon name="whatsapp" size={15} />
                WhatsApp us
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
            <Link
              href="/founder"
              className="group mt-7 flex items-center gap-3 group rounded-[12px] p-2 -m-2 transition-colors hover:bg-surface"
            >
              <span
                aria-hidden="true"
                className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-muted font-display text-[13px] font-bold text-accent"
              >
                DM
              </span>
              <span className="text-[13.5px] leading-snug text-muted-foreground">
                Built in Andhra Pradesh by <span className="font-semibold text-foreground">Dhanesh M</span>
                <span className="block text-accent">
                  Why ERIX exists
                  <Icon
                    name="arrow-right"
                    size={13}
                    variant="line"
                    className="ml-1 inline align-[-2px] group-hover:translate-x-1 ease-in-out duration-300 transform transition-transform"
                  />
                </span>
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            <Column title="Product">
              {product.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className={linkCls}>
                    {p.name}
                  </Link>
                </li>
              ))}
              {also.map((m) => (
                <li key={m.key} className="flex flex-wrap items-center gap-x-2">
                  {m.status === "soon" ? (
                    <SoonControl role="link" className={linkCls}>
                      {m.name}
                    </SoonControl>
                  ) : (
                    <Link href={m.href} className={linkCls}>
                      {m.name}
                    </Link>
                  )}
                  <StatusBadge status={m.status} isNew={m.isNew} plain />
                </li>
              ))}
            </Column>
            <Column title="Industries">
              {INDUSTRY_NAV.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className={linkCls}>
                    {i.name}
                  </Link>
                </li>
              ))}
            </Column>
            <Column title="Resources">
              {RESOURCE_NAV.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className={linkCls}>
                    {r.name}
                  </Link>
                </li>
              ))}
              {developer.map((d) => (
                <li key={d.href}>
                  <Link href={d.href} className={cn(linkCls, d.live && "relative")}>
                    {d.live && (
                      <span className="inline-flex size-2 absolute -left-3.5 shrink-0 items-center justify-center rounded-full bg-green-500 animate-pulse" />
                    )}
                    {d.label}
                  </Link>
                </li>
              ))}
            </Column>
            <Column title="Company">
              {COMPANY_NAV.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className={linkCls}>
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                {/* Wraps instead of pushing past a 320 px screen's two-column grid. */}
                <a href={`mailto:${SUPPORT_EMAIL}`} className={`${linkCls} [overflow-wrap:anywhere]`}>
                  {SUPPORT_EMAIL}
                </a>
              </li>
            </Column>
          </div>
        </div>

        {/* ── The job, end to end ── */}
        <div className="rounded-[16px] bg-surface p-2 shadow-[var(--shadow-xs)]">
          <ol aria-label="One job, end to end" className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-5">
            {journey.map((s, i) => (
              <li key={s.href} className="relative">
                <Link
                  href={s.href}
                  className="group flex h-full items-center gap-2.5 rounded-[12px] px-3 py-2.5 transition-colors hover:bg-background"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-[10px]",
                      s.ai ? "bg-[var(--ai-subtle)] text-ai" : "bg-accent-muted text-accent",
                    )}
                  >
                    <Icon name={s.icon} size={16} variant="duo" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11.5px] font-semibold text-subtle">Step {i + 1}</span>
                    <span className="block text-[14px] font-semibold text-foreground">{s.label}</span>
                  </span>
                  <Icon
                    name="arrow-right"
                    size={14}
                    variant="line"
                    className="ml-auto shrink-0 text-subtle transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </li>
            ))}
            <li className="flex items-center gap-2.5 rounded-[12px] px-3 py-2.5">
              <span
                aria-hidden="true"
                className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-[var(--error-subtle)]"
              >
                <span className="size-2.5 rounded-full bg-[var(--hero-dot)]" />
              </span>
              <span>
                <span className="block text-[11.5px] font-semibold text-subtle">The end of the job</span>
                <span className="block text-[14px] font-semibold text-foreground">Paid</span>
              </span>
            </li>
          </ol>
        </div>

        {/* ── India-first facts ── */}
        <ul aria-label="Made for India" className="mt-6 flex flex-wrap gap-x-6 gap-y-2.5">
          {facts.map((f) => (
            <li key={f.text} className="flex items-center gap-2 text-[13.5px] text-muted-foreground">
              <Icon name={f.icon} size={15} variant="line" className="text-accent" />
              {f.text}
            </li>
          ))}
        </ul>

        {/* ── Legal bar ── */}
        <div className="mt-10 flex flex-col gap-4 border-t border-border py-6 text-[13px] text-subtle lg:flex-row lg:items-center lg:justify-between">
          <p className="text-[13px] text-subtle">
            © {new Date().getFullYear()} ECODrIx. An Indian company, made in India.
          </p>
          <ul aria-label="Legal" className="flex flex-wrap gap-x-4 gap-y-2">
            {legal.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex min-h-6 items-center transition-colors hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <CookiePrefsButton className="inline-flex min-h-6 items-center transition-colors hover:text-foreground" />
            </li>
          </ul>
          <ul aria-label="ECODrIx elsewhere" className="flex flex-wrap gap-x-4 gap-y-2">
            {SOCIALS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-6 items-center gap-1 font-semibold text-muted-foreground transition-colors hover:text-foreground"
                >
                  {label}
                  <Icon name="arrow-up-right" size={12} variant="line" />
                  <span className="sr-only"> (ECODrIx, opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ── The wordmark closes the page, edge to edge across the screen ── */}
      <div className={cn("pb-3 sm:pb-4", gutter)}>
        <Wordmark />
      </div>
    </footer>
  );
}
