import Link from "next/link";
import { Icon } from "@/components/icons";
import type { PlatformNavItem } from "@/components/layout/platform-nav";
import { SoonControl } from "@/components/ui/soon";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";

/** A module row on /platform and /about: a link when available, a disabled "Coming soon" row when not. */
export function ModuleRow({ m }: { m: PlatformNavItem }) {
  const body = (
    <>
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-[11px]",
          "ai" in m ? "bg-ai-subtle text-ai" : "bg-accent-muted text-accent",
        )}
      >
        <Icon name={m.icon} size={20} variant="duo" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2 text-[17px] font-semibold text-foreground">
          {m.name}
          <StatusBadge status={m.status} isNew={m.isNew} />
        </span>
        <span className="mt-1 block text-[15px] text-muted-foreground">{m.summary}</span>
      </span>
    </>
  );
  const row = "-mx-3 flex items-start gap-4 rounded-[12px] px-3 py-5";
  if (m.status === "soon")
    return (
      <SoonControl role="link" className={row}>
        {body}
      </SoonControl>
    );
  return (
    <Link href={m.href} className={cn(row, "group hover:bg-hover")}>
      {body}
      <Icon name="arrow-right" size={16} variant="line" className="mt-3 shrink-0 text-accent" />
    </Link>
  );
}
