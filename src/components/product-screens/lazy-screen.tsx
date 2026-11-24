"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// The redrawn app screens the stories show further down a page. Each loads
// (code and DOM) only when it gets near the screen, so a long story costs a
// phone nothing on first load. Most are looping scenes (decorative: the
// chapter copy beside them carries the meaning); inbox, pipeline and flow are
// live demos people can use (components/demos), the same height with a hint row.
const screens = {
  inbox: dynamic(() => import("@/components/product-screens/inbox-demo").then((m) => m.InboxDemo), { ssr: false }),
  ai: dynamic(() => import("@/components/product-screens/screens").then((m) => m.AiScreen), { ssr: false }),
  pipeline: dynamic(() => import("@/components/product-screens/pipeline-demo").then((m) => m.PipelineDemo), { ssr: false }),
  booking: dynamic(() => import("@/components/product-screens/screens").then((m) => m.BookingScreen), { ssr: false }),
  invoice: dynamic(() => import("@/components/product-screens/screens").then((m) => m.InvoiceScreen), { ssr: false }),
  flow: dynamic(() => import("@/components/product-screens/flow-editor-demo").then((m) => m.FlowEditorDemo), { ssr: false }),
  documents: dynamic(() => import("@/components/product-screens/screens").then((m) => m.DocumentsScreen), { ssr: false }),
  overview: dynamic(() => import("@/components/product-screens/story-scenes").then((m) => m.OverviewScreen), { ssr: false }),
  broadcast: dynamic(() => import("@/components/product-screens/screens").then((m) => m.BroadcastScreen), { ssr: false }),
  crm: dynamic(() => import("@/components/product-screens/showcase-scenes").then((m) => m.CrmScreen), { ssr: false }),
  flowCanvas: dynamic(() => import("@/components/product-screens/flow-editor-demo").then((m) => m.FlowEditorDemo), {
    ssr: false,
  }),
  analytics: dynamic(() => import("@/components/product-screens/showcase-scenes").then((m) => m.AnalyticsScreen), { ssr: false }),
  form: dynamic(() => import("@/components/product-screens/showcase-scenes").then((m) => m.FormScreen), { ssr: false }),
  templates: dynamic(() => import("@/components/product-screens/showcase-scenes").then((m) => m.TemplatesScreen), { ssr: false }),
  widget: dynamic(() => import("@/components/product-screens/showcase-scenes").then((m) => m.WidgetScreen), { ssr: false }),
  agents: dynamic(() => import("@/components/product-screens/agents-screen").then((m) => m.AgentsScreen), { ssr: false }),
};

export type LazyScreenName = keyof typeof screens;

/**
 * A 25rem app screen that mounts when it's within ~1,200px of the viewport.
 * The placeholder has the scene's exact height (25rem; the pause button is keyboard-only and takes no room), so mounting never moves the page:
 * a jump to /#contact lands where it should.
 */
export function LazyScreen({ name }: { name: LazyScreenName }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return void setTimeout(() => setNear(true));
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "1200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Screen = screens[name];
  return (
    <div ref={ref} className="js-only h-[25rem]">
      {near && <Screen />}
    </div>
  );
}
