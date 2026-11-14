import { StatusPageView } from "@/components/status/StatusPageView";
import { pageMetadata } from "@/lib/seo";
import { readStatusPage } from "@/lib/status-page";

/* status.ecodrix.com serves this at its root (next.config.ts rewrite, like doc.ecodrix.com → /help).
   First paint is a 30 s-fresh snapshot; the view then polls in the browser. */

export const metadata = pageMetadata({
  title: "ERIX status",
  description: "Live status of ERIX: console, API, inbox, calls, automations, email and AI agents, with incidents and planned maintenance.",
  path: "/status-host",
});

export const revalidate = 30;

export default async function StatusHostPage() {
  return <StatusPageView initial={await readStatusPage({ next: { revalidate: 30 } })} />;
}
