import { JsonLd } from "@/components/seo/JsonLd";
import { StatusBoard } from "@/components/status/StatusBoard";
import { getBreadcrumbSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { readStatus } from "@/lib/status";

/* ──────────────────────────────────────────────────────────────────────
   /status — live status of the ERIX platform. Served from this site, not
   the API, so it still loads (and says so) when the API is down. The
   first paint is a 30s-fresh snapshot; the board then polls in the browser.
─────────────────────────────────────────────────────────────────────── */

export const metadata = pageMetadata({
  title: "ERIX system status",
  description:
    "Live status of ERIX: the API, WhatsApp, automations and storage, with 90-day uptime and past incidents.",
  path: "/status",
});

export const revalidate = 30;

export default async function StatusPage() {
  const initial = await readStatus({ next: { revalidate: 30 } });
  return (
    <div className="w-full">
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Status", url: "/status" },
        ])}
      />
      <section data-tone="subtle" className="bg-background pt-6 pb-[clamp(56px,7vw,96px)]">
        <div className="mx-auto w-full max-w-6xl px-gutter">
          <h1 className="text-[clamp(36px,5vw,54px)] leading-[1.05] tracking-[-0.035em]">System status</h1>
          <p className="mt-4 mb-8 max-w-[60ch] text-[clamp(16px,1.5vw,18px)] leading-relaxed text-muted-foreground">
            How ERIX is running right now: the API, messaging, automations and storage. Checked every 30
            seconds.
          </p>
          <StatusBoard initial={initial} />
        </div>
      </section>
    </div>
  );
}
