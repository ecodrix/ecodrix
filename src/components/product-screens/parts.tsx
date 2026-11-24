/**
 * Building blocks for coded product scenes (server components, no hooks).
 * A scene is wrapped in the client `<Scene>` driver (components/motion);
 * parts appear by step with `className="scene-in" style={at(n)}`.
 * Everything here is decorative: the Scene gives screen readers one label.
 */

import type { CSSProperties, ReactNode } from "react";
import {
  Bell,
  BookOpen,
  Cable,
  Check,
  CheckCheck,
  ChevronRight,
  ChevronsUpDown,
  ClipboardCheck,
  Globe,
  Icon,
  type IconComponent,
  isBrandName,
  LayoutDashboard,
  MessageCircle,
  Search,
  Sparkles,
  Users,
  Workflow,
} from "@/components/icons";
import { LogoMark } from "@/components/layout/LogoMark";
import { cn } from "@/lib/utils";

/** Show a part from step `n` (and hide it again from step `until`). */
export const at = (n: number, until?: number) =>
  ({ "--at": n, ...(until === undefined ? {} : { "--until": until }) }) as CSSProperties;

/** ✓ sent → ✓✓ delivered → ✓✓ read (blue, heavier), WhatsApp's meaning. */
export function Ticks({ from }: { from: number }) {
  return (
    <span className="inline-grid *:[grid-area:1/1] text-subtle">
      <Check className="scene-in scene-pop size-3.5" style={at(from, from + 1)} />
      <CheckCheck className="scene-in scene-pop size-3.5" style={at(from + 1, from + 2)} />
      <CheckCheck className="scene-in scene-pop size-3.5 text-accent" strokeWidth={2.75} style={at(from + 2)} />
    </span>
  );
}

// Real brand marks in their own colours; channels without a brand keep our glyph.
const channels = {
  whatsapp: ["whatsapp", "WhatsApp"],
  instagram: ["instagram", "Instagram"],
  email: ["mail", "Email"],
  web: ["globe", "Website chat"],
  phone: ["phone", "Phone call"],
} as const;

/** Channel = mark plus the word. */
export function Channel({ name, className }: { name: keyof typeof channels; className?: string }) {
  const [glyph, label] = channels[name];
  return (
    <span className={cn("inline-flex items-center gap-1 text-[11px] text-muted-foreground", className)}>
      {isBrandName(glyph) ? <Icon name={glyph} size={12} /> : <Icon name={glyph} variant="line" size={12} />}
      {label}
    </span>
  );
}

const tones = {
  primary: "bg-accent-muted text-accent",
  success: "bg-success-subtle text-success",
  warning: "bg-warning-subtle text-warning",
  error: "bg-error-subtle text-error",
  ai: "bg-ai-subtle text-ai",
  neutral: "bg-background text-muted-foreground border border-border",
} as const;

/** Status chip: always colour plus a word (and an icon when given). */
export function Pill({
  tone = "neutral",
  icon: Icon,
  className,
  style,
  children,
}: {
  tone?: keyof typeof tones;
  icon?: IconComponent;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <span
      style={style}
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-[6px] px-2 py-0.5 text-[11px] font-semibold",
        tones[tone],
        className,
      )}
    >
      {Icon && <Icon aria-hidden="true" className="size-3" />}
      {children}
    </span>
  );
}

/** A chat bubble: customer on the left, business (or its AI agent) on the right. */
export function Bubble({
  side = "in",
  ai,
  show,
  time,
  ticks,
  source,
  className,
  children,
}: {
  side?: "in" | "out";
  ai?: boolean;
  /** `at()` style for when it appears. */
  show?: CSSProperties;
  time?: string;
  /** First step of its ✓ → ✓✓ → read ticks. */
  ticks?: number;
  /** Knowledge the answer came from. */
  source?: string;
  className?: string;
  children: ReactNode;
}) {
  const out = side === "out";
  return (
    <div
      style={show}
      className={cn(
        "max-w-[85%] rounded-[10px] border px-3 py-2 text-[13px] leading-snug text-foreground",
        show && "scene-in",
        out ? "ml-auto border-accent-border bg-accent-muted" : "border-border bg-surface",
        className,
      )}
    >
      {ai && (
        <span className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-ai">
          <Sparkles aria-hidden="true" className="size-3" /> AI agent
        </span>
      )}
      <p className="text-foreground">{children}</p>
      {(source || time) && (
        <span className="mt-1 flex items-center justify-end gap-1.5 text-[10px] text-subtle">
          {source && (
            <span className="mr-auto flex items-center gap-1">
              <BookOpen aria-hidden="true" className="size-3" /> From: {source}
            </span>
          )}
          {time}
          {ticks !== undefined && <Ticks from={ticks} />}
        </span>
      )}
    </div>
  );
}

