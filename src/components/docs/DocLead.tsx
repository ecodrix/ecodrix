/**
 * The lead card on a section home page: an eyebrow, a big heading, one line and a
 * row of key-fact tiles. Pass only numbers that are counted from the data.
 */
export function DocLead({
  eyebrow,
  title,
  text,
  facts,
}: {
  eyebrow: string;
  title: string;
  text: string;
  facts: { value: string; label: string }[];
}) {
  return (
    <section
      aria-labelledby="lead-title"
      className="flex flex-col gap-4 rounded-[16px] border border-border-soft bg-sunken p-5 sm:p-7"
    >
      <p className="text-[12.5px] font-semibold tracking-[0.08em] text-accent uppercase">{eyebrow}</p>
      <h1
        id="lead-title"
        className="max-w-[20ch] font-display text-[clamp(2rem,1.5rem+2.2vw,3.2rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-balance text-foreground"
      >
        {title}
      </h1>
      <p className="max-w-[62ch] text-[16.5px] leading-relaxed text-muted-foreground">{text}</p>
      <dl className="mt-1 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {facts.map((f) => (
          <div
            key={f.label}
            className="flex flex-col-reverse justify-end gap-1.5 rounded-[12px] border border-border-soft bg-surface p-4"
          >
            <dt className="text-[13px] leading-snug text-muted-foreground">{f.label}</dt>
            <dd className="font-display text-[26px] leading-none font-extrabold tracking-[-0.02em] text-foreground tabular-nums">
              {f.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
