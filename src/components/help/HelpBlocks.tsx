import Image from "next/image";
import { Rich } from "@/components/docs/Rich";
import { Icon } from "@/components/icons";
import type { HelpBlock, Shot } from "@/lib/help";
import { cn } from "@/lib/utils";

/** Pixel sizes of the screenshots: console 1280×800, public pages 1100×800, the chat widget 400×640. */
function size(src: string): { width: number; height: number } {
  if (src === "webchat-visitor") return { width: 400, height: 640 };
  if (src.startsWith("public-")) return { width: 1100, height: 800 };
  return { width: 1280, height: 800 };
}

/** A real console screen; select it to open the full-size image. */
export function Figure({ shot, className }: { shot: Shot; className?: string }) {
  const src = `/help/img/${shot.src}.jpg`;
  const { width, height } = size(shot.src);
  const narrow = width < 600;
  return (
    <figure className={cn("flex flex-col gap-2", className)}>
      <a
        href={src}
        target="_blank"
        rel="noopener"
        className={cn(
          "block overflow-hidden rounded-[10px] border border-border-soft bg-surface shadow-[var(--shadow-xs)] transition-shadow hover:shadow-[0_0_0_1px_var(--accent-border)]",
          narrow && "max-w-[300px]",
        )}
      >
        <Image
          src={src}
          alt={shot.alt}
          width={width}
          height={height}
          sizes="(min-width: 1024px) 720px, 100vw"
          className="h-auto w-full"
        />
        <span className="sr-only"> (opens the full-size image)</span>
      </a>
      {shot.caption && <figcaption className="text-[13.5px] text-subtle">{shot.caption}</figcaption>}
    </figure>
  );
}

const NOTE = {
  tip: { icon: "zap", cls: "border-accent-border bg-accent-muted", label: "Tip" },
  info: { icon: "info", cls: "border-border-soft bg-sunken", label: "Good to know" },
  warn: {
    icon: "triangle-alert",
    cls: "border-[color-mix(in_srgb,var(--warning)_40%,transparent)] bg-warning-subtle",
    label: "Before you do this",
  },
} as const;

/** A stable key from the block's own content (blocks are static copy). */
function keyOf(b: HelpBlock): string {
  switch (b.kind) {
    case "p":
    case "h":
    case "note":
      return `${b.kind}:${b.text}`;
    case "shot":
      return `shot:${b.shot.src}`;
    case "list":
      return `list:${b.items[0]}`;
    case "table":
      return `table:${b.head.join("|")}:${b.rows[0]?.join("|")}`;
    case "steps":
      return `steps:${b.steps[0]?.text}`;
  }
}

export function HelpBlocks({ blocks }: { blocks: HelpBlock[] }) {
  return (
    <div className="flex flex-col gap-6">
      {blocks.map((b) => {
        const i = keyOf(b);
        switch (b.kind) {
          case "p":
            return (
              <p key={i} className="text-[16px] leading-relaxed text-muted-foreground">
                <Rich text={b.text} />
              </p>
            );
          case "h":
            return (
              <h2 key={i} className="mt-2 font-display text-[21px] font-bold tracking-[-0.01em] text-foreground">
                {b.text}
              </h2>
            );
          case "shot":
            return <Figure key={i} shot={b.shot} />;
          case "list":
            return (
              <ul
                key={i}
                className="flex list-disc flex-col gap-2 pl-5 text-[16px] leading-relaxed text-muted-foreground"
              >
                {b.items.map((t) => (
                  <li key={t}>
                    <Rich text={t} />
                  </li>
                ))}
              </ul>
            );
          case "note": {
            const n = NOTE[b.tone];
            return (
              <aside key={i} className={cn("flex gap-3 rounded-[10px] border p-4", n.cls)}>
                <Icon name={n.icon} size={18} variant="line" className="mt-0.5 shrink-0 text-foreground" />
                <div className="flex flex-col gap-1 text-[15px] leading-relaxed text-muted-foreground">
                  <p className="font-semibold text-foreground">{b.title ?? n.label}</p>
                  <p>
                    <Rich text={b.text} />
                  </p>
                </div>
              </aside>
            );
          }
          case "table":
            return (
              <div key={i} className="overflow-x-auto rounded-[10px] border border-border-soft">
                <table className="w-full border-collapse text-left text-[14.5px]">
                  <thead className="bg-sunken text-[13px] text-subtle">
                    <tr>
                      {b.head.map((h) => (
                        <th key={h} scope="col" className="px-4 py-2.5 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r) => (
                      <tr key={r.join("|")} className="border-t border-border-soft align-top">
                        {r.map((c, j) => (
                          <td
                            key={b.head[j]}
                            className={cn("px-4 py-2.5", j === 0 ? "text-foreground" : "text-muted-foreground")}
                          >
                            <Rich text={c} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "steps":
            return (
              <ol key={i} className="flex flex-col gap-8">
                {b.steps.map((s, n) => (
                  <li key={s.text} className="grid grid-cols-[32px_minmax(0,1fr)] gap-x-4 gap-y-3">
                    <span
                      aria-hidden
                      className="grid size-8 place-items-center rounded-full bg-accent text-[14px] font-bold text-white tabular-nums"
                    >
                      {n + 1}
                    </span>
                    <p className="pt-1 text-[16px] leading-relaxed text-muted-foreground">
                      <span className="sr-only">Step {n + 1}. </span>
                      <Rich text={s.text} />
                    </p>
                    {s.shot && <Figure shot={s.shot} className="col-start-2" />}
                  </li>
                ))}
              </ol>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
