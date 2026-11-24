"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";

/** Copies the page URL. Falls back to a no-op label if the clipboard is blocked. */
export function CopyLink({ url }: { url: string }) {
  const [state, setState] = useState<"idle" | "done" | "fail">("idle");
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setState("done");
        } catch {
          setState("fail");
        }
        setTimeout(() => setState("idle"), 2000);
      }}
      className="inline-flex h-10 items-center gap-2 rounded-full bg-background px-4 text-[14px] font-medium text-foreground hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <Icon name={state === "done" ? "check" : "link"} size={16} variant="line" />
      {state === "done" ? "Link copied" : state === "fail" ? "Copy failed" : "Copy link"}
      <span role="status" className="sr-only">
        {state === "done" ? "Link copied" : ""}
      </span>
    </button>
  );
}
