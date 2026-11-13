import { Badge } from "@/components/ui/badge";
import { type ModuleStatus, STATUS_LABEL } from "@/lib/site";
import { cn } from "@/lib/utils";

const tone = { live: "success", soon: "warning", invite: "primary" } as const;

const dot = { live: "bg-success", soon: "bg-warning", invite: "bg-accent" } as const;

/** Module status: colour plus the word, never colour alone. Available items show "New"
 *  for a while after going live (`isNew`, see lib/catalog) and no badge after that. Always drawn
 *  with the light tokens (`surface-light`), so it reads the same on dark.
 *  `plain`: just a small dot beside the word, no fill (dense lists). */
export function StatusBadge({
  status,
  plain,
  isNew,
  className,
}: {
  status: ModuleStatus;
  isNew?: boolean;
  plain?: boolean;
  className?: string;
}) {
  if (status === "live" && !isNew) return null;
  const label = status === "live" ? "New" : STATUS_LABEL[status];
  if (plain)
    return (
      <span
        className={cn(
          "surface-light inline-flex items-center gap-1.5 whitespace-nowrap text-[12.5px] text-subtle",
          className,
        )}
      >
        <span aria-hidden="true" className={cn("size-1.5 rounded-full", dot[status])} />
        {label}
      </span>
    );
  return (
    <Badge variant={tone[status]} className={cn("surface-light", className)}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {label}
    </Badge>
  );
}
