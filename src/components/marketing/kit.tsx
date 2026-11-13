/**
 * The ERIX marketing kit (DS `components/src/marketing/marketing.jsx`),
 * ported as server components on the site's tokens. Styles are inline
 * Tailwind; custom values (type scale, layout, brand colours, animations) are
 * @theme tokens in globals.css. Interactive parts live in seg-tabs.tsx (client).
 *
 *   <MkHero>        navy band, swoosh + red dot, BlurText h1, product visual
 *   <MkSection>     tone plain | subtle | navy, h2 + lead, content
 *   <BrowserFrame>  <PhoneFrame>   real product UI, never a screenshot
 *   <PainGrid> <FeatureSplit> <Steps> <Faq> <CtaBand>
 *   <TrustBar>      "Works with" integrations, as a marquee
 *   <PrimaryCta> <WhatsAppCta>     the two calls to action
 *
 * Product visuals rise in once with <Reveal> (framer-motion) as they scroll
 * into view; headings and body text never animate (design system v13).
 */

import Link from "next/link";
import type { ReactNode } from "react";
import { type GlyphName, Icon, type IconName, isBrandName } from "@/components/icons";
import { BlurText } from "@/components/motion/blur-text";
import { Reveal } from "@/components/motion/motion";
import { Spotlight } from "@/components/motion/spotlight";
import { Marquee } from "@/components/motion/surface";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { SOON_BUTTON, SoonControl } from "@/components/ui/soon";
import { PRIMARY_CTA, WHATSAPP_CTA } from "@/lib/site";
import { cn } from "@/lib/utils";

/* ── Calls to action ─────────────────────────────────────────────────── */

/** `disabled`: the item this button is about is not available yet (see ui/soon). */
export function PrimaryCta({ lg, className, disabled }: { lg?: boolean; className?: string; disabled?: boolean }) {
  if (disabled)
    return (
      <SoonControl
        role="button"
        hint
        className={cn(buttonVariants({ size: lg ? "lg" : "default" }), SOON_BUTTON, className)}
      >
        {PRIMARY_CTA.label}
      </SoonControl>
    );
  return (
    <Link href={PRIMARY_CTA.href} className={cn(buttonVariants({ size: lg ? "lg" : "default" }), "group", className)}>
      {PRIMARY_CTA.label}
      <Icon
        name="arrow-right"
        role="presentation"
        variant="line"
        size={16}
        className="group-hover:translate-x-1 ease-in-out duration-150 transition-transform transform"
      />
    </Link>
  );
}

export function WhatsAppCta({ lg, className, disabled }: { lg?: boolean; className?: string; disabled?: boolean }) {
  if (disabled)
    return (
      <SoonControl
        role="button"
        hint
        className={cn(buttonVariants({ variant: "ghost", size: lg ? "lg" : "default" }), SOON_BUTTON, className)}
      >
        <Icon name="whatsapp" size={16} />
        {WHATSAPP_CTA.label}
      </SoonControl>
    );
  return (
    <Link
      role="button"
      href={WHATSAPP_CTA.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonVariants({ variant: "ghost", size: lg ? "lg" : "default" }), className)}
    >
      <Icon name="whatsapp" size={16} />
      {WHATSAPP_CTA.label}
      <span className="sr-only"> (opens in a new tab)</span>
    </Link>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────── */

/** The navy band's one brand flourish: the logo's swoosh and red dot. */
function HeroMotif() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 size-full"
      viewBox="0 0 1200 520"
      preserveAspectRatio="xMaxYMax slice"
      aria-hidden="true"
    >
      <path
        className="fill-none stroke-hero-swoosh opacity-[0.28] [stroke-linecap:round] [stroke-width:56]"
        d="M180 760 C 520 300 900 220 1320 250"
      />
      <circle className="fill-hero-dot max-[900px]:hidden" cx="1010" cy="438" r="26" />
    </svg>
  );
}

/** Lead, CTAs and facts fade in after the headline; `--d` sets each delay. */
const fadeIn = "motion-safe:animate-fade motion-safe:[animation-delay:var(--d,420ms)]";

/**
 * Hero: the promise (BlurText h1, sharpens in), the lead and CTAs fading in
 * after it, a few facts, and the product as the image. Text paints from the
 * HTML with no JS.
 */
