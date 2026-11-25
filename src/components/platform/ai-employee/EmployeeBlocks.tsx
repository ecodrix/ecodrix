import { Icon } from "@/components/icons";
import { type ChannelPage, EXAMPLE_NOTE, type IconItem, type Item } from "@/lib/platform/employee-pages";
import { cn } from "@/lib/utils";

type Example = ChannelPage["example"];

const SPEAKER = {
  customer: "Customer",
  ai: "AI employee",
  team: "Your team",
  draft: "AI draft",
  system: "Note",
} as const;

/** One turn. Who speaks is text first (screen readers), colour second. */
function Turn({ m, customer }: { m: Example["messages"][number]; customer: string }) {
  if (m.from === "system") {
    return (
      <p className="mx-auto w-fit max-w-full rounded-lg bg-sunken px-3 py-1.5 text-center text-[12.5px]/[1.5] text-muted-foreground">
        <span className="sr-only">{SPEAKER.system}: </span>
        {m.label && <span className="font-semibold text-foreground">{m.label}. </span>}
        {m.text}
      </p>
    );
  }
  const out = m.from !== "customer";
  const draft = m.from === "draft";
  return (
    <div
      className={cn(
        "max-w-[92%] rounded-xl border px-3.5 py-2.5 text-[14.5px]/[1.55] text-foreground sm:max-w-[88%]",
        out ? "ml-auto" : "mr-auto",
        m.from === "customer" && "border-border bg-background",
        m.from === "ai" && "border-accent-border bg-accent-muted",
        m.from === "team" && "border-border bg-sunken",
        draft && "border-dashed border-[var(--purple-500)] bg-background",
      )}
    >
      <span
        className={cn(
          "mb-1 flex items-center gap-1.5 text-[12px] font-semibold",
          m.from === "ai" || draft ? "text-ai" : "text-muted-foreground",
        )}
      >
        {(m.from === "ai" || draft) && <Icon name="sparkles" size={12} variant="line" />}
        {m.from === "customer" ? <span className="sr-only">{customer}:</span> : SPEAKER[m.from]}
        {m.from === "customer" && <span aria-hidden="true">{customer.split(",")[0]}</span>}
        {draft && <span className="font-normal text-muted-foreground"> · waiting in your Inbox</span>}
      </span>
      <p>{m.text}</p>
      {m.action && (
        <p className="mt-2 rounded-md bg-sunken px-2.5 py-1.5 text-[12.5px] text-muted-foreground">
          <span className="font-semibold text-foreground">Proposed action: </span>
          {m.action}
        </p>
      )}
      {m.source && (
        <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-subtle">
          <Icon name="book-open" size={12} variant="line" /> Based on: {m.source}
        </p>
      )}
    </div>
  );
}

const Badge = ({ n }: { n: number }) => (
  <span
    aria-hidden="true"
    // The transparent border turns into a visible one in forced-colors mode, where the fill is dropped.
    className="inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-transparent bg-accent text-[12px] font-semibold text-white"
  >
    {n}
  </span>
);