/** "AI agent is typing" with bouncing dots. */
export function Typing({ show, className }: { show: CSSProperties; className?: string }) {
  return (
    <div
      style={show}
      className={cn(
        "scene-in ml-auto flex w-fit items-center gap-2 rounded-[10px] border border-accent-border bg-accent-muted px-3 py-2 text-[11px] font-semibold text-ai",
        className,
      )}
    >
      <Sparkles aria-hidden="true" className="size-3" /> AI agent is typing
      <span className="inline-flex items-center gap-[3px] text-ai">
        <i className="size-1.5 animate-dot rounded-[9999px] bg-current" />
        <i className="size-1.5 animate-dot rounded-[9999px] bg-current [animation-delay:0.15s]" />
        <i className="size-1.5 animate-dot rounded-[9999px] bg-current [animation-delay:0.3s]" />
      </span>
    </div>
  );
}

export type AppNav = "overview" | "ask" | "inbox" | "approvals" | "crm" | "flow" | "seo" | "ai" | "connect";

// The SaaS sidebar (saas lib/nav/unified.ts), in its order and groups:
// Overview, Erix Ask, Inbox, Approvals; Products (CRM, Flow, SEO, AI);
// Infrastructure (Connect).
const appNav: { group?: string; items: { key: AppNav; label: string; icon: IconComponent; ai?: boolean }[] }[] = [
  {
    items: [
      { key: "overview", label: "Overview", icon: LayoutDashboard },
      { key: "ask", label: "Erix Ask", icon: Sparkles, ai: true },
      { key: "inbox", label: "Inbox", icon: MessageCircle },
      { key: "approvals", label: "Approvals", icon: ClipboardCheck },
    ],
  },
  {
    group: "Products",
    items: [
      { key: "crm", label: "CRM", icon: Users },
      { key: "flow", label: "Flow", icon: Workflow },
      { key: "seo", label: "SEO", icon: Globe },
      { key: "ai", label: "AI", icon: Sparkles, ai: true },
    ],
  },
  { group: "Infrastructure", items: [{ key: "connect", label: "Connect", icon: Cable }] },
];

/**
 * The ERIX app shell in miniature (light theme), drawn from the real one: the
 * navy sidebar with the ERIX mark, the workspace, the same items and groups
 * and the current page marked; the top bar with the page trail, search, Erix
 * Ask, notifications and the signed-in person. Like the app, the sidebar
 * shows its labels when the frame is wide and folds to its icon rail when it
 * isn't (container queries, so the same scene fits a hero, a column or a
 * phone). `title` is the trail: "Connect / WhatsApp Business".
 */
