"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/track";

/**
 * "Was this helpful?" for one article. Sent as a site event (after analytics
 * consent, like every other site event) so we can see which articles fail.
 */
export function Helpful({ article }: { article: string }) {
  const [answer, setAnswer] = useState<"yes" | "no" | null>(null);
  if (answer) {
    return (
      <p role="status" className="text-[15px] text-muted-foreground">
        {answer === "yes"
          ? "Thanks for letting us know."
          : "Thanks. Tell us what was missing from Help & support in ERIX, and we'll fix this page."}
      </p>
    );
  }
  const pick = (a: "yes" | "no") => {
    setAnswer(a);
    trackEvent("help_feedback", "click", { article, helpful: a === "yes" });
  };
  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="text-[15px] font-semibold text-foreground">Was this page helpful?</p>
      {(["yes", "no"] as const).map((a) => (
        <button
          key={a}
          type="button"
          onClick={() => pick(a)}
          className="rounded-[8px] border border-border-soft bg-surface px-4 py-1.5 text-[14.5px] font-medium text-foreground transition-colors hover:bg-sunken"
        >
          {a === "yes" ? "Yes" : "No"}
        </button>
      ))}
    </div>
  );
}
