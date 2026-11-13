// Server Component: every section renders to HTML, so crawlers and link
// previews see the real content without running JavaScript. Motion only
// enhances what's already there (framer-motion islands, globals.css →
// "Motion"). The page tells one story: promise → where leads go missing →
// every channel in, every outcome out (the beam, founder's must-have) →
// one enquiry's life in ERIX (the story) → inside ERIX (Connect, CRM, Flow,
// Analytics, one screen each) → the agent → everything in 1.0 →
// India → a day in each trade → why ECODrIx exists and how pilots work →
// proof → FAQ → call to action. No pricing during the pilot: terms are
// agreed with each client (founder decision).

import { Agents } from "@/components/home/Agents";
import { Capabilities } from "@/components/home/Capabilities";
import { Hero } from "@/components/home/Hero";
import { BuiltForIndia, Heart } from "@/components/home/HowItWorks";
import { InsideErix } from "@/components/home/InsideErix";
import { ChannelBeam, WorksWith } from "@/components/home/Integrations";
import { Pain } from "@/components/home/Pain";
import { HomeStory } from "@/components/home/Story";
import { Testimonials } from "@/components/home/Testimonials";
import { UseCases } from "@/components/home/UseCases";
import { WaitlistLazy } from "@/components/home/WaitlistLazy";
import { CtaBand, Faq, MkSection } from "@/components/marketing/kit";
import { JsonLd } from "@/components/seo/JsonLd";
import { getFAQSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

const home = pageMetadata({
  title: "ECODrIx",
  description:
    "ERIX by ECODrIx: one inbox for WhatsApp, Instagram, email and website chat, an AI agent that answers from your price list, a pipeline and GST invoices.",
  path: "/",
});

export const metadata = {
  ...home,
  // The home page keeps the brand title as is (no " | ECODrIx" suffix).
  title: { absolute: "ECODrIx | Unified Business Infrastructure Platform" },
  openGraph: { ...home.openGraph, title: "ECODrIx | Unified Business Infrastructure Platform" },
};

const faqs = [
  {
    q: "Do I need a website to use ERIX?",
    a: "No. ERIX hosts your lead forms and booking page. Share the links on WhatsApp, in your Instagram bio or on your Google Business Profile. If you have a website, you can add the ERIX chat to it.",
  },
  {
    q: "Is it the official WhatsApp Business API?",
    a: "Yes. ERIX connects to Meta's WhatsApp Business Platform. You connect your own business account, so Meta bills you directly and ERIX adds no markup. Your templates are approved by WhatsApp.",
  },
  {
    q: "Will the AI reply to my customers on its own?",
    a: "Only if you turn on auto-reply, and then only with answers backed by your own information. Everything else becomes a draft for you. Refunds, complaints and medical questions always go to a person.",
  },
  {
    q: "Does ERIX work out GST on invoices?",
    a: "Yes. CGST and SGST for buyers in your state, IGST across states, numbered by financial year, with your Razorpay payment link.",
  },
  {
    q: "Can my staff use it on a phone?",
    a: "Yes. The inbox, contacts, pipeline, bookings and approvals all work on a phone, and each person gets a role so they can't change your settings.",
  },
  {
    q: "When can I start?",
    a: "We're letting businesses in a few at a time. Request early access and we'll reach out on WhatsApp or email when your turn comes.",
  },
];

export default function Home() {
  return (
    <div className="w-full">
      <JsonLd data={getFAQSchema(faqs)} />
      <Hero />
      <WorksWith />
      <Pain />
      {/* Founder, 27 Oct: required on home. Channels flow into ERIX and out as outcomes, one looping wave. */}
      <ChannelBeam tone="subtle" />
      <HomeStory />
      <InsideErix />
      <Agents />
      <Capabilities />
      <BuiltForIndia />
      <UseCases />
      <Heart />
      <Testimonials />
      <MkSection id="faq" tone="subtle" title="Questions owners ask">
        <Faq items={faqs} />
      </MkSection>
      <CtaBand
        id="contact"
        title="Be first in when ERIX opens"
        lead={
          <>
            <p className="text-inherit">
              We&apos;re letting businesses in a few at a time, so each one gets set up properly. Join the list and
              we&apos;ll reach out on WhatsApp or email when your turn comes.
            </p>
            <p className="mt-3 text-inherit">
              Pilot workspaces are set up by our team, and pricing is agreed with you.
            </p>
            <ul className="mt-6 space-y-2.5 text-[16px] text-white/90">
              {[
                "Access before the public launch",
                "Help moving your contacts and chats in",
                "Your feedback shapes what gets built next",
              ].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--on-navy-link)]" />
                  {t}
                </li>
              ))}
            </ul>
          </>
        }
        aside={<WaitlistLazy />}
      />
    </div>
  );
}