/** An annotated example: each turn with its side notes (beside it on wide screens, under it on phones). */
export function ExampleChat({ example, compact }: { example: Example; compact?: [number, number] }) {
  const messages = compact ? example.messages.slice(...compact) : example.messages;
  let n = 0;
  return (
    <figure className="m-0 overflow-hidden rounded-2xl border border-border-soft bg-surface">
      <figcaption className="flex items-center gap-2 border-b border-border-soft px-4 py-3 text-[13.5px] font-semibold text-foreground">
        <Icon name="message-circle" size={16} variant="line" className="text-accent" />
        {example.bar}
      </figcaption>
      <ol className="m-0 grid list-none gap-4 p-4 sm:p-5">
        {messages.map((m, i) => {
          const notes = compact ? [] : example.notes.filter((x) => x.at === i + 1);
          return (
            <li
              key={`${m.from}-${m.text}`}
              className={cn(
                "grid gap-3",
                notes.length > 0 && "md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-start md:gap-8",
              )}
            >
              <Turn m={m} customer={example.customer} />
              {notes.map((note) => {
                n += 1;
                return (
                  <div
                    key={note.title}
                    className="flex gap-3 border-l-2 border-accent-border pl-3.5 md:col-start-2 md:row-start-1"
                  >
                    <Badge n={n} />
                    <div>
                      <h3 className="font-sans text-[14.5px] font-semibold">
                        <span className="sr-only">Annotation: </span>
                        {note.title}
                      </h3>
                      <p className="mt-1 text-[13.5px]/[1.55] text-muted-foreground sm:text-[14px]/[1.6]">
                        {note.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </li>
          );
        })}
      </ol>
      {!compact && <p className="border-t border-border-soft px-4 py-2.5 text-[12.5px] text-subtle">{EXAMPLE_NOTE}</p>}
    </figure>
  );
}

/** The path of one message: numbered steps joined by a rail, down on phones and across from lg. */
export function Path({ steps }: { steps: NonNullable<ChannelPage["path"]> }) {
  return (
    <ol
      style={{ "--n": steps.length } as React.CSSProperties}
      className="m-0 grid list-none lg:grid-cols-[repeat(var(--n),minmax(0,1fr))]"
    >
      {steps.map((s, i) => (
        <li
          key={s.title}
          className="relative grid grid-cols-[40px_1fr] gap-4 pb-8 last:pb-0 lg:grid-cols-1 lg:content-start lg:gap-3 lg:pr-6 lg:pb-0 [&:not(:last-child)]:after:absolute [&:not(:last-child)]:after:top-11 [&:not(:last-child)]:after:bottom-1 [&:not(:last-child)]:after:left-5 [&:not(:last-child)]:after:w-px [&:not(:last-child)]:after:bg-border-strong forced-colors:[&:not(:last-child)]:after:bg-[CanvasText] lg:[&:not(:last-child)]:after:inset-auto lg:[&:not(:last-child)]:after:top-5 lg:[&:not(:last-child)]:after:right-2 lg:[&:not(:last-child)]:after:left-12 lg:[&:not(:last-child)]:after:h-px lg:[&:not(:last-child)]:after:w-auto"
        >
          <span
            aria-hidden="true"
            className="flex size-10 items-center justify-center rounded-full border border-transparent bg-accent font-display text-[17px] font-semibold text-white"
          >
            {i + 1}
          </span>
          <div className="pt-1.5 lg:pt-0">
            <h3 className="flex items-start gap-2 font-sans text-[17px] font-semibold lg:min-h-12">
              {s.icon && <Icon name={s.icon} size={18} variant="line" className="mt-0.5 shrink-0 text-accent" />}
              {s.title}
            </h3>
            <p className="mt-1 text-[15px]/[1.6] text-muted-foreground">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Honest limits, in the Cards look with a cross. */
export function DoesNot({ items }: { items: Item[] }) {
  return (
    <ul className="grid list-none gap-3 sm:grid-cols-2 sm:gap-4">
      {items.map((it) => (
        <li
          key={it.title}
          className="grid grid-cols-[24px_1fr] gap-3 rounded-xl border border-border-soft bg-surface p-4 sm:p-5"
        >
          <Icon name="x" size={20} variant="line" className="mt-0.5 text-muted-foreground" />
          <div>
            <h3 className="font-sans text-[16.5px] font-semibold">{it.title}</h3>
            <p className="mt-1 text-[15px]/[1.6] text-muted-foreground">{it.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** A checklist of what must exist first. */
export function NeedsList({ items }: { items: NonNullable<ChannelPage["needs"]> }) {
  return (
    <ul className="grid list-none gap-x-10 md:grid-cols-2">
      {items.map((it) => (
        <li key={it.text} className="grid grid-cols-[28px_1fr] gap-3 border-t border-border-soft py-4">
          <Icon name="check" size={20} variant="line" className="mt-0.5 text-accent" />
          <p className="text-[15.5px]/[1.6] text-foreground">{it.text}</p>
        </li>
      ))}
    </ul>
  );
}

/** Title + text rows with one icon each: the owner's controls and the channel's rules. */
export function RowList({ items, icon }: { items: IconItem[]; icon?: IconItem["icon"] }) {
  return (
    <ul className="grid list-none gap-x-10 md:grid-cols-2">
      {items.map((it) => (
        <li
          key={it.title}
          className={cn("grid gap-3 border-t border-border-soft py-4", icon || it.icon ? "grid-cols-[28px_1fr]" : "")}
        >
          {(icon || it.icon) && (
            <Icon
              name={(it.icon ?? icon) as NonNullable<IconItem["icon"]>}
              size={20}
              variant="line"
              className="mt-0.5 text-accent"
            />
          )}
          <div>
            <h3 className="font-sans text-[17px] font-semibold">{it.title}</h3>
            <p className="mt-1 text-[15px]/[1.6] text-muted-foreground">{it.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