export function AppFrame({
  title,
  nav,
  action,
  badges,
  workspace = "Your business",
  user = "Priya",
  className,
  children,
}: {
  title: string;
  nav: AppNav | null;
  action?: ReactNode;
  /** Counts on sidebar items, as the app shows unread chats. */
  badges?: Partial<Record<AppNav, ReactNode>>;
  workspace?: string;
  user?: string;
  className?: string;
  children: ReactNode;
}) {
  const crumbs = title.split(" / ");
  return (
    <div
      data-app-frame
      className={cn(
        // Inside a browser frame the app screen drops its own corners and shadow.
        "surface-light @container flex overflow-hidden rounded-[12px] bg-background text-foreground shadow-[var(--shadow-lg)] in-data-[browser]:rounded-none in-data-[browser]:[box-shadow:none]",
        className,
      )}
    >
      <div className="hidden w-11 shrink-0 flex-col bg-[var(--blue-900)] pb-2 @sm:flex @4xl:w-[184px]">
        <div className="flex h-11 shrink-0 items-center justify-center gap-2 @4xl:justify-start @4xl:px-3">
          <LogoMark className="w-[22px]" />
          <span className="hidden min-w-0 flex-1 truncate text-[12px] font-semibold text-white @4xl:block">
            {workspace}
          </span>
          <span className="hidden shrink-0 text-[var(--blue-200)] @4xl:flex">
            <ChevronsUpDown aria-hidden="true" className="size-3" />
          </span>
        </div>
        {appNav.map((g, gi) => (
          <div
            key={g.group ?? "top"}
            className={cn(
              "flex flex-col items-center gap-1 @4xl:items-stretch @4xl:gap-0.5 @4xl:px-2",
              gi > 0 && "mt-2.5 @4xl:mt-3",
            )}
          >
            {g.group && (
              <span className="hidden px-2 pb-0.5 text-[10px] font-semibold text-[var(--blue-200)] opacity-80 @4xl:block">
                {g.group}
              </span>
            )}
            {g.items.map((item) => {
              const on = item.key === nav;
              const badge = badges?.[item.key];
              return (
                <span
                  key={item.key}
                  className={cn(
                    "relative flex size-7 items-center justify-center rounded-[7px] text-[var(--blue-200)] @4xl:h-[26px] @4xl:w-auto @4xl:justify-start @4xl:gap-2 @4xl:px-2",
                    on && "bg-white/12 text-white",
                  )}
                >
                  {on && <span className="absolute -left-2 h-4 w-0.5 rounded-full bg-[var(--hero-dot)]" />}
                  <item.icon
                    aria-hidden="true"
                    className={cn("size-3.5 shrink-0", item.ai && "text-[var(--purple-300)]")}
                  />
                  <span className="hidden truncate text-[12px] font-medium @4xl:block">{item.label}</span>
                  {g.group && !badge && (
                    <span className="ml-auto hidden opacity-70 @4xl:flex">
                      <ChevronRight aria-hidden="true" className="size-3" />
                    </span>
                  )}
                  {badge !== undefined && (
                    <span className="absolute top-0.5 right-0.5 size-1.5 rounded-full bg-[var(--hero-dot)] @4xl:static @4xl:ml-auto @4xl:size-auto @4xl:min-w-4 @4xl:px-1 @4xl:text-center @4xl:text-[10px] @4xl:leading-4 @4xl:font-semibold @4xl:text-white">
                      <span className="hidden @4xl:inline">{badge}</span>
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        ))}
        <div className="mt-auto flex items-center justify-center gap-2 border-t border-white/8 pt-2 @4xl:justify-start @4xl:px-3">
          <Avatar name={user} className="size-6 bg-white/12 text-[9px] text-white" />
          <span className="hidden min-w-0 @4xl:block">
            <span className="block truncate text-[11.5px] leading-4 font-semibold text-white">{user}</span>
            <span className="block text-[10px] leading-3 text-[var(--blue-200)]">Owner</span>
          </span>
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border bg-surface px-3">
          <span className="flex min-w-0 flex-1 items-center gap-1.5 text-[12.5px]">
            {crumbs.map((c, i) =>
              i === crumbs.length - 1 ? (
                <span key={c} className="truncate font-semibold text-foreground">
                  {c}
                </span>
              ) : (
                <span key={c} className="hidden shrink-0 items-center gap-1.5 text-subtle @lg:flex">
                  {c}
                  <span className="text-border-strong">/</span>
                </span>
              ),
            )}
          </span>
          {action ?? (
            <span className="hidden items-center gap-1.5 rounded-[6px] border border-border bg-sunken px-2 py-1 text-[11px] text-subtle @3xl:flex">
              <Search aria-hidden="true" className="size-3" /> Search contacts, pages, actions
              <span className="rounded-[4px] border border-border bg-surface px-1 text-[9.5px] leading-3.5">⌘K</span>
            </span>
          )}
          <span className="hidden items-center gap-2.5 text-subtle @md:flex">
            <Sparkles aria-hidden="true" className="size-3.5 text-ai" />
            <span className="h-4 w-px bg-border" />
            <Bell aria-hidden="true" className="size-3.5" />
            <Avatar name={user} className="size-6 text-[9px]" />
          </span>
        </div>
        <div className="relative min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

/** Initials avatar used in the mocks. */
export function Avatar({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-muted font-display text-[11px] font-bold text-accent",
        className,
      )}
    >
      {initials}
    </span>
  );
}
