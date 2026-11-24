import Link from "next/link";
import { Icon } from "@/components/icons";
import { LEGAL } from "@/lib/legal/config";
import { LEGAL_DOCS, legalHref } from "@/lib/legal/documents";
import { pageMetadata } from "@/lib/seo/seo";

export const metadata = pageMetadata({
  title: "Legal and policies",
  description:
    "All ECODrIx legal documents: terms, privacy, cookies, acceptable use, WhatsApp, refunds, pricing, delivery, DPA, sub-processors, security and contact details.",
  path: "/legal",
});

export default function LegalIndexPage() {
  return (
    <div className="w-full">
      <section data-tone="subtle" className="py-section bg-background pt-12! pb-12! md:pt-16!">
        <div className="mx-auto w-full max-w-wrap px-gutter">
          <h1 className="text-[clamp(38px,5.4vw,60px)] leading-[1.04] tracking-[-0.035em]">Legal and compliance</h1>
          <p className="mt-5 max-w-[62ch] text-[clamp(16px,1.5vw,19px)] leading-relaxed text-muted-foreground">
            Everything governing your use of {LEGAL.brand}: the terms you agree to, how we handle data, and the rules
            for using the platform. Operated by {LEGAL.entity}.
          </p>
        </div>
      </section>

      <section className="py-section pt-10! md:pt-14!">
        <div className="mx-auto w-full max-w-wrap px-gutter">
          <ul className="grid gap-x-10 md:grid-cols-2">
            {LEGAL_DOCS.map((doc) => (
              <li key={doc.slug} className="border-t border-border-soft">
                <Link
                  href={legalHref(doc.slug)}
                  className="group -mx-3 flex items-start justify-between gap-4 rounded-[12px] px-3 py-5 hover:bg-hover"
                >
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold text-accent">{doc.pill}</span>
                    <span className="mt-1 block text-[18px] font-semibold text-foreground">{doc.title}</span>
                    <span className="mt-1 block text-[15px] text-muted-foreground">{doc.description}</span>
                  </span>
                  <Icon name="arrow-right" size={16} variant="line" className="mt-7 shrink-0 text-accent" />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-[68ch] text-sm text-muted-foreground">
            For legal notices, contact {LEGAL.emails.legal}. Grievances may be addressed to our Grievance Officer at{" "}
            {LEGAL.emails.grievance}.
          </p>
        </div>
      </section>
    </div>
  );
}