export function MkHero({
  top,
  title,
  lead,
  actions,
  facts = [],
  visual,
  className,
}: {
  /** Above the h1: breadcrumbs, a status line. */
  top?: ReactNode;
  title: string;
  lead: ReactNode;
  actions?: ReactNode;
  facts?: { icon: GlyphName; label: string }[];
  visual?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("band-navy relative overflow-hidden pt-[clamp(48px,7vw,45px)]", className)}>
      <HeroMotif />
      <div className="relative mx-auto grid w-full max-w-wrap grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] items-end gap-[clamp(32px,5vw,64px)] px-gutter max-[900px]:grid-cols-[1fr]">
        <div className="pb-[clamp(48px,7vw,45px)] max-[900px]:pb-0">
          {top}
          <BlurText as="h1" text={title} className="font-display text-mk-hero text-balance text-white" />
          <p
            className={`mt-[22px] max-w-[34em] font-sans text-mk-hero-lead text-pretty text-[rgba(255,255,255,0.78)] ${fadeIn}`}
          >
            {lead}
          </p>
          {actions && (
            <div
              className={`mt-[30px] flex flex-wrap gap-2.5 max-[900px]:*:flex-[1_1_100%] ${fadeIn}`}
              style={{ "--d": "520ms" } as React.CSSProperties}
            >
              {actions}
            </div>
          )}
          {facts.length > 0 && (
            <ul
              className={`mt-[26px] flex list-none flex-wrap gap-x-[22px] gap-y-2 ${fadeIn}`}
              style={{ "--d": "620ms" } as React.CSSProperties}
            >
              {facts.map((f) => (
                <li
                  key={f.label}
                  className="inline-flex items-center gap-[7px] font-sans text-sm/5 font-medium text-[rgba(255,255,255,0.78)]"
                >
                  <Icon name={f.icon} variant="line" size={16} className="text-on-navy-link" />
                  {f.label}
                </li>
              ))}
            </ul>
          )}
        </div>
        {visual && (
          <div className="relative self-end motion-safe:animate-rise motion-safe:[animation-delay:var(--d,200ms)]">
            {visual}
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Frames ──────────────────────────────────────────────────────────── */

export function BrowserFrame({
  url = "console.ecodrix.com",
  light,
  className,
  children,
}: {
  url?: string;
  /** On a light section: fully rounded with a soft shadow. */
  light?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      data-browser=""
      className={cn(
        "surface-light overflow-hidden bg-background",
        light
          ? "rounded-[14px] shadow-lg"
          : "rounded-[14px_14px_0_0] shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_40px_80px_-24px_rgba(4,13,66,0.55)]",
        className,
      )}
    >
      <div className="flex h-9 items-center gap-1.5 border-b border-b-border-soft bg-surface px-3.5" aria-hidden="true">
        <i className="size-[9px] rounded-[50%] bg-border-strong opacity-60" />
        <i className="size-[9px] rounded-[50%] bg-border-strong opacity-60" />
        <i className="size-[9px] rounded-[50%] bg-border-strong opacity-60" />
        <span className="mx-auto inline-flex items-center gap-[5px] rounded-sm bg-sunken px-3 py-[3px] font-sans text-[11.5px]/4 font-medium text-subtle">
          <Icon name="lock" variant="line" size={11} />
          {url}
        </span>
      </div>
      {/* An app screen inside a browser window drops its own frame. */}
      <div className="p-3.5 [&:has(>.scene_[data-app-frame])]:p-0 [&:has(>[data-app-frame])]:p-0">{children}</div>
    </div>
  );
}

export function PhoneFrame({
  head,
  className,
  children,
}: {
  head?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "surface-light relative w-[268px] rounded-[34px] bg-[#0d1020] p-2.5 shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_30px_60px_-20px_rgba(4,13,66,0.6)]",
        className,
      )}
    >
      <div
        className="absolute top-3.5 left-1/2 z-2 -ml-[38px] h-5 w-[76px] rounded-[12px] bg-[#0d1020]"
        aria-hidden="true"
      />
      {head && (
        <div className="flex items-center gap-2 rounded-[26px_26px_0_0] border-b border-b-border-soft bg-surface px-3.5 pt-[34px] pb-2.5">
          {head}
        </div>
      )}
      <div className="overflow-hidden rounded-[0_0_26px_26px] bg-background px-2.5 pt-3 pb-4">{children}</div>
    </div>
  );
}

/* ── Sections ────────────────────────────────────────────────────────── */

export function MkSection({
  id,
  tone = "plain",
  kicker,
  title,
  lead,
  center,
  className,
  children,
}: {
  id?: string;
  tone?: "plain" | "subtle" | "navy";
  kicker?: ReactNode;
  title?: ReactNode;
  lead?: ReactNode;
  center?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      data-tone={tone === "subtle" ? "subtle" : undefined}
      className={cn(
        "py-section scroll-mt-20",
        tone === "subtle" && "bg-background",
        tone === "navy" && "band-navy",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-wrap px-gutter">
        {(title || lead) && (
          <div className={cn("mb-[clamp(36px,5vw,56px)]", center && "text-center")}>
            {kicker && <div className="mb-3">{kicker}</div>}
            {title && (
              <h2 id={headingId} className="font-display text-mk-h2 text-foreground text-balance">
                {title}
              </h2>
            )}
            {lead && (
              <p className="mt-4 max-w-[60ch] font-sans text-mk-lead text-muted-foreground text-pretty">{lead}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/** Where leads go missing today. */
export function PainGrid({ items }: { items: { icon: GlyphName; title: string; text: string }[] }) {
  return (
    <ul className="grid list-none grid-cols-3 gap-4 max-[900px]:grid-cols-[1fr]">
      {items.map((it) => (
        <Spotlight as="li" key={it.title} className="rounded-xl bg-surface px-6 py-[26px] shadow-card">
          <span className="mb-[18px] grid size-11 place-items-center rounded-lg bg-error-subtle text-error">
            <Icon name={it.icon} size={20} variant="duo" />
          </span>
          <h3 className="font-sans text-lg/6 font-[650] tracking-[-0.01em]">{it.title}</h3>
          <p className="mt-2 font-sans text-[15px]/[1.6] text-muted-foreground">{it.text}</p>
        </Spotlight>
      ))}
    </ul>
  );
}

/** One feature: copy on one side, real product UI on the other. */
export function FeatureSplit({
  module,
  icon = "sparkles",
  ai,
  title,
  children,
  points = [],
  link,
  visual,
  flip,
  headingLevel = "h3",
}: {
  module?: string;
  icon?: GlyphName;
  ai?: boolean;
  title: string;
  children?: ReactNode;
  points?: string[];
  link?: { href: string; label: string };
  visual: ReactNode;
  flip?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const H = headingLevel;
  return (
    <div
      data-split=""
      className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] items-center gap-[clamp(32px,6vw,88px)] max-[900px]:grid-cols-[1fr] [[data-split]+&]:mt-[clamp(64px,9vw,120px)]"
    >
      <div className={cn(flip && "order-2 max-[900px]:order-0")}>
        {module && (
          <span
            className={cn(
              "mb-3.5 inline-flex items-center gap-[7px] font-sans text-[13.5px]/[18px] font-[650]",
              ai ? "text-ai" : "text-accent",
            )}
          >
            <Icon name={icon} size={14} variant="solid" />
            {module}
          </span>
        )}
        <H className="font-display text-mk-h3 text-foreground text-balance">{title}</H>
        {children && (
          <p className="mt-3 max-w-[56ch] font-sans text-mk-body text-muted-foreground text-pretty">{children}</p>
        )}
        {points.length > 0 && (
          <ul className="mt-5 grid list-none gap-2.5 [&_.erix-icon]:mt-[3px] [&_.erix-icon]:text-accent">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-2.5 font-sans text-[15px]/[22px] font-medium text-foreground">
                <Icon name="check" size={16} strokeWidth={2.2} variant="line" />
                {p}
              </li>
            ))}
          </ul>
        )}
        {link && (
          <Link
            href={link.href}
            className="group mt-6 inline-flex items-center gap-1.5 font-sans text-[15px]/5 font-[650] text-accent hover:underline hover:underline-offset-3 motion-safe:focus-visible:animate-focus"
          >
            {link.label}
            <Icon name="arrow-right" size={14} variant="line" />
          </Link>
        )}
      </div>
      <Reveal className="relative rounded-3xl bg-background p-[clamp(14px,3vw,32px)] shadow-[inset_0_0_0_1px_var(--border-soft)] in-data-[tone=subtle]:bg-surface">
        {visual}
      </Reveal>
    </div>
  );
}

/** A real sequence, so the numbers are earned. */
export function Steps({ items }: { items: { title: string; text: string; time?: string }[] }) {
  return (
    <ol className="grid list-none grid-cols-3 max-[900px]:grid-cols-[1fr]">
      {items.map((s, i) => (
        <li
          key={s.title}
          // Phones: the steps stack, each divided from the one above.
          className="relative pr-7 not-first:border-l not-first:border-l-border-soft not-first:pl-7 max-[900px]:[border-left:0]! max-[900px]:[border-top:1px_solid_var(--border-soft)] max-[900px]:px-0! max-[900px]:py-[22px] max-[900px]:first:[border-top:0] max-[900px]:first:pt-0"
        >
          <span className="mb-[18px] grid size-9 place-items-center rounded-full bg-accent font-sans text-[15px]/none font-bold text-white shadow-[0_0_0_6px_var(--accent-dim)]">
            {i + 1}
          </span>
          <h3 className="font-sans text-lg/6 font-[650]">{s.title}</h3>
          <p className="mt-2 font-sans text-[15px]/[1.6] text-muted-foreground">{s.text}</p>
          {s.time && (
            <span className="mt-3.5 inline-flex items-center gap-1.5 font-sans text-[13px]/[18px] font-semibold text-subtle">
              <Icon name="clock" size={13} variant="line" />
              {s.time}
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

/** FAQ on the shadcn Accordion: the first answer starts open, and every
 *  answer is in the server HTML (find-in-page, crawlers, no-JS). */
export function Faq({ items, className }: { items: { q: string; a: string }[]; className?: string }) {
  return (
    <Accordion type="single" collapsible defaultValue={items[0]?.q} className={cn("max-w-full border-t", className)}>
      {items.map((q) => (
        <AccordionItem key={q.q} value={q.q}>
          <AccordionTrigger icon={<Icon name="plus" size={18} variant="line" />}>{q.q}</AccordionTrigger>
          <AccordionContent className="max-w-[68ch] pr-12 font-sans text-[15.5px]/[1.65] text-muted-foreground">
            {q.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

/** Closing navy band: one action plus WhatsApp, or a form beside the copy. */
export function CtaBand({
  id,
  title,
  lead,
  actions,
  aside,
}: {
  id?: string;
  title: string;
  lead?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-title` : undefined}
      className="band-navy scroll-mt-20 py-[clamp(56px,7vw,96px)]"
    >
      <svg
        className="pointer-events-none absolute right-0 bottom-0 h-full w-[56%]"
        viewBox="0 0 600 300"
        aria-hidden="true"
      >
        <path
          className="fill-none stroke-hero-swoosh opacity-[0.28] [stroke-linecap:round] [stroke-width:34]"
          d="M-40 360 C 160 120 380 70 640 90"
        />
        <circle className="fill-hero-dot" cx="566" cy="94" r="12" />
      </svg>
      <div
        className={cn(
          "relative mx-auto grid w-full max-w-wrap items-center gap-10 px-gutter",
          aside && "lg:grid-cols-[1fr_1.05fr] lg:gap-16",
        )}
      >
        <div>
          <h2 id={id ? `${id}-title` : undefined} className="font-display text-mk-cta text-balance text-white">
            {title}
          </h2>
          {lead && (
            <div className="mt-4 max-w-[46ch] font-sans text-[17px]/[1.6] text-[rgba(255,255,255,0.78)]">{lead}</div>
          )}
          {actions && <div className="mt-[30px] flex flex-wrap gap-2.5 max-[900px]:*:flex-[1_1_100%]">{actions}</div>}
        </div>
        {aside}
      </div>
    </section>
  );
}

/**
 * "Works with": integrations as an endless row (design system v13 TrustBar
 * with marquee). Third-party marks in their real colours, our own channels
 * as glyphs, all through <Icon>. Only integrations that are live today; one per page at most.
 */
export function TrustBar({
  label = "Works with",
  items,
}: {
  label?: string;
  items: { label: string; icon: IconName }[];
}) {
  // Short lists repeat once inside the set so the row is wider than the
  // screen; the repeat is hidden from assistive tech and under reduced motion.
  const row = (dup: boolean) =>
    items.map((it) => (
      <li
        key={`${dup ? "d" : ""}${it.label}`}
        className={cn(
          "inline-flex items-center gap-2 font-sans text-[15px]/5 font-semibold whitespace-nowrap text-muted-foreground",
          dup && "motion-reduce:hidden!",
        )}
        aria-hidden={dup || undefined}
      >
        {isBrandName(it.icon) ? (
          <Icon name={it.icon} size={18} />
        ) : (
          <Icon name={it.icon} size={18} variant="duo" className="text-accent" />
        )}
        {it.label}
      </li>
    ));
  return (
    <div className="flex items-center gap-6 py-[22px] max-sm:flex-col max-sm:items-stretch max-sm:gap-3">
      <span className="flex-none font-sans text-[13px]/[18px] font-semibold text-subtle">{label}</span>
      <Marquee duration={36} label={label}>
        <ul className="flex list-none flex-wrap gap-x-7 gap-y-2.5">
          {row(false)}
          {row(true)}
        </ul>
      </Marquee>
    </div>
  );
}
